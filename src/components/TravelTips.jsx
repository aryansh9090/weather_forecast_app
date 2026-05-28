import React from 'react';

export default function TravelTips({ weatherData }) {
  if (!weatherData) return null;

  const generateTips = () => {
    const tips = [];
    const condition = weatherData.condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm')) {
      tips.push("Bring an umbrella and a waterproof jacket! Expect wet conditions.");
      tips.push("Indoor activities like museums or galleries are highly recommended today.");
    } else if (condition.includes('snow')) {
      tips.push("Bundle up! Wear thermal layers, a warm coat, and snow boots.");
      tips.push("Watch out for slippery roads and sidewalks if you're walking around.");
    } else if (condition.includes('clear')) {
      tips.push("Great weather for outdoor sightseeing! Take advantage of the clear skies.");
      if (weatherData.uvi >= 6) {
        tips.push(`High UV Index (${weatherData.uvi}). Don't forget your sunscreen, sunglasses, and a hat.`);
      }
    } else if (condition.includes('cloud')) {
      tips.push("Cloudy day ahead. Good weather for walking around without the harsh sun.");
    }

    if (weatherData.temp > 30) {
      tips.push(`It's very hot (${weatherData.temp}°C). Stay hydrated and seek shade during peak hours.`);
    } else if (weatherData.temp < 5) {
      tips.push(`It's quite cold (${weatherData.temp}°C). Make sure to layer up properly!`);
    }

    if (weatherData.wind_speed > 10) {
      tips.push("It's quite windy today. Hold on to your hats and avoid coastal cliffs.");
    }

    if (tips.length === 0) {
      tips.push("Weather looks generally okay! Enjoy your travel day.");
    }

    return tips;
  };

  const tips = generateTips();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-2xl mx-auto h-full border border-white/40">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
        <span className="mr-2">🧳</span> Travel Tips
      </h3>
      <ul className="space-y-4 text-gray-700">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start bg-blue-50/50 p-3 rounded-lg">
            <span className="text-blue-500 mr-3 text-lg">💡</span>
            <p className="font-medium">{tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
