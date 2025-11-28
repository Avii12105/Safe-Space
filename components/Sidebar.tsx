import React from 'react';
import { ViewState } from '../types';
import { HeartIcon, ReportIcon, LeafIcon, ShieldCheckIcon, SirenIcon } from './Icons';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: HeartIcon },
    { id: 'reports', label: 'Health Reports', icon: ReportIcon },
    { id: 'journey', label: 'Plant a Tree', icon: LeafIcon },
    { id: 'sos', label: 'Emergency Info', icon: SirenIcon, isAlert: true },
  ];

  return (
    <div className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 z-50 shadow-sm">
      <div className="p-8 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <ShieldCheckIcon className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">SafeSpace</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Preventive Care</p>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        {navItems.map((item) => {
            const isActive = currentView === item.id;
            const isAlert = item.isAlert;
            return (
                <button
                    key={item.id}
                    onClick={() => setView(item.id as ViewState)}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                        isActive 
                        ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200 shadow-sm' 
                        : isAlert 
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                >
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'fill-current' : ''}`} />
                    <span>{item.label}</span>
                </button>
            )
        })}
      </nav>

      <div className="p-6">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Medical Disclaimer</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                  SafeSpace provides environmental data, not medical diagnosis. In emergencies, call 102/108.
              </p>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
