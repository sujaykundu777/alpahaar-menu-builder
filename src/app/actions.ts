"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAllowedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, UNITS } from "@/lib/defaults";
import type {
  Batch,
  Dish,
  DishInput,
  MessageSource,
  Provider,
  Settings,
  ShareChannel,
  Tone,
  VoiceKey,
  WritingStyle,
} from "@/lib/types";

type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });
const refresh = () => revalidatePath("/", "layout");

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const optStr = (v: unknown, max: number) => str(v, max) || null;
const optNum = (v: unknown) => (v === null || v === undefined || v === "" || Number.isNaN(Number(v)) ? null : Number(v));

// ───────── Auth ─────────
export async function signIn(_prev: { error?: string } | undefined, formData: FormData) {
  const email = str(formData.get("email"), 200);
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email or password is not correct." };
  redirect("/menu");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ───────── Dishes ─────────
export async function saveDish(input: DishInput): Promise<Result<Dish>> {
  const auth = await getAllowedUser();
  if (!auth) return fail("Please sign in again.");

  const name_en = str(input.name_en, 120);
  const price = optNum(input.price);
  if (!name_en) return fail("Please enter the dish name.");
  if (price === null || price < 0) return fail("Please enter a valid price.");
  if (!(input.category in CATEGORIES)) return fail("Please choose a category.");
  if (!UNITS.some((u) => u.value === input.unit)) return fail("Please choose a unit.");

  const party_price = optNum(input.party_price);
  const party_min_qty = optNum(input.party_min_qty);
  if ((party_price === null) !== (party_min_qty === null)) {
    return fail("For a party offer, fill both the party price and the minimum quantity.");
  }

  const row = {
    name_en,
    name_hi: optStr(input.name_hi, 120),
    desc_en: optStr(input.desc_en, 200),
    desc_hi: optStr(input.desc_hi, 200),
    category: input.category,
    emoji: str(input.emoji, 8) || CATEGORIES[input.category].emoji,
    price,
    unit: input.unit,
    party_price,
    party_min_qty: party_min_qty === null ? null : Math.round(party_min_qty),
    party_note: optStr(input.party_note, 120),
    notes: optStr(input.notes, 200),
    image_url: optStr(input.image_url, 500),
    active: Boolean(input.active),
  };

  const q = input.id
    ? auth.supabase.from("dishes").update(row).eq("id", input.id)
    : auth.supabase.from("dishes").insert(row);
  const { data, error } = await q.select("*").single();
  if (error) return fail("Could not save the dish. Please try again.");
  refresh();
  return { ok: true, data: data as Dish };
}

export async function deleteDish(id: string): Promise<Result> {
  const auth = await getAllowedUser();
  if (!auth) return fail("Please sign in again.");
  const { error } = await auth.supabase.from("dishes").delete().eq("id", id);
  if (error) return fail("Could not delete the dish.");
  refresh();
  return { ok: true, data: undefined };
}

export async function setDishActive(id: string, active: boolean): Promise<Result> {
  const auth = await getAllowedUser();
  if (!auth) return fail("Please sign in again.");
  const { error } = await auth.supabase.from("dishes").update({ active }).eq("id", id);
  if (error) return fail("Could not update the dish.");
  refresh();
  return { ok: true, data: undefined };
}

// ───────── Settings ─────────
export async function saveSettings(input: Settings): Promise<Result> {
  const auth = await getAllowedUser();
  if (!auth) return fail("Please sign in again.");

  const providers: Provider[] = ["openai", "claude", "gemini"];
  const tones: Tone[] = ["hinglish", "english", "hindi"];
  const styles: WritingStyle[] = ["warm", "professional", "traditional", "modern"];
  const voices: VoiceKey[] = ["kavita", "sunita", "maa"];
  if (!providers.includes(input.ai_provider) || !tones.includes(input.default_tone) ||
      !styles.includes(input.writing_style) || !voices.includes(input.voice_key)) {
    return fail("Invalid setting value.");
  }
  const speed = Math.min(125, Math.max(75, Math.round(Number(input.voice_speed) || 100)));

  const { error } = await auth.supabase.from("settings").upsert(
    {
      user_id: auth.user.id,
      upi_number: str(input.upi_number, 40),
      group_name: str(input.group_name, 120),
      pickup_address: str(input.pickup_address, 200),
      drop_time: str(input.drop_time, 40) || "6:00 PM",
      cutoff_text: str(input.cutoff_text, 80) || "Sunday 11:00 AM",
      ai_provider: input.ai_provider,
      default_tone: input.default_tone,
      writing_style: input.writing_style,
      voice_key: input.voice_key,
      voice_speed: speed,
    },
    { onConflict: "user_id" },
  );
  if (error) return fail("Could not save settings.");
  refresh();
  return { ok: true, data: undefined };
}

// ───────── Batches & broadcasts ─────────
export interface SaveBatchInput {
  batchId: string | null;
  batchDate: string;
  dropTime: string;
  cutoffText: string;
  pickupAddress: string;
  tone: Tone;
  dishIds: string[];
  message: string;
  messageSource: MessageSource;
}

export async function saveBatch(input: SaveBatchInput): Promise<Result<Batch>> {
  const auth = await getAllowedUser();
  if (!auth) return fail("Please sign in again.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.batchDate)) return fail("Please pick a valid date.");

  const row = {
    batch_date: input.batchDate,
    drop_time: str(input.dropTime, 40),
    cutoff_text: str(input.cutoffText, 80),
    pickup_address: str(input.pickupAddress, 200),
    tone: input.tone,
    dish_ids: input.dishIds.filter((id) => /^[0-9a-f-]{36}$/i.test(id)),
    message: input.message.slice(0, 4000),
    message_source: input.messageSource,
  };

  if (input.batchId) {
    const { data, error } = await auth.supabase.from("batches").update(row).eq("id", input.batchId).select("*").single();
    if (error) return fail("Could not save the message.");
    refresh();
    return { ok: true, data: data as Batch };
  }

  const { data: last } = await auth.supabase
    .from("batches")
    .select("batch_no")
    .order("batch_no", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await auth.supabase
    .from("batches")
    .insert({ ...row, batch_no: (last?.batch_no ?? 0) + 1 })
    .select("*")
    .single();
  if (error) return fail("Could not save the message.");
  refresh();
  return { ok: true, data: data as Batch };
}

export async function logBroadcast(batchId: string, channel: ShareChannel): Promise<Result> {
  const auth = await getAllowedUser();
  if (!auth) return fail("Please sign in again.");
  const channels: ShareChannel[] = ["whatsapp", "whatsapp-group", "telegram", "sms", "clipboard"];
  if (!channels.includes(channel)) return fail("Unknown channel.");

  const { error } = await auth.supabase.from("broadcasts").insert({ batch_id: batchId, channel });
  if (error) return fail("Could not record the broadcast.");
  await auth.supabase.from("batches").update({ status: "sent" }).eq("id", batchId);
  refresh();
  return { ok: true, data: undefined };
}
