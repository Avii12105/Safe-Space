import {
  EnvData,
  NarrativeForecast,
  Recommendation,
  HealthCondition,
  RiskLevel,
} from "../types";

export const generateRecommendations = (
  envData: EnvData | null,
  forecast: NarrativeForecast[],
  condition: HealthCondition,
  riskLevel: RiskLevel
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Air Quality Recommendations
  if (envData && envData.aqi > 150) {
    recommendations.push({
      id: "aqi-high",
      title: "Avoid Outdoor Activities",
      description:
        "Air quality is poor. Stay indoors and use air purifier if available.",
      type: "safety",
      priority: "high",
      icon: "🏠",
    });
  } else if (envData && envData.aqi > 100) {
    recommendations.push({
      id: "aqi-moderate",
      title: "Limit Outdoor Exposure",
      description: "Consider wearing an N95 mask if going outside.",
      type: "safety",
      priority: "medium",
      icon: "😷",
    });
  }

  // Noise Level Recommendations
  if (envData && envData.noiseDb > 85) {
    recommendations.push({
      id: "noise-high",
      title: "Protect Your Hearing",
      description:
        "Use noise-canceling headphones or earplugs in loud environments.",
      type: "safety",
      priority: "high",
      icon: "🎧",
    });
  }

  // Best Time to Go Outside
  const bestPeriod = forecast.find(
    (f) =>
      f.prediction.toLowerCase().includes("safe") ||
      f.prediction.toLowerCase().includes("good")
  );

  if (bestPeriod) {
    recommendations.push({
      id: "best-time",
      title: `Best Time: ${bestPeriod.period}`,
      description: bestPeriod.prediction,
      type: "activity",
      priority: "medium",
      icon:
        bestPeriod.icon === "sun"
          ? "☀️"
          : bestPeriod.icon === "moon"
          ? "🌙"
          : "☁️",
    });
  }

  // Condition-Specific Recommendations
  if (condition === "breathing" || condition === "both") {
    if (riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.SEVERE) {
      recommendations.push({
        id: "breathing-alert",
        title: "Keep Inhaler Ready",
        description: "Have your rescue inhaler accessible at all times.",
        type: "health",
        priority: "high",
        icon: "💊",
      });
    }

    recommendations.push({
      id: "hydration",
      title: "Stay Hydrated",
      description: "Drink plenty of water to help your respiratory system.",
      type: "health",
      priority: "medium",
      icon: "💧",
    });
  }

  // General Health Tips
  if (envData && envData.aqi < 50 && envData.noiseDb < 60) {
    recommendations.push({
      id: "exercise",
      title: "Perfect for Exercise",
      description: "Conditions are ideal for outdoor physical activity.",
      type: "activity",
      priority: "low",
      icon: "🏃",
    });
  }

  return recommendations;
};
