import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import AutonomousDashboard from './components/AutonomousDashboard/AutonomousDashboard';
import ArmsDashboard from './components/ArmsDashboard/ArmsDashboard';
import ScienceDashboard from './components/ScienceDashboard/ScienceDashboard';

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">My Dashboards</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/autonomous">Autonomous</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/arms">Arms</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/science">Science</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/autonomous" element={<AutonomousDashboard />} />
        <Route path="/arms" element={<ArmsDashboard />} />
        <Route path="/science" element={<ScienceDashboard />} />
        <Route path="/" element={<AutonomousDashboard />} /> {/* Default route */}
      </Routes>
    </Router>
  );
};

export default App;