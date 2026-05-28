import { useState } from 'react';
import { fetchWeatherData } from '../services/weatherService';
import LoadingSpinner from './LoadingSpinner';

export default function CompareCities({ weatherData }) {
  const [cities, setCities] = useState(weatherData ? [weatherData] : []);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || cities.length >= 3) return;
    
    setLoading(true);
    setError('');
    try {
      const { weather } = await fetchWeatherData(query);
      // prevent duplicates
      if (!cities.some(c => c.name === weather.name)) {
        setCities([...cities, weather]);
      }
      setQuery('');
    } catch (err) {
      setError(err.message || 'City not found.');
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (index) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-white p-8 overflow-y-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 w-full max-w-5xl text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Compare Cities</h2>
        <p className="text-white/70 mb-6">Select up to 3 cities to compare their weather side-by-side.</p>
        
        {cities.length < 3 && (
          <form onSubmit={handleSearch} className="flex justify-center mb-8 relative max-w-md mx-auto">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city to add..." 
              className="w-full bg-black/30 border border-white/20 rounded-full px-6 py-3 text-white focus:outline-none focus:border-blue-400" 
              disabled={loading}
            />
            <button type="submit" className="absolute right-2 top-1.5 bg-blue-500 hover:bg-blue-600 rounded-full px-4 py-1.5 font-bold transition-colors shadow-lg" disabled={loading}>
              {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></span> : 'Add'}
            </button>
          </form>
        )}
        
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="mt-4 flex flex-col md:flex-row gap-4 justify-center">
          {cities.map((city, i) => (
            <div key={i} className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/10 flex flex-col relative group">
              <button 
                onClick={() => removeCity(i)}
                className="absolute top-3 right-3 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
              <p className="text-white/50 text-sm mb-4">{city.country}</p>
              
              <div className="text-6xl mb-2">{city.emoji}</div>
              <p className="text-5xl font-black mb-1">{Math.round(city.temp)}°</p>
              <p className="text-lg text-white/80 capitalize mb-6">{city.description}</p>
              
              <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/5 p-2 rounded-xl">
                  <p className="text-white/50">Feels</p>
                  <p className="font-bold">{Math.round(city.feels_like)}°</p>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <p className="text-white/50">Wind</p>
                  <p className="font-bold">{city.wind_speed} km/h</p>
                </div>
              </div>
            </div>
          ))}
          
          {Array.from({ length: Math.max(0, 3 - cities.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/10 min-h-[300px] flex items-center justify-center border-dashed">
              <span className="text-white/40 font-medium">Available Slot</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
