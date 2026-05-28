export default function WeatherSummaryCard({ weatherData }) {
  if (!weatherData) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
      <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-30 text-8xl">☀️</div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-1 opacity-90">{weatherData.name}</h2>
          <p className="text-white/60 text-sm mb-6 uppercase tracking-widest">Today's Summary</p>
          
          <h1 className="text-7xl font-black mb-2 drop-shadow-lg">{Math.round(weatherData.temp)}°</h1>
          <p className="text-xl font-medium capitalize mb-8 opacity-90">{weatherData.description}</p>

          <div className="w-full grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/20 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase font-semibold mb-1">Wind</p>
              <p className="text-lg font-bold">{weatherData.wind_speed} km/h</p>
            </div>
            <div className="bg-black/20 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase font-semibold mb-1">Humidity</p>
              <p className="text-lg font-bold">{weatherData.humidity}%</p>
            </div>
          </div>

          <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors shadow-lg flex justify-center items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Copy / Share
          </button>
        </div>
      </div>
    </div>
  );
}
