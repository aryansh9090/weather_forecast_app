import React from 'react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 text-white z-10 overflow-y-auto max-h-[90vh]"
        style={{ animation: 'modalFadeIn 0.3s ease-out forwards' }}
      >
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-3xl font-bold mb-2">About This App</h2>
            <p className="text-white/80 font-medium">Developer: Aryan Sharma</p>
            <p className="text-white/50 text-sm mt-1">Built as part of Tech Assessment 1 — AI Engineer Intern</p>
          </div>

          {/* PMA Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                PMA
              </div>
              <h3 className="text-2xl font-semibold leading-tight">Product Manager<br/>Accelerator</h3>
            </div>

            <div className="space-y-4 text-white/80 leading-relaxed text-sm md:text-base pt-2">
              <p>
                Product Manager Accelerator (PMA) is the fastest-growing Product Management professional development company in the industry, founded by Dr. Nancy Li — Award-winning AI Director of Product, Forbes-featured leader, and LinkedIn Top Voice.
              </p>
              
              <p>
                PMA helps aspiring and current Product Managers land top-tier PM roles at FAANG companies and unicorn startups — in as little as 60 days, even with no prior experience. Through structured programs, 1:1 coaching, real-world product portfolio building, and a thriving community of 1,500+ professionals, PMA has helped thousands of people transform their careers and earn industry-leading salaries.
              </p>

              <p>
                PMA also runs PMA Kids — a nonprofit offering free AI and Product Management education to teenagers from underserved communities, with a mission to establish 200 schools worldwide and make education accessible to all.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <a 
              href="https://www.linkedin.com/school/pmaccelerator/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full md:w-auto gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Visit PM Accelerator on LinkedIn 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
