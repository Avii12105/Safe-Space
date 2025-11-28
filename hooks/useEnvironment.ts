import { useState } from 'react';
import { EnvData, AiAnalysis, NarrativeForecast, UserProfile, RiskLevel } from '../types';
import { analyzeEnvironment, getNarrativeForecast } from '../services/geminiService';

// Helper to generate mock data
const generateMockEnvData = (): EnvData => {
  const isBadDay = Math.random() > 0.6; 
  return {
    aqi: isBadDay ? Math.floor(Math.random() * 60) + 110 : Math.floor(Math.random() * 40) + 25,
    noiseDb: isBadDay ? Math.floor(Math.random() * 20) + 75 : Math.floor(Math.random() * 20) + 40,
    temperature: Math.floor(Math.random() * 10) + 20,
    humidity: Math.floor(Math.random() * 30) + 40,
    condition: isBadDay ? 'Hazy' : 'Sunny',
    locationName: 'Unknown'
  };
};

export const useEnvironment = () => {
  const [envData, setEnvData] = useState<EnvData | null>(null);
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [narrativeForecast, setNarrativeForecast] = useState<NarrativeForecast[]>([]);
  const [loadingText, setLoadingText] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const startAnalysis = async (profile: UserProfile, useLocation: boolean, onComplete: () => void) => {
    setLoadingProgress(10);
    setLoadingText('Connecting to satellite network...');

    setTimeout(() => { setLoadingText('Scanning local environment...'); setLoadingProgress(40); }, 1200);
    setTimeout(() => { setLoadingText('Waking up your AI Guardian...'); setLoadingProgress(80); }, 2500);

    setTimeout(async () => {
        const mockData = generateMockEnvData();
        if (useLocation && navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(
                () => { mockData.locationName = "Home Base"; setEnvData(mockData); },
                () => { mockData.locationName = "Local Zone"; setEnvData(mockData); }
            );
        } else {
             mockData.locationName = "Local Zone";
             setEnvData(mockData);
        }
        
        try {
            const result = await analyzeEnvironment(mockData, profile);
            setAnalysis(result);
            
            getNarrativeForecast(mockData, mockData.locationName).then(setNarrativeForecast);
        } catch (e) {
            console.error(e);
            // Fallback
            setAnalysis({
                riskLevel: RiskLevel.MODERATE,
                headline: "System Offline",
                message: "I couldn't reach the servers, but stay safe out there.",
                color: "#f59e0b"
            });
        }

        setLoadingProgress(100);
        setTimeout(() => onComplete(), 500);
    }, 4000);
  };

  return {
    envData,
    analysis,
    narrativeForecast,
    loadingText,
    loadingProgress,
    startAnalysis
  };
};