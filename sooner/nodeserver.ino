#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Servo.h>

/* Put your SSID & Password */
const char* ssid = "NodeMCU";  // Enter SSID here
const char* password = "123456789";  //Enter Password here

/* Put IP Address details */
IPAddress local_ip(192,168,1,1);
IPAddress gateway(192,168,1,1);
IPAddress subnet(255,255,255,0);

ESP8266WebServer server(80);

Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;
Servo servo5;

const int servo1Pin = D1;
const int servo2Pin = D2;
const int servo3Pin = D3;
const int servo4Pin = D4;
const int servo5Pin = D5;

int upDownPos = 90;
int openClosePos = 90;
int leftRightPos = 180; // Set to middle of 0-360 range
int forwardBackwardPos = 90;
int handRotatePos = 90;

// Set max and min values for specific movements
const int openCloseMin = 0;
const int openCloseMax = 95;
const int upDownMin = 20;
const int upDownMax = 180;
const int forwardBackwardMin = 0;
const int forwardBackwardMax = 180;

void setup() {
  Serial.begin(115200);

  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  delay(100);

  servo1.attach(servo1Pin);
  servo2.attach(servo2Pin);
  servo3.attach(servo3Pin);
  servo4.attach(servo4Pin);
  servo5.attach(servo5Pin);

  server.on("/", handle_OnConnect);
  server.on("/updateServo", handle_updateServo);
  server.onNotFound(handle_NotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

void handle_OnConnect() {
  server.send(200, "text/html", SendHTML(upDownPos, openClosePos, leftRightPos, forwardBackwardPos, handRotatePos));
}

void handle_updateServo() {
  if (server.hasArg("upDown")) {
    upDownPos = server.arg("upDown").toInt();
    if (upDownPos < upDownMin) upDownPos = upDownMin;
    if (upDownPos > upDownMax) upDownPos = upDownMax;
    servo1.write(upDownPos);
  }
  if (server.hasArg("openClose")) {
    openClosePos = server.arg("openClose").toInt();
    if (openClosePos < openCloseMin) openClosePos = openCloseMin;
    if (openClosePos > openCloseMax) openClosePos = openCloseMax;
    servo2.write(openClosePos);
  }
  if (server.hasArg("leftRight")) {
    leftRightPos = server.arg("leftRight").toInt();
    if (leftRightPos < 0) leftRightPos = 0;
    if (leftRightPos > 360) leftRightPos = 360;
    servo3.write(map(leftRightPos, 0, 360, 0, 180)); // Map 0-360 to 0-180 for servo control
  }
  if (server.hasArg("forwardBackward")) {
    forwardBackwardPos = server.arg("forwardBackward").toInt();
    if (forwardBackwardPos < forwardBackwardMin) forwardBackwardPos = forwardBackwardMin;
    if (forwardBackwardPos > forwardBackwardMax) forwardBackwardPos = forwardBackwardMax;
    servo4.write(forwardBackwardPos);
  }
  if (server.hasArg("handRotate")) {
    handRotatePos = server.arg("handRotate").toInt();
    servo5.write(handRotatePos);
  }
  server.send(200, "text/html", SendHTML(upDownPos, openClosePos, leftRightPos, forwardBackwardPos, handRotatePos));
}

void handle_NotFound(){
  server.send(404, "text/plain", "Not found");
}

String SendHTML(int upDownPos, int openClosePos, int leftRightPos, int forwardBackwardPos, int handRotatePos){
  String ptr = "<!DOCTYPE html> <html>\n";
  ptr +="<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">\n";
  ptr +="<title>Servo Control</title>\n";
  ptr +="<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}\n";
  ptr +="body{margin-top: 50px;} h1 {color: #444444;margin: 50px auto 30px;} h3 {color: #444444;margin-bottom: 50px;}\n";
  ptr +=".slider {width: 300px;margin: 15px auto;}\n";
  ptr +="</style>\n";
  ptr +="<script>\n";
  ptr +="function updateServo(servo, value) {\n";
  ptr +="  var xhr = new XMLHttpRequest();\n";
  ptr +="  xhr.open(\"GET\", \"/updateServo?\" + servo + \"=\" + value, true);\n";
  ptr +="  xhr.send();\n";
  ptr +="}\n";
  ptr +="</script>\n";
  ptr +="</head>\n";
  ptr +="<body>\n";
  ptr +="<h1>ESP8266 Servo Control</h1>\n";
  ptr +="<h3>Using Access Point(AP) Mode</h3>\n";
  
  ptr +="<p>Up-Down</p><input type=\"range\" min=\"" + String(upDownMin) + "\" max=\"" + String(upDownMax) + "\" value=\"" + String(upDownPos) + "\" class=\"slider\" id=\"upDown\" oninput=\"updateServo('upDown', this.value)\">\n";
  ptr +="<p>Open-Close</p><input type=\"range\" min=\"" + String(openCloseMin) + "\" max=\"" + String(openCloseMax) + "\" value=\"" + String(openClosePos) + "\" class=\"slider\" id=\"openClose\" oninput=\"updateServo('openClose', this.value)\">\n";
  ptr +="<p>Left-Right</p><input type=\"range\" min=\"0\" max=\"360\" value=\"" + String(leftRightPos) + "\" class=\"slider\" id=\"leftRight\" oninput=\"updateServo('leftRight', this.value)\">\n";
  ptr +="<p>Forward-Backward</p><input type=\"range\" min=\"" + String(forwardBackwardMin) + "\" max=\"" + String(forwardBackwardMax) + "\" value=\"" + String(forwardBackwardPos) + "\" class=\"slider\" id=\"forwardBackward\" oninput=\"updateServo('forwardBackward', this.value)\">\n";
  ptr +="<p>Hand Rotate Position: " + String(handRotatePos) + "</p><input type=\"range\" min=\"0\" max=\"180\" value=\"" + String(handRotatePos) + "\" class=\"slider\" id=\"handRotate\" oninput=\"updateServo('handRotate', this.value)\">\n";

  ptr +="</body>\n";
  ptr +="</html>\n";
  return ptr;
}
