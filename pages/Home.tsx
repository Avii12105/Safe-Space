import React, { useState } from 'react';
import { ViewState, EnvData, AiAnalysis, UserProfile } from '../types';
import { WindIcon, Volume2Icon, SparklesIcon, CrossIcon } from '../components/Icons';
import EnvironmentCard from '../components/EnvironmentCard';
import { useTypewriter } from '../hooks/useTypewriter';

interface HomeProps {
  profile: UserProfile;
  envData: EnvData | null;
  analysis: AiAnalysis | null;
  setView: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ profile, envData, analysis, setView }) => {
  const typingMessage = useTypewriter(analysis?.message || '', 20);
  const [showCheckin, setShowCheckin] = useState(true);

  // Layout Logic based on Condition
  const showAqi = profile.condition === 'breathing' || profile.condition === 'both' || profile.condition === 'prevention';
  const showNoise = profile.condition === 'hearing' || profile.condition === 'both' || profile.condition === 'prevention';

  return (
    <div className="space-y-6 pb-20">
        
        {/* Daily Check-in Widget */}
        {showCheckin && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative">
                <button onClick={() => setShowCheckin(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500">
                    <CrossIcon className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Daily Health Check-in</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {['Great 😃', 'Okay 😐', 'Bad 🤧', 'Panic 🆘'].map((mood, i) => (
                        <button key={i} className="flex-shrink-0 px-6 py-3 rounded-2xl bg-slate-50 text-slate-600 font-medium hover:bg-teal-50 hover:text-teal-600 transition-colors border border-transparent hover:border-teal-200">
                            {mood}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* AI Guardian Insight */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-6">
                <div className="hidden md:flex w-16 h-16 rounded-full bg-teal-100 items-center justify-center text-3xl">
                    🩺
                </div>
                <div>
                     <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${
                        analysis?.riskLevel === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-teal-100 text-teal-700'
                    }`}>
                        Current Status: {analysis?.riskLevel || 'Safe'}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{analysis?.headline}</h2>
                    <p className="text-slate-600 text-lg leading-relaxed typing-cursor">{typingMessage}</p>
                </div>
            </div>
        </div>

        {/* Adaptive Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showAqi && (
                <EnvironmentCard 
                    title="Air Quality (AQI)"
                    value={envData?.aqi || 0}
                    unit=""
                    status={envData && envData.aqi > 100 ? 'Poor' : 'Healthy'}
                    colorClass={envData && envData.aqi > 100 ? 'text-orange-500' : 'text-sky-500'}
                    icon={<WindIcon />}
                />
            )}
            {showNoise && (
                <EnvironmentCard 
                    title="Noise Level"
                    value={envData?.noiseDb || 0}
                    unit="dB"
                    status={envData && envData.noiseDb > 70 ? 'Loud' : 'Quiet'}
                    colorClass={envData && envData.noiseDb > 70 ? 'text-indigo-500' : 'text-indigo-400'}
                    icon={<Volume2Icon />}
                />
            )}
        </div>

        {/* Suggestion / Alert Box */}
        {analysis?.riskLevel === 'High' && (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
                 <div className="p-3 bg-white rounded-xl shadow-sm">
                    <CrossIcon className="w-6 h-6 text-rose-500" />
                 </div>
                 <div>
                     <h4 className="font-bold text-rose-700 text-lg">Precaution Recommended</h4>
                     <p className="text-rose-600/80 leading-snug mt-1">
                         Conditions are currently unfavorable for your specific sensitivity. Consider staying indoors or wearing protection.
                     </p>
                 </div>
            </div>
        )}
    </div>
  );
};

export default Home;
