import odrive
from odrive.enums import *
import time

# ------------------------
# TORQUE CONTROL CONFIG
# ------------------------
TORQUE_CONSTANT = 0.106  # Nm/A (get this from motor datasheet)
CURRENT_LIM = 10.0     # Amps (matches motor.config.current_lim)

def configure_torque_control(axis):
    """Configure axis for torque control mode"""
    axis.controller.config.control_mode = CONTROL_MODE_CURRENT_CONTROL
    print(f"Torque control configured (1A = {TORQUE_CONSTANT}Nm)")

def set_torque(axis, torque):
    """Set torque in Newton-meters"""
    current = torque / TORQUE_CONSTANT
    if abs(current) > CURRENT_LIM:
        current = CURRENT_LIM * (1 if current > 0 else -1)
        print(f"Current clamped to {current}A")
    axis.controller.input_current = current

def get_actual_torque(axis):
    """Get measured torque in Newton-meters"""
    return axis.motor.current_control.Iq_measured * TORQUE_CONSTANT

# ------------------------
# MAIN CODE
# ------------------------
print("Connecting...")
dev = odrive.find_any()
axis = dev.axis0

# Clear existing errors
dev.clear_errors()

try:
    # Run calibration if needed
    if axis.current_state != AXIS_STATE_CLOSED_LOOP_CONTROL:
        print("Running calibration...")
        axis.requested_state = AXIS_STATE_FULL_CALIBRATION_SEQUENCE
        while axis.current_state != AXIS_STATE_IDLE:
            time.sleep(0.1)
    
    # Enter closed-loop mode
    axis.requested_state = AXIS_STATE_CLOSED_LOOP_CONTROL
    
    # Configure torque control
    configure_torque_control(axis)
    
    # Real-time torque control loop
    while True:
        try:
            # Read current torque
            actual_torque = get_actual_torque(axis)
            print(f"\nCurrent Torque: {actual_torque:.3f}Nm")
            
            # Get user input
            cmd = input("Enter torque (Nm) or 'q' to quit: ")
            if cmd.lower() == 'q':
                break
                
            # Set new torque
            new_torque = float(cmd)
            set_torque(axis, new_torque)
            
        except ValueError:
            print("Invalid input! Use numbers only.")
            
except KeyboardInterrupt:
    pass

finally:
    # Clean shutdown
    set_torque(axis, 0)
    axis.requested_state = AXIS_STATE_IDLE
    print("\nMotor stopped safely")