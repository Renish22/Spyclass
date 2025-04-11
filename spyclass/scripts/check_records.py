from qdrant_client import QdrantClient

# Connect to local Qdrant
client = QdrantClient("http://localhost:6333")

# Replace with your actual collection name
COLLECTION_NAME = "students"

# Fetch all records
points = client.scroll(
    collection_name=COLLECTION_NAME,
    limit=1000,  # Increase if you have more records
    with_payload=True,
    with_vectors=True,
)

for point in points[0]:  # points[0] contains the list of PointStructs
    print(f"ID: {point.id}")
    print(f"Vector: {point.vector[:5]}...")  # Print first 5 dims
    print(f"Payload: {point.payload}")
    print("-" * 40)

