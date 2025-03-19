import sqlite3
import pickle

DB_PATH = "/home/yagya/Projects/hackathons/smriti/pyBackend/faces.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT name, image_path FROM faces")
rows = cursor.fetchall()

for row in rows:
    print(f"Image: {row[0]}, Path: {row[1]}")

conn.close()
