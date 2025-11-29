import { useState } from "react";
import { HealthCheckIn, EnvData } from "../types";

export const useHealthCheckins = () => {
  const [checkIns, setCheckIns] = useState<HealthCheckIn[]>([]);

  const addCheckIn = (
    mood: "great" | "okay" | "bad" | "panic",
    envData: EnvData | null
  ) => {
    const newCheckIn: HealthCheckIn = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      aqi: envData?.aqi || 0,
      noiseDb: envData?.noiseDb || 0,
    };

    setCheckIns((prev) => [newCheckIn, ...prev]);
    return newCheckIn;
  };

  const getRecentCheckIns = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return checkIns.filter((checkIn) => new Date(checkIn.date) >= cutoffDate);
  };

  const getMoodTrend = () => {
    const recent = getRecentCheckIns(7);
    const moodScores = { great: 4, okay: 3, bad: 2, panic: 1 };
    const avgScore =
      recent.reduce((sum, ci) => sum + moodScores[ci.mood], 0) /
      (recent.length || 1);

    if (avgScore >= 3.5) return "improving";
    if (avgScore >= 2.5) return "stable";
    return "declining";
  };

  return {
    checkIns,
    addCheckIn,
    getRecentCheckIns,
    getMoodTrend,
  };
};
