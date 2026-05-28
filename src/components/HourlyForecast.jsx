'use client';

import React from 'react';
import { mapWeatherCode } from '../services/weatherService';

export default function HourlyForecast({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className="w-full mt-8">
      <h3 className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>⏰</span> Hourly Forecast (Next 12 Hours)
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2 md:gap-3 w-full">
        {hourlyData.slice(0, 12).map((hour, idx) => {
          const date = new Date(hour.time);
          const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          const { emoji } = mapWeatherCode(hour.weather_code);
          
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center p-2 md:p-3 rounded-2xl w-full transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer"
            >
              <div className="text-xs font-semibold text-white/70 mb-2 whitespace-nowrap">
                {idx === 0 ? 'Now' : timeStr}
              </div>
              <div className="text-2xl mb-1.5 filter drop-shadow-md">{emoji}</div>
              <div className="text-lg font-bold text-white">{hour.temp}°</div>
              {hour.pop > 0 && (
                 <div className="text-[10px] text-blue-300 font-semibold mt-1">
                   💧 {hour.pop}%
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
