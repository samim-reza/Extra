#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <DHT.h>
#include <Wire.h>
#include <MPU6050.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>

#define trigPin D1
#define echoPin D5
#define DHT11_PIN D2
#define RX_PIN D7
#define TX_PIN D6

#define DHTTYPE DHT11

MPU6050 mpu;

DHT dht(DHT11_PIN, DHTTYPE);

TinyGPSPlus gps;
SoftwareSerial ss(RX_PIN, TX_PIN);

// const char* ssid = "Hotspot";
// const char* password = "123456789";

// const char* ssid = "Room_506";
// const char* password = "greeN@121";

//  const char* ssid = "GUB";
// const char* password = "GUB!@#2023";

// const char* ssid = "Hepnox";
// const char* password = "Hepnox-Password";

const char* ssid = "AASA";
const char* password = "Nurulhudaapon";

long duration;
int distance;
bool ledState = false;

ESP8266WebServer server(80);

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  Serial.begin(9600);
  ss.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  Wire.begin();
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed");
    while (1);
  }

  dht.begin();

  server.on("/distance", handleDistance);
  server.on("/toggle", toggle);
  server.on("/temperature", handleTemperature);
  server.on("/imu", handleIMU);
  server.on("/gps", handleGPS);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
    while (ss.available() > 0) {
    gps.encode(ss.read());
  }
  server.handleClient();
}

void handleDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  String response = "{ \"distance\": " + String(distance) + " }";
  Serial.print("Distance: ");
  Serial.println(distance);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", response);
}

void toggle() {
  ledState = !ledState;
  digitalWrite(LED_BUILTIN, ledState ? HIGH : LOW);

  String response = "{ \"led\": \"" + String(ledState ? "on" : "off") + "\" }";
  Serial.print("LED: ");
  Serial.println(ledState ? "ON" : "OFF");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", response);
}

void handleTemperature() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  Serial.print("Temperature = ");
  Serial.println(temperature);
  Serial.print("Humidity = ");
  Serial.println(humidity);

  String response = "{ \"temperature\": " + String(temperature) + " , \"humidity\": " + String(humidity) + " }";
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", response);
}

void handleIMU() {
  int16_t ax, ay, az;
  int16_t gx, gy, gz;

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  String response = "{";
  response += "\"ax\": " + String(ax) + ",";
  response += "\"ay\": " + String(ay) + ",";
  response += "\"az\": " + String(az) + ",";
  response += "\"gx\": " + String(gx) + ",";
  response += "\"gy\": " + String(gy) + ",";
  response += "\"gz\": " + String(gz);
  response += "}";

  Serial.println(response);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", response);
}

void handleGPS() {
  if (gps.location.isUpdated()) {
    String response = "{";
    response += "\"latitude\": " + String(gps.location.lat(), 6) + ",";
    response += "\"longitude\": " + String(gps.location.lng(), 6) + ",";
    response += "\"altitude\": " + String(gps.altitude.meters()) + ",";
    response += "\"speed\": " + String(gps.speed.kmph()) + ",";
    response += "\"satellites\": " + String(gps.satellites.value());
    response += "}";

    Serial.println(response);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", response);
  } else {
    server.send(200, "application/json", "{ \"error\": \"No GPS data available\" }");
  }
}

