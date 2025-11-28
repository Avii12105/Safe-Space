import { GoogleGenAI, Type } from "@google/genai";
import { EnvData, UserProfile, AiAnalysis, NarrativeForecast, RiskLevel } from "../types";

// robust key retrieval for both local (Vite) and cloud environments
// @ts-ignore - ignoring potential type mismatch for import.meta in some bundlers
const apiKey = (import.meta.env && import.meta.env.VITE_API_KEY) ? import.meta.env.VITE_API_KEY : process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeEnvironment = async (
  data: EnvData, 
  profile: UserProfile
): Promise<AiAnalysis> => {
  const model = 'gemini-2.5-flash';
  
  const personaContext = profile.persona 
    ? `The user identifies as a "${profile.persona.label}" (${profile.persona.description}). Adjust your tone to specifically care for this need.` 
    : '';

  const prompt = `
    You are "SafeSpace", a personal Guardian Angel for environmental health.
    ${personaContext}
    
    Current Conditions:
    - AQI: ${data.aqi}
    - Noise: ${data.noiseDb} dB
    - Temp: ${data.temperature}°C
    
    Your Goal:
    1. Analyze the risk.
    2. Write a "Headline" (3-6 words) that captures the vibe.
    3. Write a "Message" (max 30 words). Speak directly to the user (use "I" and "You"). Be protective, warm, and human. 
       Do NOT list data. Interpret it. E.g., "I'm seeing some smoke nearby, so I've updated your route suggestions."
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            headline: { type: Type.STRING },
            message: { type: Type.STRING },
            color: { type: Type.STRING },
          },
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
        riskLevel: (result.riskLevel as RiskLevel) || RiskLevel.MODERATE,
        headline: result.headline || "I'm watching over you.",
        message: result.message || "I'm analyzing the air around you to ensure you stay healthy today.",
        color: result.color || "#10b981"
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      riskLevel: RiskLevel.MODERATE,
      headline: "System Offline",
      message: "I can't reach the satellites right now, but please stay safe.",
      color: "#f59e0b"
    };
  }
};

export const getNarrativeForecast = async (
  data: EnvData,
  location: string
): Promise<NarrativeForecast[]> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Based on conditions (${data.condition}, ${data.temperature}°C, AQI ${data.aqi}) in ${location}, 
    tell a 3-part mini-story about how the environment will change today.
    
    Return exactly 3 items: Morning, Afternoon, Evening.
    
    For each period, write a 1-sentence "prediction" that sounds like a wise friend predicting the future.
    Example: "The wind will pick up this afternoon, clearing out the smog."
    
    Assign a risk color (hex) and an icon (sun, cloud, or moon).
  `;

  try {
     const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              period: { type: Type.STRING },
              prediction: { type: Type.STRING },
              icon: { type: Type.STRING },
              riskColor: { type: Type.STRING },
            }
          }
        },
      },
    });

    return JSON.parse(response.text || '[]') as NarrativeForecast[];
  } catch (error) {
    console.error("Gemini prediction failed:", error);
    return [];
  }
};