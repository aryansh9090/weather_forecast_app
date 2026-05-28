export default function AlertsPanel({ weatherData }) {
  if (!weatherData) return null;

  const getAqiDetails = (aqi) => {
    if (!aqi) return { color: 'green', label: 'Unknown', desc: 'AQI data not available.', bg: 'bg-white/10' };
    if (aqi <= 50) return { color: 'green-400', label: 'Good', desc: 'Air quality is considered satisfactory, and air pollution poses little or no risk.', bg: 'bg-green-500', bgSoft: 'bg-green-500/20', border: 'border-green-500/30' };
    if (aqi <= 100) return { color: 'yellow-400', label: 'Moderate', desc: 'Air quality is acceptable. However, there may be a risk for some people.', bg: 'bg-yellow-500', bgSoft: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    if (aqi <= 150) return { color: 'orange-400', label: 'Unhealthy for Sensitive Groups', desc: 'Members of sensitive groups may experience health effects.', bg: 'bg-orange-500', bgSoft: 'bg-orange-500/20', border: 'border-orange-500/30' };
    if (aqi <= 200) return { color: 'red-400', label: 'Unhealthy', desc: 'Some members of the general public may experience health effects.', bg: 'bg-red-500', bgSoft: 'bg-red-500/20', border: 'border-red-500/30' };
    return { color: 'purple-400', label: 'Very Unhealthy / Hazardous', desc: 'Health warning of emergency conditions. Everyone is more likely to be affected.', bg: 'bg-purple-500', bgSoft: 'bg-purple-500/20', border: 'border-purple-500/30' };
  };

  const getUvDetails = (uvi) => {
    if (uvi === null || uvi === undefined) return { color: 'green-400', label: 'Unknown', desc: 'UV index not available.', bg: 'bg-white/10' };
    if (uvi <= 2) return { color: 'green-400', label: 'Low', desc: 'No protection required. You can safely stay outside.', bg: 'bg-green-500', bgSoft: 'bg-green-500/20', border: 'border-green-500/30' };
    if (uvi <= 5) return { color: 'yellow-400', label: 'Moderate', desc: 'Protection required. Stay in shade near midday when the sun is strongest.', bg: 'bg-yellow-500', bgSoft: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    if (uvi <= 7) return { color: 'orange-400', label: 'High', desc: 'Protection essential. Reduce time in the sun between 10 a.m. and 4 p.m.', bg: 'bg-orange-500', bgSoft: 'bg-orange-500/20', border: 'border-orange-500/30' };
    if (uvi <= 10) return { color: 'red-400', label: 'Very High', desc: 'Extra protection is needed. Be careful outside.', bg: 'bg-red-500', bgSoft: 'bg-red-500/20', border: 'border-red-500/30' };
    return { color: 'purple-400', label: 'Extreme', desc: 'Take all precautions. Unprotected skin can burn in minutes.', bg: 'bg-purple-500', bgSoft: 'bg-purple-500/20', border: 'border-purple-500/30' };
  };

  const aqiInfo = getAqiDetails(weatherData.aqi);
  const uvInfo = getUvDetails(weatherData.uvi);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 w-full max-w-3xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-yellow-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Alerts & AQI
        </h2>

        <div className="space-y-6">
          {/* AQI */}
          {weatherData.aqi ? (
            <div className={`${aqiInfo.bgSoft} border ${aqiInfo.border} p-6 rounded-2xl flex items-start gap-4`}>
              <div className={`${aqiInfo.bg} p-3 rounded-xl`}>
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className={`text-xl font-bold text-${aqiInfo.color} mb-1`}>Air Quality: {aqiInfo.label} ({weatherData.aqi})</h3>
                <p className="text-white/80">{aqiInfo.desc}</p>
                {weatherData.pm25 !== null && <p className="text-sm text-white/50 mt-2">PM2.5: {weatherData.pm25} µg/m³</p>}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
               <p className="text-white/50">AQI data currently unavailable for this location.</p>
            </div>
          )}

          {/* UV Index */}
          <div className={`${uvInfo.bgSoft} border ${uvInfo.border} p-6 rounded-2xl flex items-start gap-4`}>
            <div className={`${uvInfo.bg} p-3 rounded-xl`}>
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <h3 className={`text-xl font-bold text-${uvInfo.color} mb-1`}>UV Index: {uvInfo.label} ({weatherData.uvi})</h3>
              <p className="text-white/80">{uvInfo.desc}</p>
            </div>
          </div>

          {/* Severe Weather */}
          <div className="bg-red-500/20 border border-red-500/30 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-red-500 p-3 rounded-xl">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-1">No Severe Warnings</h3>
              <p className="text-white/80">There are currently no active weather alerts for your selected location.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
