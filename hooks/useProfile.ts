import { useCallback, useEffect, useState } from "react";
import { HealthCondition, QuestItem, UserProfile } from "../types";
import {
  CONDITIONS,
  DAILY_QUESTS,
  DEFAULT_PROFILE,
  GARDEN_STAGES,
} from "../constants";
import { fetchProfile, upsertProfile } from "../services/profileService";

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dailyQuests, setDailyQuests] = useState<QuestItem[]>(DAILY_QUESTS);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(DEFAULT_PROFILE);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const remoteProfile = await fetchProfile(userId);
        if (isMounted) {
          setProfile(remoteProfile);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Unable to load profile. Using local defaults.");
          setProfile({ ...DEFAULT_PROFILE, userId });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const persistProfile = useCallback(
    async (nextProfile: UserProfile) => {
      setProfile(nextProfile);
      if (nextProfile.userId) {
        await upsertProfile(nextProfile);
      }
    },
    []
  );

  const selectPersona = useCallback(
    async (conditionId: HealthCondition) => {
      const persona = CONDITIONS.find((c) => c.id === conditionId);
      const nextProfile: UserProfile = {
        ...profile,
        userId: profile.userId || userId || undefined,
        condition: conditionId,
        persona,
        onboardingComplete: true,
      };
      await persistProfile(nextProfile);
    },
    [persistProfile, profile, userId]
  );

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      const nextProfile: UserProfile = {
        ...profile,
        ...updates,
        userId: profile.userId || userId || undefined,
      };
      await persistProfile(nextProfile);
    },
    [persistProfile, profile, userId]
  );

  const handleQuestComplete = (id: string) => {
    const quest = dailyQuests.find((q) => q.id === id);
    if (quest && !quest.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);

      setDailyQuests((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: true } : item
        )
      );

      const newPoints = profile.points + quest.points;
      let newLevel = profile.gardenLevel || 1;
      GARDEN_STAGES.forEach((stage) => {
        if (newPoints >= stage.minPoints) newLevel = stage.level;
      });

      void updateProfile({ points: newPoints, gardenLevel: newLevel });
    }
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
  };

  useEffect(() => {
    if (!profile.userId) return;
    const pendingRaw = localStorage.getItem("pendingProfileName");
    if (!pendingRaw) return;
    try {
      const pending = JSON.parse(pendingRaw) as {
        name?: string;
        condition?: HealthCondition;
      };
      if (pending.name && profile.name === DEFAULT_PROFILE.name) {
        void updateProfile({
          name: pending.name,
          condition: pending.condition || profile.condition,
        });
      }
    } catch (err) {
      console.error("Failed to apply pending profile data", err);
    } finally {
      localStorage.removeItem("pendingProfileName");
    }
  }, [profile.userId, profile.name, profile.condition, updateProfile]);

  return {
    profile,
    dailyQuests,
    showConfetti,
    loading,
    error,
    selectPersona,
    handleQuestComplete,
    updateProfile,
    resetProfile,
  };
};
