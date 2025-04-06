import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Science = () => {
  // State for soil sliders
  const [protein, setProtein] = useState(50);
  const [carbohydrate, setCarbohydrate] = useState(30);
  const [lipid, setLipid] = useState(20);

  // State for rock analysis
  const [mVOC, setMVOC] = useState(4);
  const [igneousClass, setIgneousClass] = useState("Basaltic");
  const [fossilClass, setFossilClass] = useState("None detected");

  // Sample data for chemical graphs
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        time: i,
        NH3: Math.sin(i * 0.5) * 10 + 20 + Math.random() * 5,
        C2H5_2O: Math.cos(i * 0.3) * 15 + 30 + Math.random() * 5,
        CH2O: Math.sin(i * 0.2 + 2) * 8 + 15 + Math.random() * 3,
      });
    }
    return data;
  };

  const chemicalData = generateData();

  return (
    <div
      style={{
        backgroundColor: "#1a1f35",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        gap: "20px",
      }}
    >
      {/* Left Column - Soil and Rock Analysis */}
      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Soil Analysis Section */}
        <div
          style={{
            backgroundColor: "rgba(45, 55, 80, 0.7)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2 style={{ color: "#4cd6d6", marginTop: 0, marginBottom: "20px" }}>
            Soil Analysis
          </h2>

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Protein</span>
              <span>{protein}%</span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  height: "6px",
                  backgroundColor: "#3a4561",
                  borderRadius: "3px",
                  width: "100%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: `${protein}%`,
                  transform: "translateX(-50%)",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#5b68d6",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              ></div>
              <input
                type="range"
                value={protein}
                onChange={(e) => setProtein(parseInt(e.target.value))}
                min="0"
                max="100"
                style={{
                  position: "absolute",
                  top: "-10px",
                  width: "100%",
                  opacity: 0,
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Carbohydrate</span>
              <span>{carbohydrate}%</span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  height: "6px",
                  backgroundColor: "#3a4561",
                  borderRadius: "3px",
                  width: "100%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: `${carbohydrate}%`,
                  transform: "translateX(-50%)",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#5b68d6",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              ></div>
              <input
                type="range"
                value={carbohydrate}
                onChange={(e) => setCarbohydrate(parseInt(e.target.value))}
                min="0"
                max="100"
                style={{
                  position: "absolute",
                  top: "-10px",
                  width: "100%",
                  opacity: 0,
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Lipid</span>
              <span>{lipid}%</span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  height: "6px",
                  backgroundColor: "#3a4561",
                  borderRadius: "3px",
                  width: "100%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: `${lipid}%`,
                  transform: "translateX(-50%)",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#5b68d6",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              ></div>
              <input
                type="range"
                value={lipid}
                onChange={(e) => setLipid(parseInt(e.target.value))}
                min="0"
                max="100"
                style={{
                  position: "absolute",
                  top: "-10px",
                  width: "100%",
                  opacity: 0,
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Rock Analysis Section */}
        <div
          style={{
            backgroundColor: "rgba(45, 55, 80, 0.7)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2 style={{ color: "#4cd6d6", marginTop: 0, marginBottom: "20px" }}>
            Rock Analysis
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>mVOC Level</span>
              <span>{mVOC}</span>
            </div>
            <div style={{ position: "relative", marginBottom: "15px" }}>
              <div
                style={{
                  height: "12px",
                  background:
                    "linear-gradient(to right, #4a6af0, #43c96c, #f5515e)",
                  borderRadius: "6px",
                  width: "100%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: `${(mVOC / 10) * 100}%`,
                  transform: "translateX(-50%)",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                }}
              ></div>
              <input
                type="range"
                value={mVOC}
                onChange={(e) => setMVOC(parseInt(e.target.value))}
                min="0"
                max="10"
                style={{
                  position: "absolute",
                  top: "-6px",
                  width: "100%",
                  opacity: 0,
                  height: "24px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>Igneous Classifier:</span>
              <span style={{ color: "#d3d04e" }}>{igneousClass}</span>
            </div>
            <select
              value={igneousClass}
              onChange={(e) => setIgneousClass(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#1a1f35",
                color: "white",
                border: "1px solid #3a4561",
                borderRadius: "4px",
              }}
            >
              <option>Basaltic</option>
              <option>Andesitic</option>
              <option>Dacitic</option>
              <option>Rhyolitic</option>
              <option>Unknown</option>
            </select>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>Fossil Classifier:</span>
              <span style={{ color: "#d3d04e" }}>{fossilClass}</span>
            </div>
            <select
              value={fossilClass}
              onChange={(e) => setFossilClass(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#1a1f35",
                color: "white",
                border: "1px solid #3a4561",
                borderRadius: "4px",
              }}
            >
              <option>None detected</option>
              <option>Microbial mat</option>
              <option>Stromatolite-like</option>
              <option>Trace fossil</option>
              <option>Microscopic structures</option>
            </select>
          </div>
        </div>
      </div>

      {/* Middle Column - Camera Feeds */}
      <div style={{ width: "35%" }}>
        <h2 style={{ color: "#4cd6d6", marginBottom: "20px" }}>Camera Feeds</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            height: "calc(100% - 60px)",
          }}
        >
          <div
            style={{
              backgroundColor: "#121729",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "8px 12px", backgroundColor: "#0c101f" }}>
              <span>Front Camera</span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                padding: "12px",
              }}
            >
              <img
                src="http://192.168.0.184:5000/video_feed
              
              "
                alt="Front camera feed"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#121729",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "8px 12px", backgroundColor: "#0c101f" }}>
              <span>Rear Camera</span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                padding: "12px",
              }}
            >
              <img
                src="http://192.168.0.184:5000/video_feed"
                alt="Rear camera feed"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#121729",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "8px 12px", backgroundColor: "#0c101f" }}>
              <span>Arm Camera</span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                padding: "12px",
              }}
            >
              <img
                src="/api/placeholder/400/320"
                alt="Arm camera feed"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#121729",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "8px 12px", backgroundColor: "#0c101f" }}>
              <span>Microscopic</span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                padding: "12px",
              }}
            >
              <img
                src="/api/placeholder/400/320"
                alt="Microscopic camera feed"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Graphs */}
      <div style={{ width: "35%" }}>
        <h2 style={{ color: "#4cd6d6", marginBottom: "20px" }}>
          Chemical Analysis
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            height: "calc(100% - 60px)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(45, 55, 80, 0.7)",
              borderRadius: "8px",
              padding: "16px",
              flex: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <span>NH₃ (Ammonia)</span>
            </div>
            <div style={{ height: "85%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chemicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3251" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: "Time (h)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    stroke="#aab0c5"
                  />
                  <YAxis
                    label={{ value: "ppm", angle: -90, position: "insideLeft" }}
                    stroke="#aab0c5"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f35",
                      borderColor: "#3a4561",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="NH3"
                    stroke="#36d98d"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(45, 55, 80, 0.7)",
              borderRadius: "8px",
              padding: "16px",
              flex: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <span>(C₂H₅)₂O (Diethyl Ether)</span>
            </div>
            <div style={{ height: "85%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chemicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3251" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: "Time (h)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    stroke="#aab0c5"
                  />
                  <YAxis
                    label={{ value: "ppm", angle: -90, position: "insideLeft" }}
                    stroke="#aab0c5"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f35",
                      borderColor: "#3a4561",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="C2H5_2O"
                    stroke="#4a94f7"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(45, 55, 80, 0.7)",
              borderRadius: "8px",
              padding: "16px",
              flex: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <span>CH₂O (Formaldehyde)</span>
            </div>
            <div style={{ height: "85%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chemicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3251" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: "Time (h)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    stroke="#aab0c5"
                  />
                  <YAxis
                    label={{ value: "ppm", angle: -90, position: "insideLeft" }}
                    stroke="#aab0c5"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f35",
                      borderColor: "#3a4561",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="CH2O"
                    stroke="#e8439a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Science;
