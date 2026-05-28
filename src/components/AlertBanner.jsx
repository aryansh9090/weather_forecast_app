'use client';

import React, { useState, useEffect } from 'react';

export default function AlertBanner({ weatherData }) {
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state if location changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(false);
  }, [weatherData?.name]);

  if (!weatherData || dismissed) return null;

  const { raw_code, temp, wind_speed } = weatherData;

  let alertMessage = null;
  let alertBg = 'bg-red-500/90 text-white';

  // Logic for Severe Weather Alerts
  if ([95, 96, 99].includes(raw_code)) {
    alertMessage = "⚠️ Thunderstorm Warning - Stay indoors and avoid travel.";
  } else if (temp > 42) {
    alertMessage = "🌡️ Extreme Heat Alert - High risk of heatstroke. Stay hydrated and in shade.";
  } else if (wind_speed > 60) {
    alertMessage = "💨 High Wind Warning - Secure loose objects and drive carefully.";
    alertBg = "bg-orange-500/90 text-white";
  } else if ([71, 73, 75, 77].includes(raw_code)) {
    alertMessage = "❄️ Snowstorm Alert - Reduced visibility and hazardous roads.";
    alertBg = "bg-blue-600/90 text-white";
  }

  if (!alertMessage) return null;

  return (
    <div className={`w-full ${alertBg} backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-lg z-50 sticky top-0 transition-all duration-300`}>
      <div className="flex-1 text-center font-bold text-sm md:text-base">
        {alertMessage}
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="ml-4 hover:bg-white/20 p-1.5 rounded-full transition-colors flex-shrink-0"
        aria-label="Dismiss alert"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
