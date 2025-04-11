import os
import cv2
import numpy as np
from datetime import datetime
from keras_vggface.vggface import VGGFace
from keras_vggface.utils import preprocess_input
from keras.models import Model
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
from sklearn.cluster import DBSCAN
from fastapi import FastAPI, UploadFile, Form

app = FastAPI()

# Load VGGFace model
base_model = VGGFace(include_top=False, input_shape=(224, 224, 3), pooling='avg')
model = Model(inputs=base_model.input, outputs=base_model.output)

# Initialize Qdrant client
client = QdrantClient(host='localhost', port=6333)

@app.post("/api/add-student")
async def add_student(
    enrollment_number: str = Form(...),
    name: str = Form(...),
    address: str = Form(...),
    file: UploadFile = Form(...)
):
    # Save uploaded image
    image_bytes = await file.read()
    image_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    photo_path = f"photos/{enrollment_number}.jpg"
    cv2.imwrite(photo_path, img)

    # Preprocess image
    img_resized = cv2.resize(img, (224, 224))
    img_array = np.asarray(img_resized, 'float32')
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array, version=2)

    # Generate embedding
    embedding = model.predict(img_array)[0].tolist()

    # Optional: Check for uniqueness using DBSCAN
    # existing_embeddings = [...]  # Retrieve from Qdrant
    # embeddings = existing_embeddings + [embedding]
    # clustering = DBSCAN(eps=0.5, min_samples=2).fit(embeddings)
    # if clustering.labels_[-1] != -1:
    #     return {"error": "Duplicate face detected."}

    # Store in Qdrant
    point = PointStruct(
        id=enrollment_number,
        vector=embedding,
        payload={
            "name": name,
            "address": address,
            "photo_path": photo_path,
            "total_attendance": 0
        }
    )
    client.upsert(collection_name="students", points=[point])

    return {"status": "Student added successfully."}
