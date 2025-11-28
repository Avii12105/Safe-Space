import React, { useState } from 'react';
import { ViewState } from './types';
import { useProfile } from './hooks/useProfile';
import { useEnvironment } from './hooks/useEnvironment';

import MainLayout from './layout/MainLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Loading from './pages/Loading';
import Home from './pages/Home';
import Reports from './pages/Reports'; // New
import Journey from './pages/Journey';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  
  const { 
    profile, 
    dailyQuests, 
    showConfetti, 
    selectPersona, 
    handleQuestComplete 
  } = useProfile();

  const {
    envData,
    analysis,
    narrativeForecast, // Still keeping for future use or hidden
    loadingText,
    loadingProgress,
    startAnalysis
  } = useEnvironment();

  // Route Handlers
  const handleConditionSelection = (condition: any) => {
    selectPersona(condition); // This actually sets profile.condition now
    setView('loading');
    startAnalysis(
      { ...profile, condition }, 
      true, 
      () => setView('home')
    );
  };

  return (
    <>
      {view === 'landing' && (
        <Landing onStart={() => setView('onboarding')} />
      )}
      
      {view === 'onboarding' && (
        <Onboarding onSelectPersona={handleConditionSelection} />
      )}
      
      {view === 'loading' && (
        <Loading text={loadingText} progress={loadingProgress} />
      )}
      
      {/* Main App Views */}
      {(view === 'home' || view === 'reports' || view === 'journey' || view === 'sos') && (
        <MainLayout 
          view={view} 
          setView={setView} 
          envData={envData} 
          showConfetti={showConfetti}
        >
          {view === 'home' && (
            <Home 
              profile={profile} 
              envData={envData} 
              analysis={analysis} 
              setView={setView} 
            />
          )}
          
          {view === 'reports' && (
            <Reports />
          )}
          
          {view === 'journey' && (
            <Journey profile={profile} />
          )}
        </MainLayout>
      )}
    </>
  );
}

export default App;
