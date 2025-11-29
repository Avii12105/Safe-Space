import React, { useEffect, useMemo, useState } from "react";
import { UserProfile } from "../types";
import { CameraIcon, LeafIcon } from "../components/Icons";
import { GARDEN_STAGES } from "../constants";
import {
  fetchJourneyProgress,
  upsertJourneyProgress,
} from "../services/journeyService";
import { isSupabaseConfigured } from "../services/supabaseClient";

interface JourneyProps {
  profile: UserProfile;
  userId?: string | null;
}

const Journey: React.FC<JourneyProps> = ({ profile, userId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [points, setPoints] = useState(profile.points);
  const [treesPlanted, setTreesPlanted] = useState(profile.treesPlanted);
  const [streak] = useState(profile.streak);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(isSupabaseConfigured);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState([
    { id: "mask", label: "Wore N95 outdoors", completed: false },
    { id: "plants", label: "Watered balcony plants", completed: true },
    { id: "exercise", label: "Breathing exercise (5 min)", completed: false },
    { id: "noise", label: "Used ear protection in traffic", completed: false },
  ]);

  const { currentStage, nextStage, progressToNextStage, remainingPoints } =
    useMemo(() => {
    const sortedStages = [...GARDEN_STAGES].sort(
      (a, b) => a.minPoints - b.minPoints
    );
    const activeStage =
      sortedStages
        .slice()
        .reverse()
        .find((stage) => points >= stage.minPoints) || sortedStages[0];
    const next =
      sortedStages.find((stage) => stage.minPoints > activeStage.minPoints) ||
      null;
    const progressPercent = next
      ? Math.min(
          100,
          ((points - activeStage.minPoints) /
            (next.minPoints - activeStage.minPoints)) *
            100
        )
      : 100;
      const remaining = next
        ? Math.max(0, next.minPoints - points)
        : 0;
      return {
        currentStage: activeStage,
        nextStage: next,
        progressToNextStage: progressPercent,
        remainingPoints: remaining,
      };
    }, [points]);

  const impactStats = [
    {
      label: "Community Streak",
      value: `${streak} days`,
      helper: streak > 0 ? "+3 this week" : "Start your streak",
    },
    {
      label: "Trees Verified",
      value: treesPlanted,
      helper: "Goal: 50 trees",
    },
    {
      label: "Guardian Score",
      value: `${points} pts`,
      helper: nextStage
        ? `${nextStage.minPoints - points} pts to ${nextStage.label}`
        : "Forest Guardian unlocked",
    },
  ];

  const activityTimeline = [
    {
      title: "Neighborhood Plantation Drive",
      date: "Yesterday · 9:30 AM",
      status: "Verified",
      points: "+50 pts",
      icon: "🌳",
    },
    {
      title: "Shared air purifier report",
      date: "2 days ago",
      status: "Community impact",
      points: "+15 pts",
      icon: "📄",
    },
    {
      title: "Completed breathing therapy",
      date: "Monday",
      status: "Wellness",
      points: "+10 pts",
      icon: "🫁",
    },
  ];

  const persistProgress = async (nextPoints: number, nextTrees: number) => {
    if (!isSupabaseConfigured || !userId) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      await upsertJourneyProgress({
        profileId: userId,
        points: nextPoints,
        treesPlanted: nextTrees,
        streak,
      });
    } catch (error) {
      setSyncError("Could not sync with Supabase. Showing local values.");
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const weeklyImpact = [
    { day: "Sun", trees: 1, protection: true },
    { day: "Mon", trees: 0, protection: true },
    { day: "Tue", trees: 2, protection: false },
    { day: "Wed", trees: 0, protection: true },
    { day: "Thu", trees: 1, protection: true },
    { day: "Fri", trees: 0, protection: false },
    { day: "Sat", trees: 3, protection: true },
  ];

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowSuccess(true);
      const nextPoints = points + 50;
      const nextTrees = treesPlanted + 1;
      setPoints(nextPoints);
      setTreesPlanted(nextTrees);
      void persistProgress(nextPoints, nextTrees);
      // In a real app, we'd update Supabase here
    }, 2000);
  };

  const toggleChecklist = (taskId: string) => {
    setChecklist((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  useEffect(() => {
    let isMounted = true;
    if (!isSupabaseConfigured || !userId) {
      setLoadingProgress(false);
      return;
    }

    const loadProgress = async () => {
      setLoadingProgress(true);
      setSyncError(null);
      const progress = await fetchJourneyProgress(userId);
      if (progress && isMounted) {
        setPoints(progress.points || profile.points);
        setTreesPlanted(progress.treesPlanted || profile.treesPlanted);
      }
      setLoadingProgress(false);
    };

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, [profile.points, profile.treesPlanted, userId]);

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
          <LeafIcon className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-emerald-900 mb-2">
          Community Forest
        </h2>
        <p className="text-emerald-700 max-w-2xl mx-auto leading-relaxed">
          You are a <span className="font-bold text-emerald-900">{currentStage.label}</span>.{" "}
          Grow to {nextStage ? nextStage.label : "the max level"} by nurturing
          both your lungs and the planet. Every verified action adds leaves to
          your forest.
        </p>
        <div className="mt-8 bg-white/80 border border-emerald-100 rounded-2xl p-4 max-w-2xl mx-auto">
          <div className="flex justify-between text-xs font-bold text-emerald-700 mb-2">
            <span>
              {currentStage.label} · {points} pts
            </span>
            <span>
              {nextStage
                ? `${remainingPoints} pts to ${nextStage.label}`
                : "Forest Guardian unlocked"}
            </span>
          </div>
          <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${progressToNextStage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {impactStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
          >
            <p className="text-xs font-bold text-slate-400 uppercase">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-slate-900 mt-3">
              {stat.value}
            </p>
            <p className="text-xs font-semibold text-emerald-500 mt-2">
              {stat.helper}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4">
            <CameraIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Plant a Tree
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Upload a photo of your sapling. Moderators verify it and award
            points instantly.
          </p>

          {showSuccess ? (
            <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl w-full">
              <p className="font-bold">Verified! +50 Points</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-xs underline mt-2"
              >
                Plant another
              </button>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          )}
        <p className="text-xs text-slate-400 mt-3">
          Need help? Email proof to guardian@safespace.app
        </p>
        {isSupabaseConfigured && (
          <p className="text-[11px] text-slate-400 mt-1">
            {isSyncing
              ? "Syncing with Supabase..."
              : loadingProgress
              ? "Loading progress..."
              : syncError
              ? syncError
              : "Progress synced with Supabase."}
          </p>
        )}
        </div>

        {/* Rewards Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Your Rewards</h3>
            <span className="text-amber-500 font-bold">{points} pts</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 opacity-50">
              <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
              <div>
                <p className="font-bold text-slate-400 text-sm">
                  Pharmacy Coupon
                </p>
                <p className="text-xs text-slate-400">Unlock at 500 pts</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">
                🎟️
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  Consultation Discount
                </p>
                <p className="text-xs text-slate-500">10% off at Apollo</p>
              </div>
              <button className="ml-auto text-xs bg-slate-900 text-white px-3 py-1 rounded-lg">
                Redeem
              </button>
            </div>
          </div>
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left">
            <p className="text-xs uppercase font-bold text-amber-500 mb-1">
              Upcoming
            </p>
            <p className="text-sm text-amber-900 font-semibold">
              City air sensor volunteers needed · +120 pts
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">
              Recent Journey
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Verified actions · last 7 days
            </span>
          </div>
          <div className="space-y-5">
            {activityTimeline.map((activity) => (
              <div
                key={activity.title}
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500">
                    {activity.status}
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    {activity.points}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              Daily Care Checklist
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {checklist.filter((item) => item.completed).length}/
              {checklist.length} done
            </span>
          </div>
          <div className="space-y-3">
            {checklist.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleChecklist(task.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  task.completed
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    task.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 text-transparent"
                  }`}
                >
                  ✓
                </div>
                <span className="text-sm font-semibold">{task.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Completing all tasks adds +15 pts to your Guardian Score.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            Weekly Eco Footprint
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            Green dots = used protection outdoors
          </span>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weeklyImpact.map((day) => (
            <div
              key={day.day}
              className="p-4 rounded-2xl border border-slate-100 text-center"
            >
              <p className="text-xs font-bold text-slate-400 mb-2">
                {day.day}
              </p>
              <div className="text-3xl font-black text-slate-900">
                {day.trees}
              </div>
              <p className="text-[11px] text-slate-400">trees</p>
              <div className="mt-3 flex items-center justify-center gap-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    day.protection ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                ></span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  protection
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journey;
