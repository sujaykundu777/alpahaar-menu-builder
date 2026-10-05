"use client";

import { useEffect, useRef, useState } from "react";
import { saveDish } from "@/app/actions";
import { CATEGORIES, UNITS } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/client";
import type { Category, Dish, Unit } from "@/lib/types";
import { useApp } from "./AppProvider";

interface Form {
  name_en: string;
  name_hi: string;
  desc_en: string;
  desc_hi: string;
  category: Category;
  price: string;
  unit: Unit;
  party_price: string;
  party_min_qty: string;
  party_note: string;
  notes: string;
  image_url: string | null;
  active: boolean;
}

const EMPTY: Form = {
  name_en: "", name_hi: "", desc_en: "", desc_hi: "", category: "hot-snacks", price: "", unit: "piece",
  party_price: "", party_min_qty: "", party_note: "", notes: "", image_url: null, active: true,
};

function fromDish(d: Dish): Form {
  return {
    name_en: d.name_en, name_hi: d.name_hi ?? "", desc_en: d.desc_en ?? "", desc_hi: d.desc_hi ?? "",
    category: d.category, price: String(d.price), unit: d.unit,
    party_price: d.party_price == null ? "" : String(d.party_price),
    party_min_qty: d.party_min_qty == null ? "" : String(d.party_min_qty),
    party_note: d.party_note ?? "", notes: d.notes ?? "", image_url: d.image_url, active: d.active,
  };
}

export default function DishModal() {
  const { dishModal, closeDishModal, data, showToast } = useApp();
  const { open, dish } = dishModal;
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(dish ? fromDish(dish) : EMPTY);
      setError(null);
    }
  }, [open, dish]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const cat = CATEGORIES[form.category];

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) return setError("Only JPG and PNG images are allowed.");
    if (file.size > 5 * 1024 * 1024) return setError("Image size must be less than 5MB.");
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.type === "image/png" ? "png" : "jpg";
      const path = `${data.userId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("dish-images").upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      set("image_url", supabase.storage.from("dish-images").getPublicUrl(path).data.publicUrl);
    } catch {
      setError("Could not upload the photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    setError(null);
    if (!form.name_en.trim() || form.price === "") return setError("Please fill in at least the English name and price.");
    setSaving(true);
    const res = await saveDish({
      id: dish?.id,
      name_en: form.name_en,
      name_hi: form.name_hi || null,
      desc_en: form.desc_en || null,
      desc_hi: form.desc_hi || null,
      category: form.category,
      emoji: dish && dish.category === form.category ? dish.emoji : cat.emoji,
      price: Number(form.price),
      unit: form.unit,
      party_price: form.party_price === "" ? null : Number(form.party_price),
      party_min_qty: form.party_min_qty === "" ? null : Number(form.party_min_qty),
      party_note: form.party_note || null,
      notes: form.notes || null,
      image_url: form.image_url,
      active: form.active,
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    showToast(`✓ ${res.data.name_en} saved (सेव हो गया)`);
    closeDishModal();
  }

  return (
    <div className={`modal-overlay${open ? " active" : ""}`} onClick={(e) => e.target === e.currentTarget && closeDishModal()}
      role="dialog" aria-modal="true" aria-label={dish ? "Edit dish" : "Add new dish"} aria-hidden={!open}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-title">{dish ? "Edit Dish" : "Add New Dish or Item"}</div>
            <div className="modal-subtitle">{dish ? "आइटम बदलें" : "नया आइटम जोड़ें"}</div>
          </div>
          <button type="button" className="modal-close" onClick={closeDishModal} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="form-section">
            <div className="form-section-title">🍽️ Dish Name • डिश का नाम</div>
            <div className="input-group">
              <label className="input-label" htmlFor="dish-name-en">English Name</label>
              <input id="dish-name-en" type="text" className="input-field" placeholder="e.g., Crispy Samosa"
                value={form.name_en} onChange={(e) => set("name_en", e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="dish-name-hi">Hindi Name • हिंदी नाम</label>
              <input id="dish-name-hi" type="text" className="input-field" placeholder="e.g., कुरकुरा समोसा"
                value={form.name_hi} onChange={(e) => set("name_hi", e.target.value)} />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">📂 Category • श्रेणी</div>
            <div className="category-pills">
              {(Object.keys(CATEGORIES) as Category[]).map((key) => (
                <div key={key} role="radio" aria-checked={form.category === key} tabIndex={0}
                  className={`category-pill${form.category === key ? " selected" : ""}`}
                  onClick={() => set("category", key)}
                  onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("category", key); } }}>
                  <div className="category-pill-name">{CATEGORIES[key].en}</div>
                  <div className="category-pill-hindi">{CATEGORIES[key].hi}</div>
                </div>
              ))}
            </div>
            <div className="category-image-display">
              <div className="category-image-icon">{cat.emoji}</div>
              <div className="category-image-info">
                <div className="category-image-name">{cat.en}</div>
                <div className="category-image-desc">{cat.hi}</div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">📷 Dish Photo • डिश की तस्वीर</div>
            <div className="image-upload-container">
              <div className={`image-preview-box${form.image_url ? " has-image" : ""}`}>
                {form.image_url ? (
                  <img src={form.image_url} alt="Dish preview" className="image-preview visible" />
                ) : (
                  <div className="image-placeholder">
                    <div className="image-placeholder-icon">📸</div>
                    <div className="image-placeholder-text">No Image</div>
                  </div>
                )}
              </div>
              <div className="image-upload-actions">
                <button type="button" className="upload-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <span>{uploading ? "⏳" : "📤"}</span><span>{uploading ? "Uploading…" : "Upload Photo"}</span>
                </button>
                {form.image_url && (
                  <button type="button" className="upload-btn remove" onClick={() => set("image_url", null)}>
                    <span>🗑️</span><span>Remove Photo</span>
                  </button>
                )}
                <div className="upload-help-text">JPG, PNG up to 5MB • Recommended 400×400px</div>
              </div>
            </div>
            <input ref={fileRef} type="file" className="file-input-hidden" accept="image/jpeg,image/png" onChange={onFile} />
          </div>

          <div className="form-section">
            <div className="form-section-title">📝 Description • विवरण</div>
            <div className="input-group">
              <label className="input-label" htmlFor="dish-desc-en">English Description</label>
              <input id="dish-desc-en" type="text" className="input-field" placeholder="e.g., Potato & cashew filling"
                value={form.desc_en} onChange={(e) => set("desc_en", e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="dish-desc-hi">Hindi Description • हिंदी विवरण</label>
              <input id="dish-desc-hi" type="text" className="input-field" placeholder="e.g., आलू व काजू भरावन"
                value={form.desc_hi} onChange={(e) => set("desc_hi", e.target.value)} />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">💰 Pricing • दाम</div>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label" htmlFor="dish-price">Price • दाम (₹)</label>
                <input id="dish-price" type="number" inputMode="decimal" min="0" step="any" className="input-field" placeholder="25"
                  value={form.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="dish-unit">Unit • इकाई</label>
                <select id="dish-unit" className="select-field" value={form.unit} onChange={(e) => set("unit", e.target.value as Unit)}>
                  {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">🎉 Party Offer (Optional) • पार्टी ऑफर</div>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label" htmlFor="party-price">Party Price (₹)</label>
                <input id="party-price" type="number" inputMode="decimal" min="0" step="any" className="input-field" placeholder="23"
                  value={form.party_price} onChange={(e) => set("party_price", e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="party-min-qty">Min Quantity</label>
                <input id="party-min-qty" type="number" inputMode="numeric" min="1" step="1" className="input-field" placeholder="14"
                  value={form.party_min_qty} onChange={(e) => set("party_min_qty", e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="party-note">Offer Note (Optional)</label>
              <input id="party-note" type="text" className="input-field" placeholder="e.g., Order 2 days before"
                value={form.party_note} onChange={(e) => set("party_note", e.target.value)} />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">📌 Additional Notes • अतिरिक्त नोट्स</div>
            <div className="input-group">
              <label className="input-label" htmlFor="dish-notes">Special Notes (Optional)</label>
              <input id="dish-notes" type="text" className="input-field" placeholder="e.g., Min order 2 pcs, Freshly prepared"
                value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>

          <div className="toggle-row">
            <div>
              <div className="toggle-row-label">Active in Menu</div>
              <div className="toggle-row-desc">Show this item in weekend menu</div>
            </div>
            <button type="button" role="switch" aria-checked={form.active} aria-label="Active in menu"
              className={`toggle-switch${form.active ? " on" : ""}`} onClick={() => set("active", !form.active)}>
              <div className="toggle-knob" />
            </button>
          </div>

          {error && <div className="notice error" role="alert">{error}</div>}
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn cancel" onClick={closeDishModal}><span>Cancel</span></button>
          <button type="button" className="modal-btn save" onClick={onSave} disabled={saving || uploading}>
            <span>{saving ? "⏳" : "💾"}</span><span>{saving ? "Saving…" : "Save Dish"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
