"use client";

import Link from "next/link";
import { useState } from "react";
import { TONES } from "@/lib/defaults";
import type { ShareChannel } from "@/lib/types";
import { useApp } from "./AppProvider";
import VoicePlayer from "./VoicePlayer";

const CHANNEL_LABEL: Record<ShareChannel, string> = {
  whatsapp: "WhatsApp",
  "whatsapp-group": "WhatsApp Group",
  telegram: "Telegram",
  sms: "SMS",
  clipboard: "Copied",
};

const SHARE_OPTIONS: { channel: ShareChannel; icon: string; cls: string; name: string; desc: string }[] = [
  { channel: "whatsapp", icon: "💬", cls: "whatsapp", name: "WhatsApp Broadcast", desc: "Pick contacts or a broadcast list" },
  { channel: "whatsapp-group", icon: "👥", cls: "whatsapp", name: "WhatsApp Groups", desc: "Post to your society group" },
  { channel: "telegram", icon: "✈️", cls: "telegram", name: "Telegram Channel", desc: "Post to Telegram" },
  { channel: "sms", icon: "📨", cls: "sms", name: "SMS Blast", desc: "Send via text messages" },
  { channel: "clipboard", icon: "📋", cls: "clipboard", name: "Copy to Clipboard", desc: "Paste anywhere" },
];

function shareUrl(channel: ShareChannel, text: string) {
  const t = encodeURIComponent(text);
  switch (channel) {
    case "whatsapp":
    case "whatsapp-group":
      return `https://wa.me/?text=${t}`;
    case "telegram":
      return `https://t.me/share/url?url=%20&text=${t}`;
    case "sms":
      return `sms:?&body=${t}`;
    default:
      return null;
  }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export default function PreviewShare() {
  const app = useApp();
  const { draft, selectedDishes, data } = app;
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const tone = TONES.find((t) => t.value === draft.tone);

  async function onCopy() {
    if (await copyText(app.previewMessage)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else app.showToast("Could not copy. Please select the text and copy it.", "error");
  }

  async function onEditToggle() {
    if (!editing) {
      // Start editing from whatever is shown (template or generated).
      if (!app.hasMessage) app.editMessage(app.previewMessage);
      setEditing(true);
    } else {
      setEditing(false);
      if (await app.persist()) app.showToast("Message saved ✓ (सेव हो गया)");
    }
  }

  async function onShare(channel: ShareChannel) {
    const text = app.previewMessage;
    const url = shareUrl(channel, text);
    // Open the target app first – browsers only allow this directly inside the tap.
    if (url) window.open(url, "_blank", "noopener");
    else if (!(await copyText(text))) return app.showToast("Could not copy. Please select the text and copy it.", "error");
    else app.showToast("Message copied! 📋 (कॉपी हो गया)");
    await app.markShared(channel);
  }

  if (selectedDishes.length === 0 && !app.hasMessage) {
    return (
      <div className="tab-content active">
        <div className="preview-header">
          <h1 className="preview-title">Preview &amp; Share 📱</h1>
          <p className="preview-subtitle">पूर्वावलोकन और साझा करें</p>
        </div>
        <div className="empty-state">
          <strong>Nothing to preview yet</strong>
          Tick the dishes you are making first. (पहले मेन्यू चुनें)
        </div>
        <Link href="/menu" className="add-new-btn" style={{ textDecoration: "none" }}>Go to Menu Builder</Link>
      </div>
    );
  }

  return (
    <div className="tab-content active">
      <div className="preview-header">
        <h1 className="preview-title">Preview &amp; Share 📱</h1>
        <p className="preview-subtitle">पूर्वावलोकन और साझा करें</p>
      </div>

      <div className="message-preview-card">
        <div className="message-preview-label">WhatsApp Message Preview</div>
        {editing ? (
          <textarea className="whatsapp-edit" value={app.previewMessage} onChange={(e) => app.editMessage(e.target.value)}
            aria-label="Edit message" autoFocus />
        ) : (
          <div className="whatsapp-bubble-large">
            <div className="whatsapp-text">{app.previewMessage}</div>
            <div className="whatsapp-time">{app.hasMessage ? "Ready ✓✓" : "Standard message"}</div>
          </div>
        )}
        {app.stale && !editing && (
          <div className="notice">Menu changed since this message was written. Go back and tap Generate to refresh it. (मेन्यू बदला है)</div>
        )}
        <div className="action-grid">
          <button type="button" className="action-btn" onClick={onEditToggle}>
            <span>{editing ? "✓" : "✏️"}</span>
            <span>{editing ? "Done" : "Edit"}</span>
          </button>
          <button type="button" className="action-btn primary" onClick={onCopy}>
            <span>{copied ? "✓" : "📋"}</span>
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          🎙️ Listen
          <div className="card-subtitle">बोलकर सुनें</div>
        </h2>
        <VoicePlayer />
      </div>

      <div className="stats-card">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{selectedDishes.length}</div>
            <div className="stat-label">Items</div>
            <div className="stat-label-hindi">वस्तुएं</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{draft.batchNo}</div>
            <div className="stat-label">Batch #</div>
            <div className="stat-label-hindi">बैच</div>
          </div>
          <div className="stat-item">
            <div className="stat-value small">{tone?.value === "hinglish" ? "Hinglish" : tone?.value === "english" ? "English" : "हिंदी"}</div>
            <div className="stat-label">Language</div>
            <div className="stat-label-hindi">भाषा</div>
          </div>
        </div>
      </div>

      <div className="share-card">
        <h2 className="share-title">
          📤 Share via
          <div className="share-subtitle">साझा करें</div>
        </h2>
        <div className="share-options">
          {SHARE_OPTIONS.map((o) => (
            <button key={o.channel} type="button" className="share-option"
              onClick={() => onShare(o.channel)}>
              <div className={`share-icon ${o.cls}`}>{o.icon}</div>
              <div className="share-content">
                <div className="share-name">{o.name}</div>
                <div className="share-description">{o.desc}</div>
              </div>
              <div className="share-arrow">→</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          📜 Recent Broadcasts
          <div className="card-subtitle">हाल के संदेश</div>
        </h2>
        {data.history.length === 0 ? (
          <div className="empty-state" style={{ marginBottom: 0 }}>Nothing shared yet. (अभी तक कुछ नहीं भेजा)</div>
        ) : (
          <div className="history-list">
            {data.history.map((h) => {
              const d = new Date(h.sent_at);
              const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: "Asia/Kolkata" }).format(d);
              const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "Asia/Kolkata" }).format(d).toUpperCase();
              return (
                <div className="history-item" key={h.id}>
                  <div className="history-date">
                    <div className="history-day">{day}</div>
                    <div className="history-month">{month}</div>
                  </div>
                  <div className="history-content">
                    <div className="history-batch">Batch #{h.batch_no}</div>
                    <div className="history-meta">{CHANNEL_LABEL[h.channel]}</div>
                  </div>
                  <div className="history-status sent">SENT</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
