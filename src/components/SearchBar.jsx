"use client";

import React, { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, isSearching, minimalist }) {
  const [query, setQuery] = useState('');
  const [geoError, setGeoError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveSearch = (term) => {
    if (!term || typeof term !== 'string') return;
    const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      saveSearch(query.trim());
      setQuery('');
      setGeoError('');
    }
  };

  const handleLocation = () => {
    if ("geolocation" in navigator) {
      setGeoError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSearch({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          setGeoError("Unable to retrieve your location.");
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
    }
  };

  if (minimalist) {
    return (
      <div className="relative w-full">
        <form onSubmit={handleSubmit} className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 transition-all shadow-lg focus-within:ring-2 focus-within:ring-white/50">
          <button 
            type="button"
            onClick={handleLocation}
            className="text-white hover:scale-110 transition-transform mr-2"
            title="Use My Location"
          >
            📍
          </button>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search location..." 
            className="flex-grow bg-transparent border-none text-white placeholder-white/70 focus:outline-none font-medium"
            disabled={isSearching}
          />
          <button type="submit" disabled={isSearching || !query.trim()} className="text-white ml-2 hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </form>
        {/* Simple minimal dropdown for recents could go here, but for now we just keep the input clean */}
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row shadow-lg rounded-md bg-white overflow-hidden mb-3">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city name or PIN/ZIP code..." 
          className="flex-grow p-4 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
          disabled={isSearching}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white font-medium px-8 py-3 sm:py-0 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="flex flex-col items-center gap-3">
        <button 
          type="button"
          onClick={handleLocation}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-blue-700 font-bold py-2.5 px-6 rounded-full shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none disabled:opacity-50"
          disabled={isSearching}
        >
          <span className="text-xl">📍</span> Use My Location
        </button>
        
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-2 text-sm text-gray-100">
            <span className="font-semibold opacity-90 drop-shadow-md">Recent:</span>
            {recentSearches.map((city, idx) => (
              <React.Fragment key={idx}>
                <button 
                  onClick={() => {
                    onSearch(city);
                    saveSearch(city);
                  }}
                  className="hover:text-white hover:underline transition-colors focus:outline-none drop-shadow-md"
                  disabled={isSearching}
                >
                  {city}
                </button>
                {idx < recentSearches.length - 1 && <span className="opacity-60">|</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      {geoError && <p className="text-red-500 text-sm mt-2 text-center bg-white/80 py-1 rounded">{geoError}</p>}
    </div>
  );
}
