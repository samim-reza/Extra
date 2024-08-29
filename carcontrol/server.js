const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'car-run.html'));
});

app.get('/sensor', (req, res) => {
  res.sendFile(path.join(__dirname, 'sensor.html'));
});
app.get('/arm', (req, res) => {
  res.sendFile(path.join(__dirname, './armcontrol/index.html'));
});

app.get('/:imageName', (req, res) => {
  if (req.url.endsWith('.png') || req.url.endsWith('.jpeg'))
  {
    const fileName = req.url.split('/').pop();
    return res.sendFile(path.join(__dirname, 'armcontrol', fileName));
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
    
