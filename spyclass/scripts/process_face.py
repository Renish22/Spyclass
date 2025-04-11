import sys
import numpy as np
from deepface import DeepFace
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
import uuid
import os
from sklearn.cluster import DBSCAN

# ----- CONFIG -----
QDRANT_HOST = "http://localhost:6333"
STUDENT_COLLECTION = "students"

# ----- INPUT -----
enrollment = sys.argv[1]
name = sys.argv[2]
address = sys.argv[3]
image_path = sys.argv[4]

# ----- STEP 1: Get Embedding -----
try:
    embedding = DeepFace.represent(
        img_path=image_path,
        model_name="VGG-Face",
        enforce_detection=True,
        detector_backend="opencv"
    )[0]["embedding"]
except Exception as e:
    print(f"Failed to extract embedding: {str(e)}", flush=True)
    sys.exit(1)

# ----- STEP 2: DBSCAN (optional validation) -----
try:
    # Simple cluster test to confirm single face (optional but recommended)
    cluster = DBSCAN(eps=0.5, min_samples=1).fit([embedding])
    if len(set(cluster.labels_)) > 1:
        print("Multiple faces detected. Please use a clear photo of a single face.", flush=True)
        sys.exit(1)
except Exception as e:
    print(f"Clustering error: {str(e)}", flush=True)
    sys.exit(1)

# ----- STEP 3: Connect to Qdrant -----
client = QdrantClient(host=QDRANT_HOST)

# Create collection if not exists
try:
    client.get_collection(STUDENT_COLLECTION)
except:
    client.recreate_collection(
        collection_name=STUDENT_COLLECTION,
        vectors_config=VectorParams(size=len(embedding), distance=Distance.COSINE),
    )

# ----- STEP 4: Upload student data -----
try:
    point_id = str(uuid.uuid4())
    client.upsert(
        collection_name=STUDENT_COLLECTION,
        points=[
            PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "enrollment": enrollment,
                    "name": name,
                    "address": address,
                    "photo_path": f"/students/{os.path.basename(image_path)}",
                    "total_attendance": 0
                }
            )
        ]
    )
    print(f"Student {name} added successfully", flush=True)
except Exception as e:
    print(f"Error uploading to Qdrant: {str(e)}", flush=True)
    sys.exit(1)
