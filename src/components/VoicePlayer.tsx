"use client";

import { useState } from "react";
import { VOICES } from "@/lib/defaults";
import { formatDuration } from "@/lib/format";
import { useApp } from "./AppProvider";
import { useSpeech } from "./useSpeech";

const SPEEDS = [0.75, 1, 1.25, 1.5];

export default function VoicePlayer() {
  const { data, previewMessage, draft, showToast } = useApp();
  const { settings, capabilities } = data;
  const voice = VOICES.find((v) => v.key === settings.voice_key) ?? VOICES[0];
  const [speedIdx, setSpeedIdx] = useState(() => {
    const idx = SPEEDS.indexOf(settings.voice_speed / 100);
    return idx >= 0 ? idx : 1;
  });
  const { state, time, error, toggle, prepare, getBlob, isReady, preparing } = useSpeech(settings.voice_key, SPEEDS[speedIdx]);
  const enabled = capabilities.elevenlabs;
  const ready = isReady(previewMessage);
  const fileName = `alpahaar-foods-batch-${draft.batchNo}.mp3`;

  function download(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  // Two taps on purpose: phones only allow the share sheet right after a tap, and making the
  // voice takes a few seconds. First tap prepares it, second tap shares instantly.
  async function onShareAudio() {
    if (!ready) {
      if (await prepare(previewMessage)) showToast("Voice note ready — tap Share again 🎤 (अब दोबारा दबाएं)");
      return;
    }
    const blob = getBlob(previewMessage);
    if (!blob) return;
    const file = new File([blob], fileName, { type: "audio/mpeg" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Alpahaar Foods – weekend menu" });
      } else {
        download(blob);
        showToast("Audio downloaded. In WhatsApp tap 📎 and attach it. (WhatsApp में 📎 से जोड़ें)");
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return; // she closed the share sheet
      download(blob);
      showToast("Could not open sharing, so the audio was downloaded instead.", "error");
    }
  }

  async function onDownload() {
    if (!ready) {
      if (await prepare(previewMessage)) showToast("Voice note ready — tap Download again (अब दोबारा दबाएं)");
      return;
    }
    const blob = getBlob(previewMessage);
    if (blob) download(blob);
  }

  const pct = time.duration > 0 ? Math.min(100, (time.current / time.duration) * 100) : 0;

  return (
    <div className="voice-player">
      <div className="player-header">
        <div className="player-info">
          <button
            type="button"
            className="play-btn"
            aria-label={state === "playing" ? "Pause voice preview" : "Play voice preview"}
            disabled={!enabled}
            onClick={() => toggle(previewMessage)}
          >
            {state === "loading" ? <span className="spinner" /> : state === "playing" ? "⏸" : "▶"}
          </button>
          <div className="voice-info">
            <div className="voice-name">{voice.name}</div>
            <div className="voice-duration">
              {!enabled
                ? "Voice not set up yet"
                : state === "loading"
                  ? "Preparing voice… (आवाज़ बन रही है)"
                  : time.duration
                    ? `${formatDuration(time.current)} / ${formatDuration(time.duration)}`
                    : "Tap ▶ to listen (सुनने के लिए दबाएं)"}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="speed-toggle"
          aria-label="Change speaking speed"
          onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
        >
          {SPEEDS[speedIdx].toFixed(speedIdx === 1 ? 1 : 2).replace(/0$/, "")}×
        </button>
      </div>
      <div className="waveform">
        <div className="waveform-progress" style={{ width: `${pct}%` }} />
      </div>
      {enabled && (
        <div className="action-grid">
          <button type="button" className="action-btn primary" onClick={onShareAudio} disabled={preparing}>
            {preparing ? <span className="spinner" /> : <span>🎤</span>}
            <span>{preparing ? "Making…" : ready ? "Share voice note" : "Prepare voice note"}</span>
          </button>
          <button type="button" className="action-btn" onClick={onDownload} disabled={preparing}>
            <span>⬇️</span>
            <span>{ready ? "Download MP3" : "Prepare MP3"}</span>
          </button>
        </div>
      )}
      {error && <div className="notice error" role="alert">{error}</div>}
      {!enabled && (
        <div className="field-note">
          Add <code>ELEVENLABS_API_KEY</code> on the server to turn this on.
        </div>
      )}
    </div>
  );
}
