import React, { useState, useEffect } from "react";
import { UserSettings, HealthCondition, UserProfile } from "../types";
import {
  ShieldCheckIcon,
  BellIcon,
  MapPinIcon,
  UserIcon,
  SlidersIcon,
} from "../components/Icons";

const DEFAULT_SETTINGS: UserSettings = {
  name: "User",
  age: 25,
  ageGroup: "adult",
  condition: "prevention",
  aqiWarningThreshold: 100,
  aqiDangerThreshold: 150,
  noiseWarningThreshold: 70,
  noiseDangerThreshold: 85,
  enableNotifications: true,
  notifyOnHighRisk: true,
  notifyDailyCheckIn: true,
  primaryLocation: "Auto-detect",
  autoDetectLocation: true,
  shareDataWithDoctor: false,
  anonymousMode: false,
};

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile?: (updates: Partial<UserProfile>) => Promise<void> | void;
  userEmail?: string | null;
}

const Settings: React.FC<SettingsProps> = ({
  profile,
  onUpdateProfile,
  userEmail,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    ...DEFAULT_SETTINGS,
    name: profile.name || DEFAULT_SETTINGS.name,
    ageGroup: profile.ageGroup || DEFAULT_SETTINGS.ageGroup,
    condition: profile.condition,
  });
  const [profileForm, setProfileForm] = useState({
    name: profile.name || "",
    ageGroup: profile.ageGroup || "adult",
    condition: profile.condition,
  });
  const [showSaved, setShowSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("userSettings");
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings((prev) => ({
          ...prev,
          ...parsedSettings,
        }));
        console.log("✅ Settings loaded from localStorage:", parsedSettings);
      }
    } catch (error) {
      console.error("❌ Failed to load settings:", error);
    }
  }, []);

  useEffect(() => {
    setProfileForm({
      name: profile.name || "",
      ageGroup: profile.ageGroup || "adult",
      condition: profile.condition,
    });
    setSettings((prev) => ({
      ...prev,
      name: profile.name || prev.name,
      ageGroup: profile.ageGroup || prev.ageGroup,
      condition: profile.condition,
    }));
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      localStorage.setItem("userSettings", JSON.stringify(settings));
      console.log("✅ Settings saved to localStorage:", settings);
      if (onUpdateProfile) {
        await onUpdateProfile({
          name: profileForm.name,
          ageGroup: profileForm.ageGroup as UserProfile["ageGroup"],
          condition: profileForm.condition as UserProfile["condition"],
        });
      }
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (error) {
      console.error("❌ Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
          <p className="text-slate-500">
            Customize how SafeSpace protects{" "}
            <span className="font-semibold text-slate-700">
              {profile.name || "you"}
            </span>
          </p>
        </div>
        {showSaved && (
          <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl font-bold animate-bounce-short">
            ✓ Saved!
          </div>
        )}
      </div>

      {/* Account Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">
          Account
        </p>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-600">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-400">Email</p>
            <p className="font-bold text-slate-800">
              {userEmail || "Offline mode"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-400">Profile ID</p>
            <p className="font-bold text-slate-800 truncate">
              {profile.userId || "Guest"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-400">
              Onboarding Status
            </p>
            <p
              className={`font-bold ${
                profile.onboardingComplete ? "text-teal-600" : "text-amber-600"
              }`}
            >
              {profile.onboardingComplete ? "Complete" : "Pending"}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="w-6 h-6 text-teal-600" />
          <h3 className="text-xl font-bold text-slate-800">
            Personal Information
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={settings.age}
              onChange={(e) => {
                const age = parseInt(e.target.value);
                updateSetting("age", age);
                // Auto-update age group
                let nextGroup: UserProfile["ageGroup"] = "adult";
                if (age < 18) nextGroup = "child";
                else if (age >= 60) nextGroup = "senior";
                updateSetting("ageGroup", nextGroup);
                setProfileForm((prev) => ({ ...prev, ageGroup: nextGroup }));
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:outline-none"
              min="1"
              max="120"
            />
            <p className="text-xs text-slate-400 mt-1">
              Age Group: {settings.ageGroup}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Health Condition
            </label>
            <select
              value={profileForm.condition}
              onChange={(e) =>
                {
                  const value = e.target.value as HealthCondition;
                  setProfileForm((prev) => ({
                    ...prev,
                    condition: value,
                  }));
                  updateSetting("condition", value);
                }
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:outline-none"
            >
              <option value="prevention">General Prevention</option>
              <option value="breathing">Breathing Sensitivity</option>
              <option value="hearing">Hearing Sensitivity</option>
              <option value="both">Both Conditions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threshold Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <SlidersIcon className="w-6 h-6 text-amber-600" />
          <h3 className="text-xl font-bold text-slate-800">Alert Thresholds</h3>
        </div>

        <div className="space-y-6">
          {/* AQI Thresholds */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Air Quality Index (AQI)
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-600">Warning Level</span>
                  <span className="text-xs font-bold text-orange-600">
                    {settings.aqiWarningThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={settings.aqiWarningThreshold}
                  onChange={(e) =>
                    updateSetting(
                      "aqiWarningThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50</span>
                  <span>200</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-600">Danger Level</span>
                  <span className="text-xs font-bold text-rose-600">
                    {settings.aqiDangerThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="10"
                  value={settings.aqiDangerThreshold}
                  onChange={(e) =>
                    updateSetting(
                      "aqiDangerThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>100</span>
                  <span>300</span>
                </div>
              </div>
            </div>
          </div>

          {/* Noise Thresholds */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Noise Level (dB)
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-600">Warning Level</span>
                  <span className="text-xs font-bold text-indigo-600">
                    {settings.noiseWarningThreshold} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={settings.noiseWarningThreshold}
                  onChange={(e) =>
                    updateSetting(
                      "noiseWarningThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50 dB</span>
                  <span>100 dB</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-600">Danger Level</span>
                  <span className="text-xs font-bold text-rose-600">
                    {settings.noiseDangerThreshold} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="120"
                  step="5"
                  value={settings.noiseDangerThreshold}
                  onChange={(e) =>
                    updateSetting(
                      "noiseDangerThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>70 dB</span>
                  <span>120 dB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <BellIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-800">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-700">Enable Notifications</p>
              <p className="text-xs text-slate-500">
                Receive alerts and reminders
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  updateSetting("enableNotifications", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-700">High Risk Alerts</p>
              <p className="text-xs text-slate-500">
                Alert when conditions are dangerous
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyOnHighRisk}
                onChange={(e) =>
                  updateSetting("notifyOnHighRisk", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-700">
                Daily Check-in Reminder
              </p>
              <p className="text-xs text-slate-500">
                Daily reminder to log your mood
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyDailyCheckIn}
                onChange={(e) =>
                  updateSetting("notifyDailyCheckIn", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Location Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <MapPinIcon className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-slate-800">Location</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-700">Auto-detect Location</p>
              <p className="text-xs text-slate-500">
                Use GPS for accurate readings
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoDetectLocation}
                onChange={(e) =>
                  updateSetting("autoDetectLocation", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          {!settings.autoDetectLocation && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Primary Location
              </label>
              <input
                type="text"
                value={settings.primaryLocation}
                onChange={(e) =>
                  updateSetting("primaryLocation", e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:outline-none"
                placeholder="e.g., New Delhi, India"
              />
            </div>
          )}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-slate-800">Privacy & Data</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-700">Share Data with Doctor</p>
              <p className="text-xs text-slate-500">
                Export reports for medical consultation
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.shareDataWithDoctor}
                onChange={(e) =>
                  updateSetting("shareDataWithDoctor", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-700">Anonymous Mode</p>
              <p className="text-xs text-slate-500">
                Hide personal info in community features
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.anonymousMode}
                onChange={(e) =>
                  updateSetting("anonymousMode", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>

      {/* Reset to Defaults */}
      <button
        onClick={() => setSettings(DEFAULT_SETTINGS)}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-2xl transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
};

export default Settings;
