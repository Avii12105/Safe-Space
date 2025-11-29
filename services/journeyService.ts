import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { JourneyProgress } from "../types";

const TABLE_NAME = "journey_progress";

export async function fetchJourneyProgress(
  profileId: string
): Promise<JourneyProgress | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    console.error("[supabase] Failed to fetch journey progress", error);
    return null;
  }

  if (!data) return null;

  return {
    profileId: data.profile_id,
    points: data.points ?? 0,
    treesPlanted: data.trees_planted ?? 0,
    streak: data.streak ?? 0,
    updatedAt: data.updated_at ?? undefined,
  };
}

export async function upsertJourneyProgress(
  progress: JourneyProgress
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const payload = {
    profile_id: progress.profileId,
    points: progress.points,
    trees_planted: progress.treesPlanted,
    streak: progress.streak,
  };

  const { error } = await supabase.from(TABLE_NAME).upsert(payload);

  if (error) {
    console.error("[supabase] Failed to upsert journey progress", error);
  }
}

