import React from 'react';
import { Line } from 'react-chartjs-2';
import './App.css';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};

function App() {
  return (
    <div className="container">
      <div className="column">
        <div className="row">
          <Line data={data} />
        </div>
        <div className="row">
          <Line data={data} />
        </div>
      </div>
      <div className="column middle">
        <img src="your-image-url-here.jpg" alt="Central Visual" className="full-width-image" />
      </div>
      <div className="column">
        <div className="row">
          <Line data={data} />
        </div>
        <div className="row">
          <Line data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;
