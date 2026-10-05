import type { Category, DishInput, Settings } from "./types";

export const CATEGORIES: Record<
  Category,
  { en: string; hi: string; emoji: string; badge: string; badgeClass: string }
> = {
  "hot-snacks": { en: "Hot Snacks", hi: "ताज़ा नाश्ता", emoji: "🥟", badge: "Hot Snack", badgeClass: "hot-snack" },
  namkeen: { en: "Namkeen", hi: "नमकीन", emoji: "🥜", badge: "Namkeen / Dry", badgeClass: "namkeen" },
  mithai: { en: "Mithai", hi: "मिठाई", emoji: "🍪", badge: "Mithai / Sweet", badgeClass: "mithai" },
};

export const UNITS = [
  { value: "piece", label: "per piece", short: "pc" },
  { value: "250g", label: "per 250g", short: "250g" },
  { value: "500g", label: "per 500g", short: "500g" },
  { value: "1kg", label: "per 1kg", short: "kg" },
  { value: "box", label: "per box", short: "box" },
  { value: "pack", label: "per pack", short: "pack" },
] as const;

export const TONES = [
  { value: "hinglish", label: "Hinglish (Recommended)", note: "Mix of Hindi & English", badge: "POPULAR" },
  { value: "english", label: "Pure English", note: "Full English message" },
  { value: "hindi", label: "Shuddh Hindi", note: "पूर्ण हिंदी संदेश" },
] as const;

export const VOICES = [
  { key: "kavita", name: "Kavita (कविता)", desc: "Warm Indian Homemaker • Hindi & Hinglish friendly", icon: "🎵", badge: "Recommended" },
  { key: "sunita", name: "Sunita (सुनीता)", desc: "Energetic, friendly neighborhood aunty tone", icon: "🔈" },
  { key: "maa", name: "Maa's Real Voice Clone", desc: "Authentic AI clone recorded from 2-minute voice sample", icon: "🎤", badge: "माँ की आवाज", special: true },
] as const;

export const WRITING_STYLES = [
  { value: "warm", label: "Warm Hinglish Society Aunty (माँ जैसा अपनापन - 'नमस्ते जी!')" },
  { value: "professional", label: "Pure English Professional" },
  { value: "traditional", label: "Shuddh Hindi Traditional" },
  { value: "modern", label: "Young & Friendly Modern" },
] as const;

export const DEFAULT_SETTINGS: Settings = {
  upi_number: "",
  group_name: "",
  pickup_address: "",
  drop_time: "6:00 PM",
  cutoff_text: "Sunday 11:00 AM",
  ai_provider: "gemini",
  default_tone: "hinglish",
  writing_style: "warm",
  voice_key: "kavita",
  voice_speed: 100,
};

export const BUSINESS_NAME = "Alpahaar Foods";

/** Dishes created for a brand-new account (taken from the original prototype). */
export const SEED_DISHES: DishInput[] = [
  {
    name_en: "Crispy Samosa", name_hi: "कुरकुरा समोसा", desc_en: "Potato & cashew filling", desc_hi: "गरम समोसा • आलू व काजू भरावन",
    category: "hot-snacks", emoji: "🥟", price: 25, unit: "piece", party_price: 23, party_min_qty: 14,
    party_note: "Order 2 days before", notes: null, image_url: null, active: true,
  },
  {
    name_en: "Aloo Bonda / Aloo Chops", name_hi: "आलू बोंडा", desc_en: "Mustard & curry leaf tempering", desc_hi: "आलू बोंडा / आलू चॉप्स • कड़ी पत्ता व राई का तड़का",
    category: "hot-snacks", emoji: "🥔", price: 25, unit: "piece", party_price: null, party_min_qty: null,
    party_note: null, notes: "Min order 2 pcs (ताज़ा फ्राई)", image_url: null, active: true,
  },
  {
    name_en: "Bread Pakoda", name_hi: "ब्रेड पकोड़ा", desc_en: "Paneer stuffed", desc_hi: "पनीर भरा ब्रेड पकोड़ा • स्पेशल मसाला",
    category: "hot-snacks", emoji: "🍞", price: 35, unit: "piece", party_price: null, party_min_qty: null,
    party_note: null, notes: "Full triangle paneer slice included", image_url: null, active: true,
  },
  {
    name_en: "Veg Cutlet", name_hi: "वेज कटलेट", desc_en: "Beetroot, carrot, peas", desc_hi: "वेज कटलेट्स • चुकंदर व मटर की पौष्टिकता",
    category: "hot-snacks", emoji: "🥗", price: 30, unit: "piece", party_price: null, party_min_qty: null,
    party_note: null, notes: null, image_url: null, active: false,
  },
  {
    name_en: "Special Mixture Namkeen", name_hi: "स्पेशल मिक्सचर नमकीन", desc_en: "Crunchy & spicy", desc_hi: "स्पेशल मिक्सचर नमकीन • कुरकुरा और मसालेदार",
    category: "namkeen", emoji: "🥜", price: 84, unit: "250g", party_price: null, party_min_qty: null,
    party_note: null, notes: "Bulk 1kg jar ₹320 • Airtight sealed jar", image_url: null, active: true,
  },
  {
    name_en: "Balushahi", name_hi: "बालूशाही", desc_en: "Melt-in-mouth, pure desi ghee", desc_hi: "बालूशाही • शुद्ध देशी घी व पिस्ता गार्निश",
    category: "mithai", emoji: "🍪", price: 120, unit: "250g", party_price: null, party_min_qty: null,
    party_note: null, notes: "Approx 5-6 pcs • Freshly prepared on Saturday batch", image_url: null, active: true,
  },
  {
    name_en: "Meethi Bundiya", name_hi: "मीठी बूंदिया", desc_en: "Cardamom & saffron", desc_hi: "मीठी बुंदिया • इलायची व केसर की महक",
    category: "mithai", emoji: "🧈", price: 90, unit: "250g", party_price: null, party_min_qty: null,
    party_note: null, notes: "Fresh desi ghee preparation", image_url: null, active: true,
  },
];
