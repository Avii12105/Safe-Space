import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { UserProfile } from "../types";
import { DEFAULT_PROFILE } from "../constants";

const TABLE_NAME = "profiles";

const toProfile = (payload: Record<string, any>): UserProfile => ({
  ...DEFAULT_PROFILE,
  userId: payload.id,
  name: payload.name || DEFAULT_PROFILE.name,
  condition: payload.condition || DEFAULT_PROFILE.condition,
  ageGroup: payload.age_group || DEFAULT_PROFILE.ageGroup,
  streak: payload.streak ?? DEFAULT_PROFILE.streak,
  points: payload.points ?? DEFAULT_PROFILE.points,
  treesPlanted: payload.trees_planted ?? DEFAULT_PROFILE.treesPlanted,
  gardenLevel: payload.garden_level ?? DEFAULT_PROFILE.gardenLevel,
  onboardingComplete:
    typeof payload.onboarding_complete === "boolean"
      ? payload.onboarding_complete
      : DEFAULT_PROFILE.onboardingComplete,
});

export async function fetchProfile(userId: string): Promise<UserProfile> {
  if (!isSupabaseConfigured || !supabase) {
    return { ...DEFAULT_PROFILE, userId };
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[supabase] Failed to fetch profile", error);
    return { ...DEFAULT_PROFILE, userId };
  }

  if (!data) {
    await upsertProfile({
      ...DEFAULT_PROFILE,
      userId,
      onboardingComplete: false,
    });
    return { ...DEFAULT_PROFILE, userId };
  }

  return toProfile(data);
}

export async function upsertProfile(profile: UserProfile): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !profile.userId) return;

  const payload = {
    id: profile.userId,
    name: profile.name,
    condition: profile.condition,
    age_group: profile.ageGroup,
    streak: profile.streak,
    points: profile.points,
    trees_planted: profile.treesPlanted,
    garden_level: profile.gardenLevel,
    onboarding_complete: profile.onboardingComplete ?? false,
  };

  const { error } = await supabase.from(TABLE_NAME).upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    console.error("[supabase] Failed to upsert profile", error);
  }
}

