import cv2

# MJPEG stream URL with authentication
url = "http://admin:admin123@192.168.1.111:80/cgi-bin/mjpg/video.cgi?channel=1&subtype=1"

# Open the video stream
cap = cv2.VideoCapture(url)

if not cap.isOpened():
    print("Failed to open the video stream")
else:
    print("Stream opened successfully")

# Read one frame (or use a loop to continuously read)
ret, frame = cap.read()

if ret:
    # Save the raw image or do processing
    cv2.imwrite("frame.jpg", frame)
    print("Frame saved as 'frame.jpg'")
else:
    print("Failed to read frame")

cap.release()
