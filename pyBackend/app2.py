import sqlite3

DB_PATH = "/home/yagya/Projects/hackathons/smriti/pyBackend/faces.db"

def fetch_all_faces():
    """Fetch all records from the faces table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM faces")
    records = cursor.fetchall()
    
    conn.close()
    return records

# Fetch and print the records
faces = fetch_all_faces()
for face in faces:
    print(face)
