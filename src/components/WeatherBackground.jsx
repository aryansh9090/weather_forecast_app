'use client';

import React, { useMemo } from 'react';

// Deterministic pseudo-random to avoid SSR/CSR mismatch
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function WeatherBackground({ condition, isDay, children }) {
  const cond = condition.toLowerCase();
  let type = 'clear';
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunderstorm')) {
    type = 'rain';
  } else if (cond.includes('snow') || cond.includes('ice') || cond.includes('freezing')) {
    type = 'snow';
  } else if (cond === 'partlycloudy') {
    type = 'partlycloudy';
  } else if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog')) {
    type = 'clouds';
  }

  // Full-screen immersive gradients based on weather + time
  const getBackgroundGradient = () => {
    if (!isDay) {
      if (type === 'rain') return 'from-gray-900 via-slate-800 to-gray-950';
      if (type === 'snow') return 'from-slate-700 via-slate-800 to-gray-950';
      if (type === 'clouds') return 'from-slate-800 via-indigo-900 to-black';
      return 'from-indigo-950 via-slate-900 to-black'; // Clear night
    }
    // Day time
    if (type === 'rain') return 'from-slate-500 via-slate-600 to-slate-700';
    if (type === 'clouds') return 'from-gray-400 via-slate-400 to-gray-500';
    if (type === 'snow') return 'from-blue-200 via-slate-300 to-slate-400';
    if (type === 'partlycloudy') return 'from-sky-400 via-blue-400 to-cyan-300';
    return 'from-sky-400 via-blue-300 to-cyan-200'; // Sunny/Clear day — bright!
  };

  // Deterministic rain/snow particles
  const rainDrops = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 80 }, (_, i) => ({
      left: (rng() * 100).toFixed(1),
      topOffset: (rng() * 30 + 10).toFixed(1),
      height: (rng() * 18 + 12).toFixed(1),
      duration: (rng() * 0.4 + 0.3).toFixed(2),
      delay: (rng() * 1.5).toFixed(2),
    }));
  }, []);

  const snowFlakes = useMemo(() => {
    const rng = seededRandom(99);
    return Array.from({ length: 80 }, (_, i) => ({
      left: (rng() * 100).toFixed(1),
      topOffset: (rng() * 20 + 5).toFixed(1),
      size: (rng() * 5 + 3).toFixed(1),
      duration: (rng() * 5 + 3).toFixed(1),
      delay: (rng() * 5).toFixed(1),
      blur: (rng() * 2).toFixed(1),
      opacity: (rng() * 0.6 + 0.3).toFixed(2),
    }));
  }, []);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-sans text-white bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-[2000ms] ease-in-out`}>
      
      {/* ═══ Weather Animations Layer ═══ */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        
        {/* ── SUNNY / CLEAR DAY ── */}
        {(type === 'clear' || type === 'partlycloudy') && isDay && (
          <>
            {/* Full-screen warm sun glare from top-right */}
            <div className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vh] rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(253,224,71,0.6) 0%, rgba(251,191,36,0.2) 30%, transparent 70%)' }} />
            
            {/* Secondary warm wash from top-left */}
            <div className="absolute -top-[10%] -left-[20%] w-[60vw] h-[50vh] rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(253,186,116,0.5) 0%, transparent 70%)' }} />
            
            {/* The Sun — bright, pulsing with rays */}
            <div className="absolute top-8 right-16 md:right-36 lg:right-56">
              {/* Outer glow */}
              <div className="w-72 h-72 bg-yellow-300/30 rounded-full blur-[100px] animate-[sunPulse_6s_ease-in-out_infinite]" />
              {/* Sun body */}
              <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-br from-white via-yellow-200 to-amber-400 rounded-full shadow-[0_0_80px_20px_rgba(253,224,71,0.8)] animate-[spin_40s_linear_infinite]">
                {/* Sun rays that rotate */}
                <div className="absolute w-52 h-2.5 bg-yellow-200/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[2px]" />
                <div className="absolute w-52 h-2.5 bg-yellow-200/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 blur-[2px]" />
                <div className="absolute w-52 h-2.5 bg-yellow-200/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 blur-[2px]" />
                <div className="absolute w-52 h-2.5 bg-yellow-200/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[135deg] blur-[2px]" />
              </div>
            </div>

            {/* ── Realistic drifting clouds ── */}
            {/* Cloud 1: large, slow, high */}
            <div className="absolute top-[8%] animate-[driftCloud_50s_linear_infinite]" style={{ left: '-25%' }}>
              <div className="relative">
                <div className="absolute w-44 h-16 bg-white/25 rounded-full blur-xl" />
                <div className="absolute -top-4 left-10 w-24 h-20 bg-white/30 rounded-full blur-lg" />
                <div className="absolute -top-2 left-28 w-20 h-14 bg-white/20 rounded-full blur-xl" />
              </div>
            </div>
            {/* Cloud 2: medium, mid-speed */}
            <div className="absolute top-[22%] animate-[driftCloud_35s_linear_infinite]" style={{ left: '-20%', animationDelay: '12s' }}>
              <div className="relative">
                <div className="absolute w-36 h-12 bg-white/20 rounded-full blur-lg" />
                <div className="absolute -top-3 left-8 w-20 h-16 bg-white/25 rounded-full blur-lg" />
              </div>
            </div>
            {/* Cloud 3: small, fast, lower */}
            <div className="absolute top-[35%] animate-[driftCloud_28s_linear_infinite]" style={{ left: '-15%', animationDelay: '22s' }}>
              <div className="relative">
                <div className="absolute w-28 h-10 bg-white/15 rounded-full blur-lg" />
                <div className="absolute -top-2 left-6 w-16 h-12 bg-white/20 rounded-full blur-md" />
              </div>
            </div>
            {/* Cloud 4: wispy, very slow, high */}
            <div className="absolute top-[5%] animate-[driftCloud_65s_linear_infinite]" style={{ left: '-30%', animationDelay: '30s' }}>
              <div className="relative">
                <div className="absolute w-56 h-8 bg-white/10 rounded-full blur-2xl" />
              </div>
            </div>
          </>
        )}

        {/* ── PARTLY CLOUDY — more/thicker clouds ── */}
        {type === 'partlycloudy' && isDay && (
          <>
            <div className="absolute top-[12%] animate-[driftCloud_40s_linear_infinite]" style={{ left: '-30%', animationDelay: '5s' }}>
              <div className="relative">
                <div className="absolute w-64 h-24 bg-white/35 rounded-full blur-2xl" />
                <div className="absolute -top-6 left-16 w-36 h-28 bg-white/40 rounded-full blur-xl" />
                <div className="absolute -top-3 left-40 w-28 h-20 bg-white/30 rounded-full blur-xl" />
              </div>
            </div>
            <div className="absolute top-[30%] animate-[driftCloud_55s_linear_infinite]" style={{ left: '-25%', animationDelay: '18s' }}>
              <div className="relative">
                <div className="absolute w-48 h-20 bg-white/30 rounded-full blur-xl" />
                <div className="absolute -top-4 left-12 w-28 h-24 bg-white/35 rounded-full blur-lg" />
              </div>
            </div>
          </>
        )}

        {/* ── CLEAR NIGHT ── */}
        {type === 'clear' && !isDay && (
          <>
            {/* Stars via dot pattern */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(white 0.8px, transparent 0.8px)', backgroundSize: '35px 35px', backgroundPosition: '17px 17px' }} />
            
            {/* Moon */}
            <div className="absolute top-12 right-28">
              <div className="w-44 h-44 bg-blue-200/20 rounded-full blur-[70px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute top-8 left-8 w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                <div className="absolute top-5 left-7 w-5 h-5 bg-black/10 rounded-full shadow-inner" />
                <div className="absolute top-12 left-14 w-7 h-7 bg-black/10 rounded-full shadow-inner" />
                <div className="absolute top-16 left-5 w-4 h-4 bg-black/10 rounded-full shadow-inner" />
              </div>
            </div>
          </>
        )}

        {/* ── OVERCAST / CLOUDY ── */}
        {type === 'clouds' && (
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
            <div className="absolute top-[-5%] w-[130vw] h-[45vh] bg-white/20 rounded-[100%] blur-[90px] animate-[driftCloud_70s_linear_infinite]" style={{ left: '-40%' }} />
            <div className="absolute top-[15%] w-[110vw] h-[35vh] bg-white/15 rounded-[100%] blur-[70px] animate-[driftCloud_90s_linear_infinite]" style={{ left: '-30%', animationDelay: '15s' }} />
            <div className="absolute top-[5%] w-[90vw] h-[50vh] bg-white/25 rounded-[100%] blur-[100px] animate-[driftCloud_60s_linear_infinite]" style={{ left: '-50%', animationDelay: '30s' }} />
          </div>
        )}

        {/* ── RAIN ── */}
        {type === 'rain' && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
            <div className="absolute inset-0 opacity-50">
              {rainDrops.map((d, i) => (
                <div 
                  key={`rain-${i}`}
                  className="absolute w-[1px] md:w-[2px] bg-gradient-to-b from-transparent via-blue-300/70 to-blue-100/30 animate-[fall_linear_infinite]"
                  style={{
                    left: `${d.left}%`,
                    top: `-${d.topOffset}%`,
                    height: `${d.height}vh`,
                    animationDuration: `${d.duration}s`,
                    animationDelay: `${d.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SNOW ── */}
        {type === 'snow' && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
            <div className="absolute inset-0 opacity-70">
              {snowFlakes.map((f, i) => (
                <div 
                  key={`snow-${i}`}
                  className="absolute bg-white rounded-full animate-[fall_linear_infinite]"
                  style={{
                    left: `${f.left}%`,
                    top: `-${f.topOffset}%`,
                    width: `${f.size}px`,
                    height: `${f.size}px`,
                    animationDuration: `${f.duration}s`,
                    animationDelay: `${f.delay}s`,
                    filter: `blur(${f.blur}px)`,
                    opacity: f.opacity,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Keyframes ═══ */}
      <style jsx>{`
        @keyframes driftCloud {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 40%)); }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1);   opacity: 0.3; }
          50%      { transform: scale(1.15); opacity: 0.45; }
        }
        @keyframes fall {
          0%   { transform: translateY(0) rotate(15deg); opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(120vh) rotate(15deg); opacity: 0; }
        }
      `}</style>

      {/* Bottom gradient to ground the content */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />

      {/* Very subtle dark overlay for text readability on bright skies */}
      <div className="absolute inset-0 bg-black/15 z-[1] pointer-events-none" />

      {/* ═══ Main Content ═══ */}
      <main className="relative z-10 w-full h-screen flex flex-col md:flex-row">
        {children}
      </main>
    </div>
  );
}
