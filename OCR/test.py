import cv2
import pytesseract
import time

# Set the path to tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

# Initialize webcam capture
cap = cv2.VideoCapture(0)  # 0 is the default camera

# Store the start time for the 5-second interval
start_time = time.time()

# Define the languages to use for OCR (English + Bangla)
language = "eng+ben"  # "eng" for English, "ben" for Bangla

while True:
    # Read each frame from the webcam
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Get the current time
    current_time = time.time()

    # Capture an image every 5 seconds
    if current_time - start_time >= 0:
        # Convert the frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Apply binary thresholding to isolate white text on black background
        _, binary_image = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)

        # Optionally, invert the binary image (if needed)
        # binary_image = cv2.bitwise_not(binary_image)

        # Perform OCR on the binary image
        text = pytesseract.image_to_string(binary_image, lang=language)
        print("Detected text:", text)

        # Detecting characters and drawing boxes on the binary image
        hImg, wImg = binary_image.shape
        boxes = pytesseract.image_to_data(binary_image, lang=language)
        for b in boxes.splitlines():
            b = b.split()
            if len(b) == 12:  # Ensure the line has enough information
                try:
                    # Attempt to extract and convert coordinates to integers
                    x, y, w, h = int(b[6]), int(b[7]), int(b[8]), int(b[9])
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (50, 50, 255), 2)
                    cv2.putText(frame, b[11], (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 50, 255), 2)
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
