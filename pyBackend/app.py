import os
import sqlite3
import face_recognition
import pickle
import numpy as np
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Config
UPLOAD_FOLDER = "/home/yagya/Projects/hackathons/smriti/pyBackend/images"  # Folder for uploaded images
DB_PATH = "/home/yagya/Projects/hackathons/smriti/pyBackend/faces.db"
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to find matching faces
def find_matching_faces(query_image_path, tolerance=0.6):
    query_image = face_recognition.load_image_file(query_image_path)
    query_encodings = face_recognition.face_encodings(query_image)

    if not query_encodings:
        return []

    query_encoding = query_encodings[0]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name, image_path, encoding FROM faces")
    rows = cursor.fetchall()

    matching_images = []

    for name, image_path, encoding_blob in rows:
        stored_encoding = pickle.loads(encoding_blob)
        match = face_recognition.compare_faces([stored_encoding], query_encoding, tolerance=tolerance)
        
        if match[0]:
            matching_images.append(image_path)

    conn.close()
    return matching_images

# Route to upload image and find matches
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        matches = find_matching_faces(file_path)

        return jsonify({"matches": matches})

    return jsonify({"error": "Invalid file type"}), 400

# Run Flask app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
