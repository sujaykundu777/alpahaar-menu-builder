"use client";

import { useApp } from "./AppProvider";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className={`toast${toast.kind === "error" ? " error" : ""}`} role="status" aria-live="polite">
      {toast.text}
    </div>
  );
}
