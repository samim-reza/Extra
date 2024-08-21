const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
const port = 3000;

function generateDummyDistance() {
    let distance = Math.floor(Math.random() * 361);
    return { "distance": distance };
}

function generateDummyTemperatureAndHumidity() {
    let temperature = Math.floor(Math.random() * (100 - 25 + 1)) + 25;
    let humidity = Math.floor(Math.random() * (100 - 30 + 1)) + 30;

    return {
        "temperature": temperature,
        "humidity": humidity
    };
}

function generateDummyXYZAndPWM() {
    let x = (Math.random() * 10).toFixed(2);
    let y = (Math.random() * 10).toFixed(2);
    let z = (Math.random() * 10).toFixed(2);
    let pwm = Math.floor(Math.random() * 1025);

    return {
        "x": x,
        "y": y,
        "z": z,
        "pwm": pwm
    };
}

// Routes to serve data
app.get('/distance', (req, res) => {
    res.json(generateDummyDistance());
});

app.get('/temperature', (req, res) => {
    res.json(generateDummyTemperatureAndHumidity());
});

app.get('/imu', (req, res) => {
    res.json(generateDummyXYZAndPWM());
});

app.listen(port, () => {
    console.log(`Dummy data server running at http://localhost:${port}`);
});
