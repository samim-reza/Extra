import odrive
from odrive.enums import *
import time

# Connect to ODrive
dev0 = odrive.find_any()

# Clear errors
dev0.clear_errors()

# Set motor pole pairs and encoder CPR (based on your motor and encoder)
dev0.axis0.motor.config.pole_pairs = 7    # Pole pairs for R100 KV90 Cube Mars
dev0.axis0.encoder.config.cpr = 8192       # Encoder CPR, adjust if needed

# Save configuration
dev0.save_configuration()

# Run full calibration (motor and encoder)
print("Running full calibration...")
dev0.axis0.requested_state = AXIS_STATE_FULL_CALIBRATION_SEQUENCE
time.sleep(10)  # Give time for calibration to complete

# Check for errors
print(f"Encoder error: {hex(dev0.axis0.encoder.error)}")
print(f"Motor error: {hex(dev0.axis0.motor.error)}")
print(f"Encoder CPR: {dev0.axis0.encoder.config.cpr}")

# After successful calibration, you can switch to closed-loop control or start controlling the motor
