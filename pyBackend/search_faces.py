import os
import sqlite3
import face_recognition
import pickle
import numpy as np

# Database path
DB_PATH = "/home/yagya/Projects/hackathons/smriti/pyBackend/faces.db"

# Function to find matching images
def find_matching_faces(query_image_path, tolerance=0.6):
    # Load query image
    query_image = face_recognition.load_image_file(query_image_path)
    query_encodings = face_recognition.face_encodings(query_image)

    if not query_encodings:
        print("❌ No face detected in query image.")
        return []

    query_encoding = query_encodings[0]  # Use the first detected face

    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Fetch all stored encodings
    cursor.execute("SELECT name, image_path, encoding FROM faces")
    rows = cursor.fetchall()
    
    matching_images = []

    for name, image_path, encoding_blob in rows:
        stored_encoding = pickle.loads(encoding_blob)  # Convert binary to numpy array

        # Compare encodings
        match = face_recognition.compare_faces([stored_encoding], query_encoding, tolerance=tolerance)
        
        if match[0]:  # If True, it's a match
            matching_images.append(image_path)
            print(f"✅ Match found: {image_path}")

    conn.close()
    
    return matching_images

# Example usage
query_image_path = "/home/yagya/Projects/hackathons/smriti/pyBackend/images/WhatsApp Image 2025-03-19 at 11.00.50 PM.jpeg"  # Change this to your uploaded image path
matched_images = find_matching_faces(query_image_path)

if matched_images:
    print("\n🎯 Matching Images Found:")
    for img in matched_images:
        print(img)
else:
    print("\n❌ No matching images found.")
