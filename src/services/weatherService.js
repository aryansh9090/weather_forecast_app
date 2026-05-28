export const mapWeatherCode = (code) => {
  // Map WMO weather codes to condition strings for our background animation
  // and pick an appropriate emoji.
  // https://open-meteo.com/en/docs — WMO Weather interpretation codes
  if (code === 0) return { condition: 'Clear', emoji: '☀️', description: 'Sunny' };
  if (code === 1) return { condition: 'Clear', emoji: '🌤️', description: 'Mainly Sunny' };
  if (code === 2) return { condition: 'PartlyCloudy', emoji: '⛅', description: 'Partly Cloudy' };
  if (code === 3) return { condition: 'Cloud', emoji: '☁️', description: 'Overcast' };
  if ([45, 48].includes(code)) return { condition: 'Cloud', emoji: '🌫️', description: 'Fog' };
  if ([51, 53].includes(code)) return { condition: 'PartlyCloudy', emoji: '🌦️', description: 'Light Drizzle' };
  if ([55, 56, 57].includes(code)) return { condition: 'Rain', emoji: '🌦️', description: 'Drizzle' };
  if ([61, 63, 65, 66, 67].includes(code)) return { condition: 'Rain', emoji: '🌧️', description: 'Rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snow', emoji: '❄️', description: 'Snow' };
  if ([80, 81, 82].includes(code)) return { condition: 'Rain', emoji: '🌧️', description: 'Heavy Rain' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', emoji: '⛈️', description: 'Thunderstorm' };
  
  return { condition: 'Clear', emoji: '🌡️', description: 'Unknown' };
};

export const fetchWeatherData = async (query) => {
  let lat, lon, name, country;

  // 1. Geocoding
  if (typeof query === 'object' && query.lat && query.lon) {
    // GPS coordinates from browser geolocation — skip geocoding entirely
    lat = query.lat;
    lon = query.lon;
    name = "Current Location";
    country = "";
  } else if (/^\d+$/.test(query.trim())) {
    // All digits → treat as postal / PIN code, use Nominatim (OpenStreetMap)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(query.trim())}&format=json&limit=1`;
    const nominatimResponse = await fetch(nominatimUrl, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'WeatherTravelApp/1.0' }
    });
    const nominatimData = await nominatimResponse.json();

    if (!nominatimData || nominatimData.length === 0) {
      throw new Error(`PIN/ZIP code "${query}" not found. Please check and try again.`);
    }

    lat = parseFloat(nominatimData[0].lat);
    lon = parseFloat(nominatimData[0].lon);
    // Nominatim returns a display_name like "Bhilai, Durg, Chhattisgarh, India"
    const parts = nominatimData[0].display_name.split(',');
    name = parts[0].trim();
    country = parts[parts.length - 1].trim();
  } else {
    // City name → use Open-Meteo Geocoding API
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${query}" not found.`);
    }

    const location = geoData.results[0];
    lat = location.latitude;
    lon = location.longitude;
    name = location.name;
    country = location.country_code?.toUpperCase() || "";
  }

  // 2. Fetch Weather Data (Now with hourly)
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&hourly=temperature_2m,precipitation_probability,uv_index,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,sunrise,sunset&forecast_days=10&timezone=auto`;
  
  // 2b. Fetch AQI Data
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5`;

  const [weatherResponse, aqiResponse] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null) // fail gracefully
  ]);

  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data.");
  }
  
  const data = await weatherResponse.json();
  const aqiData = aqiResponse && aqiResponse.ok ? await aqiResponse.json() : null;
  
  // 3. Normalize Data
  const currentInfo = mapWeatherCode(data.current.weather_code);
  
  // Format current weather
  const weather = {
    name,
    country,
    lat,
    lon,
    temp: Math.round(data.current.temperature_2m),
    feels_like: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    wind_speed: data.current.wind_speed_10m,
    condition: currentInfo.condition,
    description: currentInfo.description,
    emoji: currentInfo.emoji,
    raw_code: data.current.weather_code,
    aqi: aqiData?.current?.us_aqi || null,
    pm25: aqiData?.current?.pm2_5 || null,
    pm10: aqiData?.current?.pm10 || null,
    // Note: Open-Meteo current doesn't have UVI or sunrise/sunset directly in `current`,
    // so we pull them from the first day of the `daily` array
    uvi: data.daily.uv_index_max[0] || 0,
    sunrise: new Date(data.daily.sunrise[0]).getTime(),
    sunset: new Date(data.daily.sunset[0]).getTime(),
    dt: new Date(data.current.time).getTime(),
    hourly: data.hourly.time.map((time, idx) => ({
      time: new Date(time).getTime(),
      temp: Math.round(data.hourly.temperature_2m[idx]),
      pop: data.hourly.precipitation_probability[idx],
      uvi: data.hourly.uv_index[idx],
      weather_code: data.hourly.weather_code[idx],
    })).filter(h => h.time >= new Date(data.current.time).getTime()).slice(0, 24) // Next 24 hours
  };

  // Format 10-day forecast
  const forecast = data.daily.time.map((timeStr, index) => {
    const dayInfo = mapWeatherCode(data.daily.weather_code[index]);
    
    // Hourly data is available for all 10 days. Each day has 24 hours.
    const startHourIdx = index * 24;
    
    // Fallback to min/max if hourly data is missing for some reason
    const temp_max = Math.round(data.daily.temperature_2m_max[index]);
    const temp_min = Math.round(data.daily.temperature_2m_min[index]);
    
    const morning = data.hourly?.temperature_2m?.[startHourIdx + 9] !== undefined ? Math.round(data.hourly.temperature_2m[startHourIdx + 9]) : temp_min;
    const afternoon = data.hourly?.temperature_2m?.[startHourIdx + 14] !== undefined ? Math.round(data.hourly.temperature_2m[startHourIdx + 14]) : temp_max;
    const evening = data.hourly?.temperature_2m?.[startHourIdx + 18] !== undefined ? Math.round(data.hourly.temperature_2m[startHourIdx + 18]) : Math.round((temp_max + temp_min) / 2);
    const night = data.hourly?.temperature_2m?.[startHourIdx + 21] !== undefined ? Math.round(data.hourly.temperature_2m[startHourIdx + 21]) : temp_min;

    return {
      dt: new Date(timeStr).getTime(),
      temp_max,
      temp_min,
      precipitation: data.daily.precipitation_sum[index],
      condition: dayInfo.condition,
      description: dayInfo.description,
      emoji: dayInfo.emoji,
      morning,
      afternoon,
      evening,
      night
    };
  });

  return { weather, forecast };
};
