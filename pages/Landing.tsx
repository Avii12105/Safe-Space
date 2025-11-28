import React from 'react';
import { ShieldCheckIcon, ChevronRightIcon, HeartIcon } from '../components/Icons';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative overflow-hidden">
        {/* Calm Background Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>

        <div className="w-full flex flex-col justify-center items-center p-8 z-10 text-center max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-3xl mb-8 border border-slate-100 shadow-xl shadow-teal-500/10 animate-bounce-short">
                <HeartIcon className="w-16 h-16 text-teal-500 fill-teal-100" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 leading-tight mb-6 tracking-tight">
                SafeSpace
            </h1>
            
            <p className="text-slate-600 text-lg md:text-2xl mb-12 max-w-2xl leading-relaxed font-normal">
                A preventive health guardian for your ears and lungs. 
                <br className="hidden md:block"/>Monitor noise, air quality, and stay safe.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-2xl">
                <div className="bg-white/80 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium shadow-sm">
                   👂 Hearing Care
                </div>
                <div className="bg-white/80 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium shadow-sm">
                   🫁 Asthma Support
                </div>
                <div className="bg-white/80 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium shadow-sm">
                   🌱 Plant Trees
                </div>
            </div>
            
            <button 
                onClick={onStart}
                className="group relative bg-slate-900 hover:bg-teal-600 text-white font-bold py-5 px-10 rounded-full text-lg shadow-xl transition-all hover:scale-105"
            >
                <span className="flex items-center gap-3">
                    Start Protection <ChevronRightIcon className="w-5 h-5" />
                </span>
            </button>
            
            <p className="mt-8 text-xs text-slate-400">Trusted by over 10,000 preventive care users.</p>
        </div>
    </div>
  );
};

export default Landing;
