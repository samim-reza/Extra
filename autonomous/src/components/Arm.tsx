import React, { useState, CSSProperties } from 'react';

const Arm = () => {
  const [selectedCamera, setSelectedCamera] = useState('main');
  const [armPosition, setArmPosition] = useState('middle');
  
  // Camera feed simulation
  const getCameraFeed = (camera: string): string => {
    return `/api/placeholder/640/480?text=Camera ${camera}`;
  };
  
  // Handle arm movement
  interface MoveArmFunction {
    (position: string): void;
  }

  const moveArm: MoveArmFunction = (position) => {
    setArmPosition(position);
  };
  
  // Select camera to display in main view
  interface SelectCameraFunction {
    (camera: string): void;
  }

  const selectCamera: SelectCameraFunction = (camera) => {
    setSelectedCamera(camera);
  };

  // Custom styles to replace Bootstrap
  const styles: { [key: string]: CSSProperties } = {
    container: {
      backgroundColor: '#1a1f35',
      minHeight: '100vh',
      color: 'white',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: 'white'
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap' as 'wrap',
      margin: '0 -0.5rem'
    },
    colFull: {
      width: '100%',
      padding: '0 0.5rem',
      marginBottom: '1rem'
    },
    col8: {
      width: '66.666%',
      padding: '0 0.5rem',
      marginBottom: '1rem'
    },
    col4: {
      width: '33.333%',
      padding: '0 0.5rem',
      marginBottom: '1rem'
    },
    col6: {
      width: '50%',
      padding: '0 0.5rem',
      marginBottom: '1rem'
    },
    cameraPanelMain: {
      backgroundColor: '#1e2738',
      borderRadius: '0.25rem',
      padding: '1rem',
      textAlign: 'center'
    },
    cameraPanel: {
      backgroundColor: '#1e2738',
      borderRadius: '0.25rem',
      padding: '0.5rem',
      cursor: 'pointer',
      height: '100%',
      margin: '0 0 1rem 0'
    },
    cameraPanelSelected: {
      border: '2px solid #ffc107'
    },
    cameraImage: {
      width: '100%',
      borderRadius: '0.25rem'
    },
    mainCameraImage: {
      width: '100%',
      maxHeight: '400px',
      objectFit: 'cover',
      borderRadius: '0.25rem',
      border: '1px solid #6c757d'
    },
    controlPanel: {
      backgroundColor: '#1e2738',
      borderRadius: '0.25rem',
      padding: '1.5rem',
      height: '100%'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.25rem',
      marginBottom: '1rem',
      border: '1px solid #ffc107',
      backgroundColor: 'transparent',
      color: '#ffc107',
      fontSize: '1rem',
      cursor: 'pointer',
      textAlign: 'center'
    },
    buttonActive: {
      backgroundColor: '#ffc107',
      color: '#000'
    },
    statusCard: {
      backgroundColor: '#6c757d',
      color: 'white',
      borderRadius: '0.25rem',
      padding: '1rem',
      marginTop: '1.5rem'
    },
    badge: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      marginRight: '0.5rem',
      fontSize: '0.75rem'
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.colFull}>
          <h1 style={styles.header}>Mars Rover Arm Control Dashboard</h1>
        </div>
      </div>
      
      <div style={styles.row}>
        {/* First Column - Camera Feeds */}
        <div style={styles.col8}>
          <div style={styles.row}>
            {/* Main Camera Display */}
            <div style={styles.colFull}>
              <div style={styles.cameraPanelMain}>
                <h4 style={{color: 'white'}}>Main View: {selectedCamera.toUpperCase()} Camera</h4>
                <img 
                  src={getCameraFeed(selectedCamera)} 
                  alt="Main Camera Feed" 
                  style={styles.mainCameraImage}
                />
                <div style={{marginTop: '0.5rem', color: 'white'}}>
                  <span style={styles.badge}>Live</span>
                  <span>Arm Position: {armPosition.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.row}>
            {/* Left Side Cameras */}
            <div style={styles.col6}>
              <div style={styles.row}>
                <div style={styles.col6}>
                  <div 
                    style={{
                      ...styles.cameraPanel,
                      ...(selectedCamera === 'front' ? styles.cameraPanelSelected : {})
                    }}
                    onClick={() => selectCamera('front')}
                  >
                    <h6 style={{color: 'white'}}>Front Camera</h6>
                    <img 
                      src={getCameraFeed('front')} 
                      alt="Front Camera" 
                      style={styles.cameraImage}
                    />
                  </div>
                </div>
                <div style={styles.col6}>
                  <div 
                    style={{
                      ...styles.cameraPanel,
                      ...(selectedCamera === 'arm' ? styles.cameraPanelSelected : {})
                    }}
                    onClick={() => selectCamera('arm')}
                  >
                    <h6 style={{color: 'white'}}>Arm Camera</h6>
                    <img 
                      src={getCameraFeed('arm')} 
                      alt="Arm Camera" 
                      style={styles.cameraImage}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side Cameras */}
            <div style={styles.col6}>
              <div style={styles.row}>
                <div style={styles.col6}>
                  <div 
                    style={{
                      ...styles.cameraPanel,
                      ...(selectedCamera === 'rear' ? styles.cameraPanelSelected : {})
                    }}
                    onClick={() => selectCamera('rear')}
                  >
                    <h6 style={{color: 'white'}}>Rear Camera</h6>
                    <img 
                      src={getCameraFeed('rear')} 
                      alt="Rear Camera" 
                      style={styles.cameraImage}
                    />
                  </div>
                </div>
                <div style={styles.col6}>
                  <div 
                    style={{
                      ...styles.cameraPanel,
                      ...(selectedCamera === 'ground' ? styles.cameraPanelSelected : {})
                    }}
                    onClick={() => selectCamera('ground')}
                  >
                    <h6 style={{color: 'white'}}>Ground Camera</h6>
                    <img 
                      src={getCameraFeed('ground')} 
                      alt="Ground Camera" 
                      style={styles.cameraImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second Column - Arm Controls */}
        <div style={styles.col4}>
          <div style={styles.controlPanel}>
            <h3 style={{textAlign: 'center', color: 'white', marginBottom: '1.5rem'}}>Arm Controls</h3>
            
            <button 
              style={{
                ...styles.button,
                ...(armPosition === 'up' ? styles.buttonActive : {})
              }}
              onClick={() => moveArm('up')}
            >
              Move Arm Up
            </button>
            
            <button 
              style={{
                ...styles.button,
                ...(armPosition === 'middle' ? styles.buttonActive : {})
              }}
              onClick={() => moveArm('middle')}
            >
              Move Arm Middle
            </button>
            
            <button 
              style={{
                ...styles.button,
                ...(armPosition === 'down' ? styles.buttonActive : {})
              }}
              onClick={() => moveArm('down')}
            >
              Move Arm Down
            </button>
            
            <div style={styles.statusCard}>
              <h5 style={{color: 'white', marginBottom: '0.75rem'}}>Arm Status</h5>
              <p style={{marginBottom: '0.5rem'}}>Current Position: <strong>{armPosition.toUpperCase()}</strong></p>
              <p style={{marginBottom: '0.5rem'}}>Temperature: <span style={{color: '#28a745'}}>Normal</span></p>
              <p style={{marginBottom: '0'}}>Battery: <span style={{color: '#ffc107'}}>87%</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arm;