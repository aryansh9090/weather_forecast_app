'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

/* ─── helpers ──────────────────────────────────────────────────────────────── */

/** ratio 0→1 across the day; clamped to [0,1] */
const getSunRatio = (now, sunrise, sunset) => {
  if (!sunrise || !sunset) return 0.5;
  return Math.max(0, Math.min(1, (now - sunrise) / (sunset - sunrise)));
};

/** sky colour bucket based on ratio */
const getSkyPhase = (ratio) => {
  if (ratio < 0.08) return 'dawn';
  if (ratio < 0.18) return 'goldenMorning';
  if (ratio < 0.82) return 'day';
  if (ratio < 0.92) return 'goldenEvening';
  return 'dusk';
};

const SKY_GRADIENTS = {
  dawn:          'linear-gradient(to bottom, #1a1a4e 0%, #c0392b 40%, #e67e22 70%, #f39c12 100%)',
  goldenMorning: 'linear-gradient(to bottom, #1a6fa8 0%, #f39c12 50%, #e67e22 100%)',
  day:           'linear-gradient(to bottom, #0d47a1 0%, #1976d2 40%, #42a5f5 100%)',
  goldenEvening: 'linear-gradient(to bottom, #1a6fa8 0%, #e67e22 50%, #c0392b 100%)',
  dusk:          'linear-gradient(to bottom, #1a1a4e 0%, #8e24aa 40%, #c0392b 70%, #e67e22 100%)',
  night:         'linear-gradient(to bottom, #020818 0%, #0a1628 40%, #0d2137 100%)',
};

/* deterministic star field – same stars every render */
const STARS = Array.from({ length: 120 }, (_, i) => {
  const seed = i * 137.508; // golden-angle pseudo-random
  return {
    id: i,
    x: ((Math.sin(seed) * 0.5 + 0.5) * 100).toFixed(2),
    y: ((Math.cos(seed * 1.3) * 0.5 + 0.5) * 75).toFixed(2),
    size: (1 + (i % 3)).toFixed(1),
    delay: ((i % 30) * 0.2).toFixed(1),
    duration: (2 + (i % 4)).toFixed(1),
  };
});

/* ─── component ────────────────────────────────────────────────────────────── */

export default function SkyAnimation({ sunrise, sunset }) {
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const isDay = now >= sunrise && now < sunset;
  const ratio = isDay ? getSunRatio(now, sunrise, sunset) : 0;
  const phase = isDay ? getSkyPhase(ratio) : 'night';
  const gradient = SKY_GRADIENTS[phase];

  /* sun arc: x goes 5%→95%, y follows sin curve (higher = further from bottom) */
  const sunX = 5 + ratio * 90;              // %  left → right
  const sunY = 80 - Math.sin(ratio * Math.PI) * 68; // % from top (80 at edges, 12 at noon)

  /* moon position (fixed, upper-right area) */
  const moonX = 78;
  const moonY = 12;

  return (
    <>
      {/* Sky gradient layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: gradient,
          transition: 'background 4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Stars (night only) */}
      {!isDay && (
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
        >
          {STARS.map((s) => (
            <span
              key={s.id}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderRadius: '50%',
                background: '#fff',
                opacity: 0.85,
                animation: `twinkle ${s.duration}s ${s.delay}s infinite ease-in-out alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun (day only) */}
      {isDay && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: `${sunX}%`,
            top: `${sunY}%`,
            zIndex: 1,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: 'left 60s linear, top 60s linear',
          }}
        >
          {/* outer glow */}
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,245,150,0.6) 0%, transparent 70%)',
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%) scale(2.2)',
            animation: 'sunPulse 3s ease-in-out infinite',
          }} />
          {/* sun body */}
          <div style={{
            width: 52, height: 52,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #fff9c4, #fdd835 45%, #f57f17)',
            boxShadow: '0 0 30px 10px rgba(253,216,53,0.7), 0 0 60px 20px rgba(255,152,0,0.35)',
            animation: 'sunRotate 20s linear infinite',
            position: 'relative',
          }}>
            {/* sun rays */}
            {[0,45,90,135].map((deg) => (
              <div key={deg} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 6, height: 22,
                background: 'rgba(255,238,88,0.8)',
                borderRadius: 3,
                transformOrigin: '50% 150%',
                transform: `translate(-50%, -150%) rotate(${deg}deg)`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Moon (night only) */}
      {!isDay && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: `${moonX}%`,
            top: `${moonY}%`,
            zIndex: 1,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            animation: 'moonFloat 6s ease-in-out infinite',
          }}
        >
          {/* crescent: two overlapping circles */}
          <div style={{ position: 'relative', width: 54, height: 54 }}>
            {/* moon body */}
            <div style={{
              width: 54, height: 54,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 32%, #fffde7, #fff9c4 50%, #f0e68c)',
              boxShadow: '0 0 25px 8px rgba(255,249,196,0.5)',
            }} />
            {/* crescent mask */}
            <div style={{
              position: 'absolute',
              top: -4, right: -4,
              width: 50, height: 50,
              borderRadius: '50%',
              background: 'inherit', /* will pick up sky colour behind — approximate with overlay */
              backgroundColor: 'transparent',
              boxShadow: 'inset -14px -4px 0 4px #0a1628',
            }} />
          </div>
          {/* moon glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,249,196,0.18) 0%, transparent 70%)',
            transform: 'translate(-50%,-50%)',
          }} />
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.8); }
          to   { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes sunPulse {
          0%,100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0.55; }
          50%      { transform: translate(-50%,-50%) scale(2.7); opacity: 0.75; }
        }
        @keyframes sunRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes moonFloat {
          0%,100% { transform: translate(-50%,-50%) translateY(0px); }
          50%     { transform: translate(-50%,-50%) translateY(-10px); }
        }
      `}</style>
    </>
  );
}
