import React, { useState, useMemo } from "react";
import {
  ViewState,
  EnvData,
  AiAnalysis,
  UserProfile,
  NarrativeForecast,
} from "../types";
import {
  WindIcon,
  Volume2Icon,
  SparklesIcon,
  CrossIcon,
  SunIcon,
  CloudIcon,
  MoonIcon,
  ThermometerIcon,
  DropletIcon,
} from "../components/Icons";
import EnvironmentCard from "../components/EnvironmentCard";
import { useTypewriter } from "../hooks/useTypewriter";
import { useHealthCheckins } from "../hooks/useHealthCheckins";
import { generateRecommendations } from "../utils/recommendations";

interface HomeProps {
  profile: UserProfile;
  envData: EnvData | null;
  analysis: AiAnalysis | null;
  narrativeForecast: NarrativeForecast[];
  setView: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({
  profile,
  envData,
  analysis,
  narrativeForecast,
  setView,
}) => {
  const typingMessage = useTypewriter(analysis?.message || "", 20);
  const [showCheckin, setShowCheckin] = useState(true);
  const { addCheckIn, getMoodTrend } = useHealthCheckins();

  // Generate personalized recommendations
  const recommendations = useMemo(() => {
    if (!analysis) return [];
    return generateRecommendations(
      envData,
      narrativeForecast,
      profile.condition,
      analysis.riskLevel
    );
  }, [envData, narrativeForecast, profile.condition, analysis]);

  const handleMoodSelect = (mood: "great" | "okay" | "bad" | "panic") => {
    addCheckIn(mood, envData);
    setShowCheckin(false);

    // Show SOS if panic
    if (mood === "panic") {
      setTimeout(() => setView("sos"), 500);
    }
  };

  // Layout Logic based on Condition
  const showAqi =
    profile.condition === "breathing" ||
    profile.condition === "both" ||
    profile.condition === "prevention";
  const showNoise =
    profile.condition === "hearing" ||
    profile.condition === "both" ||
    profile.condition === "prevention";

  return (
    <div className="space-y-6 pb-20">
      {/* Daily Check-in Widget */}
      {showCheckin && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative">
          <button
            onClick={() => setShowCheckin(false)}
            className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Daily Health Check-in
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { mood: "great" as const, label: "Great 😃" },
              { mood: "okay" as const, label: "Okay 😐" },
              { mood: "bad" as const, label: "Bad 🤧" },
              { mood: "panic" as const, label: "Panic 🆘" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleMoodSelect(item.mood)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all border ${
                  item.mood === "panic"
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200"
                    : "bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-600 border-transparent hover:border-teal-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Guardian Insight */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="hidden md:flex w-16 h-16 rounded-full bg-teal-100 items-center justify-center text-3xl">
            🩺
          </div>
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${
                analysis?.riskLevel === "High"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-teal-100 text-teal-700"
              }`}
            >
              Current Status: {analysis?.riskLevel || "Safe"}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {analysis?.headline}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed typing-cursor">
              {typingMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Adaptive Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {showAqi && (
          <EnvironmentCard
            title="Air Quality (AQI)"
            value={envData?.aqi || 0}
            unit=""
            status={envData && envData.aqi > 100 ? "Poor" : "Healthy"}
            colorClass={
              envData && envData.aqi > 100 ? "text-orange-500" : "text-sky-500"
            }
            icon={<WindIcon />}
          />
        )}
        {showNoise && (
          <EnvironmentCard
            title="Noise Level"
            value={envData?.noiseDb || 0}
            unit="dB"
            status={envData && envData.noiseDb > 70 ? "Loud" : "Quiet"}
            colorClass={
              envData && envData.noiseDb > 70
                ? "text-indigo-500"
                : "text-indigo-400"
            }
            icon={<Volume2Icon />}
          />
        )}

        {/* Temperature Card */}
        <EnvironmentCard
          title="Temperature"
          value={envData?.temperature || 0}
          unit="°C"
          status={
            envData && envData.temperature > 30
              ? "Hot"
              : envData && envData.temperature < 15
              ? "Cold"
              : "Moderate"
          }
          colorClass={
            envData && envData.temperature > 30
              ? "text-orange-500"
              : envData && envData.temperature < 15
              ? "text-blue-500"
              : "text-green-500"
          }
          icon={<ThermometerIcon />}
        />

        {/* Humidity Card */}
        <EnvironmentCard
          title="Humidity"
          value={envData?.humidity || 0}
          unit="%"
          status={
            envData && envData.humidity > 70
              ? "High"
              : envData && envData.humidity < 30
              ? "Low"
              : "Normal"
          }
          colorClass={
            envData && envData.humidity > 70
              ? "text-blue-600"
              : envData && envData.humidity < 30
              ? "text-amber-500"
              : "text-teal-500"
          }
          icon={<DropletIcon />}
        />
      </div>

      {/* Weather Condition Banner */}
      {envData && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                {envData.condition.toLowerCase().includes("clear") ||
                envData.condition.toLowerCase().includes("sunny")
                  ? "☀️"
                  : envData.condition.toLowerCase().includes("cloud")
                  ? "☁️"
                  : envData.condition.toLowerCase().includes("rain")
                  ? "🌧️"
                  : envData.condition.toLowerCase().includes("storm")
                  ? "⛈️"
                  : envData.condition.toLowerCase().includes("snow")
                  ? "❄️"
                  : envData.condition.toLowerCase().includes("fog") ||
                    envData.condition.toLowerCase().includes("mist")
                  ? "🌫️"
                  : "🌤️"}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {envData.condition}
                </p>
                <p className="text-sm text-slate-600">
                  {envData.temperature > 30
                    ? "🔥 Stay hydrated in hot weather"
                    : envData.temperature < 15
                    ? "🧥 Dress warmly today"
                    : envData.humidity > 70
                    ? "💧 High humidity - stay cool"
                    : "✨ Perfect weather conditions"}
                </p>
              </div>
            </div>
            <div className="block text-right">
              <p className="text-sm font-bold text-slate-500">
                {envData.locationName || "Local Zone"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestion / Alert Box */}
      {analysis?.riskLevel === "High" && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <CrossIcon className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h4 className="font-bold text-rose-700 text-lg">
              Precaution Recommended
            </h4>
            <p className="text-rose-600/80 leading-snug mt-1">
              Conditions are currently unfavorable for your specific
              sensitivity. Consider staying indoors or wearing protection.
            </p>
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            💡 Recommendations for You
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
                  rec.priority === "high"
                    ? "bg-rose-50 border border-rose-100"
                    : rec.priority === "medium"
                    ? "bg-amber-50 border border-amber-100"
                    : "bg-slate-50 border border-slate-100"
                }`}
              >
                <div className="text-2xl flex-shrink-0">{rec.icon}</div>
                <div className="flex-1">
                  <h4
                    className={`font-bold text-sm mb-1 ${
                      rec.priority === "high"
                        ? "text-rose-700"
                        : rec.priority === "medium"
                        ? "text-amber-700"
                        : "text-slate-700"
                    }`}
                  >
                    {rec.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Narrative Forecast Section */}
      {narrativeForecast && narrativeForecast.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-teal-500" />
            Air Quality Forecast
          </h3>
          <div className="space-y-4">
            {narrativeForecast.map((forecast, idx) => {
              const iconClass = `w-8 h-8 ${forecast.riskColor}`;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  style={{ borderLeft: `4px solid ${forecast.riskColor}` }}
                >
                  <div className="flex-shrink-0 p-2 bg-white rounded-xl shadow-sm">
                    {forecast.icon === "sun" && (
                      <SunIcon className={iconClass} />
                    )}
                    {forecast.icon === "cloud" && (
                      <CloudIcon className={iconClass} />
                    )}
                    {forecast.icon === "moon" && (
                      <MoonIcon className={iconClass} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-1">
                      {forecast.period}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {forecast.prediction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
