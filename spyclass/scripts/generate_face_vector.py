import sys
import uuid
import os
import numpy as np
from PIL import Image
from deepface import DeepFace
from sklearn.cluster import DBSCAN
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

# Constants
COLLECTION_NAME = "students"
QDRANT_HOST = "http://localhost:6333"

# Initialize Qdrant client
client = QdrantClient(QDRANT_HOST)

def ensure_collection():
    collections = client.get_collections().collections
    if COLLECTION_NAME not in [c.name for c in collections]:
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=4096, distance=Distance.COSINE)
        )

def extract_embedding(img_path):
    obj = DeepFace.represent(img_path=img_path, model_name="VGG-Face", enforce_detection=False)
    return obj[0]["embedding"]

def save_to_qdrant(vector, enrollment_id, photo_path, student_name, student_address):
    random_id = uuid.uuid4().int >> 64  # Qdrant requires int type for ID,
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=random_id,
                vector=vector,
                payload={
                    "enrollment": enrollment_id,
                    "photo_path": photo_path,
                    "name": student_name,
                    "address": student_address,
                    "total_attendance": 0
                }
            )
        ]
    )

def main():
    # if len(sys.argv) != 5:
    #     print("Usage: python process_face.py <image_path> <enrollment_id> <name> <address>")
    #     sys.exit(1)

    img_path, enrollment_id, student_name, student_address = sys.argv[1:]
    
    # img_path = "/home/renish/projects/React_learning/spyclass/public/students/undefined.jpg"
    # enrollment_id = 11312312412
    # student_name = "Renish"
    # student_address = "Unjha"
    print("RECEIVED", img_path, enrollment_id, student_name, student_address, flush=True)
    ensure_collection()
    embedding = extract_embedding(img_path)
    print("RENISH NU EMBEDDING",embedding)
    save_to_qdrant(embedding, enrollment_id, img_path, student_name, student_address)
    print("Student added to Qdrant.")

if __name__ == "__main__":
    main()
