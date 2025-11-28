import { useState } from 'react';
import { UserProfile, QuestItem, HealthCondition } from '../types';
import { DEFAULT_PROFILE, DAILY_QUESTS, GARDEN_STAGES, CONDITIONS } from '../constants';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dailyQuests, setDailyQuests] = useState<QuestItem[]>(DAILY_QUESTS);
  const [showConfetti, setShowConfetti] = useState(false);

  const selectPersona = (conditionId: HealthCondition) => {
    const persona = CONDITIONS.find(c => c.id === conditionId);
    setProfile(prev => ({ 
        ...prev, 
        condition: conditionId,
        persona: persona 
    }));
  };

  const handleQuestComplete = (id: string) => {
    const quest = dailyQuests.find(q => q.id === id);
    if (quest && !quest.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);

        setDailyQuests(prev => prev.map(item => item.id === id ? { ...item, completed: true } : item));
        
        // Update Points & Garden Level
        const newPoints = profile.points + quest.points;
        let newLevel = profile.gardenLevel || 1;
        GARDEN_STAGES.forEach(stage => {
            if (newPoints >= stage.minPoints) newLevel = stage.level;
        });

        setProfile(p => ({ ...p, points: newPoints, gardenLevel: newLevel }));
    }
  };

  return {
    profile,
    dailyQuests,
    showConfetti,
    selectPersona,
    handleQuestComplete
  };
};