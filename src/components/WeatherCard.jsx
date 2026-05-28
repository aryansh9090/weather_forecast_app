import React from 'react';

export default function WeatherCard({ data }) {
  if (!data) return null;

  const formatTime = (ms) => {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-auto my-4 text-center border border-white/40">
      <h2 className="text-4xl font-bold text-gray-800 tracking-wide">
        {data.name}{data.country ? `, ${data.country}` : ''}
      </h2>
      <p className="text-gray-600 text-xl capitalize mt-2 flex items-center justify-center gap-2">
        <span className="text-4xl">{data.emoji}</span>
        {data.description}
      </p>
      
      <div className="flex flex-col md:flex-row justify-center items-center my-8 gap-8">
        <div className="text-8xl font-black text-blue-700 drop-shadow-md">
          {data.temp}°<span className="text-4xl text-blue-500 font-bold">C</span>
        </div>
        <div className="flex flex-col text-left gap-2 text-gray-700 bg-white/50 p-4 rounded-lg">
          <div><span className="font-semibold text-gray-900">Feels Like:</span> {data.feels_like}°C</div>
          <div><span className="font-semibold text-gray-900">UV Index:</span> {data.uvi}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700 bg-white/40 p-4 rounded-lg mt-6">
        <div className="flex flex-col items-center p-2">
          <span className="block font-bold text-gray-900 mb-1">💧 Humidity</span>
          <span className="text-lg">{data.humidity}%</span>
        </div>
        <div className="flex flex-col items-center p-2 md:border-l border-white/50">
          <span className="block font-bold text-gray-900 mb-1">💨 Wind</span>
          <span className="text-lg">{data.wind_speed} km/h</span>
        </div>
        <div className="flex flex-col items-center p-2 md:border-l border-white/50">
          <span className="block font-bold text-gray-900 mb-1">🌅 Sunrise</span>
          <span className="text-lg">{formatTime(data.sunrise)}</span>
        </div>
        <div className="flex flex-col items-center p-2 md:border-l border-white/50">
          <span className="block font-bold text-gray-900 mb-1">🌇 Sunset</span>
          <span className="text-lg">{formatTime(data.sunset)}</span>
        </div>
      </div>
    </div>
  );
}
