import cv2
import pytesseract

pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
img = cv2.imread('image.png')
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  
print(pytesseract.image_to_string(img)) 



# Detecting characters and drawing boxes    
hImg, wImg, _ = img.shape   
boxes = pytesseract.image_to_data(img)
for b in boxes.splitlines():
    print(b)
    b = b.split()
    print(b)
    x, y, w, h = int(b[1]), int(b[2]), int(b[3]), int(b[4])
    cv2.rectangle(img,(x, hImg-y),(w,hImg-h), (0, 0, 255), 3)
    cv2.putText(img, b[0], (x,hImg-y+25), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 50, 255), 2)
 
    
    
cv2.imshow('Result', img)
cv2.waitKey(0)