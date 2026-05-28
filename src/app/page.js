"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '../components/SearchBar';
import HourlyForecast from '../components/HourlyForecast';
import AlertBanner from '../components/AlertBanner';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WeatherBackground from '../components/WeatherBackground';
import SkyAnimation from '../components/SkyAnimation';
import LeftNav from '../components/LeftNav';
import RightPanel from '../components/RightPanel';
import WaveGraph from '../components/WaveGraph';
import AboutModal from '../components/AboutModal';
import { fetchWeatherData } from '../services/weatherService';

import CompareCities from '../components/CompareCities';
import WeatherSummaryCard from '../components/WeatherSummaryCard';
import TravelPlanner from '../components/TravelPlanner';
import TenDayCalendar from '../components/TenDayCalendar';
import SettingsPanel from '../components/SettingsPanel';
import AlertsPanel from '../components/AlertsPanel';

const MiniMap = dynamic(() => import('../components/MiniMap'), { ssr: false });

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const loadData = async (query) => {
    setLoading(true);
    setError('');
    try {
      const { weather, forecast } = await fetchWeatherData(query);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching weather data.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    loadData('London');
  }, []);

  const handleSearch = (query) => loadData(query);

  const handleCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadData({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setError('Unable to get your location. Please allow location access.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  /* ── day / night helpers ── */
  const [now] = useState(() => Date.now());
  const isDay = weatherData
    ? now >= weatherData.sunrise && now < weatherData.sunset
    : true;

  const condition = weatherData ? weatherData.condition : 'Clear';

  return (
    <WeatherBackground condition={condition} isDay={isDay}>
      
      {/* ── Left Navigation Bar ── */}
      <LeftNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* ── Slide-out AI Insights Sidebar ── */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        weatherData={weatherData} 
        isNight={!isDay} 
      />

      {/* ── Main Dashboard Area ── */}
      <div className="flex-grow flex w-full h-full p-4 md:p-6 overflow-y-auto custom-scrollbar relative z-10">
        
        {/* Loading & Errors (Overlay) */}
        {error && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
            <ErrorMessage message={error} />
          </div>
        )}

        {loading && !weatherData && (
          <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-md">
            <LoadingSpinner />
          </div>
        )}

        {weatherData && (
          <>
            <AlertBanner weatherData={weatherData} />

            {activeTab === 'home' && (
            <div className={`w-full flex flex-col xl:flex-row gap-6 transition-all duration-700 ease-in-out ${loading ? 'opacity-40 blur-md scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
              
              {/* ── CENTER: Huge Typography & Wave Graph ── */}
              <div className="flex-1 flex flex-col justify-between pt-4 min-w-0">
                
                {/* Hero Text */}
                <div className="text-white max-w-2xl">
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-xs font-medium tracking-widest text-white/70 uppercase">Welcome User</span>
                    <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20 w-fit">
                      Weather Forecast
                    </div>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight drop-shadow-xl mb-2">
                    {weatherData.description}
                  </h1>
                  
                  <p className="text-base text-white/80 leading-relaxed font-medium max-w-xl text-balance drop-shadow-md mb-3">
                    Currently it feels like {weatherData.feels_like}°C. Wind is blowing from the west at {weatherData.wind_speed} km/h. 
                    Expect {weatherData.description.toLowerCase()} throughout the day.
                  </p>

                  {/* Sunrise / Sunset badges */}
                  <div className="flex gap-4 mb-2">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                      <span className="text-base">🌅</span>
                      <div>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold block leading-none">Sunrise</span>
                        <span className="text-sm font-bold text-amber-300">
                          {new Date(weatherData.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                      <span className="text-base">🌇</span>
                      <div>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold block leading-none">Sunset</span>
                        <span className="text-sm font-bold text-orange-300">
                          {new Date(weatherData.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hourly Forecast Strip */}
                <HourlyForecast hourlyData={weatherData.hourly} />

                {/* Wave Graph + Mini Map side by side */}
                <div className="mt-4 w-full flex flex-col md:flex-row gap-4">
                  <div className="flex-1 overflow-hidden">
                    <WaveGraph forecast={forecastData} />
                  </div>
                  <div className="w-full md:w-[260px] shrink-0">
                    <MiniMap lat={weatherData.lat} lon={weatherData.lon} cityName={weatherData.name} />
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Search, Profile & Location Cards ── */}
              <div className="w-full xl:w-[350px] flex flex-col gap-4 shrink-0">
                
                {/* Top Right Header (Search & Icons) */}
                <div className="flex flex-col items-end gap-2 w-full">
                  <div className="text-[11px] text-white/50 font-semibold tracking-wide">Built by Aryan Sharma</div>
                  <div className="flex items-start justify-end gap-4 w-full">
                  <div className="flex-grow max-w-[280px]">
                    <SearchBar onSearch={handleSearch} isSearching={loading} minimalist={true} />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={handleCurrentLocation}
                      className="h-12 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 gap-2 text-sm font-semibold hover:scale-105 shadow-lg"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="hidden lg:inline">My Location</span>
                    </button>
                    <button className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/20">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </button>
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold border border-white/30 overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-transform">
                      JD
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Location & Nearby Stack */}
              <RightPanel data={weatherData} isSearching={loading} />
            </div>
          </div>
          )}

            {activeTab === 'compare' && <CompareCities weatherData={weatherData} />}
            {activeTab === 'summary' && <WeatherSummaryCard weatherData={weatherData} />}
            {activeTab === 'travel' && <TravelPlanner weatherData={weatherData} />}
            {activeTab === 'calendar' && <TenDayCalendar forecast={forecastData} />}
            {activeTab === 'settings' && <SettingsPanel />}
            {activeTab === 'alerts' && <AlertsPanel />}
          </>
        )}
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05); border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2); border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.4);
        }
      `}</style>
    </WeatherBackground>
  );
}
