import React, { useEffect, useState } from "react";
import { ViewState, HealthCondition } from "./types";
import { useProfile } from "./hooks/useProfile";
import { useEnvironment } from "./hooks/useEnvironment";
import { useAuth } from "./hooks/useAuth";

import MainLayout from "./layout/MainLayout";
import Onboarding from "./pages/Onboarding";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

function App() {
  const [view, setView] = useState<ViewState>("home");
  const [hasFetchedEnv, setHasFetchedEnv] = useState(false);
  const {
    session,
    loading: authLoading,
    error: authError,
    signIn,
    signUp,
    signOut,
    isAuthReady,
  } = useAuth();
  const userId = session?.user?.id || null;

  const {
    profile,
    dailyQuests,
    showConfetti,
    selectPersona,
    handleQuestComplete,
    loading: profileLoading,
    updateProfile,
  } = useProfile(userId);

  const {
    envData,
    analysis,
    narrativeForecast, // Still keeping for future use or hidden
    loadingText,
    loadingProgress,
    startAnalysis,
  } = useEnvironment();

  // Redirect user to onboarding if they haven't completed it yet
  useEffect(() => {
    if (profileLoading) return;
    if (!profile.onboardingComplete) {
      setView("onboarding");
    } else if (view === "onboarding" || view === "landing") {
      setView("home");
    }
  }, [profile.onboardingComplete, profileLoading, view]);

  const handleConditionSelection = async (condition: HealthCondition) => {
    await selectPersona(condition);
    setView("loading");
    const nextProfile = { ...profile, condition };
    startAnalysis(nextProfile, true, () => setView("home"));
  };

  useEffect(() => {
    if (
      !profileLoading &&
      profile.onboardingComplete &&
      !envData &&
      !hasFetchedEnv &&
      view !== "loading"
    ) {
      setHasFetchedEnv(true);
      setView("loading");
      startAnalysis(profile, true, () => setView("home"));
    }
  }, [profileLoading, profile, envData, hasFetchedEnv, startAnalysis, view]);

  if (!isAuthReady) {
    // When Supabase isn't configured we allow offline usage without auth
  } else if (!authLoading && !session) {
    return (
      <Auth
        onSignIn={signIn}
        onSignUp={signUp}
        loading={authLoading}
        error={authError}
        isSupabaseReady={isAuthReady}
      />
    );
  }

  if (authLoading || profileLoading) {
    return <Loading text="Preparing your space..." progress={70} />;
  }

  return (
    <>
      {view === "onboarding" && (
        <Onboarding onSelectPersona={handleConditionSelection} />
      )}

      {view === "loading" && (
        <Loading text={loadingText} progress={loadingProgress} />
      )}

      {/* Main App Views */}
      {(view === "home" ||
        view === "reports" ||
        view === "journey" ||
        view === "settings" ||
        view === "sos") && (
        <MainLayout
          view={view}
          setView={setView}
          envData={envData}
          showConfetti={showConfetti}
          userId={userId}
          onLogout={signOut}
          userEmail={session?.user?.email}
        >
          {view === "home" && (
            <Home
              profile={profile}
              envData={envData}
              analysis={analysis}
              narrativeForecast={narrativeForecast}
              setView={setView}
            />
          )}

          {view === "reports" && <Reports />}

          {view === "journey" && (
            <Journey profile={profile} userId={userId} />
          )}

          {view === "settings" && (
            <Settings
              profile={profile}
              onUpdateProfile={updateProfile}
              userEmail={session?.user?.email}
            />
          )}
        </MainLayout>
      )}
    </>
  );
}

export default App;
