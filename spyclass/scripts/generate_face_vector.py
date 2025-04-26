import sys
import uuid
import os
import numpy as np
from PIL import Image
from deepface import DeepFace
from sklearn.cluster import DBSCAN
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from ultralytics import YOLO
import cv2

# Constants
COLLECTION_NAME = "students"
QDRANT_HOST = "http://localhost:6333"
YOLO_MODEL_PATH = "/home/renish/projects/yolov11s-face.pt"

# Initialize Qdrant client
client = QdrantClient(QDRANT_HOST)

def ensure_collection():
    collections = client.get_collections().collections
    if COLLECTION_NAME not in [c.name for c in collections]:
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=4096, distance=Distance.COSINE)
        )

def detect_and_crop_face(img_path):
    model = YOLO(YOLO_MODEL_PATH)
    results = model(img_path)[0]

    if not results.boxes or len(results.boxes) == 0:
        raise Exception("No face detected!")

    # Take the first detected face
    box = results.boxes[0].xyxy[0].cpu().numpy().astype(int)  # [x1, y1, x2, y2]
    image = cv2.imread(img_path)
    face = image[box[1]:box[3], box[0]:box[2]]

    # cropped_path = f"/tmp/cropped_{uuid.uuid4().hex}.jpg"
    # face.save(cropped_path)
    return face

def extract_embedding(cropped_face):
    print(f"Extracting for {cropped_face}", flush=True)
    obj = DeepFace.represent(img_path=cropped_face, model_name="VGG-Face", enforce_detection=False)
    return obj[0]["embedding"]

def save_to_qdrant(vector, enrollment_id, photo_path, student_name, student_address):
    random_id = uuid.uuid4().int >> 64
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
    # img_path, enrollment_id, student_name, student_address = sys.argv[1:]
    img_path = "/home/renish/Pictures/test/2255.jpg"
    enrollment_id = 11312312412
    student_name = "Renish"
    student_address = "Unjha"

    print("RECEIVED", img_path, enrollment_id, student_name, student_address, flush=True)
    ensure_collection()

    cropped_face = detect_and_crop_face(img_path)
    embedding = extract_embedding(cropped_face)

    print("RENISH NU EMBEDDING", embedding)
    save_to_qdrant(embedding, enrollment_id, img_path, student_name, student_address)
    print("Student added to Qdrant.")

if __name__ == "__main__":
    main()
