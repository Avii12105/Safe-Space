import React from 'react';
import { ViewState, EnvData } from '../types';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { SirenIcon } from '../components/Icons';

interface MainLayoutProps {
  children: React.ReactNode;
  view: ViewState;
  setView: (view: ViewState) => void;
  envData: EnvData | null;
  showConfetti: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, view, setView, envData, showConfetti }) => {
    
  if (view === 'sos') {
      return (
          <div className="min-h-screen bg-rose-50 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <SirenIcon className="w-12 h-12 text-rose-600" />
              </div>
              <h1 className="text-4xl font-black text-rose-700 mb-4">EMERGENCY SOS</h1>
              <p className="text-xl text-rose-800 max-w-md mb-8">
                  If you are experiencing severe breathing difficulty or chest pain, call for an ambulance immediately.
              </p>
              
              <div className="space-y-4 w-full max-w-sm">
                  <a href="tel:102" className="block w-full bg-rose-600 text-white font-bold py-6 rounded-2xl text-2xl shadow-xl hover:bg-rose-700">
                      Call Ambulance (102)
                  </a>
                  <button onClick={() => setView('home')} className="block w-full bg-white text-slate-500 font-bold py-4 rounded-2xl border border-slate-200">
                      Return to Dashboard
                  </button>
              </div>
          </div>
      )
  }

  return (
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
          <Sidebar currentView={view} setView={setView} />
          <div className="flex-1 flex flex-col h-full overflow-y-auto md:ml-72 w-full relative pb-24 md:pb-8">
              {/* Desktop Header */}
              <header className="hidden md:flex justify-between items-center px-8 py-6 bg-white border-b border-slate-100 sticky top-0 z-40">
                  <h2 className="text-lg font-bold text-slate-800">
                      {view === 'home' && 'Dashboard'}
                      {view === 'reports' && 'Monthly Analysis'}
                      {view === 'journey' && 'Sustainability Impact'}
                  </h2>
                  <div className="flex items-center gap-4">
                       {/* Location Badge */}
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                          <p className="text-xs font-bold text-slate-600">{envData?.locationName || 'Locating...'}</p>
                      </div>
                  </div>
              </header>
              <main className="flex-1 p-4 md:px-8 max-w-5xl mx-auto w-full pt-6">
                  {children}
              </main>
              {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <div className="absolute w-full h-full animate-confetti bg-transparent"></div> 
                </div>
              )}
          </div>
          <BottomNav currentView={view} setView={setView} />
      </div>
  );
};

export default MainLayout;
