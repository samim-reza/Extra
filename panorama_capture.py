import cv2
import numpy as np
import time
import imutils

def capture_panoramic_images():
    """
    Capture a series of images with proper buffer clearing and stabilization
    """
    cap = cv2.VideoCapture(2)  # Try different indices (0, 1, 2) if needed
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None

    # Camera warm-up and stabilization
    print("Initializing camera...")
    for _ in range(10):
        cap.read()
    time.sleep(2)  # Increased stabilization time

    images = []
    try:
        for i in range(5):
            # Flush buffer more aggressively
            for _ in range(10):
                cap.grab()
            
            ret, frame = cap.retrieve()
            if not ret:
                print(f"Failed to capture image {i+1}")
                continue

            # Process frame
            frame = imutils.resize(frame, width=1000)  # Higher resolution for better features
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)  # Improve contrast
            
            # Save with timestamp
            filename = f'panorama_{i+1}_{int(time.time())}.jpg'
            cv2.imwrite(filename, cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR))
            images.append(filename)
            
            # Show live preview with movement guidance
            preview = cv2.resize(frame, (640, 480))
            cv2.putText(preview, f"Image {i+1}/5", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow('Panorama Capture', preview)
            cv2.waitKey(300)
            
            # Wait with movement guidance
            if i < 4:
                print("Move camera RIGHT for next shot...")
                for remaining in range(3, 0, -1):
                    preview[:] = (0, 0, 0)  # Clear preview
                    cv2.putText(preview, f"Next in: {remaining}", (150, 240),
                                cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
                    cv2.imshow('Panorama Capture', preview)
                    cv2.waitKey(1000)
    
    finally:
        cap.release()
        cv2.destroyAllWindows()
    
    return create_panoramic_image(images)

def create_panoramic_image(image_paths):
    """
    Enhanced panorama stitching with feature validation
    """
    try:
        # Load images with verification
        images = []
        for path in image_paths:
            img = cv2.imread(path)
            if img is not None:
                images.append(img)
        if len(images) < 2:
            print("Not enough valid images to stitch")
            return None

        # Feature-based stitching approach
        stitcher = cv2.Stitcher.create(cv2.Stitcher_PANORAMA)
        stitcher.setPanoConfidenceThresh(0.1)  # Lower confidence threshold
        
        # Stitch images
        status, panorama = stitcher.stitch(images)
        
        if status == cv2.Stitcher_OK:
            # Crop black borders
            gray = cv2.cvtColor(panorama, cv2.COLOR_BGR2GRAY)
            _, thresh = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)
            contours = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            contours = imutils.grab_contours(contours)
            x,y,w,h = cv2.boundingRect(contours[0])
            
            panorama = panorama[y:y+h, x:x+w]
            cv2.imwrite('panorama_result.jpg', panorama)
            return 'panorama_result.jpg'
        
        # Fallback to simple horizontal merge
        print("Professional stitching failed, creating simple panorama...")
        panorama = np.hstack([img for img in images])
        cv2.imwrite('simple_panorama.jpg', panorama)
        return 'simple_panorama.jpg'

    except Exception as e:
        print(f"Stitching error: {str(e)}")
        return None

def main():
    print("Panoramic Image Capture Starting...")
    print("Please stay in the same general area and rotate slowly.")
    print("Tips:")
    print("- Maintain consistent rotation")
    print("- Ensure good lighting")
    print("- Keep camera at same height")
    
    # Countdown before starting
    for i in range(3, 0, -1):
        print(f"Starting capture in {i} seconds...")
        time.sleep(1)
    
    # Capture and create panoramic image
    result = capture_panoramic_images()
    
    if result:
        print(f"Panoramic image saved as {result}")
    else:
        print("Panoramic image creation failed.")
        print("Troubleshooting tips:")
        print("- Ensure more image overlap")
        print("- Move camera more slowly")
        print("- Check lighting conditions")

if __name__ == "__main__":
    main()