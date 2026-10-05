import type { Capabilities, Provider, VoiceKey } from "../types";

const TIMEOUT_MS = 40_000;

export function getModel(provider: Provider) {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_MODEL || "gpt-4o-mini";
    case "claude":
      return process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
    case "gemini":
      return process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }
}

function keyFor(provider: Provider) {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "claude":
      return process.env.ANTHROPIC_API_KEY;
    case "gemini":
      return process.env.GEMINI_API_KEY;
  }
}

export const DEFAULT_VOICE_ID = "iPmVSMDLX3FRQaONHDW2";

export function voiceId(voice: VoiceKey) {
  const map: Record<VoiceKey, string | undefined> = {
    kavita: process.env.ELEVENLABS_VOICE_KAVITA,
    sunita: process.env.ELEVENLABS_VOICE_SUNITA,
    maa: process.env.ELEVENLABS_VOICE_MAA,
  };
  return map[voice] || process.env.ELEVENLABS_VOICE_KAVITA || DEFAULT_VOICE_ID;
}

/** Booleans only – safe to send to the browser. */
export function getCapabilities(): Capabilities {
  const p = (x: Provider) => ({ configured: Boolean(keyFor(x)), model: getModel(x) });
  return {
    providers: { openai: p("openai"), claude: p("claude"), gemini: p("gemini") },
    elevenlabs: Boolean(process.env.ELEVENLABS_API_KEY),
    voices: {
      kavita: true,
      sunita: Boolean(process.env.ELEVENLABS_VOICE_SUNITA),
      maa: Boolean(process.env.ELEVENLABS_VOICE_MAA),
    },
  };
}

export class ProviderError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

async function postJson(url: string, headers: Record<string, string>, body: unknown) {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    throw new ProviderError(e instanceof Error && e.name === "TimeoutError" ? "The AI took too long to answer." : "Could not reach the AI service.");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[ai] ${url} -> ${res.status}: ${text.slice(0, 500)}`);
    if (res.status === 401 || res.status === 403) throw new ProviderError("The AI key on the server was rejected. Please check it.", 502);
    if (res.status === 429) throw new ProviderError("The AI is busy or out of quota. Please try again shortly.", 429);
    throw new ProviderError(`The AI service returned an error (${res.status}).`);
  }
  return res.json();
}

export async function generateText(provider: Provider, system: string, user: string): Promise<string> {
  const apiKey = keyFor(provider);
  if (!apiKey) throw new ProviderError(`No API key configured for ${provider} on the server.`, 400);
  const model = getModel(provider);

  if (provider === "openai") {
    const data = await postJson(
      "https://api.openai.com/v1/chat/completions",
      { authorization: `Bearer ${apiKey}` },
      { model, messages: [{ role: "system", content: system }, { role: "user", content: user }] },
    );
    return String(data?.choices?.[0]?.message?.content ?? "").trim();
  }

  if (provider === "claude") {
    const data = await postJson(
      "https://api.anthropic.com/v1/messages",
      { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      { model, max_tokens: 1200, system, messages: [{ role: "user", content: user }] },
    );
    const blocks: Array<{ type: string; text?: string }> = data?.content ?? [];
    return blocks.filter((b) => b.type === "text").map((b) => b.text ?? "").join("").trim();
  }

  const data = await postJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    { "x-goog-api-key": apiKey },
    {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
    },
  );
  const parts: Array<{ text?: string }> = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? "").join("").trim();
}

/** Strip accidental code fences / quotes models sometimes add. */
export function cleanMessage(raw: string) {
  return raw
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/\n?```$/i, "")
    .replace(/^"""\n?|\n?"""$/g, "")
    .trim();
}
