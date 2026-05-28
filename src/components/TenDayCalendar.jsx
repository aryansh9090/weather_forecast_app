export default function TenDayCalendar({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  // Use up to 10 days if available
  const days = forecast.slice(0, 10);

  return (
    <div className="w-full h-full flex flex-col text-white p-4 md:p-8 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        10-Day Forecast
      </h2>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        <div className="grid grid-cols-1 gap-3 w-full">
          {/* Header Row */}
          <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-black/40 rounded-t-xl border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
            <div className="col-span-1">Date</div>
            <div className="text-center">Morning<br/><span className="text-[10px] opacity-70">9 AM - 12 PM</span></div>
            <div className="text-center">Afternoon<br/><span className="text-[10px] opacity-70">12 PM - 5 PM</span></div>
            <div className="text-center">Evening<br/><span className="text-[10px] opacity-70">5 PM - 8 PM</span></div>
            <div className="text-center">Night<br/><span className="text-[10px] opacity-70">8 PM - 12 AM</span></div>
          </div>

          {/* Forecast Rows */}
          {days.map((day, i) => {
            const date = new Date(day.dt);
            const isToday = i === 0;

            return (
              <div key={i} className={`grid grid-cols-5 gap-2 items-center p-3 sm:p-4 rounded-xl border transition-all ${isToday ? 'bg-blue-500/20 border-blue-400/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                {/* Date / Day */}
                <div className="flex flex-col col-span-1">
                  <span className={`font-bold text-lg ${isToday ? 'text-blue-300' : 'text-white'}`}>
                    {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-xs text-white/50">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <div className="flex items-center gap-1 mt-1">
                     <span className="text-lg">
                       {day.description.includes('rain') ? '🌧️' : day.description.includes('cloud') ? '☁️' : '☀️'}
                     </span>
                  </div>
                </div>

                {/* Morning */}
                <div className="flex flex-col items-center justify-center bg-black/20 rounded-lg p-2">
                  <span className="font-bold text-lg">{day.morning}°</span>
                </div>

                {/* Afternoon */}
                <div className="flex flex-col items-center justify-center bg-black/20 rounded-lg p-2">
                  <span className="font-bold text-lg text-orange-300">{day.afternoon}°</span>
                </div>

                {/* Evening */}
                <div className="flex flex-col items-center justify-center bg-black/20 rounded-lg p-2">
                  <span className="font-bold text-lg">{day.evening}°</span>
                </div>

                {/* Night */}
                <div className="flex flex-col items-center justify-center bg-black/20 rounded-lg p-2">
                  <span className="font-bold text-lg text-blue-200">{day.night}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
