"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VoiceKey } from "@/lib/types";

export type SpeechState = "idle" | "loading" | "playing" | "paused";

// Tiny silent clip: playing it inside the tap "unlocks" audio on iOS Safari,
// so the real audio can start after the network request finishes.
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export function useSpeech(voice: VoiceKey, rate: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<{ key: string; url: string; blob: Blob } | null>(null);
  const unlockedRef = useRef(false);
  const rateRef = useRef(rate);
  const [state, setState] = useState<SpeechState>("idle");
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [error, setError] = useState<string | null>(null);
  const [cachedKey, setCachedKey] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    rateRef.current = rate;
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("timeupdate", () => setTime({ current: audio.currentTime, duration: audio.duration || 0 }));
    audio.addEventListener("loadedmetadata", () => setTime({ current: 0, duration: audio.duration || 0 }));
    audio.addEventListener("ended", () => {
      setState("idle");
      setTime((t) => ({ ...t, current: 0 }));
    });
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      if (cacheRef.current) URL.revokeObjectURL(cacheRef.current.url);
    };
  }, []);

  /** Fetches (or reuses) the ElevenLabs audio for this text. */
  const ensureAudio = useCallback(
    async (text: string) => {
      const key = `${voice}|${text}`;
      if (cacheRef.current?.key === key) return cacheRef.current;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Could not create the voice.");
      }
      const blob = await res.blob();
      if (cacheRef.current) URL.revokeObjectURL(cacheRef.current.url);
      cacheRef.current = { key, url: URL.createObjectURL(blob), blob };
      setCachedKey(key);
      return cacheRef.current;
    },
    [voice],
  );

  /** Generate the audio without playing it (so a later tap can share it instantly). */
  const prepare = useCallback(
    async (text: string) => {
      setError(null);
      setPreparing(true);
      try {
        await ensureAudio(text);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not create the voice.");
        return false;
      } finally {
        setPreparing(false);
      }
    },
    [ensureAudio],
  );

  const getBlob = useCallback(
    (text: string) => (cacheRef.current?.key === `${voice}|${text}` ? cacheRef.current.blob : null),
    [voice],
  );

  const toggle = useCallback(
    async (text: string) => {
      const audio = audioRef.current;
      if (!audio) return;
      setError(null);

      if (state === "playing") {
        audio.pause();
        setState("paused");
        return;
      }
      const key = `${voice}|${text}`;
      if (state === "loading") return;

      if (state === "paused" && cacheRef.current?.key === key) {
        await audio.play().catch(() => undefined);
        setState("playing");
        return;
      }

      if (!unlockedRef.current) {
        unlockedRef.current = true;
        audio.src = SILENT_WAV;
        audio.play().catch(() => undefined);
      }

      setState("loading");
      try {
        const { url } = await ensureAudio(text);
        audio.src = url;
        audio.playbackRate = rateRef.current;
        await audio.play();
        setState("playing");
      } catch (e) {
        setState("idle");
        setError(e instanceof Error ? e.message : "Could not play the voice.");
      }
    },
    [state, voice, ensureAudio],
  );

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setState("idle");
  }, []);

  const isReady = useCallback((text: string) => cachedKey === `${voice}|${text}`, [cachedKey, voice]);

  return { state, time, error, toggle, stop, prepare, getBlob, isReady, preparing };
}
