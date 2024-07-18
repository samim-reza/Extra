#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Servo.h>

const char* ssid = "Room_506";
const char* password = "greeN@121";

//  const char* ssid = "GUB";
// const char* password = "GUB!@#2023";

ESP8266WebServer server(80);

Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;

const int servo1Pin = D1;
const int servo2Pin = D2;
const int servo3Pin = D3;
const int servo4Pin = D4;

int pos1 = 90;
int pos2 = 90;
int pos3 = 90;
int pos4 = 90;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to ");
  Serial.println(ssid);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  servo1.attach(servo1Pin);
  servo2.attach(servo2Pin);
  servo3.attach(servo3Pin);
  servo4.attach(servo4Pin);

  servo1.write(pos1);
  servo2.write(pos2);
  servo3.write(pos3);
  servo4.write(pos4);

  server.on("/control", handleControl);

  server.begin();
  Serial.println("Server started");
}

void loop() {
  server.handleClient();
}

void handleControl() {
  String command = server.arg("cmd");
  if (command == "up") {
    pos1 += 10;
    if (pos1 > 180) pos1 = 180;
    servo1.write(pos1);
  } else if (command == "down") {
    pos1 -= 10;
    if (pos1 < 0) pos1 = 0;
    servo1.write(pos1);
  } else if (command == "left") {
    pos2 += 10;
    if (pos2 > 180) pos2 = 180;
    servo2.write(pos2);
  } else if (command == "right") {
    pos2 -= 10;
    if (pos2 < 0) pos2 = 0;
    servo2.write(pos2);
  } else if (command == "forward") {
    pos3 += 10;
    if (pos3 > 180) pos3 = 180;
    servo3.write(pos3);
  } else if (command == "backward") {
    pos3 -= 10;
    if (pos3 < 0) pos3 = 0;
    servo3.write(pos3);
  } else if (command == "rotate") {
    pos4 += 10;
    if (pos4 > 180) pos4 = 180;
    servo4.write(pos4);
  } else if (command == "open") {
    pos4 += 10;
    if (pos4 > 180) pos4 = 180;
    servo4.write(pos4);
  } else if (command == "close") {
    pos4 -= 10;
    if (pos4 < 0) pos4 = 0;
    servo4.write(pos4);
  }

  server.send(200, "text/plain", "OK");
}
