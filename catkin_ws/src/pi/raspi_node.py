#!/usr/bin/env python3

import rospy
import math
import smbus
import serial
from gpiozero import PWMOutputDevice, DigitalOutputDevice
from pynmea2 import parse
from geometry_msgs.msg import Vector3
from std_msgs.msg import Float64

# Motor control setup (BCM numbering)
MFR1 = PWMOutputDevice(20)
MBL1 = PWMOutputDevice(21)
MFR2 = PWMOutputDevice(12)
MBL2 = PWMOutputDevice(13)

# Magnetometer (HMC5883L)
HMC5883L_ADDR = 0x1E
MODE_REGISTER = 0x02
DATA_REGISTER_BEGIN = 0x03
bus = smbus.SMBus(1)

# GPS setup
gps_serial = serial.Serial('/dev/ttyAMA0', 9600, timeout=1)

# Declination for magnetometer
DECLINATION = 0.22  # Magnetic declination

def setup_hmc5883l():
    bus.write_byte_data(HMC5883L_ADDR, MODE_REGISTER, 0x00)
    rospy.sleep(0.1)

def read_magnetometer():
    data = bus.read_i2c_block_data(HMC5883L_ADDR, DATA_REGISTER_BEGIN, 6)
    x = (data[0] << 8) | data[1]
    y = (data[4] << 8) | data[5]
    
    if x > 32767:
        x -= 65536
    if y > 32767:
        y -= 65536
    
    heading = math.atan2(y, x) + DECLINATION
    if heading < 0:
        heading += 2 * math.pi
    heading_deg = math.degrees(heading)
    return heading_deg

def get_gps_data():
    try:
        line = gps_serial.readline().decode('utf-8', errors='replace')
        if line.startswith('$GPRMC'):
            fields = line.split(',')
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

                # Convert ground speed from knots to meters per second
                velocity_mps = ground_speed * 0.51444
                rospy.loginfo(f"lat: {lat_deg} lon: {lon_deg}")
                return lat_deg, lon_deg, velocity_mps
    except Exception as e:
        rospy.logerr(f"Error reading GPS data: {e}")
    return None, None, None

def motor_control_callback(msg):
    # msg.x = left motor speed, msg.y = right motor speed

    # Left motor control (MFR1 = forward, MBL1 = backward)
    if (msg.x or msg.y) == 0:
        MFR1.value = 0
        MBL1.value = 0
        MFR2.value = 0
        MBL2.value = 0

    if msg.x > 0:  # Move forward
        MFR1.value = msg.x  # Forward speed
        MBL1.value = 0      # Stop backward motor
    else:  # Move backward
        MFR1.value = 0      # Stop forward motor
        MBL1.value = abs(msg.x)  # Backward speed

    # Right motor control (MFR2 = forward, MBL2 = backward)
    if msg.y > 0:  # Move forward
        MFR2.value = msg.y  # Forward speed
        MBL2.value = 0      # Stop backward motor
    else:  # Move backward
        MFR2.value = 0      # Stop forward motor
        MBL2.value = abs(msg.y)  # Backward speed

def raspi_node():
    rospy.init_node('raspi_node', anonymous=True)
    setup_hmc5883l()

    # Publishers
    gps_pub = rospy.Publisher('/gps_data', Vector3, queue_size=10)
    heading_pub = rospy.Publisher('/heading', Float64, queue_size=10)

    # Subscriber for motor control
    rospy.Subscriber('/motor_control', Vector3, motor_control_callback)

    rate = rospy.Rate(10)  # 10 Hz
    while not rospy.is_shutdown():
        # Read and publish GPS data
        lat, lon, vel = get_gps_data()
        if lat is not None and lon is not None:
            gps_data = Vector3(lat, lon, vel)
            gps_pub.publish(gps_data)

        # Read and publish heading
        heading = read_magnetometer()
        rospy.loginfo(f"Heading: {heading:.2f}")
        heading_pub.publish(heading)

        rate.sleep()

if __name__ == '__main__':
    try:
        raspi_node()
    except rospy.ROSInterruptException:
        pass
