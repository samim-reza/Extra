import os
import math
import time
import smbus
import serial
from gpiozero import PWMOutputDevice, DigitalOutputDevice
from pynmea2 import parse

# Motor control setup (BCM numbering)
EN1 = PWMOutputDevice(13)
IN1 = DigitalOutputDevice(19)
IN2 = DigitalOutputDevice(26)
EN2 = PWMOutputDevice(12)
IN3 = DigitalOutputDevice(20)
IN4 = DigitalOutputDevice(21)

# Magnetometer (HMC5883L)
HMC5883L_ADDR = 0x1E
MODE_REGISTER = 0x02
DATA_REGISTER_BEGIN = 0x03
bus = smbus.SMBus(1)

last_update_time = 0  # Initialize the time of the last request
TIME_INTERVAL = 0.5  # 0.5 seconds interval

# GPS setup
gps_serial = serial.Serial('/dev/ttyAMA0', 9600, timeout=1)

# Waypoints
target_lat = [23.8296169, 23.829437, 23.829472, 23.829671, 23.829472, 23.829635, 23.829462]
target_lng = [90.5672889, 90.567002, 90.567096, 90.567096, 90.567259, 90.567265, 90.567005]
current_target = 0

# Configuration
SPEED = 0.6  # 0-1
L_R_SPD = 0.45
dlow = 0.1
dhigh = 0.5
DECLINATION = 0.22  # Magnetic declination
null = 0
left = 0
right = 0

# Kalman Filter class
class KalmanFilter:
    def __init__(self, process_variance, measurement_variance):
        """
        Initialize the Kalman Filter with process and measurement variances.
        process_variance: Variance of the process (the model's uncertainty)
        measurement_variance: Variance of the measurements (sensor noise)
        """
        self.process_variance = process_variance
        self.measurement_variance = measurement_variance
        self.posteri_estimate = 0  # Initial estimate (could be a guess or 0)
        self.posteri_error_estimate = 1  # Initial error estimate

    def update(self, measurement):
        """
        Update the filter with a new measurement and return the updated estimate.
        measurement: The new measurement from the sensor (e.g., GPS or magnetometer)
        """
        # Predict the prior estimate and error
        priori_estimate = self.posteri_estimate
        priori_error_estimate = self.posteri_error_estimate + self.process_variance
        
        # Calculate the Kalman Gain
        kalman_gain = priori_error_estimate / (priori_error_estimate + self.measurement_variance)
        
        # Update the estimate with the new measurement
        self.posteri_estimate = priori_estimate + kalman_gain * (measurement - priori_estimate)
        
        # Update the error estimate
        self.posteri_error_estimate = (1 - kalman_gain) * priori_error_estimate
        
        return self.posteri_estimate

# Kalman filter instances for GPS latitude and longitude
kf_lat = KalmanFilter(process_variance=0.1, measurement_variance=1)
kf_lon = KalmanFilter(process_variance=0.1, measurement_variance=1)

# Kalman filter instance for heading (magnetometer data)
kf_heading = KalmanFilter(process_variance=10, measurement_variance=1)

# Optionally, you can also add a Kalman filter instance for velocity
kf_vel = KalmanFilter(process_variance=0.1, measurement_variance=1)

def setup_hmc5883l():
    bus.write_byte_data(HMC5883L_ADDR, MODE_REGISTER, 0x00)
    time.sleep(0.1)

# Read magnetometer data and apply Kalman filter
def read_magnetometer():
    data = bus.read_i2c_block_data(HMC5883L_ADDR, DATA_REGISTER_BEGIN, 6)
    x = (data[0] << 8) | data[1]
    z = (data[2] << 8) | data[3]
    y = (data[4] << 8) | data[5]
    
    if x > 32767:
        x -= 65536
    if y > 32767:
        y -= 65536
    if z > 32767:
        z -= 65536
    
    heading = math.atan2(y, x) + DECLINATION
    if heading < 0:
        heading += 2 * math.pi
    heading_deg = math.degrees(heading)

    smoothed_heading = kf_heading.update(heading_deg)

    print('Heading (Kalman):', smoothed_heading)
    return smoothed_heading


# Calculate bearing
def calculate_bearing(lat1, lon1, lat2, lon2):
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)
    
    d_lon = lon2 - lon1
    x = math.cos(lat2) * math.sin(d_lon)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(d_lon)
    bearing = math.atan2(x, y)
    bearing = math.degrees(bearing)
    return (bearing + 360) % 360

# Get GPS data and apply Kalman filter
def get_gps_data():
    last_lat, last_lon, last_velocity = None, None, None  # Variables to store the last valid GPS data
    gps_data_buffer = ""  # Buffer to store incomplete sentences

    while True:
        try:
            # Read a line from the GPS
            line = gps_serial.readline().decode('utf-8', errors='replace')

            if not line:
                continue  # Skip empty lines

            # Append the received data to the buffer
            gps_data_buffer += line.strip()

            # Check if the line contains the end of a sentence (i.e., checksum marker '*')
            if '*' in gps_data_buffer:
                # Only process GPRMC lines, as they contain useful coordinates
                if gps_data_buffer.startswith('$GPRMC'):
                    fields = gps_data_buffer.split(',')

                    if len(fields) >= 9 and fields[2] == 'A':  # 'A' means data is valid
                        latitude = float(fields[3])
                        lat_dir = fields[4]
                        longitude = float(fields[5])
                        lon_dir = fields[6]
                        ground_speed = float(fields[7])  # Ground speed in knots

                        # Convert latitude and longitude to decimal degrees
                        lat_deg = int(latitude // 100) + (latitude % 100) / 60.0
                        if lat_dir == 'S':
                            lat_deg = -lat_deg

                        lon_deg = int(longitude // 100) + (longitude % 100) / 60.0
                        if lon_dir == 'W':
                            lon_deg = -lon_deg

                        # Convert ground speed from knots to meters per second (1 knot ≈ 0.51444 m/s)
                        velocity_mps = ground_speed * 0.51444

                        print(f"Raw Latitude: {lat_deg}, Raw Longitude: {lon_deg}, Ground Speed: {velocity_mps} m/s")

                        # Apply Kalman filter to smooth the latitude, longitude, and velocity
                        smoothed_lat = kf_lat.update(lat_deg)
                        smoothed_lon = kf_lon.update(lon_deg)
                        smoothed_vel = kf_vel.update(velocity_mps)

                        print(f"Latitude (Kalman): {smoothed_lat}")
                        print(f"Longitude (Kalman): {smoothed_lon}")
                        print(f"Velocity (Kalman): {smoothed_vel}")

                        # Update last valid data
                        last_lat, last_lon, last_velocity = smoothed_lat, smoothed_lon, smoothed_vel

                # Clear the buffer after processing the data
                gps_data_buffer = ""

        except serial.SerialException as e:
            print(f"Serial port error: {e}")
            break  # Exit if there's a serial port error

        except ValueError as e:
            print(f"Value error when parsing GPS data: {e}")
            continue  # Skip invalid lines and continue reading

        except Exception as e:
            print(f"Unexpected error: {e}")
            continue  # Keep going in case of other errors

        # Return the last valid data if available
        if last_lat is not None and last_lon is not None and last_velocity is not None:
            return last_lat, last_lon, last_velocity

    return None, None, None  # Return None if no valid data is found

# Calculate distance
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth radius in meters
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat/2) * math.sin(d_lat/2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon/2) * math.sin(d_lon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# Adjust heading to match target heading
def adjust_heading(current_heading, target_heading):
    error = target_heading - current_heading
    if error < -180:
        error += 360
    elif error > 180:
        error -= 360
    return error

def should_run_functions():
    global last_update_time
    
    current_time = time.time()
    # Check if enough time has passed
    if current_time - last_update_time >= TIME_INTERVAL:
        last_update_time = current_time  # Update the last run time
        return True
    return False

def move_forward():
    print('Moving forward')
    IN1.on()
    IN2.off()
    IN3.on()
    IN4.off()
    EN1.value = SPEED
    EN2.value = SPEED

def turn_left():
    print('Turning left')
    IN1.off()
    IN2.on()
    IN3.on()
    IN4.off()
    EN1.value = L_R_SPD
    EN2.value = L_R_SPD

def left_drift():
    print('Drifting left')
    EN1.value = dlow
    EN2.value = dhigh
    IN1.on()
    IN2.off()
    IN3.on()
    IN4.off()

def turn_right():
    print('Turning right')
    IN1.on()
    IN2.off()
    IN3.off()
    IN4.on()
    EN1.value = L_R_SPD
    EN2.value = L_R_SPD

def right_drift():
    print('Drifting right')
    EN1.value = dhigh
    EN2.value = dlow
    IN1.on()
    IN2.off()
    IN3.on()
    IN4.off()

def stop_motors():
    print('Stopping motors')
    EN1.value = 0
    EN2.value = 0
    IN1.off()
    IN2.off()
    IN3.off()
    IN4.off()

def kill_process():
    print('Terminating process...')
    os.kill(os.getpid(), 9)  # Kill the current process

if __name__ == '__main__':
    setup_hmc5883l()
    try:
        while current_target < len(target_lat):
            current_lat, current_lon, velocity = get_gps_data()
            if current_lat is None or current_lon is None:
                continue
            
            distance = calculate_distance(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
            bearing = calculate_bearing(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
            current_heading = read_magnetometer()
            heading_error = adjust_heading(current_heading, bearing)
            print(f"Bearing: ",bearing)
            if distance < 2.5:
                stop_motors()
                time.sleep(5)
                current_target += 1
            elif abs(heading_error) > 10:
                if abs(heading_error) > 90:  # More aggressive correction threshold
                    if heading_error > 0:
                        null = 1
                        right = 1
                        if left == 1:
                            stop_motors()
                            left = 0
                            time.sleep(1.5)
                        turn_right()
                    else:
                        null = 1
                        left = 1
                        if right == 1:
                            stop_motors()
                            right = 0
                            time.sleep(1.5)
                        turn_left()
                elif abs(heading_error) < 90:  # Subtle correction
                    if heading_error > 0:
                        if null == 1:
                            stop_motors()
                            null = 0
                            time.sleep(1.5)
                        right_drift()
                    else:
                        if null == 1:
                            stop_motors()
                            null = 0
                            time.sleep(1.5)
                        left_drift()
            else:
                move_forward()
            time.sleep(0.5)
    except KeyboardInterrupt:
        stop_motors()
        kill_process()
