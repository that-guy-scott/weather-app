const express = require('express');

const app = express();
app.use(express.static('.'));
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/weather', async (req, res) => {
  console.log('Weather endpoint hit');
  const { latitude, longitude, timezone } = req.query;
  const tz = timezone || 'auto';
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,uv_index,weathercode,windspeed_10m,apparent_temperature&hourly=temperature_2m,weathercode,precipitation_probability&forecast_hours=24&timezone=${encodeURIComponent(tz)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});