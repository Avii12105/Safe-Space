import React from 'react';
import { NarrativeForecast } from '../types';
import { SunIcon, CloudIcon, MoonIcon } from '../components/Icons';

interface GuardianProps {
  narrativeForecast: NarrativeForecast[];
}

const Guardian: React.FC<GuardianProps> = ({ narrativeForecast }) => {
  return (
    <div>
        <div className="mb-8">
            <h2 className="text-4xl font-black text-slate-900 mb-2">Future Forecast</h2>
            <p className="text-slate-500 text-lg">Your guardian's narrative prediction for the day.</p>
        </div>

        <div className="grid gap-6">
            {narrativeForecast.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
                    <p className="animate-pulse text-slate-400">Consulting future models...</p>
                </div>
            ) : (
                narrativeForecast.map((item, idx) => (
                    <div key={idx} className="group relative pl-8 pb-8 border-l-2 border-slate-200 last:border-0 hover:border-emerald-300 transition-colors">
                        <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-white z-10 group-hover:scale-110 transition-transform`}>
                            {item.icon === 'sun' && <SunIcon className="w-4 h-4 text-orange-400" />}
                            {item.icon === 'cloud' && <CloudIcon className="w-4 h-4 text-slate-400" />}
                            {item.icon === 'moon' && <MoonIcon className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group-hover:shadow-lg transition-all group-hover:-translate-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{item.period}</span>
                            <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
                                {item.prediction}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default Guardian;