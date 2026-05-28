'use client';

import React, { useEffect, useRef } from 'react';

export default function MiniMap({ lat, lon, cityName }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!lat || !lon || !mapRef.current) return;

    // Dynamically load Leaflet CSS
    if (!document.getElementById('leaflet-css-mini')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-mini';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    const loadLeaflet = () => {
      return new Promise((resolve) => {
        if (window.L) {
          resolve(window.L);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve(window.L);
        document.head.appendChild(script);
      });
    };

    loadLeaflet().then((L) => {
      // If map already exists, just fly to new coords
      if (mapInstance.current) {
        mapInstance.current.flyTo([lat, lon], 11, { duration: 1.5 });
        // Remove old markers
        mapInstance.current.eachLayer(layer => {
          if (layer instanceof L.Marker) mapInstance.current.removeLayer(layer);
        });
        L.marker([lat, lon]).addTo(mapInstance.current)
          .bindPopup(`<b>${cityName || 'Location'}</b>`)
          .openPopup();
        return;
      }

      // Create new map
      const map = L.map(mapRef.current, {
        center: [lat, lon],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
      });

      // Voyager (light, muted) tiles — blends well with bright AND dark UIs
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${cityName || 'Location'}</b>`)
        .openPopup();

      mapInstance.current = map;
    });

    return () => {
      // Don't destroy map on every re-render, just let flyTo handle updates
    };
  }, [lat, lon, cityName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
        <span>🗺️</span> Location Map
      </h3>
      <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-white/10 backdrop-blur-sm" style={{ height: '180px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
