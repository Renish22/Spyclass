# # scan_qr.py
import cv2
from pyzbar.pyzbar import decode
import sys

def scan_qr_from_image(image_path):
    img = cv2.imread(image_path)
    decoded_objs = decode(img)
    if decoded_objs:
        return decoded_objs[0].data.decode('utf-8')
    return None

def get_student_info(enrollment_id):
    from qdrant_client import QdrantClient
    from qdrant_client.models import Filter, FieldCondition, MatchValue
    client = QdrantClient("http://localhost:6333")
    COLLECTION_NAME = "students"
    response = client.scroll(
        collection_name=COLLECTION_NAME,
        scroll_filter=Filter(
            must=[
                FieldCondition(
                    key="enrollment",
                    match=MatchValue(value=enrollment_id)
                )
            ]
        ),
        limit=1,
        with_payload=True
    )

    if response and response[0]:
        payload = response[0][0].payload
        student_name = payload.get("name", "")
        photo_path = payload.get("photo_path", "")
        return student_name, photo_path
    return None, None



if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Image path not provided", flush=True)
        sys.exit(1)

    image_path = sys.argv[1]
    result = scan_qr_from_image(image_path)
    if result:
        student_name, photo_path = get_student_info(result)
        result_dict = {
            "name": f"{result} Unknown",
            "photoPath": "unknown"
        }
        if student_name!= None:
            result_dict["name"] = student_name
            result_dict["photoPath"] = photo_path
            print(result_dict, flush=True)
        else:
            print(f"{result_dict}", flush=True)
        sys.exit(0)
    else:
        print("No QR code detected", flush=True)
        sys.exit(1)





# if __name__ == '__main__':
#     if len(sys.argv) < 2:
#         print("Image path not provided", flush=True)
#         sys.exit(1)

#     image_path = sys.argv[1]
#     # image_path = "/home/renish/Downloads/260.png"
#     enrollment_id = scan_qr_from_image(image_path)


#     if enrollment_id != None:
#         name, photo_path = get_student_info(enrollment_id)
#         if name:
#             # print(enrollment_id, flush=True)
#             print(f"{name}|{photo_path}", flush=True)
#             sys.exit(0)
#         else:
#             # print(enrollment_id, flush=True)
#             print("Unknown", flush=True)
#             sys.exit(1)
#     else:
#         print("No QR code detected", flush=True)
#         sys.exit(1)
