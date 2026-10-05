"use client";

import { useRouter } from "next/navigation";
import { TONES } from "@/lib/defaults";
import { formatDateEn, formatDateHi, partyLabel, priceLabel } from "@/lib/format";
import type { Dish } from "@/lib/types";
import { useApp } from "./AppProvider";
import VoicePlayer from "./VoicePlayer";

function DishChoice({ dish, selected, onToggle }: { dish: Dish; selected: boolean; onToggle: () => void }) {
  return (
    <div
      className={`snack-item${selected ? " selected" : ""}`}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="checkbox">
        <span className="checkmark">✓</span>
      </div>
      {dish.image_url && <img src={dish.image_url} alt="" className="snack-thumb" />}
      <div className="snack-content">
        <div className="snack-name">{dish.name_en}</div>
        {dish.name_hi && <div className="snack-name-hindi">{dish.name_hi}</div>}
      </div>
      <div className="snack-price">{priceLabel(dish)}</div>
      {dish.party_price != null && dish.party_min_qty != null && (
        <div className="party-offer-badge">PARTY ₹{dish.party_price}</div>
      )}
    </div>
  );
}

export default function MenuBuilder() {
  const router = useRouter();
  const app = useApp();
  const { draft, activeDishes, selectedDishes, generating } = app;

  const snacks = activeDishes.filter((d) => d.category === "hot-snacks");
  const sweets = activeDishes.filter((d) => d.category !== "hot-snacks");
  const partyDishes = selectedDishes.filter((d) => partyLabel(d));

  async function onGenerate() {
    if (await app.generate()) router.push("/preview");
  }

  return (
    <div className="tab-content active">
      <section className="greeting">
        <div className="greeting-header">
          <h1 className="greeting-title">Namaste Auntyji! 🙏</h1>
          <div className="batch-badge">Batch #{draft.batchNo}</div>
        </div>
      </section>

      {/* Logistics */}
      <div className="card">
        <h2 className="card-title">This Weekend&apos;s Details</h2>
        <div className="logistics-grid">
          <div className="logistics-item">
            <div className="logistics-icon">📅</div>
            <div className="logistics-content">
              <label className="logistics-label" htmlFor="batch-date">Batch Date</label>
              <input id="batch-date" type="date" className="input-field logistics-input" value={draft.batchDate}
                onChange={(e) => e.target.value && app.setBatchDate(e.target.value)} />
              <div className="logistics-value">{formatDateEn(draft.batchDate)}</div>
              <div className="logistics-hindi">{formatDateHi(draft.batchDate)}</div>
            </div>
          </div>
          <div className="logistics-item">
            <div className="logistics-icon">🚚</div>
            <div className="logistics-content">
              <label className="logistics-label" htmlFor="drop-time">Pickup / Drop Time • शाम का समय</label>
              <input id="drop-time" type="text" className="input-field logistics-input" value={app.dropTime}
                onChange={(e) => app.setOverride("dropTime", e.target.value)} />
            </div>
          </div>
          <div className="logistics-item">
            <div className="logistics-icon">⏰</div>
            <div className="logistics-content">
              <label className="logistics-label" htmlFor="cutoff">Pre-order Cutoff • ऑर्डर बंद</label>
              <input id="cutoff" type="text" className="input-field logistics-input" value={app.cutoffText}
                onChange={(e) => app.setOverride("cutoff", e.target.value)} />
            </div>
          </div>
          <div className="logistics-item">
            <div className="logistics-icon">📍</div>
            <div className="logistics-content">
              <label className="logistics-label" htmlFor="pickup">Pickup Location • पिकअप का पता</label>
              <input id="pickup" type="text" className="input-field logistics-input" value={app.pickupAddress}
                placeholder="Flat / building" onChange={(e) => app.setOverride("pickup", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Snacks */}
      <div className="card">
        <h2 className="card-title">
          🥟 Fresh Snacks
          <div className="card-subtitle">ताज़ा नाश्ता</div>
        </h2>
        {snacks.length === 0 ? (
          <div className="empty-state">
            <strong>No snacks yet</strong>
            Add your first dish below. (अभी कोई आइटम नहीं है)
          </div>
        ) : (
          <div className="snack-list">
            {snacks.map((d) => (
              <DishChoice key={d.id} dish={d} selected={draft.dishIds.includes(d.id)} onToggle={() => app.toggleDish(d.id)} />
            ))}
          </div>
        )}
        {partyDishes.length > 0 && (
          <div className="snack-price-note" style={{ marginTop: "0.75rem", textAlign: "center" }}>
            Party offer: {partyDishes.map((d) => `${d.name_en} – ${partyLabel(d)}`).join(" • ")}
          </div>
        )}
      </div>

      {/* Mithai & Namkeen */}
      <div className="card">
        <h2 className="card-title">
          🍬 Mithai &amp; Namkeen
          <div className="card-subtitle">मिठाई और नमकीन</div>
        </h2>
        {sweets.length > 0 && (
          <div className="snack-list" style={{ marginBottom: "0.875rem" }}>
            {sweets.map((d) => (
              <DishChoice key={d.id} dish={d} selected={draft.dishIds.includes(d.id)} onToggle={() => app.toggleDish(d.id)} />
            ))}
          </div>
        )}
        <button type="button" className="add-custom-btn" onClick={() => app.openDishModal(null)}>
          <span style={{ fontSize: 20 }}>+</span>
          <span>Add Custom Item</span>
        </button>
      </div>

      {/* Tone */}
      <div className="card">
        <h2 className="card-title">
          💬 Message Tone
          <div className="card-subtitle">संदेश का स्वर</div>
        </h2>
        <div className="tone-selector" role="radiogroup" aria-label="Message tone">
          {TONES.map((t) => (
            <div
              key={t.value}
              className={`tone-option${draft.tone === t.value ? " selected" : ""}`}
              role="radio"
              aria-checked={draft.tone === t.value}
              tabIndex={0}
              onClick={() => app.setTone(t.value)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  app.setTone(t.value);
                }
              }}
            >
              <div className="radio"><div className="radio-dot" /></div>
              <div style={{ flex: 1 }}>
                <div className="tone-label">{t.label}</div>
                <div className="tone-label-note">{t.note}</div>
              </div>
              {"badge" in t && <div className="recommended-badge">{t.badge}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Voice + live message preview */}
      <div className="card">
        <h2 className="card-title">
          🎙️ Voice Preview
          <div className="card-subtitle">आवाज़ का पूर्वावलोकन</div>
        </h2>
        <VoicePlayer />
        <div className="whatsapp-preview">
          <div className="whatsapp-text">{app.previewMessage}</div>
          <div className="whatsapp-time">{app.hasMessage ? "Generated ✓✓" : "Live preview"}</div>
        </div>
        {app.stale && <div className="notice">Menu changed since this message was written. Tap Generate to refresh it. (मेन्यू बदला है — दोबारा बनाएं)</div>}
      </div>

      <div className="floating-cta">
        <button type="button" className="cta-btn" onClick={onGenerate} disabled={generating || selectedDishes.length === 0}>
          {generating ? <span className="spinner" /> : <span>✨</span>}
          <span>
            {generating
              ? "Writing… (लिख रहे हैं)"
              : selectedDishes.length === 0
                ? "Tick a dish to start"
                : app.hasMessage ? "Regenerate WhatsApp Message" : "Generate WhatsApp Message"}
          </span>
        </button>
      </div>
    </div>
  );
}

