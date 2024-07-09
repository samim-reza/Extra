let xCounter = 1;

const ctx = document.getElementById('myChart').getContext('2d');
const data = {
  datasets: [{
    label: 'Distance',
    data: [],
    backgroundColor: 'red',
    borderColor: 'red',
    showLine: true,
    fill: false
  }]
};

const config = {
  type: 'scatter',
  data: data,
  options: {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'X-Axis'
        },
        grid: {
          drawOnChartArea: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0
        },
        ticks: {
          stepSize: 1,
          callback: function(value) { return value; },
          precision: 0
        },
        min: 0
      },
      y: {
        title: {
          display: true,
          text: 'Distance (cm)'
        },
        grid: {
          drawOnChartArea: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0
        },
        ticks: {
          stepSize: 1,
          callback: function(value) { return value; },
          precision: 0
        },
        min: 0
      }
    },
    plugins: {
      legend: {
        display: false
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        }
      }
    }
  }
};

const myChart = new Chart(ctx, config);

function updateAxisLimits(newX, newY) {
  const xScale = myChart.options.scales.x;
  const yScale = myChart.options.scales.y;

  let updated = false;

  if (newX < xScale.min) {
    xScale.min = newX;
    updated = true;
  } else if (newX > xScale.max) {
    xScale.max = newX;
    updated = true;
  }

  if (newY < yScale.min) {
    yScale.min = newY;
    updated = true;
  } else if (newY > yScale.max) {
    yScale.max = newY;
    updated = true;
  }

  if (updated) {
    myChart.update();
  }
}

function fetchData() {
  fetch('http://172.18.13.37/distance')
    .then(response => response.json())
    .then(data => {
      const newPoint = { x: xCounter, y: data.distance };
      myChart.data.datasets[0].data.push(newPoint);
      updateAxisLimits(xCounter, data.distance);
      myChart.update();
      xCounter++;
    })
    .catch(error => console.error('Error:', error));
}

setInterval(fetchData, 1000);

function toggleLED() {
  fetch('http://172.18.13.37/toggle')
    .then(response => response.json())
    .then(data => {
      console.log('LED:', data.led);
    })
    .catch(error => console.error('Error:', error));
}

function temperature() {
  fetch('http://172.18.13.37/temperature')
    .then(response => response.json())
    .then(data => {
      document.getElementById('temperature-value').innerText = 'Temperature: ' + data.temperature + ' °C';
    })
    .catch(error => console.error('Error:', error));
}

function humidity() {
  fetch('http://172.18.13.37/humidity')
    .then(response => response.json())
    .then(data => {
      document.getElementById('humidity-value').innerText = 'Humidity: ' + data.humidity + ' %';
    })
    .catch(error => console.error('Error:', error));
}

setInterval(temperature, 5000);
setInterval(humidity, 5000);

// Placeholder for Three.js gyro visualization
const gyroDiv = document.getElementById('gyro');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, gyroDiv.clientWidth / gyroDiv.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(gyroDiv.clientWidth, gyroDiv.clientHeight);
gyroDiv.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
