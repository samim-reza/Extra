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
dev0.axis0.motor.config.current_lim = 10  # Max current in Amps
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
time.sleep(5)
print("Reconnecting...")
dev0 = odrive.find_any()

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

# Set position control mode
dev0.axis0.controller.config.control_mode = CONTROL_MODE_POSITION_CONTROL
print("Position control mode activated")

def move_to_position(target_position, tolerance=5, timeout=10):
    """
    Move motor to specified position (in encoder counts)
    - tolerance: allowed position error (counts)
    - timeout: maximum time to reach position (seconds)
    """
    dev0.axis0.controller.input_pos = target_position
    start_time = time.time()
    
    while True:
        current_pos = dev0.axis0.encoder.pos_estimate
        error = abs(current_pos - target_position)
        
        print(f"Target: {target_position} | Current: {current_pos:.1f} | Error: {error:.1f}")
        
        if error <= tolerance:
            print("Position reached!")
            return True
            
        if time.time() - start_time > timeout:
            print("Timeout reached!")
            return False
            
        time.sleep(0.1)

# Example usage: Move to 3 different positions
try:
    # Move to 500 counts (about 4 revolutions)
    print("\nMoving to position 500")
    move_to_position(10)
    
    # Move to -200 counts
    print("\nMoving to position -200")
    move_to_position(-5)
    
    # Return to zero
    print("\nReturning to zero")
    move_to_position(0)

except KeyboardInterrupt:
    print("Stopping due to user interrupt")

finally:
    # Stop motor and clean up
    dev0.axis0.controller.input_pos = dev0.axis0.encoder.pos_estimate
    dev0.axis0.requested_state = AXIS_STATE_IDLE
    print("\nMotor stopped")