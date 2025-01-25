import cv2
import pytesseract
import time

# Set the path to tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

# Initialize webcam capture
cap = cv2.VideoCapture(0)  # 0 is the default camera

# Store the start time for the 5-second interval
start_time = time.time()

while True:
    # Read each frame from the webcam
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Get the current time
    current_time = time.time()

    # Capture an image every 5 seconds
    if current_time - start_time >= 2:
        # Convert the frame from BGR (OpenCV default) to RGB
        img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Perform OCR on the frame and print the text
        print(pytesseract.image_to_string(img))

        # Detecting characters and drawing boxes
        hImg, wImg, _ = img.shape
        boxes = pytesseract.image_to_data(img)
        for b in boxes.splitlines():
            b = b.split()
            if len(b) == 12:  # Ensure the line has enough information
                try:
                    # Attempt to extract and convert coordinates to integers
                    x, y, w, h = int(b[6]), int(b[7]), int(b[8]), int(b[9])
                    cv2.rectangle(frame, (x, y), (w, h), (50, 50, 255), 1)
                    cv2.putText(frame, b[11], (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 50, 255), 1)
                except ValueError:
                    # Handle cases where coordinates are not valid integers
                    print("Skipping invalid data:", b)

        # Display the resulting frame
        cv2.imshow('Image Stream', frame)

        # Reset the timer for the next 5-second interval
        start_time = current_time

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture and close windows
cap.release()
cv2.destroyAllWindows()
