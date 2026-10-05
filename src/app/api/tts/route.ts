import { NextResponse } from "next/server";
import { getAllowedUser } from "@/lib/auth";
import { voiceId } from "@/lib/ai/providers";
import { toSpeakable } from "@/lib/message";
import type { VoiceKey } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const VOICES: VoiceKey[] = ["kavita", "sunita", "maa"];
const MAX_CHARS = 2500;

export async function POST(req: Request) {
  const auth = await getAllowedUser();
  if (!auth) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ElevenLabs is not set up on the server yet." }, { status: 400 });

  let body: { text?: unknown; voice?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_v4";
  // v3 / v4 models understand audio tags such as [warm]; older models would read them aloud.
  const expressive = /^eleven_v[34]/.test(modelId);
  const styleTag = expressive ? (process.env.ELEVENLABS_STYLE_TAG ?? "[warm]").trim() : "";

  const spoken = toSpeakable(typeof body.text === "string" ? body.text : "").slice(0, MAX_CHARS);
  if (!spoken) return NextResponse.json({ error: "Nothing to read out." }, { status: 400 });
  const text = styleTag ? `${styleTag} ${spoken}` : spoken;

  let voiceKey = VOICES.includes(body.voice as VoiceKey) ? (body.voice as VoiceKey) : undefined;
  if (!voiceKey) {
    const { data } = await auth.supabase.from("settings").select("voice_key").maybeSingle();
    voiceKey = (data?.voice_key as VoiceKey | undefined) ?? "kavita";
  }
  const id = voiceId(voiceKey);
  if (!id) return NextResponse.json({ error: "No ElevenLabs voice ID is configured on the server." }, { status: 400 });

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "content-type": "application/json", accept: "audio/mpeg" },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: expressive
            ? { stability: 0.5 }
            : { stability: 0.5, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
        }),
        signal: AbortSignal.timeout(50_000),
      },
    );
  } catch {
    return NextResponse.json({ error: "Could not reach ElevenLabs." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(`[tts] ElevenLabs ${upstream.status}: ${detail.slice(0, 400)}`);
    const msg =
      upstream.status === 401 ? "The ElevenLabs key on the server was rejected."
      : upstream.status === 404 || upstream.status === 422 ? "That ElevenLabs voice ID was not found."
      : upstream.status === 429 ? "ElevenLabs is busy or out of credits."
      : "ElevenLabs could not create the audio.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  return new Response(upstream.body, {
    headers: { "content-type": "audio/mpeg", "cache-control": "private, no-store" },
  });
}
