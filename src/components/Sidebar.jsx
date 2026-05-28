'use client';

import React, { useState, useEffect } from 'react';

// Collapsible Section Component
function CollapsibleSection({ title, icon, defaultOpen = true, children, isNight }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const borderColor = 'border-white/10';
  const headerHover = 'hover:bg-white/10';

  return (
    <div className={`border-b ${borderColor} overflow-hidden`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 ${headerHover} transition-colors outline-none`}
      >
        <div className="flex items-center gap-2 font-semibold">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <svg 
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out px-4 ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

// Logic Functions

function getClothingSuggestions(temp, wind, pop) {
  const tips = [];
  if (temp > 30) {
    tips.push("Wear light, breathable cotton clothing.");
    tips.push("Avoid dark colors to stay cooler under the sun.");
  } else if (temp > 20) {
    tips.push("T-shirt and shorts/jeans are perfect for today.");
  } else if (temp > 10) {
    tips.push("A light jacket or sweater is recommended.");
  } else {
    tips.push("Wear heavy winter clothing, gloves, and a beanie.");
    tips.push("Thermal layers are highly recommended.");
  }

  if (wind > 20) tips.push(`Carry a windbreaker, winds are strong at ${wind} km/h.`);
  if (pop > 30) tips.push("Take an umbrella or raincoat just in case!");
  
  return tips;
}

function getTravelTips(condition, uvi, pop) {
  const tips = [];
  if (pop > 60) {
    tips.push("High chance of rain. Great day for indoor museums or cafes.");
    tips.push("If driving, keep extra distance due to wet roads.");
  } else if (condition.includes("Snow")) {
    tips.push("Roads may be icy. Check transit schedules before leaving.");
  } else {
    tips.push("Perfect day for a road trip or walking around the city!");
    tips.push("Avoid heavy traffic hours to enjoy the clear weather.");
  }

  if (uvi > 7) {
    tips.push(`UV Index is very high (${uvi}). Apply sunscreen and wear sunglasses.`);
  }

  return tips;
}

// Removed hardcoded getNearbySpots

function getBestTimeToGoOut(hourly) {
  if (!hourly || hourly.length === 0) return "Not enough data available.";
  
  // Filter for daytime hours (7 AM to 6 PM) to ensure realistic visiting times
  const daytimeHours = hourly.filter(hour => {
    const h = new Date(hour.time).getHours();
    return h >= 7 && h <= 18;
  });

  // If for some reason we only have night hours left in the next 24h, fallback to whatever is available
  const validHours = daytimeHours.length > 0 ? daytimeHours : hourly;

  // Scoring system: lower score is better
  let bestHour = validHours[0];
  let bestScore = Infinity;

  validHours.forEach(hour => {
    const tempDiff = Math.abs(22 - hour.temp);
    const popScore = hour.pop * 3; // Heavily penalize rain
    const uviScore = hour.uvi * 1.5; // Penalize UV slightly
    
    const score = tempDiff + popScore + uviScore;
    if (score < bestScore) {
      bestScore = score;
      bestHour = hour;
    }
  });

  const timeStr = new Date(bestHour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endStr = new Date(bestHour.time + 2 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `Best time to go out is around ${timeStr} - ${endStr}.`;
}

function getAqiInfo(aqi) {
  if (!aqi) return { text: "Data unavailable", color: "text-gray-400", bg: "bg-white/10", tips: [] };
  
  if (aqi <= 50) return { 
    text: `AQI ${aqi} - Good`, color: "text-emerald-300", bg: "bg-emerald-500/20 border border-emerald-400/30",
    tips: ["Air quality is satisfactory.", "Enjoy outdoor activities!"]
  };
  if (aqi <= 100) return {
    text: `AQI ${aqi} - Moderate`, color: "text-yellow-300", bg: "bg-yellow-500/20 border border-yellow-400/30",
    tips: ["Acceptable air quality.", "Unusually sensitive people should consider reducing prolonged outdoor exertion."]
  };
  if (aqi <= 150) return {
    text: `AQI ${aqi} - Unhealthy for Sensitive Groups`, color: "text-orange-300", bg: "bg-orange-500/20 border border-orange-400/30",
    tips: ["Children, older adults, and people with lung disease should reduce outdoor exertion."]
  };
  
  return {
    text: `AQI ${aqi} - Unhealthy`, color: "text-red-300", bg: "bg-red-500/20 border border-red-400/30",
    tips: ["Avoid prolonged outdoor exertion.", "Keep windows closed if possible."]
  };
}

export default function Sidebar({ isOpen, onClose, weatherData, isNight }) {
  const [realSpots, setRealSpots] = useState([]);
  const [loadingSpots, setLoadingSpots] = useState(false);

  useEffect(() => {
    if (!weatherData) return;
    
    let isMounted = true;
    const fetchSpots = async () => {
      setLoadingSpots(true);
      try {
        const { lat, lon, condition } = weatherData;
        let kinds = 'interesting_places';
        
        if (condition.includes('Rain') || condition.includes('Thunderstorm')) {
          kinds = 'museums,cultural,religion';
        } else if (condition.includes('Snow')) {
          kinds = 'winter_sports,museums';
        } else {
          kinds = 'natural,architecture,amusement_parks';
        }

        const apiKey = '5ae2e3f221c38a28845f05b60fd7c8f96e4e56f7f9c8f7b4df0e3b4c';
        const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=20000&lon=${lon}&lat=${lat}&kinds=${kinds}&rate=2&limit=5&format=json&apikey=${apiKey}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        if (isMounted) {
          if (data && data.length > 0) {
            setRealSpots(data.map(p => p.name).filter(n => n));
          } else {
            setRealSpots(["City Center / Downtown", "Local Restaurants", "Nearby Parks", "Shopping District"]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setRealSpots(["City Center / Downtown", "Local Restaurants", "Nearby Parks", "Shopping District"]);
        }
      } finally {
        if (isMounted) setLoadingSpots(false);
      }
    };
    
    fetchSpots();
    
    return () => { isMounted = false; };
  }, [weatherData]);

  if (!weatherData) return null;

  const bgStyle = "bg-black/40 text-white border-l border-white/10";
    
  const clothingTips = getClothingSuggestions(weatherData.temp, weatherData.wind_speed, weatherData.hourly?.[0]?.pop || 0);
  const travelTips = getTravelTips(weatherData.condition, weatherData.uvi, weatherData.hourly?.[0]?.pop || 0);
  const bestTime = getBestTimeToGoOut(weatherData.hourly);
  const aqiInfo = getAqiInfo(weatherData.aqi);

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-80 lg:w-96 backdrop-blur-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl overflow-y-auto custom-scrollbar ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${bgStyle}`}
      >
        <div className="sticky top-0 p-4 flex items-center justify-between border-b z-10 backdrop-blur-xl border-white/10 bg-black/50">
          <h2 className="font-bold text-lg flex items-center gap-2">
            ✨ AI Insights
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full transition-colors hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col pb-8">
          
          <CollapsibleSection title="Clothing Suggestions" icon="👕" isNight={isNight}>
            <ul className="space-y-2 text-sm opacity-90 list-disc pl-4 mt-2">
              {clothingTips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Travel Tips" icon="✈️" isNight={isNight}>
            <ul className="space-y-2 text-sm opacity-90 list-disc pl-4 mt-2">
              {travelTips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Best Time To Go Out" icon="⏰" isNight={isNight}>
            <div className="mt-2 p-4 rounded-xl text-center shadow-inner bg-white/5">
              <div className="text-3xl mb-2">🌅</div>
              <p className="text-sm font-semibold opacity-90">
                {bestTime}
              </p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Air Quality Index" icon="🌫️" isNight={isNight}>
            <div className={`mt-2 p-3 rounded-lg mb-3 font-bold text-center ${aqiInfo.bg} ${aqiInfo.color}`}>
              {aqiInfo.text}
            </div>
            <ul className="space-y-2 text-sm opacity-90 list-disc pl-4">
              {aqiInfo.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Best Nearby Spots" icon="📍" isNight={isNight} defaultOpen={false}>
            <ul className="space-y-3 text-sm opacity-90 mt-2">
              {loadingSpots ? (
                <li className="text-center opacity-50 py-2">Discovering real places...</li>
              ) : realSpots.length > 0 ? (
                realSpots.map((spot, i) => (
                  <li key={i} className="p-3 rounded-xl shadow-sm bg-white/5 border border-white/10">✨ {spot}</li>
                ))
              ) : (
                <li className="text-center opacity-50 py-2">No specific places found.</li>
              )}
            </ul>
          </CollapsibleSection>

        </div>
      </div>
    </>
  );
}
