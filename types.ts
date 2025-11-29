export type ViewState =
  | "landing"
  | "onboarding"
  | "loading"
  | "home"
  | "reports"
  | "journey"
  | "settings"
  | "sos";

export type HealthCondition = "hearing" | "breathing" | "both" | "prevention";

export enum RiskLevel {
  LOW = "Low",
  MODERATE = "Moderate",
  HIGH = "High",
  SEVERE = "Severe",
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
  ageGroup: "child" | "adult" | "senior";
  streak: number;
  points: number;
  treesPlanted: number;
  persona?: UserPersona;
  gardenLevel?: number;
  onboardingComplete?: boolean;
  userId?: string;
}

export interface UserSettings {
  // Personal Info
  name: string;
  age: number;
  ageGroup: "child" | "adult" | "senior";
  condition: HealthCondition;

  // Threshold Settings
  aqiWarningThreshold: number;
  aqiDangerThreshold: number;
  noiseWarningThreshold: number;
  noiseDangerThreshold: number;

  // Notifications
  enableNotifications: boolean;
  notifyOnHighRisk: boolean;
  notifyDailyCheckIn: boolean;

  // Location
  primaryLocation: string;
  autoDetectLocation: boolean;

  // Privacy
  shareDataWithDoctor: boolean;
  anonymousMode: boolean;
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
  period: "Morning" | "Afternoon" | "Evening";
  prediction: string;
  icon: "sun" | "cloud" | "moon";
  riskColor: string;
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  type: "medical" | "eco" | "community";
}

export interface MonthlyReport {
  month: string;
  avgAqi: number;
  avgNoise: number;
  highRiskDays: number;
  checkInSummary: string;
}

export interface HealthCheckIn {
  id: string;
  date: string;
  mood: "great" | "okay" | "bad" | "panic";
  symptoms?: string[];
  notes?: string;
  aqi: number;
  noiseDb: number;
}

export interface HistoricalDataPoint {
  date: string;
  aqi: number;
  noiseDb: number;
  riskLevel: RiskLevel;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: "safety" | "activity" | "health";
  priority: "high" | "medium" | "low";
  icon: string;
}

export interface JourneyProgress {
  profileId: string;
  points: number;
  treesPlanted: number;
  streak: number;
  updatedAt?: string;
}