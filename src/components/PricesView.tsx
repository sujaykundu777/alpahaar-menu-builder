"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteDish, setDishActive } from "@/app/actions";
import { CATEGORIES } from "@/lib/defaults";
import { money, relativeDay, unitShort } from "@/lib/format";
import type { Category, Dish } from "@/lib/types";
import { useApp } from "./AppProvider";

type Filter = "all" | Category;

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label}
      className={`toggle-switch${on ? " on" : ""}`} onClick={(e) => { e.stopPropagation(); onChange(); }}>
      <div className="toggle-knob" />
    </button>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  const app = useApp();
  const [pending, start] = useTransition();
  const cat = CATEGORIES[dish.category];
  const unitLabel = dish.unit === "piece" ? "piece" : unitShort(dish.unit);

  function onToggle() {
    start(async () => {
      const res = await setDishActive(dish.id, !dish.active);
      if (!res.ok) app.showToast(res.error, "error");
    });
  }

  function onDelete() {
    if (!window.confirm(`Delete ${dish.name_en}? This cannot be undone.\n(${dish.name_en} हटाएं?)`)) return;
    start(async () => {
      const res = await deleteDish(dish.id);
      if (!res.ok) app.showToast(res.error, "error");
      else app.showToast("Dish deleted (हटा दिया)");
    });
  }

  return (
    <div className={`dish-card${dish.active ? "" : " inactive"}`} style={pending ? { opacity: 0.5 } : undefined}>
      <div className="dish-header">
        <div className="dish-image">
          {dish.image_url ? <img src={dish.image_url} alt={dish.name_en} /> : dish.emoji}
        </div>
        <div className="dish-header-content">
          <div className="dish-meta-row">
            <div className={`category-badge ${dish.active ? cat.badgeClass : "paused"}`}>
              {dish.active ? cat.badge : "Paused / Inactive"}
            </div>
            <div className={`active-indicator${dish.active ? "" : " inactive"}`}>
              <div className="active-dot" />
              <span>{dish.active ? "Active in Menu" : "Hidden"}</span>
            </div>
          </div>
          <div className="dish-title">{dish.name_en}</div>
          <div className="dish-subtitle">{dish.desc_hi || dish.name_hi || dish.desc_en}</div>
        </div>
        <div className="dish-toggle">
          <Toggle on={dish.active} label={`Show ${dish.name_en} in menu`} onChange={onToggle} />
        </div>
      </div>

      <div className="pricing-box">
        <div className="pricing-row">
          <div className="pricing-label">Rate:</div>
          <div className="pricing-value">₹{money(dish.price)} / {unitLabel}</div>
        </div>
        {dish.party_price != null && dish.party_min_qty != null && (
          <div className="party-offer-box">
            <span>📢</span>
            <span className="party-offer-text">
              Party Offer: ₹{money(dish.party_price)}/{unitShort(dish.unit)} for {dish.party_min_qty}+ {dish.unit === "piece" ? "pcs" : "units"}
              {dish.party_note ? ` (${dish.party_note})` : ""}
            </span>
          </div>
        )}
        {dish.notes && <div className="pricing-note">{dish.notes}</div>}
        {!dish.active && !dish.notes && <div className="pricing-note">Switch on to show in weekend menu / Not Visible</div>}
      </div>

      <div className="dish-actions">
        <button type="button" className="dish-action-btn edit" onClick={() => app.openDishModal(dish)}>
          <span>✏️</span><span>Edit (बदलें)</span>
        </button>
        <button type="button" className="dish-action-btn delete" onClick={onDelete} disabled={pending}>
          <span>🗑️</span><span>Delete (हटाएं)</span>
        </button>
      </div>
    </div>
  );
}

export default function PricesView() {
  const app = useApp();
  const { dishes } = app.data;
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: dishes.length, "hot-snacks": 0, mithai: 0, namkeen: 0 };
    dishes.forEach((d) => { c[d.category] += 1; });
    return c;
  }, [dishes]);

  const shown = filter === "all" ? dishes : dishes.filter((d) => d.category === filter);
  const categoriesUsed = new Set(dishes.map((d) => d.category)).size;
  const lastUpdated = dishes.length ? dishes.map((d) => d.updated_at).sort().at(-1)! : null;

  const pills: { key: Filter; label: string }[] = [
    { key: "all", label: `All Items (${counts.all})` },
    { key: "hot-snacks", label: `Hot Snacks (ताज़ा नाश्ता) · ${counts["hot-snacks"]}` },
    { key: "mithai", label: `Mithai / Sweets (मिठाई) · ${counts.mithai}` },
    { key: "namkeen", label: `Namkeen (नमकीन) · ${counts.namkeen}` },
  ];

  return (
    <div className="tab-content active">
      <div className="prices-header">
        <div className="status-badges">
          <div className="status-badge master-list"><span>📖</span><span>मास्टर रेट लिस्ट</span></div>
          <div className="status-badge synced"><span>✔</span><span>Auto-synced</span></div>
        </div>
        <h1 className="prices-title">Saved Prices &amp; Dishes</h1>
        <p className="prices-subtitle">रेट लिस्ट व डिशेज • घर का शुद्ध स्वाद</p>
        <p className="prices-description">
          All your regular snacks, sweets &amp; namkeen saved in one place. Add new items or edit rates anytime for weekend orders.
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">{dishes.length}</div>
          <div className="kpi-label">Total Dishes</div>
          <div className="kpi-label-hindi">कुल आइटम</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{categoriesUsed}</div>
          <div className="kpi-label">Categories</div>
          <div className="kpi-label-hindi">श्रेणियां</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">⏰</div>
          <div className="kpi-label">{lastUpdated ? relativeDay(lastUpdated) : "—"}</div>
          <div className="kpi-label-hindi">अपडेटेड</div>
        </div>
      </div>

      <button type="button" className="add-new-btn" onClick={() => app.openDishModal(null)}>
        <span>➕</span><span>Add New Dish or Item (नया आइटम जोड़ें)</span>
      </button>

      <div className="filter-pills" role="tablist" aria-label="Filter dishes">
        {pills.map((p) => (
          <button key={p.key} type="button" role="tab" aria-selected={filter === p.key}
            className={`filter-pill${filter === p.key ? " active" : ""}`} onClick={() => setFilter(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="dish-list">
        {shown.length === 0 ? (
          <div className="empty-state">
            <strong>No dishes here yet</strong>
            Tap &quot;Add New Dish&quot; to save your first one. (नया आइटम जोड़ें)
          </div>
        ) : (
          shown.map((d) => <DishCard key={d.id} dish={d} />)
        )}
      </div>

      <div className="tip-card">
        <div className="tip-header">
          <div className="tip-icon">💡</div>
          <div className="tip-title">Auntyji&apos;s Kitchen Tip (सुझाव):</div>
        </div>
        <div className="tip-text">
          Rates updated here reflect instantly in your weekly Menu Builder and WhatsApp broadcast preview. Keep party discounts
          transparent so customers can plan weekend family gatherings easily!
        </div>
      </div>
    </div>
  );
}
