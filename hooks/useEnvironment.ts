import { useState } from "react";
import {
  EnvData,
  AiAnalysis,
  NarrativeForecast,
  UserProfile,
  RiskLevel,
} from "../types";
import {
  analyzeEnvironment,
  getNarrativeForecast,
} from "../services/geminiService";
import { fetchRealTimeEnvironmentData } from "../services/environmentApi";

// Fallback mock data generator (used if API fails)
const generateMockEnvData = (): EnvData => {
  const isBadDay = Math.random() > 0.6;
  return {
    aqi: isBadDay
      ? Math.floor(Math.random() * 60) + 110
      : Math.floor(Math.random() * 40) + 25,
    noiseDb: isBadDay
      ? Math.floor(Math.random() * 20) + 75
      : Math.floor(Math.random() * 20) + 40,
    temperature: Math.floor(Math.random() * 10) + 20,
    humidity: Math.floor(Math.random() * 30) + 40,
    condition: isBadDay ? "Hazy" : "Sunny",
    locationName: "Unknown",
  };
};

export const useEnvironment = () => {
  const [envData, setEnvData] = useState<EnvData | null>(null);
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [narrativeForecast, setNarrativeForecast] = useState<
    NarrativeForecast[]
  >([]);
  const [loadingText, setLoadingText] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const startAnalysis = async (
    profile: UserProfile,
    useLocation: boolean,
    onComplete: () => void
  ) => {
    setLoadingProgress(10);
    setLoadingText("Connecting to satellite network...");

    setTimeout(() => {
      setLoadingText("Scanning local environment...");
      setLoadingProgress(30);
    }, 800);
    setTimeout(() => {
      setLoadingText("Fetching real-time data...");
      setLoadingProgress(50);
    }, 1600);
    setTimeout(() => {
      setLoadingText("Waking up your AI Guardian...");
      setLoadingProgress(75);
    }, 2400);

    setTimeout(async () => {
      let environmentData: EnvData;

      // Try to fetch real-time data from APIs
      try {
        setLoadingText("Receiving live environmental data...");
        // @ts-ignore - API key from environment
        const weatherApiKey = import.meta.env?.VITE_WEATHER_API_KEY || "";
        // Read Settings from localStorage to decide geolocation vs city
        let overrideCity: string | undefined = undefined;
        try {
          const raw = localStorage.getItem("userSettings");
          if (raw) {
            const settings = JSON.parse(raw);
            if (
              settings?.autoDetectLocation === false &&
              settings?.primaryLocation
            ) {
              overrideCity = settings.primaryLocation as string;
            }
          }
        } catch {}

        if (weatherApiKey) {
          environmentData = await fetchRealTimeEnvironmentData(
            weatherApiKey,
            useLocation,
            overrideCity
          );
          console.log(
            "✅ Real-time data fetched successfully:",
            environmentData
          );
        } else {
          console.warn("⚠️ No Weather API key found. Using mock data.");
          environmentData = generateMockEnvData();
          if (useLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              () => {
                environmentData.locationName = "Home Base";
              },
              () => {
                environmentData.locationName = "Local Zone";
              }
            );
          } else {
            environmentData.locationName = "Local Zone";
          }
        }
      } catch (apiError) {
        console.error(
          "❌ Real-time API failed, falling back to mock data:",
          apiError
        );
        environmentData = generateMockEnvData();
        environmentData.locationName = useLocation ? "Local Zone" : "Unknown";
      }

      setEnvData(environmentData);

      // Analyze with AI
      try {
        setLoadingText("Analyzing environmental conditions...");
        const result = await analyzeEnvironment(environmentData, profile);
        setAnalysis(result);

        getNarrativeForecast(
          environmentData,
          environmentData.locationName
        ).then(setNarrativeForecast);
      } catch (e) {
        console.error("AI Analysis Error:", e);
        setAnalysis({
          riskLevel: RiskLevel.MODERATE,
          headline: "System Offline",
          message: "I couldn't reach the servers, but stay safe out there.",
          color: "#f59e0b",
        });
      }

      setLoadingProgress(100);
      setTimeout(() => onComplete(), 500);
    }, 3500);
  };

  return {
    envData,
    analysis,
    narrativeForecast,
    loadingText,
    loadingProgress,
    startAnalysis,
  };
};
