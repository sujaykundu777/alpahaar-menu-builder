import { UNITS } from "./defaults";
import type { Dish, Unit } from "./types";

const HI_DAYS = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const HI_MONTHS = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];
const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m: m - 1, d, dow };
}

export function formatDateEn(iso: string) {
  const { y, m, d, dow } = parts(iso);
  return `${EN_DAYS[dow]}, ${EN_MONTHS[m]} ${d}, ${y}`;
}
export function formatDateShortEn(iso: string) {
  const { m, d, dow } = parts(iso);
  return `${EN_DAYS[dow]} ${d} ${EN_MONTHS[m]}`;
}
export function formatDayMonthEn(iso: string) {
  const { m, d } = parts(iso);
  return `${d} ${EN_MONTHS[m]}`;
}
export function formatDayMonthHi(iso: string) {
  const { m, d } = parts(iso);
  return `${d} ${HI_MONTHS[m]}`;
}
export function formatDateHi(iso: string) {
  const { m, d, dow } = parts(iso);
  return `${HI_DAYS[dow]}, ${d} ${HI_MONTHS[m]}`;
}
export function dayNameEn(iso: string) {
  return EN_DAYS[parts(iso).dow];
}
export function dayNameHi(iso: string) {
  return HI_DAYS[parts(iso).dow];
}

/** Today's date in India as YYYY-MM-DD. */
export function todayIST(now = new Date()) {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });
  return f.format(now);
}

/** The next Sunday strictly after today if today is Sunday, otherwise the coming Sunday. */
export function nextSunday(now = new Date()) {
  const today = todayIST(now);
  const { y, m, d, dow } = parts(today);
  const add = dow === 0 ? 7 : 7 - dow;
  const dt = new Date(Date.UTC(y, m, d + add));
  return dt.toISOString().slice(0, 10);
}

export function unitShort(unit: Unit) {
  return UNITS.find((u) => u.value === unit)?.short ?? unit;
}

export function money(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "");
}

/** "₹25/pc", "₹84/250g" */
export function priceLabel(d: Pick<Dish, "price" | "unit">) {
  return `₹${money(d.price)}/${unitShort(d.unit)}`;
}

export function partyLabel(d: Pick<Dish, "party_price" | "party_min_qty" | "unit" | "party_note">, hindi = false) {
  if (d.party_price == null || d.party_min_qty == null) return null;
  if (hindi) {
    const note = d.party_note ? ` (${d.party_note})` : "";
    return `₹${money(d.party_price)}/${d.unit === "piece" ? "पीस" : unitShort(d.unit)}, ${d.party_min_qty}+ ${d.unit === "piece" ? "पीस" : "यूनिट"} पर${note}`;
  }
  const note = d.party_note ? ` (${d.party_note})` : "";
  return `₹${money(d.party_price)}/${unitShort(d.unit)} for ${d.party_min_qty}+ ${d.unit === "piece" ? "pcs" : "units"}${note}`;
}

export function formatDuration(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function relativeDay(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}
