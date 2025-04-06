import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Define TypeScript interfaces for mission data
interface Coordinates {
  lat: string | null;
  long: string | null;
  alt?: string | null;
}
interface MockRoverData {
  currentPosition: MapPoint;
  cameraFrames: {
    detection: CameraFrame[];
    workflow: CameraFrame[];
  };
  batteryLevel: number;
  signalStrength: number;
  temperature: number;
  distanceTraveled: number;
}
interface Step {
  status: "completed" | "in-progress" | "pending" | "warning" | "error";
  timestamp: string | null;
}

interface TaskSteps {
  [key: string]: Step;
}

interface AntennaTask {
  status: string;
  steps: {
    exitAirlock: Step;
    reachArea: Step;
    findPeak: Step;
    installAntenna: Step;
    transmitCoordinates: Step;
  };
  coordinates: Coordinates;
}

interface IceSearchTask {
  status: string;
  steps: {
    reachCrater: Step;
    findColdPoint: Step;
    transmitCoordinates: Step;
  };
  temperature: number | null;
  coordinates: Coordinates;
}

interface LavaTubeTask {
  status: string;
  steps: {
    reachEntrance: Step;
    enterTube: Step;
    measureCoverage: Step;
    exitAndTransmit: Step;
  };
  coveredLength: number | null;
}

interface ReturnToBaseTask {
  status: string;
  steps: {
    receiveCommand: Step;
    navigateToAirlock: Step;
    missionComplete: Step;
  };
}

interface Alert {
  id: number;
  time: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface MapPoint {
  x: number;
  y: number;
  timestamp: string;
  status?: string;
}

interface CameraFrame {
  id: number;
  timestamp: string;
  type: "detection" | "workflow";
}

interface MissionState {
  missionActive: boolean;
  currentPhase: string;
  autonomousMode: boolean;
  batteryLevel: number;
  signalStrength: number;
  temperature: number;
  distanceTraveled: number;
  tasks: {
    activityLight: {
      status: string;
      timestamp: string;
    };
    antenna: AntennaTask;
    iceSearch: IceSearchTask;
    lavaTube: LavaTubeTask;
    returnToBase: ReturnToBaseTask;
  };
  alerts: Alert[];
  mapPath: MapPoint[];
  currentPosition: MapPoint;
  cameraFrames: {
    detection: CameraFrame[];
    workflow: CameraFrame[];
  };
}

const App: React.FC = () => {
  // Mission state management
  const [missionState, setMissionState] = useState<MissionState>({
    missionActive: true,
    currentPhase: "antenna",
    autonomousMode: true,
    batteryLevel: 87,
    signalStrength: 76,
    temperature: -142,
    distanceTraveled: 124,

    // Task completion states
    tasks: {
      activityLight: {
        status: "completed",
        timestamp: "14:32:05",
      },
      antenna: {
        status: "in-progress",
        steps: {
          exitAirlock: { status: "completed", timestamp: "14:35:18" },
          reachArea: { status: "completed", timestamp: "14:47:22" },
          findPeak: { status: "in-progress", timestamp: null },
          installAntenna: { status: "pending", timestamp: null },
          transmitCoordinates: { status: "pending", timestamp: null },
        },
        coordinates: { lat: null, long: null, alt: null },
      },
      iceSearch: {
        status: "pending",
        steps: {
          reachCrater: { status: "pending", timestamp: null },
          findColdPoint: { status: "pending", timestamp: null },
          transmitCoordinates: { status: "pending", timestamp: null },
        },
        temperature: null,
        coordinates: { lat: null, long: null },
      },
      lavaTube: {
        status: "pending",
        steps: {
          reachEntrance: { status: "pending", timestamp: null },
          enterTube: { status: "pending", timestamp: null },
          measureCoverage: { status: "pending", timestamp: null },
          exitAndTransmit: { status: "pending", timestamp: null },
        },
        coveredLength: null,
      },
      returnToBase: {
        status: "pending",
        steps: {
          receiveCommand: { status: "pending", timestamp: null },
          navigateToAirlock: { status: "pending", timestamp: null },
          missionComplete: { status: "pending", timestamp: null },
        },
      },
    },

    // Alerts and messages
    alerts: [
      {
        id: 1,
        time: "14:32:05",
        message: "Autonomous mode activated",
        type: "info",
      },
      {
        id: 2,
        time: "14:35:18",
        message: "Successfully exited airlock",
        type: "success",
      },
      {
        id: 3,
        time: "14:47:22",
        message: "Reached antenna installation area",
        type: "success",
      },
      {
        id: 4,
        time: "14:52:37",
        message: "Scanning for highest elevation point",
        type: "info",
      },
    ],

    // Map tracking
    mapPath: [
      { x: 50, y: 150, timestamp: "14:32:05", status: "completed" }, // Starting point (airlock)
      { x: 65, y: 140, timestamp: "14:35:18", status: "completed" },
      { x: 85, y: 125, timestamp: "14:38:45", status: "completed" },
      { x: 110, y: 115, timestamp: "14:42:30", status: "completed" },
      { x: 140, y: 100, timestamp: "14:47:22", status: "completed" }, // Reached antenna area
      { x: 150, y: 85, timestamp: "14:52:37", status: "in-progress" }, // Current position
    ],
    currentPosition: { x: 150, y: 85, timestamp: "14:52:37" },

    // Camera frames
    cameraFrames: {
      detection: [{ id: 1, timestamp: "14:52:37", type: "detection" }],
      workflow: [{ id: 1, timestamp: "14:52:37", type: "workflow" }],
    },
  });

  // Function to simulate camera feed updates
  useEffect(() => {
    const cameraInterval = setInterval(() => {
      if (missionState.missionActive) {
        // Update camera frames with new timestamps
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", { hour12: false });

        setMissionState((prev) => ({
          ...prev,
          cameraFrames: {
            detection: [
              ...prev.cameraFrames.detection.slice(-4), // Keep last 5 frames
              {
                id: prev.cameraFrames.detection.length + 1,
                timestamp: timeString,
                type: "detection",
              },
            ],
            workflow: [
              ...prev.cameraFrames.workflow.slice(-4), // Keep last 5 frames
              {
                id: prev.cameraFrames.workflow.length + 1,
                timestamp: timeString,
                type: "workflow",
              },
            ],
          },
        }));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(cameraInterval);
  }, [missionState.missionActive]);

  // Mock rover data
  const mockRoverData = (): MockRoverData => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { hour12: false });

    return {
      currentPosition: {
        x: Math.floor(Math.random() * 350),
        y: Math.floor(Math.random() * 200),
        timestamp: timeString,
      },
      cameraFrames: {
        detection: [
          { id: Math.random(), timestamp: timeString, type: "detection" },
        ],
        workflow: [
          { id: Math.random(), timestamp: timeString, type: "workflow" },
        ],
      },
      batteryLevel: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100),
      temperature: -142 + Math.floor(Math.random() * 10),
      distanceTraveled: 124 + Math.floor(Math.random() * 10),
    };
  };

  // Update mission state with mock rover data
  useEffect(() => {
    const roverInterval = setInterval(() => {
      if (missionState.missionActive) {
        const newData = mockRoverData();
        setMissionState((prev) => ({
          ...prev,
          currentPosition: newData.currentPosition,
          cameraFrames: {
            detection: [
              ...prev.cameraFrames.detection.slice(-4),
              ...newData.cameraFrames.detection,
            ],
            workflow: [
              ...prev.cameraFrames.workflow.slice(-4),
              ...newData.cameraFrames.workflow,
            ],
          },
          batteryLevel: newData.batteryLevel,
          signalStrength: newData.signalStrength,
          temperature: newData.temperature,
          distanceTraveled: newData.distanceTraveled,
        }));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(roverInterval);
  }, [missionState.missionActive]);

  // Demo function to progress the mission
  const advanceMission = () => {
    const newState = { ...missionState };
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { hour12: false });

    // Simulate mission advancement based on current phase
    if (newState.currentPhase === "antenna") {
      if (newState.tasks.antenna.steps.findPeak.status === "in-progress") {
        // Complete peak finding
        newState.tasks.antenna.steps.findPeak.status = "completed";
        newState.tasks.antenna.steps.findPeak.timestamp = timeString;
        newState.tasks.antenna.steps.installAntenna.status = "in-progress";
        newState.alerts.push({
          id: newState.alerts.length + 1,
          time: timeString,
          message:
            "Peak location identified at coordinates N28.5493, E15.6723, elevation +12m",
          type: "success",
        });

        // Update map path
        newState.mapPath.push({
          x: 165,
          y: 75,
          timestamp: timeString,
          status: "in-progress",
        });
        newState.currentPosition = { x: 165, y: 75, timestamp: timeString };
      } else if (
        newState.tasks.antenna.steps.installAntenna.status === "in-progress"
      ) {
        // Complete antenna installation
        newState.tasks.antenna.steps.installAntenna.status = "completed";
        newState.tasks.antenna.steps.installAntenna.timestamp = timeString;
        newState.tasks.antenna.steps.transmitCoordinates.status = "in-progress";
        newState.alerts.push({
          id: newState.alerts.length + 1,
          time: timeString,
          message: "Antenna successfully deployed at peak location",
          type: "success",
        });

        // Update map path
        newState.mapPath.push({
          x: 170,
          y: 70,
          timestamp: timeString,
          status: "in-progress",
        });
        newState.currentPosition = { x: 170, y: 70, timestamp: timeString };
      } else if (
        newState.tasks.antenna.steps.transmitCoordinates.status ===
        "in-progress"
      ) {
        // Complete coordinates transmission and advance to ice search
        newState.tasks.antenna.steps.transmitCoordinates.status = "completed";
        newState.tasks.antenna.steps.transmitCoordinates.timestamp = timeString;
        newState.tasks.antenna.status = "completed";
        newState.tasks.antenna.coordinates = {
          lat: "N28.5493",
          long: "E15.6723",
          alt: "+12m",
        };
        newState.tasks.iceSearch.status = "in-progress";
        newState.tasks.iceSearch.steps.reachCrater.status = "in-progress";
        newState.currentPhase = "iceSearch";
        newState.alerts.push({
          id: newState.alerts.length + 1,
          time: timeString,
          message:
            "Antenna coordinates transmitted. Task completed. Beginning ice search mission.",
          type: "success",
        });

        // Update map path to start heading to ice crater
        newState.mapPath.push({
          x: 190,
          y: 90,
          timestamp: timeString,
          status: "in-progress",
        });
        newState.currentPosition = { x: 190, y: 90, timestamp: timeString };
      }
    } else if (newState.currentPhase === "iceSearch") {
      // Simulate ice search progression
      if (newState.tasks.iceSearch.steps.reachCrater.status === "in-progress") {
        // Complete reaching crater
        newState.tasks.iceSearch.steps.reachCrater.status = "completed";
        newState.tasks.iceSearch.steps.reachCrater.timestamp = timeString;
        newState.tasks.iceSearch.steps.findColdPoint.status = "in-progress";
        newState.alerts.push({
          id: newState.alerts.length + 1,
          time: timeString,
          message: "Reached edge of crater. Beginning temperature scanning.",
          type: "success",
        });

        // Update map path
        newState.mapPath.push({
          x: 220,
          y: 120,
          timestamp: timeString,
          status: "in-progress",
        });
        newState.currentPosition = { x: 220, y: 120, timestamp: timeString };
      } else if (
        newState.tasks.iceSearch.steps.findColdPoint.status === "in-progress"
      ) {
        // Complete finding cold point
        newState.tasks.iceSearch.steps.findColdPoint.status = "completed";
        newState.tasks.iceSearch.steps.findColdPoint.timestamp = timeString;
        newState.tasks.iceSearch.steps.transmitCoordinates.status =
          "in-progress";
        newState.tasks.iceSearch.temperature = -153;
        newState.alerts.push({
          id: newState.alerts.length + 1,
          time: timeString,
          message:
            "Cold point located. Temperature: -153°C. Potential ice deposit detected.",
          type: "success",
        });

        // Update map path
        newState.mapPath.push({
          x: 235,
          y: 140,
          timestamp: timeString,
          status: "in-progress",
        });
        newState.currentPosition = { x: 235, y: 140, timestamp: timeString };
      } else if (
        newState.tasks.iceSearch.steps.transmitCoordinates.status ===
        "in-progress"
      ) {
        // Complete coordinates transmission and advance to lava tube
        newState.tasks.iceSearch.steps.transmitCoordinates.status = "completed";
        newState.tasks.iceSearch.steps.transmitCoordinates.timestamp =
          timeString;
        newState.tasks.iceSearch.status = "completed";
        newState.tasks.iceSearch.coordinates = {
          lat: "N28.5326",
          long: "E15.7102",
        };
        newState.tasks.lavaTube.status = "in-progress";
        newState.tasks.lavaTube.steps.reachEntrance.status = "in-progress";
        newState.currentPhase = "lavaTube";
        newState.alerts.push({
          id: newState.alerts.length + 1,
          time: timeString,
          message:
            "Ice deposit coordinates transmitted. Task completed. Beginning lava tube exploration.",
          type: "success",
        });

        // Update map path to start heading to lava tube entrance
        newState.mapPath.push({
          x: 250,
          y: 160,
          timestamp: timeString,
          status: "in-progress",
        });
        newState.currentPosition = { x: 250, y: 160, timestamp: timeString };
      }
    }

    // Update the state
    setMissionState(newState);
  };

  // Toggle autonomous mode
  const toggleAutonomousMode = () => {
    const newState = { ...missionState };
    newState.autonomousMode = !newState.autonomousMode;

    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { hour12: false });

    newState.alerts.push({
      id: newState.alerts.length + 1,
      time: timeString,
      message: newState.autonomousMode
        ? "Autonomous mode activated"
        : "Manual control mode activated",
      type: "info",
    });

    setMissionState(newState);
  };

  // Get status color for Bootstrap classes
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "text-success"; // Green for completed tasks
      case "in-progress":
        return "text-primary"; // Blue for in-progress tasks
      case "pending":
        return "text-light"; // White for pending tasks
      case "warning":
        return "text-warning"; // Yellow for warnings
      case "error":
        return "text-danger"; // Red for errors
      default:
        return "text-light"; // Default to white
    }
  };

  // Get icon class for status
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "completed":
        return "bi-check-circle-fill text-teal";
      case "in-progress":
        return "bi-clock-fill text-blue";
      case "pending":
        return "bi-clock text-gray";
      case "warning":
        return "bi-exclamation-triangle-fill text-amber";
      case "error":
        return "bi-exclamation-circle-fill text-red";
      default:
        return "bi-clock text-gray";
    }
  };

  // Helper function to render task steps
  const renderTaskSteps = (steps: TaskSteps) => {
    return Object.entries(steps).map(([key, step]) => (
      <div key={key} className="ms-4 d-flex align-items-center py-1">
        <i className={`bi ${getStatusIcon(step.status)} me-2`}></i>
        <span className={getStatusColor(step.status)}>
          {key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
          {step.timestamp && ` (${step.timestamp})`}
        </span>
      </div>
    ));
  };

  // Calculate mission progress percentage
  const calculateProgress = (): number => {
    return (
      ((missionState.tasks.activityLight.status === "completed" ? 1 : 0) +
        (missionState.tasks.antenna.status === "completed" ? 1 : 0) +
        (missionState.tasks.iceSearch.status === "completed" ? 1 : 0) +
        (missionState.tasks.lavaTube.status === "completed" ? 1 : 0) +
        (missionState.tasks.returnToBase.status === "completed" ? 1 : 0)) *
      20
    );
  };

  // Get alert icon
  const getAlertIcon = (type: string): string => {
    switch (type) {
      case "success":
        return "bi-check-circle-fill";
      case "warning":
        return "bi-exclamation-triangle-fill";
      case "error":
        return "bi-exclamation-circle-fill";
      case "info":
      default:
        return "bi-info-circle-fill";
    }
  };

  // Get alert background color
  const getAlertBg = (type: string): string => {
    switch (type) {
      case "success":
        return "bg-success-subtle";
      case "warning":
        return "bg-warning-subtle";
      case "error":
        return "bg-danger-subtle";
      case "info":
      default:
        return "bg-info-subtle";
    }
  };

  // Get alert text color
  const getAlertText = (type: string): string => {
    switch (type) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-danger";
      case "info":
      default:
        return "text-info";
    }
  };

  // Render the map with rover path
  const renderMap = () => {
    const mapWidth = 350;
    const mapHeight = 200;
    const baseSvgStyle = {
      width: "100%",
      height: "100%",
      background: "linear-gradient(180deg, #0a1226 0%, #1e2b45 100%)",
      borderRadius: "8px",
    };

    return (
      <svg style={baseSvgStyle} viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
        {/* Stars background */}
        {Array.from({ length: 80 }).map((_, i) => {
          const x = Math.random() * mapWidth;
          const y = Math.random() * mapHeight;
          const r = Math.random() * 0.8 + 0.2;
          const opacity = Math.random() * 0.7 + 0.3;
          return (
            <circle
              key={`star-${i}`}
              cx={x}
              cy={y}
              r={r}
              fill="#ffffff"
              opacity={opacity}
            >
              {i % 4 === 0 && (
                <animate
                  attributeName="opacity"
                  values={`${opacity};${opacity * 0.5};${opacity}`}
                  dur={`${Math.random() * 3 + 2}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          );
        })}

        {/* Grid lines */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`h-line-${i}`}
            x1="0"
            y1={i * 40}
            x2={mapWidth}
            y2={i * 40}
            stroke="#2a3c5a"
            strokeWidth="1"
            strokeDasharray="2,3"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`v-line-${i}`}
            x1={i * 40}
            y1="0"
            x2={i * 40}
            y2={mapHeight}
            stroke="#2a3c5a"
            strokeWidth="1"
            strokeDasharray="2,3"
          />
        ))}

        {/* Starting point (base) */}
        <circle cx="50" cy="150" r="6" fill="#ff4561" />
        <text
          x="50"
          y="170"
          textAnchor="middle"
          fill="#ff4561"
          fontSize="10"
          fontWeight="bold"
        >
          Base
        </text>

        {/* Path lines with glow effect */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <polyline
          points={missionState.mapPath
            .map((point) => `${point.x},${point.y}`)
            .join(" ")}
          fill="none"
          stroke="#4dabf7"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Path points */}
        {missionState.mapPath.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={
              point.status === "completed"
                ? "#12b886"
                : point.status === "in-progress"
                ? "#fab005"
                : "#adb5bd"
            }
          />
        ))}

        {/* Current position with pulsing effect */}
        <circle
          cx={missionState.currentPosition.x}
          cy={missionState.currentPosition.y}
          r="5"
          fill="#fa5252"
          stroke="#ffffff"
          strokeWidth="1"
        >
          <animate
            attributeName="r"
            values="5;7;5"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Landmarks */}
        {(missionState.currentPhase === "antenna" ||
          missionState.tasks.antenna.status === "completed") && (
          <g>
            <circle cx="170" cy="70" r="5" fill="#40c9ff" />
            <text
              x="170"
              y="60"
              textAnchor="middle"
              fill="#40c9ff"
              fontSize="9"
              fontWeight="bold"
            >
              Antenna
            </text>
          </g>
        )}

        {(missionState.currentPhase === "iceSearch" ||
          missionState.tasks.iceSearch.status === "completed") && (
          <g>
            <circle cx="235" cy="140" r="5" fill="#74c0fc" />
            <text
              x="235"
              y="130"
              textAnchor="middle"
              fill="#74c0fc"
              fontSize="9"
              fontWeight="bold"
            >
              Ice Deposit
            </text>
          </g>
        )}

        {(missionState.currentPhase === "lavaTube" ||
          missionState.tasks.lavaTube.status === "completed") && (
          <g>
            <circle cx="300" cy="120" r="5" fill="#cc5de8" />
            <text
              x="300"
              y="110"
              textAnchor="middle"
              fill="#cc5de8"
              fontSize="9"
              fontWeight="bold"
            >
              Lava Tube
            </text>
          </g>
        )}

        {/* Map overlay - compass with outer ring */}
        <g transform="translate(25,25)">
          <circle
            cx="0"
            cy="0"
            r="18"
            fill="rgba(20,27,45,0.8)"
            stroke="#4dabf7"
            strokeWidth="1"
          />
          <circle cx="0" cy="0" r="15" fill="rgba(10,18,38,0.9)" />
          <line
            x1="0"
            y1="-12"
            x2="0"
            y2="-6"
            stroke="#ff6b6b"
            strokeWidth="2"
          />
          <line x1="0" y1="6" x2="0" y2="12" stroke="#adb5bd" strokeWidth="1" />
          <line
            x1="-12"
            y1="0"
            x2="-6"
            y2="0"
            stroke="#adb5bd"
            strokeWidth="1"
          />
          <line x1="6" y1="0" x2="12" y2="0" stroke="#adb5bd" strokeWidth="1" />
          <text
            x="0"
            y="-2"
            textAnchor="middle"
            fill="#ff6b6b"
            fontSize="8"
            fontWeight="bold"
          >
            N
          </text>
          <text x="0" y="9" textAnchor="middle" fill="#adb5bd" fontSize="8">
            S
          </text>
          <text x="-7" y="4" textAnchor="middle" fill="#adb5bd" fontSize="8">
            W
          </text>
          <text x="7" y="4" textAnchor="middle" fill="#adb5bd" fontSize="8">
            E
          </text>
        </g>

        {/* Scale with modern design */}
        <g transform="translate(270,180)">
          <rect
            x="0"
            y="-5"
            width="60"
            height="12"
            rx="2"
            fill="rgba(20,27,45,0.8)"
          />
          <line x1="5" y1="0" x2="55" y2="0" stroke="#fff" strokeWidth="1" />
          <line x1="5" y1="-3" x2="5" y2="3" stroke="#fff" strokeWidth="1" />
          <line x1="55" y1="-3" x2="55" y2="3" stroke="#fff" strokeWidth="1" />
          <text
            x="30"
            y="5"
            textAnchor="middle"
            fill="#fff"
            fontSize="8"
            fontWeight="bold"
          >
            50m
          </text>
        </g>
      </svg>
    );
  };

  // Generate realistic camera feed with SVG overlay
  const renderDetailedCameraFeed = (type: "detection" | "workflow") => {
    const svgWidth = 350;
    const svgHeight = 200;

    return (
      <div
        className="position-relative"
        style={{
          height: "200px",
          background: "#0a1226",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Simulated camera background */}
          <defs>
            <radialGradient
              id="terrainGradient"
              cx="50%"
              cy="50%"
              r="70%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#1a2a4a" />
              <stop offset="100%" stopColor="#0a1226" />
            </radialGradient>

            <filter id="cameraGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
              />
              <feComposite operator="in" in2="SourceGraphic" result="noisy" />
            </filter>

            <linearGradient id="scanline" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(120,190,255,0.03)" />
              <stop offset="50%" stopColor="rgba(120,190,255,0)" />
              <stop offset="100%" stopColor="rgba(120,190,255,0.03)" />
            </linearGradient>
          </defs>

          {/* Terrain/background elements based on current phase */}
          {missionState.currentPhase === "antenna" && (
            <>
              <path
                d="M0 150 L100 100 L200 140 L300 90 L350 120 L350 200 L0 200 Z"
                fill="#1a2a4a"
              />
              <path
                d="M150 110 L250 70 L350 100 L350 200 L150 200 Z"
                fill="#15203a"
              />

              {/* Stars in the sky */}
              {Array.from({ length: 30 }).map((_, i) => (
                <circle
                  key={`camera-star-${i}`}
                  cx={Math.random() * svgWidth}
                  cy={30 + Math.random() * 60}
                  r={Math.random() * 0.8 + 0.2}
                  fill="#ffffff"
                  opacity={Math.random() * 0.7 + 0.3}
                />
              ))}

              {type === "detection" ? (
                <>
                  {/* Detection view overlay */}
                  <circle
                    cx="210"
                    cy="80"
                    r="15"
                    fill="none"
                    stroke="#40c9ff"
                    strokeWidth="2"
                    strokeDasharray="5,2"
                  >
                    <animate
                      attributeName="r"
                      values="15;18;15"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <line
                    x1="200"
                    y1="70"
                    x2="220"
                    y2="90"
                    stroke="#ff6b6b"
                    strokeWidth="1"
                  />
                  <line
                    x1="200"
                    y1="90"
                    x2="220"
                    y2="70"
                    stroke="#ff6b6b"
                    strokeWidth="1"
                  />
                  <text
                    x="240"
                    y="85"
                    fill="#40c9ff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    Peak identified
                  </text>
                  <rect
                    x="195"
                    y="95"
                    width="70"
                    height="15"
                    fill="rgba(64,201,255,0.1)"
                    stroke="#40c9ff"
                    strokeWidth="1"
                  />
                  <text x="230" y="106" fill="#40c9ff" fontSize="8">
                    ELEV +12M
                  </text>
                </>
              ) : (
                <>
                  {/* Workflow view overlay */}
                  <line
                    x1="190"
                    y1="70"
                    x2="230"
                    y2="70"
                    stroke="#fab005"
                    strokeWidth="1"
                    strokeDasharray="2,1"
                  />
                  <line
                    x1="190"
                    y1="90"
                    x2="230"
                    y2="90"
                    stroke="#fab005"
                    strokeWidth="1"
                    strokeDasharray="2,1"
                  />
                  <line
                    x1="190"
                    y1="70"
                    x2="190"
                    y2="90"
                    stroke="#fab005"
                    strokeWidth="1"
                    strokeDasharray="2,1"
                  />
                  <line
                    x1="230"
                    y1="70"
                    x2="230"
                    y2="90"
                    stroke="#fab005"
                    strokeWidth="1"
                    strokeDasharray="2,1"
                  />
                  <text
                    x="270"
                    y="85"
                    fill="#fab005"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    Install antenna here
                  </text>
                </>
              )}
            </>
          )}

          {/* Scanning effect overlay */}
          <rect width={svgWidth} height={svgHeight} fill="url(#scanline)">
            <animate
              attributeName="y"
              from="-200"
              to="200"
              dur="10s"
              repeatCount="indefinite"
            />
          </rect>

          {/* UI Elements */}
          <g className="camera-ui">
            {/* Top left - camera info */}
            <rect
              x="10"
              y="10"
              width="120"
              height="20"
              rx="3"
              fill="rgba(0,0,0,0.5)"
            />
            <text x="20" y="24" fill="#ffffff" fontSize="10">
              CAM: {type.toUpperCase()} FEED
            </text>

            {/* Bottom left - timestamp */}
            <rect
              x="10"
              y="170"
              width="100"
              height="20"
              rx="3"
              fill="rgba(0,0,0,0.5)"
            />
            <text x="20" y="184" fill="#ffffff" fontSize="10">
              {missionState.cameraFrames[type].length > 0
                ? missionState.cameraFrames[type][
                    missionState.cameraFrames[type].length - 1
                  ].timestamp
                : "--:--:--"}
            </text>

            {/* Top right - status */}
            <rect
              x="250"
              y="10"
              width="90"
              height="20"
              rx="3"
              fill="rgba(0,0,0,0.5)"
            />
            <text x="260" y="24" fill="#4dabf7" fontSize="10">
              SCANNING
            </text>
          </g>

          {/* Image grain overlay */}
          <rect
            width={svgWidth}
            height={svgHeight}
            fill="none"
            filter="url(#cameraGrain)"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4 bg-dark text-light min-vh-100">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3">Autonomous Mission DB</h1>
          <div className="d-flex align-items-center">
            <div className="me-4">
              <span className="badge bg-primary me-2">
                Mission Status: Active
              </span>
              <span
                className={`badge ${
                  missionState.autonomousMode ? "bg-success" : "bg-warning"
                }`}
              >
                {missionState.autonomousMode
                  ? "Autonomous Mode"
                  : "Manual Control"}
              </span>
            </div>
            <div className="progress flex-grow-1" style={{ height: "10px" }}>
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${calculateProgress()}%` }}
                aria-valuenow={calculateProgress()}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {calculateProgress()}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left column - Mission Tasks */}
        <div className="col-md-3">
          <div className="card bg-dark border-secondary mb-3">
            <div className="card-header border-secondary bg-dark text-light">
              <i className="bi bi-list-check me-2"></i>Mission Tasks
            </div>
            <div className="card-body p-2">
              {/* Activity Light Test */}
              <div className="card bg-dark border-secondary mb-2">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i
                        className={`bi ${getStatusIcon(
                          missionState.tasks.activityLight.status
                        )} me-2`}
                      ></i>
                      <span
                        className={getStatusColor(
                          missionState.tasks.activityLight.status
                        )}
                      >
                        Activity Light Test
                        {missionState.tasks.activityLight.timestamp &&
                          ` (${missionState.tasks.activityLight.timestamp})`}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() =>
                        alert("More details about Activity Light Test")
                      }
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Antenna Installation */}
              <div className="card bg-dark border-secondary mb-2">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i
                        className={`bi ${getStatusIcon(
                          missionState.tasks.antenna.status
                        )} me-2`}
                      ></i>
                      <span
                        className={getStatusColor(
                          missionState.tasks.antenna.status
                        )}
                      >
                        Antenna Installation
                        {missionState.tasks.antenna.status === "completed" &&
                          ` (${missionState.tasks.antenna.steps.transmitCoordinates.timestamp})`}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() =>
                        alert("More details about Antenna Installation")
                      }
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </div>
                  {renderTaskSteps(missionState.tasks.antenna.steps)}
                </div>
              </div>

              {/* Ice Deposit Search */}
              <div className="card bg-dark border-secondary mb-2">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i
                        className={`bi ${getStatusIcon(
                          missionState.tasks.iceSearch.status
                        )} me-2`}
                      ></i>
                      <span
                        className={getStatusColor(
                          missionState.tasks.iceSearch.status
                        )}
                      >
                        Ice Deposit Search
                        {missionState.tasks.iceSearch.status === "completed" &&
                          ` (${missionState.tasks.iceSearch.steps.transmitCoordinates.timestamp})`}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() =>
                        alert("More details about Ice Deposit Search")
                      }
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </div>
                  {renderTaskSteps(missionState.tasks.iceSearch.steps)}
                </div>
              </div>

              {/* Lava Tube Exploration */}
              <div className="card bg-dark border-secondary mb-2">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i
                        className={`bi ${getStatusIcon(
                          missionState.tasks.lavaTube.status
                        )} me-2`}
                      ></i>
                      <span
                        className={getStatusColor(
                          missionState.tasks.lavaTube.status
                        )}
                      >
                        Lava Tube Exploration
                        {missionState.tasks.lavaTube.status === "completed" &&
                          ` (${missionState.tasks.lavaTube.steps.exitAndTransmit.timestamp})`}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() =>
                        alert("More details about Lava Tube Exploration")
                      }
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </div>
                  {renderTaskSteps(missionState.tasks.lavaTube.steps)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle column - Map and visual */}
        <div className="col-md-5">
          <div className="card bg-dark border-secondary mb-3">
            <div className="card-header border-secondary bg-dark text-light">
              <i className="bi bi-map me-2"></i>Lunar Surface Navigation
            </div>
            <div className="card-body p-0">{renderMap()}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="card bg-dark border-secondary h-100">
                <div className="card-header border-secondary bg-dark text-light">
                  <i className="bi bi-camera-video me-2"></i>Object Detection
                </div>
                <div className="card-body p-0">
                  {renderDetailedCameraFeed("detection")}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-dark border-secondary h-100">
                <div className="card-header border-secondary bg-dark text-light">
                  <i className="bi bi-camera-video-fill me-2"></i>Workflow
                  Assist
                </div>
                <div className="card-body p-0">
                  {renderDetailedCameraFeed("workflow")}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-primary me-2"
                  onClick={advanceMission}
                >
                  <i className="bi bi-play-fill me-1"></i>Advance Mission
                </button>
                <button
                  className={`btn ${
                    missionState.autonomousMode ? "btn-warning" : "btn-success"
                  }`}
                  onClick={toggleAutonomousMode}
                >
                  <i
                    className={`bi ${
                      missionState.autonomousMode
                        ? "bi-person-fill"
                        : "bi-robot"
                    } me-1`}
                  ></i>
                  {missionState.autonomousMode
                    ? "Manual Control"
                    : "Autonomous Mode"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Alerts and Rover Status */}
        <div className="col-md-4">
          <div className="card bg-dark border-secondary mb-3">
            <div className="card-header border-secondary bg-dark text-light">
              <i className="bi bi-bell me-2"></i>Mission Alerts
            </div>
            <div
              className="card-body p-2"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {[...missionState.alerts].reverse().map((alert) => (
                <div
                  key={alert.id}
                  className={`alert ${getAlertBg(alert.type)} mb-2 py-2 px-3`}
                  style={{ marginBottom: "0.5rem" }}
                >
                  <div className="d-flex align-items-center">
                    <i
                      className={`bi ${getAlertIcon(alert.type)} ${getAlertText(
                        alert.type
                      )} me-2`}
                    ></i>
                    <small className="text-dark">{alert.time}</small>
                  </div>
                  <div className="ms-4">{alert.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-dark border-secondary mb-3">
            <div className="card-header border-secondary bg-dark text-light">
              <i className="bi bi-clipboard-data me-2"></i>Mission Data
            </div>
            <div className="card-body">
              <h6 className="text-info">
                Current Phase:{" "}
                {missionState.currentPhase
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h6>

              {missionState.tasks.antenna.status === "completed" && (
                <div className="mb-3">
                  <h6 className="text-light">Antenna Coordinates:</h6>
                  <div className="d-flex">
                    <div className="me-3">
                      <small className="text-secondary">Latitude</small>
                      <div>{missionState.tasks.antenna.coordinates.lat}</div>
                    </div>
                    <div className="me-3">
                      <small className="text-secondary">Longitude</small>
                      <div>{missionState.tasks.antenna.coordinates.long}</div>
                    </div>
                    <div>
                      <small className="text-secondary">Altitude</small>
                      <div>{missionState.tasks.antenna.coordinates.alt}</div>
                    </div>
                  </div>
                </div>
              )}

              {missionState.tasks.iceSearch.status === "completed" && (
                <div className="mb-3">
                  <h6 className="text-light">Ice Deposit Data:</h6>
                  <div className="d-flex">
                    <div className="me-3">
                      <small className="text-secondary">Location</small>
                      <div>
                        {missionState.tasks.iceSearch.coordinates.lat},{" "}
                        {missionState.tasks.iceSearch.coordinates.long}
                      </div>
                    </div>
                    <div>
                      <small className="text-secondary">Temperature</small>
                      <div>{missionState.tasks.iceSearch.temperature}°C</div>
                    </div>
                  </div>
                </div>
              )}

              {missionState.tasks.lavaTube.status === "completed" && (
                <div className="mb-3">
                  <h6 className="text-light">Lava Tube Measurements:</h6>
                  <div>
                    <small className="text-secondary">Covered Length</small>
                    <div>{missionState.tasks.lavaTube.coveredLength}m</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rover Status moved to the bottom right corner */}
          <div className="card bg-dark border-secondary">
            <div className="card-header border-secondary bg-dark text-light">
              <i className="bi bi-info-circle me-2"></i>Rover Status
            </div>
            <div className="card-body">
              <div className="row row-cols-2 g-3">
                <div className="col">
                  <div className="d-flex flex-column">
                    <small className="text-secondary">Battery</small>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-battery-full me-2 text-success"></i>
                      <span>{missionState.batteryLevel}%</span>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="d-flex flex-column">
                    <small className="text-secondary">Signal</small>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-wifi me-2 text-info"></i>
                      <span>{missionState.signalStrength}%</span>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="d-flex flex-column">
                    <small className="text-secondary">Temperature</small>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-thermometer-half me-2 text-light"></i>
                      <span>{missionState.temperature}°C</span>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="d-flex flex-column">
                    <small className="text-secondary">Distance</small>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-arrow-left-right me-2 text-warning"></i>
                      <span>{missionState.distanceTraveled}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;