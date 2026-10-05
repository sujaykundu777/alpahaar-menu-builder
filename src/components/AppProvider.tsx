"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { logBroadcast, saveBatch } from "@/app/actions";
import { buildTemplateMessage, messageInputFrom } from "@/lib/message";
import type { AppData, Dish, MessageSource, ShareChannel, Tone } from "@/lib/types";

interface Draft {
  batchId: string | null;
  batchNo: number;
  status: "draft" | "sent";
  dishIds: string[];
  tone: Tone;
  batchDate: string;
  dropTimeOverride: string | null;
  cutoffOverride: string | null;
  pickupOverride: string | null;
  message: string; // "" = not generated yet → live template preview
  messageSource: MessageSource;
  generatedKey: string | null;
}

interface Toast {
  text: string;
  kind: "ok" | "error";
}

interface Ctx {
  data: AppData;
  draft: Draft;
  activeDishes: Dish[];
  selectedDishes: Dish[];
  dropTime: string;
  cutoffText: string;
  pickupAddress: string;
  previewMessage: string;
  hasMessage: boolean;
  stale: boolean;
  generating: boolean;
  toast: Toast | null;
  showToast: (text: string, kind?: Toast["kind"]) => void;
  toggleDish: (id: string) => void;
  setTone: (t: Tone) => void;
  setBatchDate: (d: string) => void;
  setOverride: (field: "dropTime" | "cutoff" | "pickup", value: string) => void;
  editMessage: (text: string) => void;
  generate: () => Promise<boolean>;
  persist: () => Promise<string | null>;
  markShared: (channel: ShareChannel) => Promise<void>;
  dishModal: { open: boolean; dish: Dish | null };
  openDishModal: (dish?: Dish | null) => void;
  closeDishModal: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

function initialDraft(data: AppData): Draft {
  const b = data.latestBatch;
  if (b && b.status === "draft") {
    return {
      batchId: b.id,
      batchNo: b.batch_no,
      status: "draft",
      dishIds: b.dish_ids,
      tone: b.tone,
      batchDate: b.batch_date,
      dropTimeOverride: b.drop_time,
      cutoffOverride: b.cutoff_text,
      pickupOverride: b.pickup_address,
      message: b.message,
      messageSource: b.message_source,
      generatedKey: null, // set after first render so "fresh" drafts are not flagged stale
    };
  }
  // New batch – pre-tick last week's dishes (menus often repeat) that still exist & are active.
  const stillActive = new Set(data.dishes.filter((d) => d.active).map((d) => d.id));
  return {
    batchId: null,
    batchNo: data.nextBatchNo,
    status: "draft",
    dishIds: (b?.dish_ids ?? []).filter((id) => stillActive.has(id)),
    tone: data.settings.default_tone,
    batchDate: data.defaultDate,
    dropTimeOverride: null,
    cutoffOverride: null,
    pickupOverride: null,
    message: "",
    messageSource: "template",
    generatedKey: null,
  };
}

export default function AppProvider({ data, children }: { data: AppData; children: React.ReactNode }) {
  const [draft, setDraft] = useState<Draft>(() => initialDraft(data));
  const draftRef = useRef(draft);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [dishModal, setDishModal] = useState<{ open: boolean; dish: Dish | null }>({ open: false, dish: null });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback((patch: Partial<Draft>) => {
    draftRef.current = { ...draftRef.current, ...patch };
    setDraft(draftRef.current);
  }, []);

  const showToast = useCallback((text: string, kind: Toast["kind"] = "ok") => {
    setToast({ text, kind });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const settings = data.settings;
  const activeDishes = useMemo(() => data.dishes.filter((d) => d.active), [data.dishes]);
  const selectedDishes = useMemo(
    () => draft.dishIds.map((id) => activeDishes.find((d) => d.id === id)).filter((d): d is Dish => Boolean(d)),
    [draft.dishIds, activeDishes],
  );

  const dropTime = draft.dropTimeOverride ?? settings.drop_time;
  const cutoffText = draft.cutoffOverride ?? settings.cutoff_text;
  const pickupAddress = draft.pickupOverride ?? settings.pickup_address;

  const templateMessage = useMemo(
    () =>
      buildTemplateMessage(
        messageInputFrom({ dishes: selectedDishes, tone: draft.tone, batchDate: draft.batchDate, dropTime, cutoffText, pickupAddress, settings }),
      ),
    [selectedDishes, draft.tone, draft.batchDate, dropTime, cutoffText, pickupAddress, settings],
  );

  // Fingerprint of everything the message depends on – used to tell the user when it is out of date.
  const currentKey = useMemo(
    () =>
      JSON.stringify([
        selectedDishes.map((d) => [d.id, d.price, d.unit, d.party_price, d.party_min_qty]),
        draft.tone, draft.batchDate, dropTime, cutoffText, pickupAddress, settings.upi_number,
      ]),
    [selectedDishes, draft.tone, draft.batchDate, dropTime, cutoffText, pickupAddress, settings.upi_number],
  );

  // A message loaded from the database is assumed to match its saved inputs.
  useEffect(() => {
    if (draftRef.current.message && draftRef.current.generatedKey === null) update({ generatedKey: currentKey });
  }, [currentKey, update]);

  const hasMessage = draft.message.trim().length > 0;
  const previewMessage = hasMessage ? draft.message : templateMessage;
  const stale = hasMessage && draft.generatedKey !== null && draft.generatedKey !== currentKey;

  const toggleDish = useCallback((id: string) => {
    const cur = draftRef.current.dishIds;
    update({ dishIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  }, [update]);

  const setTone = useCallback((tone: Tone) => update({ tone }), [update]);
  const setBatchDate = useCallback((batchDate: string) => update({ batchDate }), [update]);
  const setOverride = useCallback(
    (field: "dropTime" | "cutoff" | "pickup", value: string) =>
      update(field === "dropTime" ? { dropTimeOverride: value } : field === "cutoff" ? { cutoffOverride: value } : { pickupOverride: value }),
    [update],
  );
  const editMessage = useCallback(
    (text: string) => update({ message: text, messageSource: "edited", generatedKey: draftRef.current.generatedKey ?? currentKey }),
    [update, currentKey],
  );

  const persist = useCallback(async (): Promise<string | null> => {
    const d = draftRef.current;
    const res = await saveBatch({
      batchId: d.batchId,
      batchDate: d.batchDate,
      dropTime,
      cutoffText,
      pickupAddress,
      tone: d.tone,
      dishIds: d.dishIds,
      message: d.message || previewMessage,
      messageSource: d.message ? d.messageSource : "template",
    });
    if (!res.ok) {
      showToast(res.error, "error");
      return null;
    }
    update({ batchId: res.data.id, batchNo: res.data.batch_no, status: res.data.status });
    return res.data.id;
  }, [dropTime, cutoffText, pickupAddress, previewMessage, showToast, update]);

  const generate = useCallback(async () => {
    if (draftRef.current.dishIds.length === 0) {
      showToast("Please tick at least one dish first (कम से कम एक चुनें)", "error");
      return false;
    }
    setGenerating(true);
    try {
      // A new message after a sent broadcast starts a fresh batch.
      if (draftRef.current.status === "sent") update({ batchId: null, status: "draft" });
      const d = draftRef.current;
      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          dishIds: d.dishIds,
          tone: d.tone,
          batchDate: d.batchDate,
          dropTime,
          cutoffText,
          pickupAddress,
          provider: settings.ai_provider,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.message) {
        showToast(json.error ?? "Could not create the message. Please try again.", "error");
        return false;
      }
      update({ message: json.message, messageSource: json.source === "ai" ? "ai" : "template", generatedKey: currentKey });
      await persist();
      showToast(json.notice ?? "Message ready! ✨ (मैसेज तैयार है)", json.notice ? "error" : "ok");
      return true;
    } catch {
      showToast("Network problem. Please try again.", "error");
      return false;
    } finally {
      setGenerating(false);
    }
  }, [dropTime, cutoffText, pickupAddress, settings.ai_provider, currentKey, persist, showToast, update]);

  const markShared = useCallback(
    async (channel: ShareChannel) => {
      const id = await persist();
      if (!id) return;
      const res = await logBroadcast(id, channel);
      if (!res.ok) showToast(res.error, "error");
      else update({ status: "sent" });
    },
    [persist, showToast, update],
  );

  const openDishModal = useCallback((dish: Dish | null = null) => setDishModal({ open: true, dish }), []);
  const closeDishModal = useCallback(() => setDishModal({ open: false, dish: null }), []);

  const value: Ctx = {
    data, draft, activeDishes, selectedDishes, dropTime, cutoffText, pickupAddress,
    previewMessage, hasMessage, stale, generating, toast, showToast,
    toggleDish, setTone, setBatchDate, setOverride, editMessage, generate, persist, markShared,
    dishModal, openDishModal, closeDishModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
