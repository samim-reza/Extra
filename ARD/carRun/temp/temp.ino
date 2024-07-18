void setup() {
  Serial.begin(115200);
}

void loop() {
  int sensorValue = analogRead(A0);
  float voltage = sensorValue * (3.3 / 1023.0);
  float temperatureC = voltage * 100.0;
  Serial.print("Temperature: ");
  Serial.print(temperatureC);
  Serial.println(" °C");
  delay(1000);
}