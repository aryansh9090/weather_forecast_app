export default function Navbar({ onToggleSidebar }) {
  return (
    <nav className="w-full bg-blue-600 p-4 text-white shadow-md relative z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Weather Travel Assistant</h1>
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
        >
          <span className="hidden sm:inline font-semibold">Insights</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
