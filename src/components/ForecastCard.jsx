import React from 'react';
import { formatDate } from '../utils/helpers';

export default function ForecastCard({ forecast }) {
  if (!forecast) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 text-center shadow-md w-40 flex-shrink-0 border border-white/30 hover:scale-105 transition-transform duration-300">
      <p className="font-bold text-gray-800 text-sm">{formatDate(forecast.dt)}</p>
      <div className="my-3 text-5xl flex justify-center">
        {forecast.emoji}
      </div>
      <div className="flex justify-center items-center gap-2 mb-1">
        <span className="text-xl font-black text-red-600">{forecast.temp_max}°</span>
        <span className="text-lg font-bold text-blue-600">{forecast.temp_min}°</span>
      </div>
      <p className="text-xs text-gray-600 font-medium">
        {forecast.precipitation > 0 ? `Rain: ${forecast.precipitation}mm` : 'No rain'}
      </p>
      <p className="text-xs text-gray-500 capitalize mt-1">{forecast.condition}</p>
    </div>
  );
}
