#!/usr/bin/env python3
import rospy
import math
import time
from geometry_msgs.msg import Vector3, PoseStamped
from std_msgs.msg import Float64
from nav_msgs.msg import Path
from visualization_msgs.msg import Marker

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

def publish_waypoints(marker_pub):
    marker = Marker()
    marker.header.frame_id = "map"
    marker.header.stamp = rospy.Time.now()
    marker.ns = "waypoints"
    marker.id = 0
    marker.type = Marker.POINTS
    marker.action = Marker.ADD
    marker.scale.x = 0.3  # Marker size
    marker.scale.y = 0.3
    marker.color.r = 1.0
    marker.color.g = 0.0
    marker.color.b = 0.0
    marker.color.a = 1.0

    for lat, lon in zip(target_lat, target_lng):
        pose = Vector3()
        pose.x = lon  # Assuming Lon as X, Lat as Y
        pose.y = lat
        pose.z = 0
        marker.points.append(pose)

    marker_pub.publish(marker)
    
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
    global current_target

    rospy.init_node('laptop_node', anonymous=True)

    rospy.Subscriber('/gps_data', Vector3, gps_callback)
    rospy.Subscriber('/heading', Float64, heading_callback)

    motor_pub = rospy.Publisher('/motor_control', Vector3, queue_size=10)
    path_pub = rospy.Publisher('/robot_path', Path, queue_size=10)
    pose_pub = rospy.Publisher('/robot_pose', PoseStamped, queue_size=10)
    waypoint_pub = rospy.Publisher('/waypoints', Marker, queue_size=10)

    rate = rospy.Rate(10)  # 10 Hz
    path_msg = Path()
    path_msg.header.frame_id = "map"

    while not rospy.is_shutdown():
        if current_target >= len(target_lat):
            rospy.loginfo("All waypoints reached!")
            break

        # Publish waypoints in RViz
        publish_waypoints(waypoint_pub)

        # Calculate navigation values
        distance = calculate_distance(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
        bearing = calculate_bearing(current_lat, current_lon, target_lat[current_target], target_lng[current_target])
        heading_error = adjust_heading(current_heading, bearing)

        rospy.loginfo(f"Distance: {distance:.2f} m, Bearing: {bearing:.2f} deg, Heading error: {heading_error}")

        # Publish robot's current pose
        pose_msg = PoseStamped()
        pose_msg.header.frame_id = "map"
        pose_msg.header.stamp = rospy.Time.now()
        pose_msg.pose.position.x = current_lon
        pose_msg.pose.position.y = current_lat
        pose_msg.pose.position.z = 0
        path_msg.poses.append(pose_msg)
        pose_pub.publish(pose_msg)
        path_pub.publish(path_msg)

        # Navigation logic
        if distance < 2.5:
            current_target += 1
            rospy.loginfo(f"Reached waypoint {current_target}")
            motor_pub.publish(Vector3(0, 0, 0))
            time.sleep(5)
        elif abs(heading_error) > 70:
            motor_pub.publish(Vector3(ROT_L, ROT_H, 0) if heading_error > 0 else Vector3(ROT_H, ROT_L, 0))
        elif abs(heading_error) > 10:
            motor_pub.publish(Vector3(DRF_L, DRF_H, 0) if heading_error > 0 else Vector3(DRF_H, DRF_L, 0))
        else:
            motor_pub.publish(Vector3(SPEED, SPEED, 0))

        rate.sleep()
        
if __name__ == '__main__':
    try:
        laptop_node()
    except rospy.ROSInterruptException:
        pass