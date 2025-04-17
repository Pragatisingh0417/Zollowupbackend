const express = require("express");
const axios = require("axios");
const router = express.Router();
const Location = require("../models/Location"); 

router.get("/", async (req, res) => {
  const { lat, lng } = req.query;

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: "Invalid latitude or longitude format" });
  }
  console.log("Received query params:", { lat, lng }); 

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    // ✅ Define API URL
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`;
    console.log("Calling Google Maps API:", apiUrl); 

    // ✅ Make the request
    const response = await axios.get(apiUrl);

    const results = response.data.results;
    let city = "";

    if (results.length > 0) {
      console.log("Address components:", results[0].address_components);
      
      // Loop through address components to find city or state
      for (const component of results[0].address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name;
          break;
        } else if (component.types.includes("administrative_area_level_1")) {
          city = component.long_name;  // Use state if city is not found
          break;
        }
      }
    }

    res.json({ city });
  } catch (error) {
    console.error("Geolocation error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

module.exports = router;
