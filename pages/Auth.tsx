import React, { useState } from "react";
import { HealthCondition } from "../types";

interface AuthProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  isSupabaseReady: boolean;
}

const Auth: React.FC<AuthProps> = ({
  onSignIn,
  onSignUp,
  loading,
  error,
  isSupabaseReady,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [conditionFocus, setConditionFocus] =
    useState<HealthCondition>("prevention");
  const [newsletter, setNewsletter] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    if (isSignup) {
      if (!fullName.trim()) {
        setLocalError("Please share your name so we can personalize alerts.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters long.");
        return;
      }
    }

    try {
      if (mode === "signin") {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
        localStorage.setItem(
          "pendingProfileName",
          JSON.stringify({
            name: fullName,
            condition: conditionFocus,
            newsletter,
          })
        );
      }
    } catch (err) {
      // Already handled by hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">
            {mode === "signin" ? "Welcome back 👋" : "Create your Safe Space"}
          </h1>
          <p className="text-slate-500">
            Monitor air, noise, and weather risks with personalized guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase">
            <span>AI Guardian</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Health Check-ins</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Community Forest</span>
          </div>
        </div>

        {mode === "signup" && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">
              What you get with an account:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Personalized AQI & noise alerts for your sensitivities.</li>
              <li>Guided onboarding with clinically-reviewed actions.</li>
              <li>Journey tracking synced securely via Supabase.</li>
            </ul>
          </div>
        )}

        {!isSupabaseReady && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-2xl p-3">
            Supabase credentials not configured. App will run offline-only.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Dr. Aditi Sharma"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Health focus
                </label>
                <select
                  value={conditionFocus}
                  onChange={(e) =>
                    setConditionFocus(e.target.value as HealthCondition)
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="prevention">General prevention</option>
                  <option value="breathing">Breathing sensitivity</option>
                  <option value="hearing">Hearing sensitivity</option>
                  <option value="both">Comprehensive care</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-400 mt-1">
              Use at least 6 characters. Mix letters, numbers & symbols for
              extra safety.
            </p>
          </div>

          {isSignup && (
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Repeat password"
              />
            </div>
          )}

          {isSignup && (
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <input
                id="newsletter"
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="newsletter">
                Send me occasional breathing safety tips, doctor Q&As, and
                product updates.
              </label>
            </div>
          )}

          {(error || localError) && (
            <p className="text-sm text-rose-500">
              {error || localError || "Authentication failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-slate-800 transition-colors disabled:opacity-70"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          {mode === "signin" ? (
            <>
              Need an account?{" "}
              <button
                className="text-teal-500 font-semibold"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-teal-500 font-semibold"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

