import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CameraIcon, LeafIcon, ShieldCheckIcon } from '../components/Icons';

interface JourneyProps {
  profile: UserProfile;
}

const Journey: React.FC<JourneyProps> = ({ profile }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpload = () => {
      setIsUploading(true);
      setTimeout(() => {
          setIsUploading(false);
          setShowSuccess(true);
          // In a real app, we'd update Supabase here
      }, 2000);
  };

  return (
    <div className="space-y-8 pb-24">
        <div className="text-center bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                 <LeafIcon className="w-10 h-10 text-emerald-600" />
             </div>
             <h2 className="text-3xl font-black text-emerald-900 mb-2">Community Forest</h2>
             <p className="text-emerald-700 max-w-md mx-auto leading-relaxed">
                 You have planted <span className="font-bold text-emerald-900">{profile.treesPlanted} trees</span> so far. 
                 Your actions help filter air for everyone.
             </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Plant a Tree</h3>
                <p className="text-slate-500 text-sm mb-6">Upload a photo of a sapling you planted to earn rewards.</p>
                
                {showSuccess ? (
                    <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl animate-bounce-short">
                        <p className="font-bold">Verified! +50 Points</p>
                        <button onClick={() => setShowSuccess(false)} className="text-xs underline mt-2">Plant another</button>
                    </div>
                ) : (
                    <button 
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            'Uploading...'
                        ) : (
                            <>
                                <CameraIcon className="w-5 h-5" /> Upload Photo
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Rewards Card */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Your Rewards</h3>
                    <span className="text-amber-500 font-bold">{profile.points} Pts</span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 opacity-50">
                         <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                         <div>
                             <p className="font-bold text-slate-400 text-sm">Pharmacy Coupon</p>
                             <p className="text-xs text-slate-400">Unlock at 500 pts</p>
                         </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                         <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">🎟️</div>
                         <div>
                             <p className="font-bold text-slate-800 text-sm">Consultation Discount</p>
                             <p className="text-xs text-slate-500">10% off at Apollo</p>
                         </div>
                         <button className="ml-auto text-xs bg-slate-900 text-white px-3 py-1 rounded-lg">Redeem</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Journey;
