import { BUSINESS_NAME } from "../defaults";
import { dayNameEn, formatDateEn, formatDateHi, money, partyLabel, unitShort } from "../format";
import type { MessageInput } from "../message";
import type { Settings, WritingStyle } from "../types";

const STYLE_HINTS: Record<WritingStyle, string> = {
  warm: "Warm, motherly society-aunty voice – friendly, polite, like talking to neighbours ('Namaste ji!').",
  professional: "Clean, polite and professional.",
  traditional: "Traditional, respectful and simple.",
  modern: "Young, friendly and upbeat; light on formality.",
};

const TONE_RULES = {
  hinglish:
    "Language: HINGLISH – Hindi written in Roman script mixed naturally with simple English, plus the key announcement line repeated in simple English (as in the examples). Item names stay in English.",
  english: "Language: simple, clear English only. Do not use Hindi words.",
  hindi: "Language: shuddh Hindi in Devanagari script. Item names in Devanagari where given. Keep prices as ASCII digits with the ₹ sign.",
} as const;

const EXAMPLE = `Hello everyone 👋
Tomorrow 26th July, we are making hot and crispy samosas and aloo bondas, so if anyone wants to order you can preorder today.
Kal 26th July ke liye hum garam garam crispy samosa aur aloo bonda (chops) bana rahe hai, toh kisi ko kal ke liye order karna ho toh aaj hi booking kar lijiye
*Samosa price*
1-14 pcs - Rs 25/pc
14+ pcs (Samosa party offer)
23/pc - Please order before 2 days
*Aloo bonda price* - 25/pc
Pickup tomorrow 6pm onwards at E401, GR Lavender Apartments. Please prepay to confirm your order by sharing payment screenshot
Payment - GPay / UPI at 6362307567
Thank you
Alpahaar Foods`;

export function buildPrompt(input: MessageInput, settings: Pick<Settings, "writing_style" | "group_name">) {
  const system = `You write WhatsApp broadcast messages for "${BUSINESS_NAME}", a small home kitchen run by a mother who sells freshly made Indian snacks and sweets to her apartment society every weekend. The message is posted in a neighbourhood foodies WhatsApp group on Saturday so people can pre-order for Sunday pickup.

Rules:
- Output ONLY the final message text – no preamble, no explanation, no code fences.
- Use WhatsApp formatting only: *bold* with single asterisks. No markdown headings, no tables.
- Use ONLY the dishes, prices, offers and logistics given in the data. Never invent items, prices, discounts, times or addresses. Copy every price exactly (ASCII digits, ₹ sign).
- Include for each dish: its name and price/unit; include the party offer wherever one is given.
- Include pickup place and time, the order cut-off, and the payment line (GPay / UPI number) with the note that customers must prepay and share the payment screenshot to confirm. Skip any logistics field that is empty.
- Keep it short and scannable (roughly 8-16 lines), with a few friendly emojis (🙏 🥟 😊). Close with a thank-you and "${BUSINESS_NAME}".
- ${TONE_RULES[input.tone]}
- Style: ${STYLE_HINTS[settings.writing_style]}

Example of the owner's own real message (for tone and structure only – do NOT copy its dishes or prices):
"""
${EXAMPLE}
"""`;

  const data = {
    group: settings.group_name || undefined,
    batch_date: `${formatDateEn(input.batchDate)} / ${formatDateHi(input.batchDate)}`,
    day: dayNameEn(input.batchDate),
    pickup_time: input.dropTime,
    pickup_address: input.pickupAddress,
    order_cutoff: input.cutoffText,
    payment_upi_number: input.upiNumber,
    dishes: input.dishes.map((d) => ({
      name_en: d.name_en,
      name_hi: d.name_hi,
      price: `₹${money(d.price)} per ${unitShort(d.unit)}`,
      party_offer: partyLabel(d),
      notes: d.notes,
    })),
  };

  const user = `Write the broadcast message for this weekend.\n\nData (JSON):\n${JSON.stringify(data, null, 2)}`;
  return { system, user };
}
