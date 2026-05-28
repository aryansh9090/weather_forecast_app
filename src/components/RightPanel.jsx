'use client';

import React, { useState, useEffect } from 'react';
import { mapWeatherCode } from '../services/weatherService';

const OTM_KEY = '5ae2e3f221c38a28845f05b60fd7c8f96e4e56f7f9c8f7b4df0e3b4c';

async function fetchNearbyCitiesWithWeather(lat, lon) {
  try {
    const otmUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=80000&lon=${lon}&lat=${lat}&kinds=interesting_places&limit=3&format=json&apikey=${OTM_KEY}`;
    const otmRes = await fetch(otmUrl);
    if (!otmRes.ok) return [];
    const otmData = await otmRes.json();
    
    const places = (otmData || []).filter(p => p.name && p.name.trim() && p.name.toLowerCase() !== 'unnamed').slice(0, 3);
    if (places.length === 0) return [];

    const lats = places.map((p) => p.point.lat).join(',');
    const lons = places.map((p) => p.point.lon).join(',');
    
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code`;
    const meteoRes = await fetch(meteoUrl);
    
    if (!meteoRes.ok) return places; 
    
    const meteoData = await meteoRes.json();
    const responses = Array.isArray(meteoData) ? meteoData : [meteoData];
    
    return places.map((place, index) => {
      const current = responses[index]?.current;
      return {
        ...place,
        temp: current?.temperature_2m ? Math.round(current.temperature_2m) : null,
        weather_code: current?.weather_code,
      };
    });
  } catch (err) {
    return [];
  }
}

export default function RightPanel({ data }) {
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data) return;
    setLoading(true);
    fetchNearbyCitiesWithWeather(data.lat, data.lon).then((cities) => {
      // If no cities found via API, fallback to some mock data just to keep the UI looking like the mockup
      if (cities.length === 0) {
        setNearby([
          { name: "North Area", temp: data.temp + 1, weather_code: data.raw_code },
          { name: "South Area", temp: data.temp - 1, weather_code: data.raw_code },
          { name: "West Area", temp: data.temp, weather_code: data.raw_code },
        ]);
      } else {
        setNearby(cities);
      }
      setLoading(false);
    });
  }, [data]);

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm ml-auto">
      
      {/* Main Location Glass Card */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-semibold text-lg text-white drop-shadow-md">{data.name}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 relative z-10">
          <span className="text-7xl font-bold tracking-tighter text-white drop-shadow-lg">{data.temp}°</span>
          <span className="text-4xl font-light text-white/80 mt-2">C</span>
        </div>

        <div className="mt-8 flex items-center gap-4 text-white/90 text-sm font-medium relative z-10">
          <div className="flex items-center gap-1.5"><span className="opacity-80">💨</span> {data.wind_speed} km/h</div>
          <div className="flex items-center gap-1.5"><span className="opacity-80">💧</span> {data.humidity}%</div>
        </div>
      </div>

      {/* Nearby Locations Stack */}
      <div className="flex flex-col gap-3 mt-4">
        {loading ? (
           <div className="text-white/50 text-sm ml-2">Loading areas...</div>
        ) : (
          nearby.map((place, idx) => {
            const { emoji, description } = mapWeatherCode(place.weather_code);
            return (
              <div 
                key={idx} 
                className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">{data.country || 'Area'}</div>
                  <div className="text-white font-semibold text-lg drop-shadow-sm">{place.name}</div>
                  <div className="text-white/70 text-sm">{description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-white drop-shadow-md">{place.temp}°</span>
                  <span className="text-3xl filter drop-shadow-sm">{emoji}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
