Prototype Specification: Alpahaar Foods - Menu Builder & Message Generator
1. App Overview & Persona
App Name: Alpahaar Foods (अल्पाहार - माँ के हाथ का स्वाद)
Target User: A 50-year-old home chef ("Auntyji") running a weekend homemade snack & sweet business for her apartment society.
Goal: Select dishes for the upcoming weekend, preview an AI-generated WhatsApp marketing broadcast with bilingual Hinglish copy, and listen to a warm ElevenLabs voice note read-out before broadcasting.
Device & Format: Mobile app portrait viewport (approx. 390px – 430px wide, e.g., iPhone 14/15/16).
2. Design Tokens & Visual Style
Color Palette:
Primary / Brand Accent: Warm Terracotta / Burnt Orange (#C2410C / #EA580C)
Warm Culinary Backgrounds: #FBF8FC (main background), #FFFFFF (cards), #F5F3F6 (secondary containers), #FFF7ED / #FED7AA (warm saffron tints for party badges & tips)
Action / WhatsApp Green: #22C55E / #16A34A (ready indicators, share CTAs)
Text & Neutral Colors: #1C1917 (primary text), #78716C (secondary text), #E7E5E4 (border dividers)
Typography:
Font Family: Plus Jakarta Sans (clean, high-legibility sans-serif)
Senior-friendly sizing: 16px–18px body copy, 20px–24px subheadings, large touch targets (minimum 48px height for all buttons and toggles).
Styling Details:
Border radius: rounded-2xl (16px) for cards, rounded-xl (12px) for inner boxes, rounded-full for badges.
Subtle drop shadows (shadow-sm) with crisp 1px borders (border-stone-200).
3. Screen Structure & Component Breakdown (Top to Bottom)
A. Top Header App Bar
Left: Samosa brand emblem icon (#EA580C) + Business title: "Alpahaar Foods" with subtitle "Maa Ke Haath Ka Swaad • Weekend Pre-orders".
Right: Settings gear icon (linked to AI & Voice API keys) + Auntyji circular profile avatar.
B. Hero Greeting & Batch Card
Friendly greeting: "Namaste Auntyji! (नमस्ते आंटीजी)" + waving hand emoji 👋.
Batch badge on right: "Batch #48".
Microcopy: "Tap the dishes you want to prepare this weekend. We will craft the perfect WhatsApp group announcement for you!"
C. Weekend Timings & Logistics Summary Card
Header: "Menu Timings (तारीख व समय)" + date badge: "Sunday, 27th July" with calendar icon.
3-step logistics timeline:
Menu Announcement Drop: Saturday Evening (Today • 6:00 PM) (Checkmark icon).
Pre-order Closes (IMP): Sunday, 11:00 AM sharp (ऑर्डर बंद) (Clock icon + edit pencil).
Pickup & Delivery: Sunday, 6:00 PM onwards (Delivery truck icon + edit pencil).
D. Category 1: "Fresh Weekend Snacks (ताज़ा गरम नाश्ता)"
Header with item count pill: "3 Selected".
Item 1: Crispy Samosa (गरम समोसा • आलू व काजू भरावन)
Dish photo thumbnail + "Popular" orange badge.
Description: "Refined flour crust stuffed with heirloom spiced potatoes, roasted cashews."
Pricing box: Standard Rate: ₹25 / piece (1 to 13 pcs).
Highlighted Party Offer banner: "Party Offer: ₹23 / piece for 14+ pcs (Order 2 days before)".
Right selection state: Large checked box (checked, primary terracotta).
Item 2: Aloo Bonda / Chops (आलू बोंडा / आलू चॉप्स)
Description: "Golden chickpea crust • Mustard seed & green chilli tempering."
Rate: ₹25 / piece (Min order 2 pcs).
Selection state: Checked box.
Item 3: Bread Pakoda (Paneer Stuffed) (पनीर भरा ब्रेड पकोड़ा)
Rate: ₹35 / piece (Quarter cut, served with saunth chutney).
Selection state: Checked box.
Item 4: Veg Vegetable Cutlet (वेज कटलेट्स)
Description: "Beetroot, carrot, peas and cashew center."
Rate: ₹30 / piece.
Selection state: Unselected card with a + (Add) icon.
E. Category 2: "Mithai & Dry Namkeen (घर की बनी नमकीन और ताज़ा देशी घी मिठाई)"
Header with count pill: "3 Ready".
Item 1: Special Mixture Namkeen (स्पेशल मिक्सचर नमकीन)
Rate: ₹84 per 250g packet (Bulk 1kg jar tier note).
Selection state: Checked box.
Item 2: Melt-in-Mouth Balushahi (बालूशाही - शुद्ध देशी घी)
Rate: ₹120 per 250g box (Approx 5–6 pieces).
Selection state: Checked box.
Item 3: Meethi Bundiya (मीठी बुंदिया / बूंदी)
Rate: ₹90 per 250g pack (Fresh Saturday desi ghee prep).
Selection state: Checked box.
Action Button: Centered dashed card button: "+ Add New Custom Item or Sweet (नया व्यंजन / मिठाई जोड़ें)".
F. WhatsApp Message Tone Selector
Header: "WhatsApp Message Language (मैसेज का अंदाज़ कैसा रखें?)"
3 selectable options:
Hinglish (Recommended) — Selected state with checkmark: "English intro + Hindi translation + clear bullet points. Best for Society Group."
Pure English: "Crisp formal format with price tags."
Shuddh Hindi (शुद्ध हिंदी): "देवनागरी लिपि में संपूर्ण जानकारी."
G. Pickup & Payment Summary Strip
Address: Flat E401, GR Lavender Apartments.
Payment: GPay / PhonePe: 6362307567 (Prepayment confirms order).
Edit pencil button on right.
H. Live WhatsApp Message & Voice Audio Preview Card
Header: "Live WhatsApp Message Preview" + green count pill: "5 Items Selected".
ElevenLabs Voice Read-Out Player Sub-card:
Title: "Listen to Message (बोलकर सुनें)" + green badge "ElevenLabs Voice Connected".
Voice Persona: Kavita (Warm Indian Homemaker / Aunty tone).
Interactive player: Large terracotta play button + animated audio waveform graphic + time indicator (0:24 / 0:42) + speed button (1.0x).
WhatsApp Chat Bubble Preview (green-tinted or light beige WhatsApp style container with monospace/clean font):
🌸 *ALPAHAAR FOODS - WEEKEND SPECIAL (BATCH #48)* 🌸
Namaste GR Lavender neighbors! Is weekend Maa ke haath ka authentic swaad garam-garam prepare ho raha hai. 🍲✨

🥟 *FRESH SNACKS (Sunday Evening Hot Delivery):*
• *Crispy Samosa:* ₹25/pc (Party Offer: ₹23/pc for 14+ pcs) with Saunth & Mint Chutney
• *Aloo Bonda / Chops:* ₹25/pc (Min 2 pcs)
• *Bread Pakoda (Paneer):* ₹35/pc (Double malai paneer layer)

🍯 *DESI GHEE MITHAI & DRY NAMKEEN:*
• *Special Mixture Namkeen:* ₹84 (250g jar) / ₹320 (1kg family pack)
• *Pure Ghee Balushahi:* ₹120 (250g box) / ₹230 (500g)
• *Meethi Kesar Bundiya:* ₹90 (250g box)

⏰ *Order Closes:* Sunday 11:00 AM sharp
📍 *Pickup:* Flat E401, GR Lavender (Sunday 6 PM onwards)
📲 *GPay/UPI:* 6362307567 (Share screenshot to confirm booking)
I. Floating / Bottom Action Section
Primary Action Button: Large pill button in #C2410C terracotta:
"✨ Generate WhatsApp Message (व्हाट्सएप मैसेज तैयार करें - एक क्लिक में कॉपी)"
Voice status sub-bar:
"Audio Note Ready • ElevenLabs" + button: "▶ Play Voice".
J. Persistent Bottom Tab Bar
Tab 1 (Active): Menu Builder (ऑर्डर मेनू) — Utensils icon (Active terracotta color).
Tab 2: Preview & Share (मैसेज भेजें) — Share nodes icon.
Tab 3: Saved Prices (रेट लिस्ट) — Notebook/price tag icon.
Tab 4: Settings (सेटिंग्स) — Gear icon.
4. Ready-to-Paste Prompt for Other AI Code / UI Generators:
Create a mobile-first web screen (390px width) for "Alpahaar Foods", a home food business run by a 50-year-old Indian homemaker (Auntyji). The page is a "Weekend Menu Builder & AI Broadcast Generator".

Design Requirements:
- Visual Style: Warm artisanal Indian culinary aesthetic using terracotta orange (#c2410c), warm cream background (#fbf8fc), saffron accents (#fed7aa), crisp WhatsApp green (#22c55e), rounded-2xl cards, Plus Jakarta Sans typography, senior-friendly large touch targets, and bilingual English + Hindi subtitles.
- Header: Alpahaar Foods logo, subtitle "Maa Ke Haath Ka Swaad", Settings gear, and user avatar.
- Batch Header: "Namaste Auntyji!" with Batch #48 badge.
- Logistics Card: Upcoming Sunday date, 6 PM drop, Sunday 11 AM pre-order cutoff, Sunday 6 PM pickup at Flat E401.
- Snack Checkbox List: Crispy Samosa (₹25/pc, Party offer ₹23 for 14+), Aloo Bonda (₹25), Bread Pakoda (₹35), Veg Cutlet (₹30, unselected).
- Sweets & Namkeen List: Special Mixture Namkeen (₹84/250g), Balushahi (₹120/250g), Meethi Bundiya (₹90/250g).
- Message Tone Selector: 3 options (Hinglish recommended, Pure English, Shuddh Hindi).
- Voice Player Card: ElevenLabs voice read-out preview with "Kavita (Warm Indian Aunty)" voice, play button, duration (0:24/0:42), audio waveform, and speed toggle.
- WhatsApp Live Bubble: Realistic formatted WhatsApp markdown message preview with emojis, prices, pickup address, and UPI payment number (6362307567).
- Sticky Bottom: Big primary button "✨ Generate WhatsApp Message" and a 4-tab bottom navigation bar (Menu Builder, Preview & Share, Saved Prices, Settings).