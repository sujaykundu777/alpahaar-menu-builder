import { createClient } from "./supabase/server";

export function isEmailAllowed(email: string | undefined | null) {
  const allowed = (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return true;
  return allowed.includes((email ?? "").toLowerCase());
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user, allowed: user ? isEmailAllowed(user.email) : false };
}

/** Signed-in AND allowed user, or null. */
export async function getAllowedUser() {
  const { supabase, user, allowed } = await getSession();
  if (!user || !allowed) return null;
  return { supabase, user };
}
