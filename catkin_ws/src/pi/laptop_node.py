#!/usr/bin/env python3
import time
import rospy
import math
from geometry_msgs.msg import Vector3
from std_msgs.msg import Float64

# Waypoints
target_lat = [23.8296169, 23.829437, 23.829472, 23.829671, 23.829472, 23.829635, 23.829462]
target_lng = [90.5672889, 90.567002, 90.567096, 90.567096, 90.567259, 90.567265, 90.567005]
current_target = 0

# Configuration
SPEED = 0.7  # 0-1
DRF_H = 0.6
DRF_L = 0.3
ROT_H = 0.6
ROT_L = -0.1
current_lat = 0.0
current_lon = 0.0
velocity = 0.0
current_heading = 0.0


# Kalman Filter class (same as before)
class KalmanFilter:
    def __init__(self, process_variance, measurement_variance):
        self.process_variance = process_variance
        self.measurement_variance = measurement_variance
        self.posteri_estimate = 0
        self.posteri_error_estimate = 1

    def update(self, measurement):
        priori_estimate = self.posteri_estimate
        priori_error_estimate = self.posteri_error_estimate + self.process_variance
        kalman_gain = priori_error_estimate / (priori_error_estimate + self.measurement_variance)
        self.posteri_estimate = priori_estimate + kalman_gain * (measurement - priori_estimate)
        self.posteri_error_estimate = (1 - kalman_gain) * priori_error_estimate
        return self.posteri_estimate

# Kalman filter instances
kf_lat = KalmanFilter(process_variance=0.1, measurement_variance=1)
kf_lon = KalmanFilter(process_variance=0.1, measurement_variance=1)
kf_heading = KalmanFilter(process_variance=10, measurement_variance=1)

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

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth radius in meters
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat/2) * math.sin(d_lat/2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon/2) * math.sin(d_lon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def adjust_heading(current_heading, target_heading):
    error = target_heading - current_heading
    if error < -180:
        error += 360
    elif error > 180:
        error -= 360
    return error

def gps_callback(msg):
    global current_lat, current_lon, velocity
    current_lat = msg.x
    current_lon = msg.y
    velocity = msg.z

def heading_callback(msg):
    global current_heading
    current_heading = msg.data

def laptop_node():
    global current_target  # Add this line
    rospy.init_node('laptop_node', anonymous=True)

    # Subscribers
    rospy.Subscriber('/gps_data', Vector3, gps_callback)
    rospy.Subscriber('/heading', Float64, heading_callback)

    # Publisher for motor control
    motor_pub = rospy.Publisher('/motor_control', Vector3, queue_size=10)

    rate = rospy.Rate(10)  # 10 Hz
    while not rospy.is_shutdown():
        if current_target >= len(target_lat):
            rospy.loginfo("All waypoints reached!")
            break

        distance = calculate_distance(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
        bearing = calculate_bearing(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
        rospy.loginfo(f"Distance: {distance:.2f} m, Bearing: {bearing:.2f} deg")
        heading_error = adjust_heading(current_heading, bearing)
        rospy.loginfo(f"Heading error:{heading_error}")

        if distance < 2.5:
            current_target += 1  # This was causing the issue
            rospy.loginfo(f"Reached waypoint {current_target}")
            motor_pub.publish(Vector3(0, 0, 0))  # Turn right
            time.sleep(5)
        elif abs(heading_error) > 10:
            if heading_error > 0:
                motor_pub.publish(Vector3(ROT_L, ROT_H, 0))  # Turn right
                rospy.loginfo("Turning right")
            else:
                motor_pub.publish(Vector3(ROT_H, ROT_L, 0))  # Turn left
                rospy.loginfo("Turning left")
        elif abs(heading_error) > 10:
            if heading_error > 0:
                motor_pub.publish(Vector3(DRF_L, DRF_H, 0))  # Turn right
                rospy.loginfo("Drifting right")
            else:
                motor_pub.publish(Vector3(DRF_H, DRF_L, 0))  # Turn left
                rospy.loginfo("Drifting left")

        else:
            motor_pub.publish(Vector3(SPEED, SPEED, 0))  # Move forward
            rospy.loginfo("Moving forward")

        rate.sleep()

if __name__ == '__main__':
    try:
        laptop_node()
    except rospy.ROSInterruptException:
        pass