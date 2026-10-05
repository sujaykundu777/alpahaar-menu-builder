import { NextResponse } from "next/server";
import { getAllowedUser } from "@/lib/auth";
import { buildPrompt } from "@/lib/ai/prompt";
import { cleanMessage, generateText, getModel, ProviderError } from "@/lib/ai/providers";
import { buildTemplateMessage, missingPrices } from "@/lib/message";
import type { Dish, Provider, Settings, Tone } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const PROVIDERS: Provider[] = ["openai", "claude", "gemini"];
const TONES: Tone[] = ["hinglish", "english", "hindi"];

export async function POST(req: Request) {
  const auth = await getAllowedUser();
  if (!auth) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const dishIds = Array.isArray(body.dishIds) ? body.dishIds.filter((x): x is string => typeof x === "string") : [];
  const tone = TONES.includes(body.tone as Tone) ? (body.tone as Tone) : "hinglish";
  const batchDate = typeof body.batchDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.batchDate) ? body.batchDate : "";
  if (!dishIds.length) return NextResponse.json({ error: "Please select at least one dish." }, { status: 400 });
  if (!batchDate) return NextResponse.json({ error: "Please pick the batch date." }, { status: 400 });

  // Prices always come from the database, never from the browser.
  const [{ data: dishRows }, { data: settingsRow }] = await Promise.all([
    auth.supabase.from("dishes").select("*").in("id", dishIds),
    auth.supabase.from("settings").select("*").maybeSingle(),
  ]);
  const byId = new Map((dishRows as Dish[] | null)?.map((d) => [d.id, d]));
  const dishes = dishIds.map((id) => byId.get(id)).filter((d): d is Dish => Boolean(d));
  if (!dishes.length) return NextResponse.json({ error: "Those dishes were not found." }, { status: 404 });

  const settings = settingsRow as Settings | null;
  const provider = PROVIDERS.includes(body.provider as Provider) ? (body.provider as Provider) : settings?.ai_provider ?? "gemini";

  const input = {
    dishes,
    tone,
    batchDate,
    dropTime: String(body.dropTime ?? settings?.drop_time ?? ""),
    cutoffText: String(body.cutoffText ?? settings?.cutoff_text ?? ""),
    pickupAddress: String(body.pickupAddress ?? settings?.pickup_address ?? ""),
    upiNumber: settings?.upi_number ?? "",
  };
  const template = () => buildTemplateMessage(input);

  try {
    const { system, user } = buildPrompt(input, {
      writing_style: settings?.writing_style ?? "warm",
      group_name: settings?.group_name ?? "",
    });
    const message = cleanMessage(await generateText(provider, system, user));
    if (!message) throw new ProviderError("The AI returned an empty message.");

    const missing = missingPrices(message, dishes);
    if (missing.length) {
      console.warn("[generate-message] AI message missing prices for:", missing.join(", "));
      return NextResponse.json({
        message: template(),
        source: "template",
        notice: "The AI message did not match your prices, so the standard message was used instead.",
      });
    }
    return NextResponse.json({ message, source: "ai", provider, model: getModel(provider) });
  } catch (e) {
    const msg = e instanceof ProviderError ? e.message : "Could not generate the message.";
    console.error("[generate-message]", e);
    return NextResponse.json({ message: template(), source: "template", notice: `${msg} The standard message was used instead.` });
  }
}
