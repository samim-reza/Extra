import MissionDashboard from './components/Dashboard';
import Science from './components/Science';
import Arm from './components/Arm';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// function App() {
//   return (
//     <div >
//       <Science />
//     </div>
//   );
// }

// export default App;



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MissionDashboard />} />
        <Route path="/science" element={<Science />} />
        <Route path="/arm" element={<Arm />} />
      </Routes>
    </Router>
  );
};

export default App;