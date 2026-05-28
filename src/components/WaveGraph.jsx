'use client';

import React from 'react';

export default function WaveGraph({ forecast }) {
  if (!forecast || forecast.length < 7) return null;
  const days = forecast.slice(0, 7);

  const temps = days.map(d => d.temp_max);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  // Use percentages for X and arbitrary 0-100 for Y
  const points = temps.map((temp, i) => {
    const x = (i / (days.length - 1)) * 100;
    const normalizedY = (temp - minTemp) / range;
    const y = 100 - (normalizedY * 60) - 20; // 20% to 80% to leave room for text
    return { x, y, temp, day: days[i] };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cp1x = p1.x + (p2.x - p1.x) / 2;
    pathD += ` C ${cp1x} ${p1.y}, ${cp1x} ${p2.y}, ${p2.x} ${p2.y}`;
  }

  const fillPath = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full relative h-full flex flex-col">
      <h3 className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2 shrink-0">
        <span>📈</span> 7-Day Trend
      </h3>
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex-1 flex flex-col justify-between overflow-hidden relative">
        <div className="relative w-full h-[90px] mt-4 mb-2">
          {/* SVG for lines and gradient */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
              </linearGradient>
            </defs>
            <path d={fillPath} fill="url(#waveFill)" />
            <path d={pathD} fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
          </svg>

          {/* HTML overlays for dots and text so they don't stretch */}
          {points.map((p, i) => (
            <div 
              key={i}
              className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="text-white font-bold text-xs md:text-sm drop-shadow-md mb-1">{p.temp}°</span>
              <div className="w-2 h-2 rounded-full bg-white border-2 border-white/50 shadow-sm" />
            </div>
          ))}
        </div>
        
        {/* Day labels below */}
        <div className="flex justify-between w-full text-[10px] md:text-xs text-white/60 font-medium px-1 mt-2">
          {days.map((d, i) => (
            <span key={i} className="text-center w-8">
              {i === 0 ? 'Today' : new Date(d.dt).toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
