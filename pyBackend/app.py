import os
import sqlite3
import face_recognition
import pickle
import numpy as np
import datetime
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Config
UPLOAD_FOLDER = "/home/yagya/Projects/hackathons/smriti/pyBackend/uploads"  #store in .env
SAVED_FOLDER = "/home/yagya/Projects/hackathons/smriti/pyBackend/images"  
DB_PATH = "/home/yagya/Projects/hackathons/smriti/pyBackend/faces.db"
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SAVED_FOLDER, exist_ok=True)

# Initialize database with timestamp
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS faces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image_path TEXT,
        encoding BLOB,
        desc TEXT,
        timestamp TEXT
    )
""")
conn.commit()
conn.close()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to encode and store face with description and timestamp
def save_face(file_path, desc):
    image = face_recognition.load_image_file(file_path)
    face_encodings = face_recognition.face_encodings(image)

    if face_encodings:
        encoding_blob = pickle.dumps(face_encodings[0])
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO faces (name, image_path, encoding, desc, timestamp) VALUES (?, ?, ?, ?, ?)",
                       (os.path.basename(file_path), file_path, encoding_blob, desc, timestamp))
        conn.commit()
        conn.close()
        return True
    return False

# Function to find matching faces
def find_matching_faces(query_image_path, tolerance=0.6):
    query_image = face_recognition.load_image_file(query_image_path)
    query_encodings = face_recognition.face_encodings(query_image)

    if not query_encodings:
        return []

    query_encoding = query_encodings[0]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name, image_path, encoding, desc, timestamp FROM faces")
    rows = cursor.fetchall()
    conn.close()

    matching_results = []

    for name, image_path, encoding_blob, desc, timestamp in rows:
        stored_encoding = pickle.loads(encoding_blob)
        match = face_recognition.compare_faces([stored_encoding], query_encoding, tolerance=tolerance)

        if match[0]:
            matching_results.append({
                "image": image_path,
                "description": desc,
                "timestamp": timestamp
            })

    return matching_results

# Endpoint to save an image and description
@app.route('/save-image', methods=['POST'])
def save_image():
    if 'file' not in request.files or 'description' not in request.form:
        return jsonify({"error": "Image file and description are required"}), 400

    file = request.files['file']
    description = request.form['description']

    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type or empty filename"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(SAVED_FOLDER, filename)
    file.save(file_path)

    if save_face(file_path, description):
        return jsonify({"message": "Image and description saved successfully"})
    else:
        return jsonify({"error": "No face detected in image"}), 400

# Endpoint to upload an image and find matches
@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type or empty filename"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    matches = find_matching_faces(file_path)

    return jsonify({"matches": matches if matches else "No matching faces found, try saving this memory <3"})

# Run Flask app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
