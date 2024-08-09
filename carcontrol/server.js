const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'car-run.html'));
});
app.get('/sensor', (req, res) => {
  res.sendFile(path.join(__dirname, 'sensor.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
    
