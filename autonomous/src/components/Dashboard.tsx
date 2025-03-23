import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MissionDashboard: React.FC = () => {
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [currentLat, setCurrentLat] = useState<number>(18.5213);
  const [currentLng, setCurrentLng] = useState<number>(226.9236);

  const handleCoordinateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentLat(lat);
    setCurrentLng(lng);
  };

  return (
    <div
      className="container-fluid vh-100 min-vw-100 px-0"
      style={{ backgroundColor: "#2a2a2a", color: "white" }}
    >
      {/* First Row */}
      <div style={{ height: "55%", display: "flex" }}>
        {/* Camera Feed */}
        <div className="m-1 p-2 bg-dark rounded" style={{ width: "100%" }}>
          <h4 className="text-warning">Camera Feed</h4>
          <div
            className="bg-secondary d-flex align-items-center justify-content-center"
            style={{ height: "93%" }}
          >
            <span className="text-muted">Live Camera Feed</span>
          </div>
        </div>

        {/* Map Section */}
        <div className="m-1 p-2 bg-dark rounded" style={{ width: "100%" }}>
          <h4 className="text-warning">Terrain Map</h4>
          <div
            className="bg-secondary  d-flex align-items-center justify-content-center "
            style={{ height: "93%" }}
          >
            <span className="text-muted">3D Terrain Visualization</span>
          </div>
        </div>

        {/* Lava Tube */}
        <div className="m-1 p-2 bg-dark rounded" style={{ width: "100%" }}>
          <h4 className="text-warning">Lava Tube</h4>
          <div className="h-75 d-flex align-items-center justify-content-center">
            <h1 className="text-danger">12.6m</h1>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div style={{ height: "45%", display: "flex" }}>
        {/* Elevation Profile */}
        <div className="m-1 p-2 bg-dark rounded" style={{ width: "100%" }}>
          <h4 className="text-warning">Elevation Profile</h4>
          <div className="bg-secondary h-75 mb-2">
            <span className="text-muted">Height Chart</span>
          </div>
          <div className="text-center">
            <h5 className="text-info">Max Height: 84.2m</h5>
            <p className="text-muted">Current: 67.3m</p>
          </div>
        </div>

        {/* Temperature */}
        <div className="m-1 p-2 bg-dark rounded" style={{ width: "100%" }}>
          <h4 className="text-warning">Temperature</h4>
          <div className="bg-secondary h-75 mb-2">
            <span className="text-muted">Temperature Chart</span>
          </div>
          <div className="text-center">
            <h5 className="text-info">Max Temperature: 38</h5>
            <p className="text-muted">Current: 67.3m</p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="m-1 p-2 bg-dark rounded" style={{ width: "100%" }}>
          <h4 className="text-warning">Coordinates</h4>
          <form onSubmit={handleCoordinateSubmit}>
            <div className="row mb-3">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control bg-secondary text-white"
                  placeholder="Latitude"
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control bg-secondary text-white"
                  placeholder="Longitude"
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-warning w-100 mb-2">
              Set Coordinates
            </button>
          </form>
          <div className="bg-secondary p-2 rounded">
            <p className="mb-0">Current Latitude: {currentLat}</p>
            <p className="mb-0">Current Longitude: {currentLng}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDashboard;
