import { redirect } from "next/navigation";
import { getCapabilities } from "./ai/providers";
import { DEFAULT_SETTINGS, SEED_DISHES } from "./defaults";
import { getSession } from "./auth";
import { nextSunday } from "./format";
import type { AppData, Batch, BroadcastRow, Dish, Provider, Settings } from "./types";

const PROVIDERS: Provider[] = ["openai", "claude", "gemini"];

export type LoadResult = { status: "ok"; data: AppData } | { status: "forbidden"; email: string };

export async function loadAppData(): Promise<LoadResult> {
  const { supabase, user, allowed } = await getSession();
  if (!user) redirect("/login");
  if (!allowed) return { status: "forbidden", email: user.email ?? "" };

  // Settings (creating them – and seeding the starter dishes – on first visit).
  let { data: settingsRow } = await supabase.from("settings").select("*").maybeSingle();
  if (!settingsRow) {
    const envProvider = (process.env.DEFAULT_AI_PROVIDER ?? "") as Provider;
    const ai_provider = PROVIDERS.includes(envProvider) ? envProvider : DEFAULT_SETTINGS.ai_provider;
    const { data: created, error } = await supabase
      .from("settings")
      .upsert({ ...DEFAULT_SETTINGS, ai_provider }, { onConflict: "user_id" })
      .select("*")
      .single();
    if (error) throw new Error(`Could not create settings: ${error.message}`);
    settingsRow = created;
    const { count } = await supabase.from("dishes").select("id", { count: "exact", head: true });
    if (!count) await supabase.from("dishes").insert(SEED_DISHES);
  }

  const [dishesRes, batchRes, historyRes] = await Promise.all([
    supabase.from("dishes").select("*").order("created_at", { ascending: true }),
    supabase.from("batches").select("*").order("batch_no", { ascending: false }).limit(1).maybeSingle(),
    supabase
      .from("broadcasts")
      .select("id, channel, sent_at, batches(batch_no, batch_date)")
      .order("sent_at", { ascending: false })
      .limit(5),
  ]);

  const settings: Settings = {
    upi_number: settingsRow.upi_number,
    group_name: settingsRow.group_name,
    pickup_address: settingsRow.pickup_address,
    drop_time: settingsRow.drop_time,
    cutoff_text: settingsRow.cutoff_text,
    ai_provider: settingsRow.ai_provider,
    default_tone: settingsRow.default_tone,
    writing_style: settingsRow.writing_style,
    voice_key: settingsRow.voice_key,
    voice_speed: settingsRow.voice_speed,
  };

  const latest = batchRes.data as Batch | null;
  type HistoryRow = {
    id: string;
    channel: BroadcastRow["channel"];
    sent_at: string;
    batches: { batch_no: number; batch_date: string } | { batch_no: number; batch_date: string }[] | null;
  };
  const history: BroadcastRow[] = ((historyRes.data ?? []) as unknown as HistoryRow[]).map((r) => {
    const b = Array.isArray(r.batches) ? r.batches[0] : r.batches;
    return { id: r.id, channel: r.channel, sent_at: r.sent_at, batch_no: b?.batch_no ?? 0, batch_date: b?.batch_date ?? "" };
  });

  return {
    status: "ok",
    data: {
      userId: user.id,
      email: user.email ?? "",
      dishes: (dishesRes.data ?? []) as Dish[],
      settings,
      latestBatch: latest,
      nextBatchNo: (latest?.batch_no ?? 0) + 1,
      defaultDate: nextSunday(),
      history,
      capabilities: getCapabilities(),
    },
  };
}
