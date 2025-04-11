# scan_qr.py
import cv2
from pyzbar.pyzbar import decode
import sys

def scan_qr_from_image(image_path):
    img = cv2.imread(image_path)
    decoded_objs = decode(img)
    if decoded_objs:
        return decoded_objs[0].data.decode('utf-8')
    return None

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Image path not provided", flush=True)
        sys.exit(1)

    image_path = sys.argv[1]
    result = scan_qr_from_image(image_path)
    if result:
        print(result, flush=True)
        sys.exit(0)
    else:
        print("No QR code detected", flush=True)
        sys.exit(1)
