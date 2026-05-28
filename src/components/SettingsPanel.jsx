import { useState } from 'react';

export default function SettingsPanel() {
  const [unit, setUnit] = useState('c');
  const [theme, setTheme] = useState('dark');
  const [timeFormat, setTimeFormat] = useState('24h');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 w-full max-w-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
          Settings
        </h2>

        <div className="space-y-6">
          {/* Temperature Unit */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div>
              <p className="font-semibold text-lg">Temperature Unit</p>
              <p className="text-sm text-white/50">Celsius or Fahrenheit</p>
            </div>
            <div className="flex bg-black/40 rounded-xl p-1">
              <button 
                onClick={() => setUnit('c')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${unit === 'c' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
              >
                °C
              </button>
              <button 
                onClick={() => setUnit('f')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${unit === 'f' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div>
              <p className="font-semibold text-lg">Theme</p>
              <p className="text-sm text-white/50">Light or Dark mode</p>
            </div>
            <div className="flex bg-black/40 rounded-xl p-1">
              <button 
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${theme === 'light' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
              >
                ☀️ Light
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          {/* Time Format */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div>
              <p className="font-semibold text-lg">Time Format</p>
              <p className="text-sm text-white/50">12-hour or 24-hour</p>
            </div>
            <div className="flex bg-black/40 rounded-xl p-1">
              <button 
                onClick={() => setTimeFormat('12h')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${timeFormat === '12h' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
              >
                12h AM/PM
              </button>
              <button 
                onClick={() => setTimeFormat('24h')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${timeFormat === '24h' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
              >
                24h
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
