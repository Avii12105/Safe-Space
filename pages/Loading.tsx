import React from 'react';
import { ShieldCheckIcon } from '../components/Icons';

interface LoadingProps {
  text: string;
  progress: number;
}

const Loading: React.FC<LoadingProps> = ({ text, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 relative overflow-hidden text-white">
       <div className="w-full max-w-md text-center relative z-10">
          <div className="mb-10 relative inline-flex items-center justify-center">
             <div className="w-32 h-32 border-4 border-emerald-500/30 rounded-full animate-spin border-t-emerald-400"></div>
             <ShieldCheckIcon className="w-12 h-12 text-emerald-400 absolute" />
          </div>
          <h2 className="text-3xl font-bold mb-4 animate-pulse">{text}</h2>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-8">
            <div style={{ width: `${progress}%` }} className="h-full bg-emerald-400 transition-all duration-500 rounded-full"></div>
          </div>
       </div>
    </div>
  );
};

export default Loading;