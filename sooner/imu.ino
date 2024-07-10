#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>

// Create an instance of the ADXL345 class
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

void displaySensorDetails(void) {
  sensor_t sensor;
  accel.getSensor(&sensor);
  Serial.println("------------------------------------");
  Serial.print("Sensor:       "); Serial.println(sensor.name);
  Serial.print("Driver Ver:   "); Serial.println(sensor.version);
  Serial.print("Unique ID:    "); Serial.println(sensor.sensor_id);
  Serial.print("Max Value:    "); Serial.print(sensor.max_value); Serial.println(" m/s^2");
  Serial.print("Min Value:    "); Serial.print(sensor.min_value); Serial.println(" m/s^2");
  Serial.print("Resolution:   "); Serial.print(sensor.resolution); Serial.println(" m/s^2");  
  Serial.println("------------------------------------");
  Serial.println("");
  delay(500);
}

void setup(void) {
  Serial.begin(115200);
  Serial.println("ADXL345 test");

  // Initialize the sensor
  if(!accel.begin()) {
    Serial.println("Ooops, no ADXL345 detected ... Check your wiring!");
    while(1);
  }
  
  // Display some basic information about the sensor
  displaySensorDetails();
  
  // Set the range to whatever is appropriate for your project
  accel.setRange(ADXL345_RANGE_16_G);
  
  Serial.print("Range set to: ");
  switch (accel.getRange()) {
    case ADXL345_RANGE_16_G: 
      Serial.println("+-16G"); 
      break;
    case ADXL345_RANGE_8_G:  
      Serial.println("+-8G"); 
      break;
    case ADXL345_RANGE_4_G:  
      Serial.println("+-4G"); 
      break;
    case ADXL345_RANGE_2_G:  
      Serial.println("+-2G"); 
      break;
  }
}

void loop(void) {
  delay(2000);
  // Get a new sensor event
  sensors_event_t event; 
  accel.getEvent(&event);
 
  // Display the results (acceleration is measured in m/s^2)
  Serial.print("X: "); Serial.print(event.acceleration.x); Serial.print("  ");
  Serial.print("Y: "); Serial.print(event.acceleration.y); Serial.print("  ");
  Serial.print("Z: "); Serial.print(event.acceleration.z); Serial.print("  "); 
  
  // Delay before the next sample
  delay(3000);
}

