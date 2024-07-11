let xCounter = 1;

const distanceCtx = document.getElementById('distance-chart').getContext('2d');
const tempCtx = document.getElementById('temp-chart').getContext('2d');
const hmdCtx = document.getElementById('hmd-chart').getContext('2d');

const distanceData = {
  datasets: [{
    label: 'Distance',
    data: [],
    backgroundColor: 'red',
    borderColor: 'red',
    showLine: true,
    fill: false
  }]
};

const tempData = {
  datasets: [{
    label: 'Temperature',
    data: [],
    backgroundColor: 'blue',
    borderColor: 'blue',
    showLine: true,
    fill: false
  }]
};

const hmdData = {
  datasets: [{
    label: 'Humidity',
    data: [],
    backgroundColor: 'green',
    borderColor: 'green',
    showLine: true,
    fill: false
  }]
};

const config = {
  type: 'line',
  data: distanceData,
  options: {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Time'
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
          callback: function (value) { return value; },
          precision: 0,
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0
        },
        beginAtZero: true
      },
      y: {
        beginAtZero: true,
        grid: {
          drawOnChartArea: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          enabled: true,
          mode: 'x'
        }
      }
    }
  }
};

const distanceChart = new Chart(distanceCtx, config);
const tempChart = new Chart(tempCtx, { ...config, data: tempData });
const hmdChart = new Chart(hmdCtx, { ...config, data: hmdData });

let ip = '192.168.0.199';

function fetchData() {
  fetch(`http://${ip}/distance`)
    .then(response => response.json())
    .then(data => {
      const currentTime = new Date();
      const timeLabel = `${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

      distanceChart.data.labels.push(timeLabel);
      distanceChart.data.datasets[0].data.push({ x: xCounter, y: data.distance });
      distanceChart.update();

      tempChart.data.labels.push(timeLabel);
      tempChart.data.datasets[0].data.push({ x: xCounter, y: data.temperature });
      tempChart.update();

      hmdChart.data.labels.push(timeLabel);
      hmdChart.data.datasets[0].data.push({ x: xCounter, y: data.humidity });
      hmdChart.update();

      xCounter++;

      const tempPercentage = (data.temperature - 20) / 60 * 100;
      const hmdPercentage = data.humidity;
      document.getElementById('temperature-thermo').style.height = `${tempPercentage}%`;
      document.getElementById('temperature-thermo').setAttribute('data-value', `${data.temperature}°C`);
      document.getElementById('temperature-value').innerText = `${data.temperature}°C`;

      document.getElementById('humidity-thermo').style.height = `${hmdPercentage}%`;
      document.getElementById('humidity-thermo').setAttribute('data-value', `${data.humidity}%`);
      document.getElementById('humidity-value').innerText = `${data.humidity}%`;

    })
    .catch(error => console.error('Error:', error));
}

function fetchTemperature() {
  fetch(`http://${ip}/temperature`)
    .then(response => response.json())
    .then(data => {
      const currentTime = new Date();
      const timeLabel = `${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

      tempChart.data.labels.push(timeLabel);
      tempChart.data.datasets[0].data.push({ x: xCounter, y: data.temperature });
      tempChart.update();

      const tempPercentage = (data.temperature - 20) / 60 * 100;
      document.getElementById('temperature-thermo').style.height = `${tempPercentage}%`;
      document.getElementById('temperature-thermo').setAttribute('data-value', `${data.temperature}°C`);
      document.getElementById('temperature-value').innerText = `${data.temperature}°C`;

    })
    .catch(error => console.error('Error:', error));
}

function fetchHumidity() {
  fetch(`http://${ip}/temperature`)
    .then(response => response.json())
    .then(data => {
      const currentTime = new Date();
      const timeLabel = `${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

      hmdChart.data.labels.push(timeLabel);
      hmdChart.data.datasets[0].data.push({ x: xCounter, y: data.humidity });
      hmdChart.update();

      const hmdPercentage = data.humidity;
      document.getElementById('humidity-thermo').style.height = `${hmdPercentage}%`;
      document.getElementById('humidity-thermo').setAttribute('data-value', `${data.humidity}%`);
      document.getElementById('humidity-value').innerText = `${data.humidity}%`;

    })
    .catch(error => console.error('Error:', error));
}

function initThreeJS() {
    
  let ax = 0, ay = 0, az = 0;

  const fetchData = () => {
    fetch(`http://${ip}/imu`)
      .then(response => response.json())
      .then(data => {
        ax = data.ax;
        ay = data.ay;
        az = data.az;
      })
      .catch(error => console.error('Error:', error));
  };

  const container = document.getElementById('threejs-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x = ax;
    cube.rotation.y = ay;
    cube.rotation.z = az;

    renderer.render(scene, camera);
  };

  setInterval(fetchData, 1000);
  fetchData();

  animate();
}

setInterval(fetchData, 1500);
setInterval(fetchTemperature, 1500);
setInterval(fetchHumidity, 1500);

initThreeJS();
