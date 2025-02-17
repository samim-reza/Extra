#!/usr/bin/env python3

import rospy
from std_msgs.msg import Int32, Float32

def encoder_callback(msg):
    rospy.loginfo(f"Encoder Count: {msg.data}")

if __name__ == "__main__":
    rospy.init_node("motor_controller")

    # Subscribe to encoder count
    rospy.Subscriber("encoder_count", Int32, encoder_callback)

    # Publisher for motor commands
    motor_pub = rospy.Publisher("motor_command", Float32, queue_size=10)

    rate = rospy.Rate(10)  # 10 Hz
    while not rospy.is_shutdown():
        speed = float(input("Enter motor speed (-100 to 100): "))
        motor_pub.publish(speed)
        rate.sleep()
