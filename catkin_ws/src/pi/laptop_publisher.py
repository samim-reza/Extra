#!/usr/bin/env python3

import rospy
from std_msgs.msg import String

def laptop_publisher():
    rospy.init_node('laptop_publisher', anonymous=True)
    pub = rospy.Publisher('laptop_topic', String, queue_size=10)
    rate = rospy.Rate(1)  # 1 Hz

    while not rospy.is_shutdown():
        message = "Hello from Laptop"
        rospy.loginfo("Publishing: %s", message)
        pub.publish(message)
        rate.sleep()

if __name__ == '__main__':
    try:
        laptop_publisher()
    except rospy.ROSInterruptException:
        pass