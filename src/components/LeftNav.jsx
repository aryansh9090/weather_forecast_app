'use client';

import React from 'react';

const navItems = [
  { id: 'home', title: 'Home', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  { id: 'compare', title: 'Compare Cities', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'summary', title: 'Weather Summary', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'travel', title: 'Travel Planner', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
  { id: 'calendar', title: '10-Day Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'settings', title: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { id: 'alerts', title: 'Alerts & AQI', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
];

export default function LeftNav({ activeTab, setActiveTab, onToggleSidebar, onOpenAbout }) {
  return (
    <nav className="h-full w-20 md:w-24 flex flex-col items-center py-6 bg-black/30 backdrop-blur-md border-r border-white/10 shrink-0 z-20">
      {/* Top Logo */}
      <div className="text-white mb-8" title="Logo">
        <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      </div>

      {/* Nav Icons */}
      <div className="flex flex-col gap-6 w-full items-center">
        {navItems.map((item) => (
          <NavIcon 
            key={item.id} 
            icon={item.icon} 
            active={activeTab === item.id} 
            onClick={() => setActiveTab(item.id)}
            title={item.title}
          />
        ))}
      </div>

      {/* Bottom AI Insights Sidebar Toggle & About Button */}
      <div className="mt-auto flex flex-col gap-4">
        <button 
          onClick={onOpenAbout}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all border shadow-lg bg-transparent border-transparent text-white/50 hover:text-cyan-300 hover:bg-white/10 hover:border-white/20"
          title="About This App"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button 
          onClick={onToggleSidebar}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all border shadow-lg bg-transparent border-transparent text-white/50 hover:text-yellow-300 hover:bg-white/10 hover:border-white/20"
          title="AI Insights"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function NavIcon({ icon, active, onClick, title }) {
  return (
    <div 
      onClick={onClick}
      title={title}
      className={`cursor-pointer transition-all duration-300 w-12 h-12 flex items-center justify-center rounded-xl ${active ? 'bg-white/10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-white/20' : 'text-white/40 hover:text-white/90 hover:bg-white/5 hover:scale-105 border border-transparent'}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
    </div>
  );
}
