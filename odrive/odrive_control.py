import odrive
from odrive.enums import *
import time

# Find the ODrive
print("Finding ODrive...")
dev0 = odrive.find_any()
print("ODrive found!")

# Clear errors
dev0.clear_errors()

# Motor Configuration (Adjust according to your motor)
dev0.axis0.motor.config.current_lim = 15  # Max current in Amps
dev0.axis0.motor.config.pole_pairs = 21   # Set according to your motor
dev0.axis0.motor.config.calibration_current = 10
dev0.axis0.encoder.config.cpr = 126  # Counts per revolution of the encoder

# Save Configuration (will trigger reboot)
try:
    dev0.save_configuration()
    print("Configuration saved. ODrive rebooting...")
except Exception as e:
    print(f"Expected disconnection: {str(e)}")

# Wait for reboot and reconnect
time.sleep(5)  # Wait for reboot to complete
print("Reconnecting...")
dev0 = odrive.find_any()  # Get a new connection

# Run Motor Calibration
print("Calibrating motor...")
dev0.axis0.requested_state = AXIS_STATE_MOTOR_CALIBRATION
while dev0.axis0.current_state != AXIS_STATE_IDLE:
    time.sleep(0.1)
print("Motor calibration done.")

# Check for errors
if dev0.axis0.motor.error:
    print(f"Motor Error: {hex(dev0.axis0.motor.error)}")
    exit()

# Run Encoder Calibration
print("Calibrating encoder...")
dev0.axis0.requested_state = AXIS_STATE_ENCODER_OFFSET_CALIBRATION
while dev0.axis0.current_state != AXIS_STATE_IDLE:
    time.sleep(0.1)
print("Encoder calibration done.")

# Check for errors
if dev0.axis0.encoder.error:
    print(f"Encoder Error: {hex(dev0.axis0.encoder.error)}")
    exit()

# Switch to Closed-Loop Control
dev0.axis0.requested_state = AXIS_STATE_CLOSED_LOOP_CONTROL
print("Closed-loop control enabled.")

# Run the motor at a set velocity
print("Running motor at velocity 10...")
dev0.axis0.controller.input_vel = 10  # Adjust speed as needed
time.sleep(5)  # Run for 5 seconds

# Stop the motor
print("Stopping motor...")
dev0.axis0.controller.input_vel = 0

print("Done!")