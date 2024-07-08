  #include <ESP8266WiFi.h>
  #include <ESP8266WebServer.h>

  #define trigPin D1
  #define echoPin D5

  // const char* ssid = "Hotspot";
  // const char* password = "123456789";

  // const char* ssid = "Room_506";
  // const char* password = "greeN@121";

  //  const char* ssid = "GUB";
  // const char* password = "GUB!@#2023";

  const char* ssid = "Hepnox";
  const char* password = "Hepnox-Password";

long duration;
int distance;
bool ledState = false;

ESP8266WebServer server(80);

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW); // Ensure the LED is initially off

  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/distance", handleDistance);
  server.on("/toggle", toggle); // Handle toggle request
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
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
