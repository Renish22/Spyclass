import uuid
import os
import shutil
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from PIL import Image
from deepface import DeepFace
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from ultralytics import YOLO
import uvicorn
import cv2
import logging


# Constants
COLLECTION_NAME = "students"
QDRANT_HOST = "http://localhost:6333"
YOLO_MODEL_PATH = "yolov11s-face.pt"

# Init
app = FastAPI()
client = QdrantClient(QDRANT_HOST)
yolo_model = YOLO(YOLO_MODEL_PATH)

def ensure_collection():
    collections = client.get_collections().collections
    if COLLECTION_NAME not in [c.name for c in collections]:
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=4096, distance=Distance.COSINE)
        )

def detect_and_crop_face(image_path):
    results = yolo_model(image_path)[0]
    if not results.boxes or len(results.boxes) == 0:
        raise Exception("No face detected!")

    box = results.boxes[0].xyxy[0].cpu().numpy().astype(int)  # [x1, y1, x2, y2]
    image = cv2.imread(image_path)
    face = image[box[1]:box[3], box[0]:box[2]]

    # cropped_path = f"/tmp/cropped_{uuid.uuid4().hex}.jpg"
    # face.save(cropped_path)
    return face

def extract_embedding(cropped_path):
    obj = DeepFace.represent(img_path=cropped_path, model_name="VGG-Face", enforce_detection=False)
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

@app.post("/add-student")
async def add_student(
    file: UploadFile,
    enrollment_id: str = Form(...),
    student_name: str = Form(...),
    student_address: str = Form(...),
    image_path: str = Form(...)
):
    logging.info(f"Headers: {file.headers}")
    logging.info(f"Received Form Data - Enrollment ID: {enrollment_id}, Name: {student_name}, Address: {student_address}, Image Path: {image_path}")

    try:
        temp_image_path = f"/tmp/{uuid.uuid4().hex}_{file.filename}"
        with open(temp_image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        ensure_collection()
        cropped_path = detect_and_crop_face(temp_image_path)
        embedding = extract_embedding(cropped_path)
        save_to_qdrant(embedding, enrollment_id, image_path, student_name, student_address)

        return JSONResponse({"status": "success", "message": "Student added successfully."})

    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

if __name__ == "__main__":
    uvicorn.run("frs_server:app", host="0.0.0.0", port=8000, reload=False)
