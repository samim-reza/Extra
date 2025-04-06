from flask import Flask, Response, render_template
import cv2

app = Flask(__name__)

# MJPEG stream URL with authentication
url = "http://admin:admin123@192.168.1.113:80/cgi-bin/mjpg/video.cgi?channel=1&subtype=1"

def generate_frames():
    cap = cv2.VideoCapture(url)
    
    if not cap.isOpened():
        print("Error: Could not open video stream")
        return
    
    while True:
        ret, frame = cap.read()
        if not ret: 
            print("Error: Failed to read frame")
            break
        
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)