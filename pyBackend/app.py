import os
import sqlite3
import face_recognition
import pickle
import datetime
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
import httpx
from flask import Flask, render_template, request
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

CORS(app)

# Config
DB_PATH = "/home/maxcillius/Dev/Projects/Smriti/pyBackend/faces.db"
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
IMGUR_CLIENT_ID = os.getenv("CLIENT_ID")
IMGUR_UPLOAD_URL = "https://api.imgur.com/3/image"
API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-small"
HEADERS = {"Authorization": f"Bearer {os.getenv('HUGGING_FACE_ACCESS_TOKEN')}"}

# user_sessions = {}
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Initialize database
with sqlite3.connect(DB_PATH) as conn:
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS faces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_path TEXT,
            encoding BLOB,
            desc TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()


# async def query_huggingface(conversation):
#     payload = {"inputs": conversation}
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.post(API_URL, headers=HEADERS, json=payload, timeout=10)  # Timeout set to 10s

#             if response.status_code == 429:
#                 return {"error": "Rate limit exceeded. Try again later."}
#             if response.status_code != 200:
#                 return {"error": f"API Error: {response.status_code}, {response.text}"}

#             return response.json()
#         except httpx.RequestError as e:
#             return {"error": f"Request failed: {str(e)}"}

def get_chatbot_response(user_message):
    """Sends user input to the AI model and gets the response."""
    payload = {"inputs": user_message}
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    
    if response.status_code == 200:
        return response.json()[0]["generated_text"]
    else:
        return "Sorry, I'm unable to respond at the moment."
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_to_imgur(image):
    """Uploads an image to Imgur and returns the image link."""
    headers = {"Authorization": f"Client-ID {IMGUR_CLIENT_ID}"}
    files = {"image": image.read()}
    response = requests.post(IMGUR_UPLOAD_URL, headers=headers, files=files)
    if response.status_code != 200:
        return None
    return response.json()["data"]["link"]

def save_face(image_file, desc):
    image_path = upload_to_imgur(image_file)
    if(not image_path):
        print("file not uploaded")

    image = face_recognition.load_image_file(image_file)
    face_encodings = face_recognition.face_encodings(image)
    
    if not face_encodings:
        return None, "No face detected in image"
    encoding_blob = pickle.dumps(face_encodings[0])
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO faces (image_path, encoding, desc, timestamp) VALUES (?, ?, ?, ?)",
                       (image_path, encoding_blob, desc, timestamp))
        conn.commit()
    return image_path

def find_matching_faces(query_image_file, tolerance=0.6):
    query_image = face_recognition.load_image_file(query_image_file)
    query_encodings = face_recognition.face_encodings(query_image)
    
    if not query_encodings:
        return []
    
    query_encoding = query_encodings[0]
    matches = []
    
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT image_path, encoding, desc, timestamp FROM faces")
        rows = cursor.fetchall()
    
    for image_path, encoding_blob, desc, timestamp in rows:
        stored_encoding = pickle.loads(encoding_blob)
        match = face_recognition.compare_faces([stored_encoding], query_encoding, tolerance=tolerance)
        if match[0]:
            matches.append({"image": image_path, "description": desc, "timestamp": timestamp})
    
    return matches

@app.route('/save-image', methods=['POST'])
def save_image():
    if 'image' not in request.files or 'description' not in request.form:
        return jsonify({"error": "Image file and description are required"}), 400
    
    image = request.files["image"]        
    description = request.form['description']
    
    # if file.filename == '' or not allowed_file(file.filename):
    #     return jsonify({"error": "Invalid file type or empty filename"}), 400
    
    image_path = save_face(image, description)
    
    return jsonify({"message": "Image and description saved successfully", "image_url": image_path})

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['image']
    
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type or empty filename"}), 400
    
    matches = find_matching_faces(file)
    return jsonify({"matches": matches if matches else "No matching faces found, try saving this memory <3"})


# @app.route('/chat', methods=['POST'])
# async def chat():
#     data = request.json
#     user_id = data.get("user_id", "default")
#     user_message = data.get("message", "")

#     if not user_message:
#         return jsonify({"error": "Message cannot be empty"}), 400

#     if user_id not in user_sessions:
#         user_sessions[user_id] = []

#     user_sessions[user_id].append(user_message)
#     conversation = user_sessions[user_id][-3:]  # Send only last 3 messages

#     # Call the API asynchronously
#     response = await query_huggingface(conversation)

#     if isinstance(response, list) and len(response) > 0:
#         bot_reply = response[0].get("generated_text", "I'm here to listen.")
#     else:
#         bot_reply = "I'm here to listen."

#     user_sessions[user_id].append(bot_reply)
#     return jsonify({"response": bot_reply})

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.form['message']
    model = genai.GenerativeModel('gemini-1.5-flash')
    chat_session = model.start_chat()
    response = chat_session.send_message(user_input)
    return {'response': response.text}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
