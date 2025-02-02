import smbus
import math
import time

# HMC5883L I2C address
HMC5883L_ADDRESS = 0x1E

# Register addresses
MODE_REGISTER = 0x02
DATA_REGISTER_BEGIN = 0x03

# Initialize I2C (SMBus)
bus = smbus.SMBus(1)  # Use 1 for Raspberry Pi 4 (I2C bus 1)

def setup_hmc5883l():
    # Set the HMC5883L to continuous measurement mode
    bus.write_byte_data(HMC5883L_ADDRESS, MODE_REGISTER, 0x00)
    time.sleep(0.1)  # Wait for the sensor to initialize

def read_raw_data():
    # Request 6 bytes of data from the sensor (2 bytes each for X, Z, and Y axes)
    data = bus.read_i2c_block_data(HMC5883L_ADDRESS, DATA_REGISTER_BEGIN, 6)
    
    # Combine high and low bytes for each axis
    x = (data[0] << 8) | data[1]
    z = (data[2] << 8) | data[3]
    y = (data[4] << 8) | data[5]
    
    # Handle negative values (16-bit signed integers)
    if x > 32767:
        x -= 65536
    if y > 32767:
        y -= 65536
    if z > 32767:
        z -= 65536
    
    return x, y, z

def calculate_heading(x, y, z):
    # Calculate pitch and roll
    pitch = math.atan2(-y, math.sqrt(x * x + z * z))
    roll = math.atan2(x, z)
    
    # Correct the X and Y values for tilt
    x_comp = x * math.cos(pitch) + z * math.sin(pitch)
    y_comp = y * math.cos(roll) + z * math.sin(roll)
    
    # Calculate heading (in radians)
    heading = math.atan2(y_comp, x_comp)
    
    # Normalize the heading to be between 0 and 360 degrees
    if heading < 0:
        heading += 2 * math.pi
    
    # Convert heading to degrees
    heading_degrees = heading * 180.0 / math.pi
    return heading_degrees

def get_cardinal_direction(heading_degrees):
    # Map the heading degrees to cardinal directions
    if heading_degrees >= 337.5 or heading_degrees < 22.5:
        return "North"
    elif 22.5 <= heading_degrees < 67.5:
        return "North-East"
    elif 67.5 <= heading_degrees < 112.5:
        return "East"
    elif 112.5 <= heading_degrees < 157.5:
        return "South-East"
    elif 157.5 <= heading_degrees < 202.5:
        return "South"
    elif 202.5 <= heading_degrees < 247.5:
        return "South-West"
    elif 247.5 <= heading_degrees < 292.5:
        return "West"
    elif 292.5 <= heading_degrees < 337.5:
        return "North-West"
    else:
        return "Unknown"

def main():
    setup_hmc5883l()
    
    while True:
        x, y, z = read_raw_data()
        
        # Print raw magnetometer data
        print(f"X: {x}\tY: {y}\tZ: {z}")
        
        # Calculate heading
        heading_degrees = calculate_heading(x, y, z)
        print(f"Current Heading: {heading_degrees:.2f} degrees")
        
        # Get cardinal direction
        direction = get_cardinal_direction(heading_degrees)
        print(f"Heading: {direction}")
        
        time.sleep(0.5)  # Delay to make output readable

if __name__ == "__main__":
    main()
