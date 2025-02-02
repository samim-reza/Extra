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

# GPS setup
gps_serial = serial.Serial('/dev/ttyAMA0', 9600, timeout=1)

# Waypoints
target_lat = [23.8296169, 23.82952, 23.829585, 23.829604, 23.829572, 23.829635, 23.829462]
target_lng = [90.5672889, 90.567155, 90.567145, 90.567239, 90.567179, 90.567265, 90.567005]
current_target = 0

# Configuration
SPEED = 0.7  # 0-1
L_R_SPD = 0.3
dlow = 0.25
dhigh = 0.6
DECLINATION = 0.22  # Magnetic declination
null = 0
left = 0
right = 0

def setup_hmc5883l():
    bus.write_byte_data(HMC5883L_ADDR, MODE_REGISTER, 0x00)
    time.sleep(0.1)

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
    print('heading: ', math.degrees(heading))
    return math.degrees(heading)

def get_gps_data():
    while True:
        try:
            line = gps_serial.readline().decode('utf-8')
            if line.startswith(''):
                msg = parse(line)
                print('latitude: ', msg.latitude)
                print('longitude: ', msg.longitude)
                return msg.latitude, msg.longitude
        except:
            return None, None

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
    print('bearing: ', (bearing+360)%360)
    return (bearing + 360) % 360

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth radius in meters
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat/2) * math.sin(d_lat/2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon/2) * math.sin(d_lon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    print('distance: ', R * c)
    return R * c

def adjust_heading(current_heading, target_heading):
    error = target_heading - current_heading
    if error < -180:
        error += 360
    elif error > 180:
        error -= 360
    return error

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
            current_lat, current_lon = get_gps_data()
            if current_lat is None or current_lon is None:
                continue
            
            distance = calculate_distance(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
            bearing = calculate_bearing(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
            current_heading = read_magnetometer()
            heading_error = adjust_heading(current_heading, bearing)
            print(target_lat[current_target])
            print(target_lng[current_target])

            if distance < 1:
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
                            time.sleep(0.5)
                        turn_right()
                    else:
                        null = 1
                        left = 1
                        if right == 1:
                            stop_motors()
                            right = 0
                            time.sleep(0.5)
                        turn_left()
                elif abs(heading_error) < 90:  # Subtle correction
                    if heading_error > 0:
                        if null == 1:
                            stop_motors()
                            null = 0
                            time.sleep(0.5)
                        right_drift()
                    else:
                        if null == 1:
                            stop_motors()
                            null = 0
                            time.sleep(0.5)
                        left_drift()
            else:
                move_forward()
            time.sleep(0.5)
    except KeyboardInterrupt:
        stop_motors()
        kill_process()
