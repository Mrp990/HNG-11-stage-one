const express = require('express');
const ipinfo = require('ipinfo-node');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
});

// API endpoint
app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.clientIp;

  try {
  // location data based on client IP
    const locationData = await ipinfo(clientIp, process.env.IPINFO_API_KEY);
    const { city } = locationData.details;

    const weatherData = {
      temperature: 11 
    };

    const greeting = `Hello, ${visitorName}!, the temperature is ${weatherData.temperature} degrees Celsius in ${city}`;
    const responseData = {
      client_ip: clientIp,
      location: city,
      greeting: greeting
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching location data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
