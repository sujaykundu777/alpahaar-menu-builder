"use client";

import { useState } from "react";
import { saveSettings, signOut } from "@/app/actions";
import { TONES, VOICES, WRITING_STYLES } from "@/lib/defaults";
import type { Provider, Settings } from "@/lib/types";
import { useApp } from "./AppProvider";
import { useSpeech } from "./useSpeech";

const SAMPLE = "नमस्ते जी! इस रविवार ताज़ा समोसे और बालूशाही तैयार हैं। ऑर्डर करने के लिए आज ही बुकिंग कर लीजिए।";

const PROVIDER_CARDS: { key: Provider; icon: string; name: string; desc: string }[] = [
  { key: "openai", icon: "✨", name: "OpenAI (GPT)", desc: "Best Indian recipe & Hinglish phrasing" },
  { key: "claude", icon: "🧠", name: "Anthropic Claude", desc: "Very polite, warm conversational nuances" },
  { key: "gemini", icon: "💎", name: "Google Gemini", desc: "Fast & multilingual • Great for Indian languages" },
];

function speedLabel(v: number) {
  return `${(v / 100).toFixed(2)}x (${v === 75 ? "Slow" : v === 125 ? "Fast" : "Normal"})`;
}

export default function SettingsView() {
  const app = useApp();
  const { capabilities } = app.data;
  const [form, setForm] = useState<Settings>(app.data.settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const speech = useSpeech(form.voice_key, form.voice_speed / 100);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setForm((f) => ({ ...f, [key]: value }));
  const providerReady = capabilities.providers[form.ai_provider].configured;

  async function onSave() {
    setSaving(true);
    const res = await saveSettings(form);
    setSaving(false);
    if (!res.ok) return app.showToast(res.error, "error");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="tab-content active">
      <div className="settings-banner">
        <div className="settings-icon-circle">⚙️</div>
        <div className="settings-banner-content">
          <div className="settings-banner-header">
            <h1 className="settings-banner-title">AI &amp; Voice Settings</h1>
            <div className="settings-badge">सेटिंग्स</div>
          </div>
          <p className="settings-banner-desc">
            Set up smart writing and warm voice narration so Auntyji can easily create WhatsApp broadcasts and listen with a single tap.
          </p>
          <p className="settings-banner-hindi">आसान सेटिंग्स: एक क्लिक में संदेश लिखें और आवाज में सुनें</p>
        </div>
      </div>

      {/* Voice */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-header-left">
            <div className="section-icon">🔊</div>
            <div className="section-title-group">
              <div className="section-title">Voice Read-Out (आवाज)</div>
              <div className="section-subtitle">ElevenLabs Text-to-Speech</div>
            </div>
          </div>
          <div className={`connected-badge ${capabilities.elevenlabs ? "success" : "warn"}`}>
            <span>•</span>
            <span>{capabilities.elevenlabs ? "Connected (कनेक्टेड)" : "Not set up"}</span>
          </div>
        </div>
        {!capabilities.elevenlabs && (
          <div className="notice">
            The ElevenLabs key is kept safely on the server. Add <code>ELEVENLABS_API_KEY</code> in{" "}
            <code>.env.local</code> (and in the Render environment settings), then restart.
          </div>
        )}

        <div className="voice-option-header">Choose Narration Voice • आवाज चुनें</div>
        <div className="voice-options" role="radiogroup" aria-label="Narration voice">
          {VOICES.map((v) => {
            const selected = form.voice_key === v.key;
            return (
              <div key={v.key} className={`voice-option${selected ? " selected" : ""}`} role="radio" aria-checked={selected} tabIndex={0}
                onClick={() => set("voice_key", v.key)}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("voice_key", v.key); } }}>
                <div className="voice-radio"><div className="voice-radio-dot" /></div>
                <div className="voice-content">
                  <div className="voice-name-row">
                    <div className="voice-name">{v.name}</div>
                    {"badge" in v && (
                      <div className={"special" in v ? "voice-special-badge" : "voice-recommended"}>{v.badge}</div>
                    )}
                  </div>
                  <div className="voice-desc">
                    {v.desc}
                    {capabilities.elevenlabs && !capabilities.voices[v.key] && " • (voice ID not set – uses Kavita)"}
                  </div>
                </div>
                <div className="voice-icon">{v.icon}</div>
              </div>
            );
          })}
        </div>

        <div className="sample-preview">
          <div className="sample-preview-header">
            <div className="sample-preview-title">Sample Preview (सुनकर देखें):</div>
            <div className="ready-status">{capabilities.elevenlabs ? "Ready" : "Off"}</div>
          </div>
          <button type="button" className="test-button" disabled={!capabilities.elevenlabs || speech.state === "loading"}
            onClick={() => speech.toggle(SAMPLE)}>
            {speech.state === "loading" ? <span className="spinner" /> : <span>{speech.state === "playing" ? "⏸" : "▶"}</span>}
            <span>
              {speech.state === "loading" ? "Preparing… (तैयार हो रहा है)"
                : speech.state === "playing" ? "Playing… (आवाज चल रही है)"
                : "Test Read-out (आवाज सुनें)"}
            </span>
          </button>
          <div className="sample-quote">{SAMPLE}</div>
          {speech.error && <div className="notice error" role="alert">{speech.error}</div>}
        </div>

        <div className="speed-slider-group">
          <div className="speed-header">
            <div className="speed-label">Speaking Speed (बोलने की रफ़्तार)</div>
            <div className="speed-value">{speedLabel(form.voice_speed)}</div>
          </div>
          <div className="slider-container">
            <input type="range" className="slider" min={75} max={125} step={25} value={form.voice_speed}
              aria-label="Speaking speed" onChange={(e) => set("voice_speed", Number(e.target.value))} />
          </div>
          <div className="speed-markers">
            <div className="speed-marker">0.75x<br />Slow for Elders<br />साफ आवाज</div>
            <div className="speed-marker">1.0x<br />Standard</div>
            <div className="speed-marker">1.25x<br />Fast</div>
          </div>
        </div>
      </div>

      {/* AI writer */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-header-left">
            <div className="section-icon">🤖</div>
            <div className="section-title-group">
              <div className="section-title">AI Message Writer (मैसेज मॉडल)</div>
              <div className="section-subtitle">WhatsApp Broadcast Generation</div>
            </div>
          </div>
          <div className={`connected-badge ${providerReady ? "ready" : "warn"}`}>
            <span>•</span>
            <span>{providerReady ? "Ready" : "Key missing"}</span>
          </div>
        </div>

        <div className="model-providers" role="radiogroup" aria-label="AI provider">
          {PROVIDER_CARDS.map((p) => {
            const cap = capabilities.providers[p.key];
            const selected = form.ai_provider === p.key;
            return (
              <div key={p.key} className={`model-card${selected ? " selected" : ""}${cap.configured ? "" : " disabled"}`}
                role="radio" aria-checked={selected} tabIndex={0} onClick={() => set("ai_provider", p.key)}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("ai_provider", p.key); } }}>
                <div className="model-icon">{p.icon}</div>
                <div className="model-content">
                  <div className="model-name">{p.name} <span style={{ fontWeight: 400, fontSize: 12 }}>· {cap.model}</span></div>
                  <div className="model-desc">{p.desc}</div>
                  <div className={`model-status${cap.configured ? "" : " missing"}`}>
                    {cap.configured ? "✔ Key set on server" : "Key not set on server"}
                  </div>
                </div>
                {selected && <div className="model-checkmark">✓</div>}
              </div>
            );
          })}
        </div>
        {!providerReady && (
          <div className="notice">
            No key for this provider yet. Messages will use the standard template until it is added on the server.
          </div>
        )}

        <div className="input-group" style={{ marginTop: "1rem" }}>
          <label className="input-label" htmlFor="style">Writing Style • बात करने का अंदाज</label>
          <select id="style" className="select-field" value={form.writing_style}
            onChange={(e) => set("writing_style", e.target.value as Settings["writing_style"])}>
            {WRITING_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="tone">Default Language • भाषा</label>
          <select id="tone" className="select-field" value={form.default_tone}
            onChange={(e) => set("default_tone", e.target.value as Settings["default_tone"])}>
            {TONES.map((t) => <option key={t.value} value={t.value}>{t.label.replace(" (Recommended)", "")} – {t.note}</option>)}
          </select>
        </div>
      </div>

      {/* Kitchen & UPI */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-header-left">
            <div className="section-icon">🏪</div>
            <div className="section-title-group">
              <div className="section-title">Kitchen &amp; UPI Details</div>
              <div className="section-subtitle">डिफ़ॉल्ट पता और पेमेंट नंबर</div>
            </div>
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="upi">Google Pay / PhonePe UPI Mobile • यूपीआई नंबर</label>
          <div className="input-wrapper">
            <input id="upi" type="tel" inputMode="tel" className="input-field" placeholder="Enter UPI number"
              value={form.upi_number} onChange={(e) => set("upi_number", e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="group">Society WhatsApp Group Name • ग्रुप का नाम</label>
          <div className="input-wrapper">
            <input id="group" type="text" className="input-field" placeholder="Enter group name"
              value={form.group_name} onChange={(e) => set("group_name", e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="addr">Pickup Flat / Kitchen Counter • पिकअप का पता</label>
          <div className="input-wrapper">
            <input id="addr" type="text" className="input-field" placeholder="Enter pickup address"
              value={form.pickup_address} onChange={(e) => set("pickup_address", e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="drop">Usual Pickup Time • पिकअप का समय</label>
          <div className="input-wrapper">
            <input id="drop" type="text" className="input-field" placeholder="6:00 PM"
              value={form.drop_time} onChange={(e) => set("drop_time", e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="cutoff">Order Cut-off • ऑर्डर बंद होने का समय</label>
          <div className="input-wrapper">
            <input id="cutoff" type="text" className="input-field" placeholder="Sunday 11:00 AM"
              value={form.cutoff_text} onChange={(e) => set("cutoff_text", e.target.value)} />
          </div>
        </div>
      </div>

      <button type="button" className="save-button" onClick={onSave} disabled={saving}
        style={saved ? { background: "#16a34a" } : undefined}>
        <span>{saved ? "✓" : saving ? "⏳" : "💾"}</span>
        <span>{saved ? "Settings Saved! (सेटिंग्स सेव हो गईं)" : saving ? "Saving…" : "Save Settings (सेव करें)"}</span>
      </button>

      <div className="security-note">
        <div className="security-icon">🔒</div>
        <div className="security-text">
          <strong>Secure &amp; Private:</strong> AI and voice keys live only on the server (never in this phone&apos;s browser) and
          are never shown here. Your menu and prices are saved in your private account.
        </div>
      </div>

      <div className="account-line" style={{ marginTop: "1.25rem" }}>Signed in as {app.data.email}</div>
      <form action={signOut}>
        <button type="submit" className="signout-btn">Sign out (साइन आउट)</button>
      </form>
    </div>
  );
}
