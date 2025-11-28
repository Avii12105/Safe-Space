export type ViewState = 'landing' | 'onboarding' | 'loading' | 'home' | 'reports' | 'journey' | 'sos';

export type HealthCondition = 'hearing' | 'breathing' | 'both' | 'prevention';

export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  SEVERE = 'Severe'
}

export interface UserPersona {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface UserProfile {
  name: string;
  condition: HealthCondition;
  ageGroup: 'child' | 'adult' | 'senior';
  streak: number;
  points: number;
  treesPlanted: number;
  persona?: UserPersona;
  gardenLevel?: number;
}

export interface EnvData {
  aqi: number;
  noiseDb: number;
  temperature: number;
  humidity: number;
  condition: string;
  locationName: string;
}

export interface AiAnalysis {
  riskLevel: RiskLevel;
  headline: string;
  message: string;
  color: string;
}

export interface NarrativeForecast {
  period: 'Morning' | 'Afternoon' | 'Evening';
  prediction: string;
  icon: 'sun' | 'cloud' | 'moon';
  riskColor: string;
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  type: 'medical' | 'eco' | 'community';
}

export interface MonthlyReport {
  month: string;
  avgAqi: number;
  avgNoise: number;
  highRiskDays: number;
  checkInSummary: string;
}