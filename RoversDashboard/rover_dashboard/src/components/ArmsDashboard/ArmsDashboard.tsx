import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Mock components - replace with your actual components
const ArmControl = () => {
  const [baseRotation, setBaseRotation] = useState(90);
  const [shoulder, setShoulder] = useState(45);
  const [elbow, setElbow] = useState(90);
  const [wrist, setWrist] = useState(60);

  return (
    <div className="d-flex flex-column">
      <div className="mb-3">
        <label className="form-label text-light">Base Rotation: {baseRotation}°</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="180"
          value={baseRotation}
          onChange={(e) => setBaseRotation(parseInt(e.target.value))}
        />
        <div className="d-flex justify-content-between">
          <small>0°</small>
          <small>180°</small>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label text-light">Shoulder: {shoulder}°</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="180"
          value={shoulder}
          onChange={(e) => setShoulder(parseInt(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <label className="form-label text-light">Elbow: {elbow}°</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="180"
          value={elbow}
          onChange={(e) => setElbow(parseInt(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <label className="form-label text-light">Wrist: {wrist}°</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="180"
          value={wrist}
          onChange={(e) => setWrist(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

const GripperControl = () => {
  const [gripperWidth, setGripperWidth] = useState(50);

  const handleClose = () => setGripperWidth(0);
  const handleOpen = () => setGripperWidth(100);

  return (
    <div>
      <div className="mb-3">
        <label className="form-label text-light">Gripper Width: {gripperWidth}%</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={gripperWidth}
          onChange={(e) => setGripperWidth(parseInt(e.target.value))}
        />
        <div className="d-flex justify-content-between">
          <small>Closed</small>
          <small>Open</small>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-sm"
          style={{ backgroundColor: 'rgba(77, 145, 255, 0.3)', color: '#e9ecef', border: '1px solid #4d91ff' }}
          onClick={handleClose}
        >
          <i className="fas fa-hand-rock me-1"></i>CLOSE
        </button>
        <button
          className="btn btn-sm"
          style={{ backgroundColor: 'rgba(77, 145, 255, 0.3)', color: '#e9ecef', border: '1px solid #4d91ff' }}
          onClick={handleOpen}
        >
          <i className="fas fa-hand-peace me-1"></i>OPEN
        </button>
      </div>
    </div>
  );
};

const TaskAutomation = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Pick and Place', selected: false },
    { id: 2, name: 'Continuous Rotation', selected: false },
    { id: 3, name: 'Follow Path', selected: false },
  ]);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleTaskSelect = (taskId: number) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
    setTasks(
      tasks.map((task) => ({
        ...task,
        selected: task.id === taskId ? !task.selected : false,
      }))
    );
  };

  const handleRunTask = () => {
    if (selectedTask !== null) {
      setIsRunning(!isRunning);
      alert(
        `Task ${isRunning ? 'stopped' : 'started'}: ${
          tasks.find((task) => task.id === selectedTask)?.name
        }`
      );
    }
  };

  return (
    <div>
      <div
        className="list-group mb-2"
        style={{ maxHeight: '150px', overflowY: 'auto' }}
      >
        {tasks.map((task) => (
          <button
            key={task.id}
            className={`list-group-item list-group-item-action ${
              task.selected ? 'active' : ''
            }`}
            style={{
              backgroundColor: task.selected
                ? 'rgba(77, 145, 255, 0.5)'
                : 'rgba(77, 145, 255, 0.1)',
              color: '#e9ecef',
              border: '1px solid rgba(77, 145, 255, 0.2)',
            }}
            onClick={() => handleTaskSelect(task.id)}
          >
            {task.name}
          </button>
        ))}
      </div>
      <button
        className="btn btn-sm w-100"
        style={{
          backgroundColor: isRunning
            ? 'rgba(220, 53, 69, 0.3)'
            : 'rgba(40, 167, 69, 0.3)',
          color: '#e9ecef',
          border: isRunning ? '1px solid #dc3545' : '1px solid #28a745',
        }}
        onClick={handleRunTask}
        disabled={selectedTask === null}
      >
        <i className={`fas ${isRunning ? 'fa-stop' : 'fa-play'} me-1`}></i>
        {isRunning ? 'STOP TASK' : 'RUN SELECTED TASK'}
      </button>
    </div>
  );
};
const ThreedArm = () => {
  const handleRotate = (direction:string) => {
    console.log(`Rotating 3D view: ${direction}`);
    // Implement actual rotation logic here
  };

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#131829' }}>
      <div style={{ fontSize: '4rem', color: 'rgba(77, 145, 255, 0.2)' }}>
        <i className="fas fa-cube"></i>
      </div>
      {/* 3D rendering would go here */}
    </div>
  );
};

const CameraFeed = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    alert(`Camera ${isConnected ? 'disconnected' : 'connected'}`);
  };

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#000000' }}>
      {isConnected ? (
        <div style={{ fontSize: '2rem', color: 'rgba(77, 145, 255, 0.2)' }}>
          <i className="fas fa-video"></i>
          <div className="small text-light mt-2">Live Feed</div>
        </div>
      ) : (
        <button
          className="btn btn-sm"
          style={{ backgroundColor: 'rgba(77, 145, 255, 0.3)', color: '#e9ecef', border: '1px solid #4d91ff' }}
          onClick={handleConnect}
        >
          <i className="fas fa-plug me-1"></i>Connect Camera
        </button>
      )}
    </div>
  );
};

const Telemetry = () => {
  // Mock data for telemetry
  const [telemetryData] = useState([
    { name: '0s', motor1: 42, motor2: 35, motor3: 28 },
    { name: '10s', motor1: 45, motor2: 32, motor3: 30 },
    { name: '20s', motor1: 43, motor2: 36, motor3: 27 },
    { name: '30s', motor1: 47, motor2: 34, motor3: 29 },
    { name: '40s', motor1: 44, motor2: 37, motor3: 31 },
  ]);

  return (
    <div>
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small>Motor 1 Temp:</small>
          <small className="text-warning">44°C</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
        </div>
      </div>
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small>Motor 2 Temp:</small>
          <small className="text-success">37°C</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div className="progress-bar bg-success" style={{ width: '40%' }}></div>
        </div>
      </div>
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small>Motor 3 Temp:</small>
          <small className="text-success">31°C</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div className="progress-bar bg-success" style={{ width: '30%' }}></div>
        </div>
      </div>
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small>Battery:</small>
          <small className="text-success">87%</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div className="progress-bar bg-success" style={{ width: '87%' }}></div>
        </div>
      </div>
    </div>
  );
};

const StatusPanel = () => (
  <div>
    <div className="mb-2">
      <div className="d-flex justify-content-between">
        <small>System Status:</small>
        <small className="text-success">Online</small>
      </div>
    </div>
    <div className="mb-2">
      <div className="d-flex justify-content-between">
        <small>Connection:</small>
        <small className="text-success">Stable</small>
      </div>
    </div>
    <div className="mb-2">
      <div className="d-flex justify-content-between">
        <small>Last Error:</small>
        <small className="text-secondary">None</small>
      </div>
    </div>
    <div className="mb-2">
      <div className="d-flex justify-content-between">
        <small>Uptime:</small>
        <small>3h 24m</small>
      </div>
    </div>
    <div className="alert alert-warning py-1 px-2 mt-3 mb-0 small">
      <i className="fas fa-exclamation-triangle me-1"></i>
      Motor 1 running hot
    </div>
  </div>
);

const NotificationCenter = () => {
  const notifications = [
    { id: 1, type: 'info', time: '09:42:12', message: 'Task completed successfully' },
    { id: 2, type: 'warning', time: '09:38:54', message: 'Motor 1 temperature rising' },
    { id: 3, type: 'success', time: '09:35:21', message: 'Connection established' },
    { id: 4, type: 'info', time: '09:32:05', message: 'Task started: Pick and Place' },
    { id: 5, type: 'danger', time: '09:27:33', message: 'Emergency stop triggered' },
  ];

  return (
    <div className="notification-center" style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {notifications.map(notification => (
        <div key={notification.id} className={`alert alert-${notification.type} py-1 px-2 mb-1 d-flex align-items-center`}>
          <small className="text-muted me-2">{notification.time}</small>
          <small>{notification.message}</small>
        </div>
      ))}
    </div>
  );
};

// Main App component
const App = () => {
  const [systemMode, setSystemMode] = useState('manual'); // 'manual' or 'auto'
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Primary color scheme
  const colors = {
    background: '#1a2035', // Dark blue background
    cardBg: '#242e4c',     // Slightly lighter blue for cards
    accent: '#4d91ff',     // Blue accent
    secondary: '#6c757d',  // Grey secondary
    success: '#28a745',    // Green for success indicators
    warning: '#ffc107',    // Yellow for warnings
    danger: '#dc3545',     // Red for errors/danger
    text: '#e9ecef'        // Light grey text
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-2" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Header */}
      <div className="row mb-2">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: colors.cardBg, borderRadius: '4px' }}>
            <div className="d-flex align-items-center">
              <i className="fas fa-robot me-2" style={{ fontSize: '1.5rem', color: colors.accent }}></i>
              <h4 className="mb-0 fw-bold">ROBOTIC ARM COMMAND CENTER</h4>
            </div>
            <div className="d-flex">
              {/* System mode toggle */}
              <div className="btn-group me-3">
                <button
                  className={`btn btn-sm ${systemMode === 'manual' ? 'active' : ''}`}
                  style={{
                    backgroundColor: systemMode === 'manual' ? colors.accent : 'rgba(77, 145, 255, 0.2)',
                    color: colors.text,
                    borderColor: colors.accent
                  }}
                  onClick={() => setSystemMode('manual')}
                >
                  <i className="fas fa-hand-paper me-1"></i>MANUAL
                </button>
                <button
                  className={`btn btn-sm ${systemMode === 'auto' ? 'active' : ''}`}
                  style={{
                    backgroundColor: systemMode === 'auto' ? colors.accent : 'rgba(77, 145, 255, 0.2)',
                    color: colors.text,
                    borderColor: colors.accent
                  }}
                  onClick={() => setSystemMode('auto')}
                >
                  <i className="fas fa-robot me-1"></i>AUTO
                </button>
              </div>
              {/* Notifications */}
              <div className="position-relative me-2">
                <button
                  className="btn btn-sm position-relative"
                  style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text, borderColor: colors.accent }}
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUnreadNotifications(0);
                  }}
                >
                  <i className="fas fa-bell"></i>
                  {unreadNotifications > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                {/* Notification dropdown */}
                {notificationsOpen && (
                  <div className="position-absolute end-0 mt-1 p-2 shadow" style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.accent,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    width: '300px',
                    zIndex: 1000,
                    borderRadius: '4px'
                  }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Notifications</h6>
                      <button className="btn btn-sm p-0" style={{ color: colors.text }} onClick={() => setNotificationsOpen(false)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <NotificationCenter />
                  </div>
                )}
              </div>
              {/* Emergency button */}
              <button className="btn btn-sm" style={{ backgroundColor: colors.danger, color: colors.text }}>
                <i className="fas fa-power-off me-1"></i>EMERGENCY STOP
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="row g-2 flex-grow-1">
        {/* Left Column - Controls and Status */}
        <div className="col-lg-3 d-flex flex-column">
          {/* Control Panel */}
          <div className="card shadow mb-2 flex-grow-0" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
            <div className="card-header py-2" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
              <i className="fas fa-sliders-h me-1"></i>CONTROL PANEL
            </div>
            <div className="card-body py-2">
              <ul className="nav nav-tabs mb-2">
                <li className="nav-item">
                  <a className="nav-link active" href="#" style={{ color: colors.accent, backgroundColor: 'rgba(77, 145, 255, 0.1)' }}>Arm</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" style={{ color: colors.text }}>Gripper</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" style={{ color: colors.text }}>Tasks</a>
                </li>
              </ul>
              <ArmControl />
            </div>
          </div>
          {/* System Status */}
          <div className="card shadow mb-2 flex-grow-1" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
            <div className="card-header py-2" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
              <i className="fas fa-info-circle me-1"></i>SYSTEM STATUS
            </div>
            <div className="card-body py-2">
              <StatusPanel />
              <Telemetry />
            </div>
          </div>
        </div>
        {/* Middle Column - Visualization and Camera */}
        <div className="col-lg-6 d-flex flex-column">
          {/* 3D Visualization */}
          <div className="card shadow mb-2 flex-grow-1" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
            <div className="card-header py-2 d-flex justify-content-between" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
              <span><i className="fas fa-cube me-1"></i>3D VISUALIZATION</span>
              <div>
                <button className="btn btn-sm py-0 px-1" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text, borderColor: colors.accent }}>
                  <i className="fas fa-compress"></i>
                </button>
              </div>
            </div>
            <div className="card-body p-0 position-relative">
              <ThreedArm />
              {/* Rotation Controls */}
              <div className="position-absolute bottom-0 end-0 p-2">
                <div className="d-flex flex-column align-items-center">
                  <button className="btn btn-sm py-0 px-1 mb-1" style={{ backgroundColor: 'rgba(77, 145, 255, 0.3)', color: colors.text, border: `1px solid ${colors.accent}` }}>
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <div className="d-flex">
                    <button className="btn btn-sm py-0 px-1 me-1" style={{ backgroundColor: 'rgba(77, 145, 255, 0.3)', color: colors.text, border: `1px solid ${colors.accent}` }}>
                      <i className="fas fa-arrow-left"></i>
                    </button>
                    <button className="btn btn-sm py-0 px-1" style={{ backgroundColor: 'rgba(77, 145, 255, 0.3)', color: colors.text, border: `1px solid ${colors.accent}` }}>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                  <button className="btn btn-sm py-0 px-1 mt-1" style={{ backgroundColor: 'rgba(77, 145, 255, 0.3)', color: colors.text, border: `1px solid ${colors.accent}` }}>
                    <i className="fas fa-arrow-down"></i>
                  </button>
                </div>
              </div>
              {/* Navigation info overlay */}
              <div className="position-absolute top-0 start-0 p-2 bg-dark bg-opacity-50 rounded m-2">
                <div className="small">
                  <div>X: 142.5 mm</div>
                  <div>Y: 85.2 mm</div>
                  <div>Z: 230.7 mm</div>
                </div>
              </div>
            </div>
          </div>
          {/* Camera Row */}
          <div className="row g-2 mb-2">
            <div className="col-md-6">
              <div className="card shadow h-100" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
                <div className="card-header py-1 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
                  <span className="small"><i className="fas fa-camera me-1"></i>PRIMARY CAMERA</span>
                </div>
                <div className="card-body p-0" style={{ height: '250px' }}>
                  <CameraFeed />
                  <div className="position-absolute top-0 start-0 bg-dark bg-opacity-50 text-light p-1 small">
                    <i className="fas fa-circle text-danger me-1"></i> LIVE
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow h-100" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
                <div className="card-header py-1 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
                  <span className="small"><i className="fas fa-camera me-1"></i>GRIPPER CAMERA</span>
                </div>
                <div className="card-body p-0" style={{ height: '250px' }}>
                  <CameraFeed />
                  <div className="position-absolute top-0 start-0 bg-dark bg-opacity-50 text-light p-1 small">
                    <i className="fas fa-circle text-danger me-1"></i> LIVE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column - Maps, Tasks and Gripper */}
        <div className="col-lg-3 d-flex flex-column">
          {/* Map View */}
          <div className="card shadow mb-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
            <div className="card-header py-2" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
              <i className="fas fa-map-marked-alt me-1"></i>WORK AREA MAP
            </div>
            <div className="card-body p-0" style={{ height: '200px', backgroundColor: '#1a2035' }}>
              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                <div style={{ fontSize: '2rem', color: 'rgba(77, 145, 255, 0.2)' }}>
                  <i className="fas fa-map"></i>
                </div>
                {/* Map would go here */}
              </div>
              {/* Position indicator */}
              <div className="position-absolute top-0 end-0 p-2 bg-dark bg-opacity-50 rounded m-2">
                <div className="small">
                  <div>Region: Alpha</div>
                  <div>Position: 4C</div>
                </div>
              </div>
            </div>
          </div>
          {/* Gripper Control */}
          <div className="card shadow mb-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
            <div className="card-header py-2" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
              <i className="fas fa-hand-rock me-1"></i>GRIPPER CONTROL
            </div>
            <div className="card-body py-2">
              <GripperControl />
            </div>
          </div>
          {/* Task Automation */}
          <div className="card shadow flex-grow-1" style={{ backgroundColor: colors.cardBg, borderColor: colors.accent, borderWidth: '1px' }}>
            <div className="card-header py-2" style={{ backgroundColor: 'rgba(77, 145, 255, 0.2)', color: colors.text }}>
              <i className="fas fa-tasks me-1"></i>TASK AUTOMATION
            </div>
            <div className="card-body py-2">
              <TaskAutomation />
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="row mt-1">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center py-1 px-3" style={{ backgroundColor: colors.cardBg, borderRadius: '4px' }}>
            <div>
              <span className="badge me-2" style={{ backgroundColor: colors.success }}>Connection: Stable</span>
              <span className="badge me-2" style={{ backgroundColor: colors.accent }}>Latency: 42ms</span>
              <span className="badge me-2" style={{ backgroundColor: colors.secondary }}>Uptime: 3h 24m</span>
            </div>
            <div className="small text-light">
              <span>Mode: {systemMode === 'manual' ? 'Manual Control' : 'Automated Operation'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;