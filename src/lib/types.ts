export type Category = "hot-snacks" | "namkeen" | "mithai";
export type Unit = "piece" | "250g" | "500g" | "1kg" | "box" | "pack";
export type Tone = "hinglish" | "english" | "hindi";
export type Provider = "openai" | "claude" | "gemini";
export type VoiceKey = "kavita" | "sunita" | "maa";
export type WritingStyle = "warm" | "professional" | "traditional" | "modern";
export type ShareChannel = "whatsapp" | "whatsapp-group" | "telegram" | "sms" | "clipboard";
export type MessageSource = "template" | "ai" | "edited";

export interface Dish {
  id: string;
  name_en: string;
  name_hi: string | null;
  desc_en: string | null;
  desc_hi: string | null;
  category: Category;
  emoji: string;
  price: number;
  unit: Unit;
  party_price: number | null;
  party_min_qty: number | null;
  party_note: string | null;
  notes: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type DishInput = Omit<Dish, "id" | "created_at" | "updated_at"> & { id?: string };

export interface Settings {
  upi_number: string;
  group_name: string;
  pickup_address: string;
  drop_time: string;
  cutoff_text: string;
  ai_provider: Provider;
  default_tone: Tone;
  writing_style: WritingStyle;
  voice_key: VoiceKey;
  voice_speed: number;
}

export interface Batch {
  id: string;
  batch_no: number;
  batch_date: string; // YYYY-MM-DD
  drop_time: string;
  cutoff_text: string;
  pickup_address: string;
  tone: Tone;
  dish_ids: string[];
  message: string;
  message_source: MessageSource;
  status: "draft" | "sent";
  created_at: string;
}

export interface BroadcastRow {
  id: string;
  channel: ShareChannel;
  sent_at: string;
  batch_no: number;
  batch_date: string;
}

/** What the server tells the browser about which integrations are configured (no secrets). */
export interface Capabilities {
  providers: Record<Provider, { configured: boolean; model: string }>;
  elevenlabs: boolean;
  voices: Record<VoiceKey, boolean>;
}

export interface AppData {
  userId: string;
  email: string;
  dishes: Dish[];
  settings: Settings;
  latestBatch: Batch | null;
  nextBatchNo: number;
  defaultDate: string; // next Sunday (IST), YYYY-MM-DD
  history: BroadcastRow[];
  capabilities: Capabilities;
}
