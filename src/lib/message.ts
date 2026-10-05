import { BUSINESS_NAME } from "./defaults";
import { dayNameEn, dayNameHi, formatDayMonthEn, formatDayMonthHi, money, partyLabel, priceLabel } from "./format";
import type { Dish, Settings, Tone } from "./types";

export interface MessageInput {
  dishes: Dish[];
  tone: Tone;
  batchDate: string;
  dropTime: string;
  cutoffText: string;
  pickupAddress: string;
  upiNumber: string;
}

function nameFor(d: Dish, tone: Tone) {
  if (tone === "hindi") return d.name_hi || d.name_en;
  return d.name_en;
}

function joinList(items: string[], and: string) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}

/** Always-available, deterministic message – used as live preview and as AI fallback. */
export function buildTemplateMessage(i: MessageInput): string {
  const { dishes, tone } = i;
  const names = dishes.map((d) => `*${nameFor(d, tone)}*`);
  const dayEn = dayNameEn(i.batchDate);
  const dayHi = dayNameHi(i.batchDate);
  const dateEn = formatDayMonthEn(i.batchDate);
  const dateHi = formatDayMonthHi(i.batchDate);

  const priceLines = dishes.flatMap((d) => {
    const price = tone === "hindi" ? priceLabel(d).replace(/\/pc$/, "/पीस") : priceLabel(d);
    const lines = [`🔸 ${nameFor(d, tone)} - ${price}`];
    const party = partyLabel(d, tone === "hindi");
    if (party) lines.push(`   🎉 ${tone === "hindi" ? "पार्टी ऑफर" : "Party offer"}: ${party}`);
    return lines;
  });

  const empty = dishes.length === 0;
  let intro: string[];
  let labels: { menu: string; pickup: string; by: string; pay: string; payNote: string; thanks: string; onwards: string };

  if (tone === "english") {
    intro = [
      "🙏 *Hello everyone!* ✨",
      "",
      empty ? "Menu coming soon!" : `This ${dayEn} (${dateEn}) we are making hot & fresh ${joinList(names, "and")}! 🥟`,
      "Pre-order today so we can cook just for you.",
    ];
    labels = { menu: "Menu & Prices", pickup: "Pickup", by: "Order by", pay: "Pay", payNote: "please prepay & share the payment screenshot to confirm your order", thanks: "Thank you", onwards: "onwards" };
  } else if (tone === "hindi") {
    intro = [
      "🙏 *नमस्ते!* ✨",
      "",
      empty ? "मेन्यू जल्द ही आएगा!" : `इस ${dayHi} (${dateHi}) हम बना रहे हैं गरमा-गरम ${joinList(names, "और")}! 🥟`,
      "कृपया आज ही प्री-ऑर्डर कर लीजिए।",
    ];
    labels = { menu: "मेन्यू और दाम", pickup: "पिकअप", by: "ऑर्डर करें", pay: "भुगतान", payNote: "कृपया पहले पेमेंट करके स्क्रीनशॉट भेजें, तभी ऑर्डर कन्फ़र्म होगा", thanks: "धन्यवाद", onwards: "से" };
  } else {
    intro = [
      "🙏 *Namaste!* ✨",
      "",
      empty ? "Menu coming soon!" : `This ${dayEn} (${dateEn}) we are making hot & fresh ${joinList(names, "and")}! 🥟`,
      empty ? "" : `${dayHi} के लिए हम गरमा-गरम ${joinList(names, "aur")} बना रहे हैं, toh order karna ho toh aaj hi booking kar lijiye 😊`,
    ].filter((l, idx, arr) => !(l === "" && idx === arr.length - 1));
    labels = { menu: "What's Available", pickup: "Pickup", by: "Order by", pay: "Pay", payNote: "please prepay & share screenshot to confirm", thanks: "Thank you", onwards: "onwards" };
  }

  const footer: string[] = [];
  if (i.pickupAddress) footer.push(`📍 *${labels.pickup}:* ${i.pickupAddress}${i.dropTime ? ` – ${i.dropTime} ${labels.onwards}` : ""}`);
  else if (i.dropTime) footer.push(`📍 *${labels.pickup}:* ${i.dropTime} ${labels.onwards}`);
  if (i.cutoffText) footer.push(`⏰ *${labels.by}:* ${i.cutoffText}`);
  if (i.upiNumber) footer.push(`💰 *${labels.pay}:* GPay / UPI ${i.upiNumber} – ${labels.payNote}`);

  return [
    ...intro,
    ...(empty ? [] : ["", `*${labels.menu}:*`, ...priceLines]),
    ...(footer.length ? ["", ...footer] : []),
    "",
    `${labels.thanks} 🙏`,
    `*${BUSINESS_NAME}*`,
  ].join("\n");
}

export function messageInputFrom(args: {
  dishes: Dish[];
  tone: Tone;
  batchDate: string;
  dropTime: string;
  cutoffText: string;
  pickupAddress: string;
  settings: Settings;
}): MessageInput {
  return {
    dishes: args.dishes,
    tone: args.tone,
    batchDate: args.batchDate,
    dropTime: args.dropTime,
    cutoffText: args.cutoffText,
    pickupAddress: args.pickupAddress,
    upiNumber: args.settings.upi_number,
  };
}

/** Every selected dish's price must appear verbatim – protects against AI mis-pricing. */
export function missingPrices(message: string, dishes: Dish[]) {
  const text = message.replace(/[०-९]/g, (c) => String("०१२३४५६७८९".indexOf(c)));
  const missing: string[] = [];
  for (const d of dishes) {
    if (!new RegExp(`(^|[^0-9.])${money(d.price).replace(".", "\\.")}([^0-9]|$)`).test(text)) missing.push(d.name_en);
    if (d.party_price != null && !new RegExp(`(^|[^0-9.])${money(d.party_price).replace(".", "\\.")}([^0-9]|$)`).test(text)) {
      missing.push(`${d.name_en} (party)`);
    }
  }
  return missing;
}

/** Remove WhatsApp markup / emoji so the voice reads naturally. */
export function toSpeakable(message: string) {
  return message
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/₹\s?(\d+(?:\.\d+)?)/g, "$1 rupees")
    .replace(/\/pc\b/gi, " per piece")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[‍️]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
