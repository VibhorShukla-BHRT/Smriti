import os
import sqlite3
import face_recognition
import pickle

# Paths
IMAGES_FOLDER = "/home/yagya/Projects/hackathons/smriti/pyBackend/images"
DB_PATH = "/home/yagya/Projects/hackathons/smriti/pyBackend/faces.db"

# Initialize database
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS faces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image_path TEXT,
        encoding BLOB
    )
""")
conn.commit()

# Process images
def encode_faces():
    for file in os.listdir(IMAGES_FOLDER):
        file_path = os.path.join(IMAGES_FOLDER, file)

        # Ensure it's an image
        if not file.lower().endswith(('.jpg', '.jpeg', '.png')):
            print(f"Skipping non-image file: {file}")
            continue
        
        print(f"Processing: {file_path}")

        # Load image & extract face encodings
        image = face_recognition.load_image_file(file_path)
        face_encodings = face_recognition.face_encodings(image)

        if face_encodings:  # If a face is detected
            encoding_blob = pickle.dumps(face_encodings[0])  # Convert encoding to binary
            
            # Insert into database
            cursor.execute("INSERT INTO faces (name, image_path, encoding) VALUES (?, ?, ?)",
                           (file, file_path, encoding_blob))
            conn.commit()
            print(f"✅ Face encoding stored for {file}")
        else:
            print(f"❌ No face detected in {file}")

# Run encoding function
encode_faces()

# Close database connection
conn.close()
print("✅ All face embeddings stored in the database.")
