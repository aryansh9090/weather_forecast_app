'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapWeatherCode } from '../services/weatherService';

/* ── Re-centre map when coords change ── */
function MapController({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 9, { animate: true });
  }, [lat, lon, map]);
  return null;
}

/* ── Fetch nearby cities via OpenTripMap + OpenMeteo for temps ── */
const OTM_KEY = '5ae2e3f221c38a28845f05b60fd7c8f96e4e56f7f9c8f7b4df0e3b4c';

async function fetchNearbyCitiesWithWeather(lat, lon) {
  try {
    // 1. Get nearby places
    const otmUrl =
      `https://api.opentripmap.com/0.1/en/places/radius` +
      `?radius=80000&lon=${lon}&lat=${lat}&kinds=interesting_places` +
      `&limit=8&format=json&apikey=${OTM_KEY}`;
    const otmRes = await fetch(otmUrl);
    if (!otmRes.ok) throw new Error('OTM fetch failed');
    const otmData = await otmRes.json();
    
    const places = (otmData || []).filter(
      (p) => p.name && p.name.trim() && p.point && p.name.toLowerCase() !== 'unnamed'
    );

    if (places.length === 0) return [];

    // 2. Fetch current weather for all places in one batch request
    const lats = places.map((p) => p.point.lat).join(',');
    const lons = places.map((p) => p.point.lon).join(',');
    
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code`;
    const meteoRes = await fetch(meteoUrl);
    
    if (!meteoRes.ok) return places; // Fallback to just places if weather fails
    
    const meteoData = await meteoRes.json();
    
    // Open-Meteo returns an array of responses when querying multiple locations
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
    // API failed (likely rate limits or CORS). Fail silently to avoid breaking the UI.
    return [];
  }
}

/* ── Custom HTML DivIcons ── */
const createCustomIcon = (isMain, temp, weatherCode, name) => {
  const emoji = weatherCode !== undefined ? mapWeatherCode(weatherCode).emoji : '';
  const tempStr = temp !== null && temp !== undefined ? `${temp}°C` : '';
  
  const bgClass = isMain 
    ? 'bg-gradient-to-br from-red-500 to-rose-700 shadow-red-500/50' 
    : 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/50';

  const html = `
    <div class="custom-map-marker group flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110">
      <div class="marker-pill ${bgClass} rounded-full shadow-lg border-2 border-white/80 text-white flex items-center overflow-hidden transition-all duration-300 ease-in-out h-8 w-8 hover:w-auto hover:px-3">
        <span class="emoji text-sm flex-shrink-0 flex items-center justify-center w-full h-full group-hover:w-auto group-hover:mr-2">
          ${isMain ? '📍' : emoji || '🔵'}
        </span>
        <span class="info whitespace-nowrap opacity-0 w-0 transform translate-x-2 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:w-auto group-hover:translate-x-0 flex gap-2 font-semibold text-sm">
          <span>${name}</span>
          ${tempStr ? `<span class="opacity-90 font-black">${tempStr}</span>` : ''}
        </span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'bg-transparent border-none', // Override default Leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};


/* ── Main component ── */
export default function WeatherMap({ lat, lon, cityName, onCitySelect, isNight }) {
  const [nearby, setNearby] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingNearby(true);
    fetchNearbyCitiesWithWeather(lat, lon).then((cities) => {
      setNearby(cities);
      setLoadingNearby(false);
    });
  }, [lat, lon]);

  if (!lat || !lon) return null;

  // Cool CartoDB tiles without API keys
  const tileUrl = isNight
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const containerBg = isNight ? 'rgba(10,22,48,0.82)' : 'rgba(255,255,255,0.80)';
  const containerBorder = isNight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.4)';
  const textColor = isNight ? '#e2e8f0' : '#1f2937';

  return (
    <div
      className="rounded-xl shadow-lg border overflow-hidden backdrop-blur-md transition-all duration-700"
      style={{
        background: containerBg,
        borderColor: containerBorder,
      }}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: isNight ? 'rgba(255,255,255,0.15)' : '#e5e7eb' }}>
        <span className="text-xl">🗺️</span>
        <span className="font-bold text-base" style={{ color: textColor }}>
          Explore Area
        </span>
        {loadingNearby && (
          <span className="ml-auto text-sm animate-pulse" style={{ color: isNight ? '#94a3b8' : '#64748b' }}>
            Scanning environment...
          </span>
        )}
      </div>

      {/* Map */}
      <div className="relative p-2">
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: isNight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <MapContainer
            center={[lat, lon]}
            zoom={9}
            scrollWheelZoom={false}
            style={{ height: 280, width: '100%', background: isNight ? '#0f172a' : '#f8fafc' }}
            attributionControl={false}
          >
            <MapController lat={lat} lon={lon} />

            <TileLayer url={tileUrl} />

            {/* Main city — red marker */}
            <Marker 
              position={[lat, lon]} 
              icon={createCustomIcon(true, null, null, cityName)} 
              zIndexOffset={1000}
            />

            {/* Nearby cities — blue markers */}
            {nearby.map((place) => (
              <Marker
                key={place.xid || place.name}
                position={[place.point.lat, place.point.lon]}
                icon={createCustomIcon(false, place.temp, place.weather_code, place.name)}
                eventHandlers={{
                  click: () => onCitySelect && onCitySelect(place.name),
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>

      <style jsx global>{`
        /* Global override for Leaflet to fix divIcon bounding boxes causing hover issues */
        .leaflet-marker-icon.bg-transparent {
          background: transparent !important;
          border: none !important;
        }
        
        .custom-map-marker {
          /* Expand click area safely */
          width: 100%;
          height: 100%;
        }
        
        .marker-pill {
          transform-origin: center left;
        }
        
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
