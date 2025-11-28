import { UserProfile, QuestItem, MonthlyReport } from './types';

export const CONDITIONS = [
  { id: 'breathing', label: 'Breathing Sensitivity', icon: '🫁', description: 'Asthma, COPD, or pollution sensitivity.', color: 'bg-sky-100 text-sky-600 border-sky-200' },
  { id: 'hearing', label: 'Hearing Sensitivity', icon: '👂', description: 'Tinnitus, hyperacusis, or hearing loss.', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { id: 'both', label: 'Both Conditions', icon: '🛡️', description: 'Comprehensive protection for lungs & ears.', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  { id: 'prevention', label: 'General Prevention', icon: '❤️', description: 'Health-conscious preventive monitoring.', color: 'bg-slate-100 text-slate-600 border-slate-200' },
];

export const GARDEN_STAGES = [
  { level: 1, minPoints: 0, label: 'Sprout' },
  { level: 2, minPoints: 100, label: 'Sapling' },
  { level: 3, minPoints: 300, label: 'Young Tree' },
  { level: 4, minPoints: 600, label: 'Mature Tree' },
  { level: 5, minPoints: 1000, label: 'Forest Guardian' },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Guest',
  condition: 'prevention',
  ageGroup: 'adult',
  streak: 0,
  points: 0,
  treesPlanted: 0,
  gardenLevel: 1
};

export const DAILY_QUESTS: QuestItem[] = [
  { id: 'q1', title: 'Daily Check-in', description: 'Log your symptoms to help your doctor.', points: 10, completed: false, type: 'medical' },
  { id: 'q2', title: 'Hydration Goal', description: 'Drink 2L of water to help lung function.', points: 5, completed: false, type: 'medical' },
  { id: 'q3', title: 'Plant a Virtual Tree', description: 'Contribute to the community forest.', points: 20, completed: false, type: 'eco' },
];

export const MOCK_REPORTS: MonthlyReport[] = [
  { month: 'October', avgAqi: 145, avgNoise: 65, highRiskDays: 4, checkInSummary: 'Mostly mild symptoms reported.' },
  { month: 'November', avgAqi: 180, avgNoise: 82, highRiskDays: 12, checkInSummary: 'Frequent coughing reported during Diwali week.' },
  { month: 'December', avgAqi: 160, avgNoise: 60, highRiskDays: 8, checkInSummary: 'Stable health reported.' },
];