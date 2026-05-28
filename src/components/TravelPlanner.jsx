import { useState } from 'react';
import { fetchWeatherData } from '../services/weatherService';

export default function TravelPlanner({ weatherData }) {
  const [query, setQuery] = useState('');
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const { weather } = await fetchWeatherData(query);
      setDestination(weather);
      setQuery('');
    } catch (err) {
      setError(err.message || 'City not found.');
    } finally {
      setLoading(false);
    }
  };

  const getPackingAdvice = () => {
    if (!weatherData || !destination) return "Enter a destination to receive tailored clothing and packing recommendations based on the weather difference.";
    const diff = destination.temp - weatherData.temp;
    let advice = `It's about ${Math.abs(diff)}°C ${diff > 0 ? 'warmer' : 'colder'} in ${destination.name}. `;
    if (diff > 5) advice += "Pack lighter clothing and sunglasses.";
    else if (diff < -5) advice += "Make sure to bring extra layers or a jacket.";
    else advice += "The temperature is quite similar, so pack your usual outfits.";
    
    if (destination.condition.toLowerCase().includes('rain')) {
      advice += " Don't forget an umbrella or raincoat!";
    }
    return advice;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 overflow-y-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 w-full max-w-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Travel Planner</h2>
            <p className="text-white/60 text-sm">Compare origin and destination weather & get packing tips</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Destination City..." 
            className="flex-1 bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400" 
            disabled={loading}
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg" disabled={loading}>
            {loading ? 'Searching...' : 'Plan Trip'}
          </button>
        </form>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-6 mb-8 mt-4">
          <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4 font-semibold">Origin</h3>
            <p className="text-xl font-bold mb-2">{weatherData?.name || 'Current City'}</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black">{weatherData ? Math.round(weatherData.temp) : '--'}°C</span>
              <span className="text-2xl">{weatherData?.emoji}</span>
            </div>
            <p className="text-white/70 capitalize mt-2 text-sm">{weatherData?.description || ''}</p>
          </div>
          
          <div className={`p-6 rounded-2xl border ${destination ? 'bg-black/20 border-white/10' : 'bg-black/10 border-white/10 border-dashed flex items-center justify-center'}`}>
            {!destination ? (
              <span className="text-white/30 font-medium">Destination Weather</span>
            ) : (
              <>
                <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4 font-semibold">Destination</h3>
                <p className="text-xl font-bold mb-2">{destination.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black">{Math.round(destination.temp)}°C</span>
                  <span className="text-2xl">{destination.emoji}</span>
                </div>
                <p className="text-white/70 capitalize mt-2 text-sm">{destination.description}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="font-semibold mb-2">Packing Advice</h3>
          <p className="text-white/70 text-sm leading-relaxed">{getPackingAdvice()}</p>
        </div>
      </div>
    </div>
  );
}
