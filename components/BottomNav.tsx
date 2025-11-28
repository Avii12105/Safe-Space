import React from 'react';
import { ViewState } from '../types';
import { HeartIcon, ReportIcon, LeafIcon, SirenIcon } from './Icons';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  // Hide nav on onboarding or loading
  if (currentView === 'onboarding' || currentView === 'loading' || currentView === 'landing') return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: HeartIcon },
    { id: 'reports', label: 'Reports', icon: ReportIcon },
    { id: 'journey', label: 'Trees', icon: LeafIcon },
    { id: 'sos', label: 'SOS', icon: SirenIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-safe">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
                <button
                    key={item.id}
                    onClick={() => setView(item.id as ViewState)}
                    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
                        isActive ? 'text-teal-600 -translate-y-1' : 'text-slate-400 hover:text-teal-500'
                    }`}
                >
                    <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                </button>
            )
        })}
      </div>
    </div>
  );
};

export default BottomNav;
