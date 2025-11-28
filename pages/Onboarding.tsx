import React from 'react';
import { CONDITIONS } from '../constants';
import { HealthCondition } from '../types';

interface OnboardingProps {
  onSelectPersona: (condition: HealthCondition) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectPersona }) => {
  return (
     <div className="min-h-screen bg-white p-6 md:p-12 flex flex-col items-center justify-center">
         <div className="max-w-4xl w-full">
             <div className="text-center mb-10">
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Health Profile</h2>
                 <p className="text-slate-500 text-lg">Select the primary condition you want to monitor.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {CONDITIONS.map(c => (
                     <button 
                        key={c.id}
                        onClick={() => onSelectPersona(c.id as HealthCondition)}
                        className={`group relative bg-white rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-2 ${c.color}`}
                     >
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl">{c.icon}</span>
                            <div className={`w-6 h-6 rounded-full border-2 border-current opacity-30 group-hover:bg-current transition-all`}></div>
                         </div>
                         <h3 className="text-xl font-bold text-slate-800 mb-1">{c.label}</h3>
                         <p className="text-slate-600 text-sm font-medium opacity-80">{c.description}</p>
                     </button>
                 ))}
             </div>
             
             <div className="mt-12 text-center">
                 <p className="text-xs text-slate-400">
                    By continuing, you agree to allow SafeSpace to access your approximate location for environmental analysis.
                 </p>
             </div>
         </div>
     </div>
  );
};

export default Onboarding;
