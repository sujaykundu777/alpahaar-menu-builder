Here is the comprehensive specification, component hierarchy, and ready-to-paste AI prompt in plain text format so you can replicate or prototype the Saved Prices & Master Inventory (Mobile) screen (Alpahaar Foods - Saved Prices & Master Inventory) in tools like Figma, v0, Lovable, Cursor, Bolt.new, or Claude Artifacts:

Prototype Specification: Alpahaar Foods – Saved Prices & Master Inventory (Mobile)
1. Overview & Objective
App Name: Alpahaar Foods (अल्पाहार - माँ के हाथ का स्वाद • वीकेंड प्री-ऑर्डर)
Target User: Smt. Shashi Sharma ("Auntyji"), a 50+ homemaker running a weekend food business for apartment neighbors.
Screen Role: Master Pricing Notebook & Inventory Management — Allows Auntyji to easily view, add, modify, pause/activate, or delete dish prices and bulk party tiers from one central hub, automatically syncing rates with her weekend WhatsApp broadcast generator.
Device & Viewport: Mobile portrait viewport (approx. 390px – 430px width, e.g., iPhone 14/15/16).
2. Design Tokens & Styling Rules
Color Palette:
Primary / Brand Accent: Warm Terracotta / Burnt Orange (#C2410C / #EA580C)
Background Base: Warm Culinary Cream (#FBF8FC)
Cards & Surfaces: Clean White (#FFFFFF) with subtle warm container border (#E7E5E4 / #DCD9DD)
Success / Active Green: #16A34A / #22C55E (Active toggles, auto-sync indicators)
Danger / Delete Tint: Soft rose/red tint (#FEE2E2 bg, #DC2626 text)
Warm Callout / Tip Tint: Soft saffron peach (#FFF7ED bg, #FED7AA border, #9A3412 text)
Text Colors: Charcoal (#1C1917 primary), Muted Slate (#78716C secondary)
Typography & Accessibility (Senior Friendly):
Font: Plus Jakarta Sans (clean, open counters, highly legible).
High-contrast bilingual copy (English primary + Hindi phonetic subtitles).
Generous touch targets (buttons and switches ≥ 48px height for effortless tapping).
Card shape: rounded-2xl (16px) with soft ambient drop shadow (shadow-sm).
3. Screen Structure & Component Hierarchy (Top to Bottom)
A. Top App Header Bar
Left: Alpahaar Foods round emblem logo (#EA580C) + Title "Alpahaar Foods" with subtitle "Maa Ke Haath Ka Swaad • Weekend Pre-orders".
Right: Circular profile avatar for Smt. Shashi Auntyji (#C2410C).
B. Page Header & Live Status
Badge Strip:
Left badge: "📖 मास्टर रेट लिस्ट (Master Rate List)" (soft warm background).
Right status: "✔ Auto-synced" with green dot/check icon.
Main Heading: "Saved Prices & Dishes" (H1, bold, 24px).
Hindi Subtitle: "रेट लिस्ट व डिशेज • घर का शुद्ध स्वाद".
Description: "All your regular snacks, sweets & namkeen saved in one place. Add new items or edit rates anytime for weekend orders."
C. Quick Metrics Summary Cards (3-Column Strip)
Three equal rounded white cards with light borders:

Total Dishes (कुल आइटम): Large number "8" in bold burnt orange.
Categories (श्रेणियां): Large number "3" (Hot Snacks, Namkeen, Mithai).
Yesterday (अपडेटेड): Clock icon + timestamp indicator showing when pricing was last modified.
D. Primary Call-to-Action
Full-width large pill button in solid terracotta (#C2410C):
"➕ Add New Dish or Item (नया आइटम जोड़ें)"
Height: 52px, text bold 16px, icon on left.
E. Filter Tabs (Horizontal Category Scroll)
All Items (8): Selected pill button in dark burnt terracotta (#C2410C, white text).
Hot Snacks (ताज़ा नाश्ता): Unselected pill (#F5F3F6 background, stone text).
Mithai / Sweets (मिठाई): Unselected pill.
Namkeen (नमकीन): Unselected pill.
F. Dish Inventory Cards List
1. Crispy Samosa Card
Header:
Dish thumbnail photo (square rounded-xl).
Green dot indicator + Category badge: "Hot Snack".
Right: "Active in Menu" label with green active toggle switch (ON).
Title: "Crispy Samosa" + Subtitle: "गरम समोसा • आलू व काजू भरावन".
Pricing Details Box (Light gray/cream container):
Left: Standard Rate: ₹25 / piece.
Right: Highlighted saffron banner: "📢 Party Offer: ₹23/pc for 14+ pcs (Order 2 days before)".
Action Buttons (Two side-by-side buttons):
Left: "✏️ Edit (बदलें)" (White button with soft border).
Right: "🗑️ Delete (हटाएं)" (Soft red tinted background button).
2. Aloo Bonda / Aloo Chops Card
Header: Image thumbnail, "Hot Snack" badge, "Active in Menu" with toggle switch (ON).
Title: "Aloo Bonda / Aloo Chops" + Subtitle: "आलू बोंडा / आलू चॉप्स • कड़ी पत्ता व राई का तड़का".
Pricing Box: Unit Rate: ₹25 / pc | Note: "Min order 2 pcs (ताज़ा फ्राई)".
Actions: "✏️ Edit (बदलें)" and "🗑️ Delete (हटाएं)".
3. Bread Pakoda (Paneer Stuffed) Card
Header: Image thumbnail, "Hot Snack" badge, "Active in Menu" with toggle switch (ON).
Title: "Bread Pakoda (Paneer Stuffed)" + Subtitle: "पनीर भरा ब्रेड पकोड़ा • स्पेशल मसाला".
Pricing Box: Unit Rate: ₹35 / pc | Highlight: "Full triangle paneer slice included".
Actions: "✏️ Edit (बदलें)" and "🗑️ Delete (हटाएं)".
4. Veg Cutlet (Paused / Inactive State Demonstration) Card
Header:
Image thumbnail with slight opacity/grayscale.
Gray badge: "Paused / Inactive".
Right: "Hidden" label with switch toggled (OFF).
Title: "Veg Cutlet" + Subtitle: "वेज कटलेट्स • चुकंदर व मटर की पौष्टिकता".
Pricing Box: Rate: ₹30 / piece | Note: "Switch on to show in weekend menu / Not Visible".
Actions: "✏️ Edit (बदलें)" and "🗑️ Delete (हटाएं)".
5. Special Mixture Namkeen Card
Header: Image thumbnail, "Namkeen / Dry" badge, "Active in Menu" toggle switch (ON).
Title: "Special Mixture Namkeen" + Subtitle: "स्पेशल मिक्सचर नमकीन • कुरकुरा और मसालेदार".
Pricing Box: Packet Pricing: ₹84 / 250g pack | Bulk 1kg Jar Rate: ₹320 (Airtight sealed jar).
Actions: "✏️ Edit (बदलें)" and "🗑️ Delete (हटाएं)".
6. Melt-in-Mouth Balushahi Card
Header: Image thumbnail, "Mithai / Sweet" badge, "Active in Menu" toggle switch (ON).
Title: "Melt-in-Mouth Balushahi" + Subtitle: "बालूशाही • शुद्ध देशी घी व पिस्ता गार्निश".
Pricing Box: Box Rate: ₹120 / 250g box (Approx 5–6 pcs • Freshly prepared on Saturday batch).
Actions: "✏️ Edit (बदलें)" and "🗑️ Delete (हटाएं)".
7. Meethi Bundiya Card
Header: Image thumbnail, "Mithai / Sweet" badge, "Active in Menu" toggle switch (ON).
Title: "Meethi Bundiya" + Subtitle: "मीठी बुंदिया • इलायची व केसर की महक".
Pricing Box: Pack Rate: ₹90 / 250g pack (Fresh Desi Ghee preparation).
Actions: "✏️ Edit (बदलें)" and "🗑️ Delete (हटाएं)".
G. Auntyji's Kitchen Tip (Helpful Guidance Card)
Card styling: Soft saffron-tinted container (#FFF7ED) with light orange border and amber lightbulb icon 💡.
Title: "Auntyji's Kitchen Tip (सुझाव):"
Copy: "Rates updated here reflect instantly in your weekly Menu Builder and WhatsApp broadcast preview. Keep party discounts transparent so customers can plan weekend family gatherings easily!"
H. Persistent Bottom Tab Bar (Fixed Navigation)
Height 68px, white background with top divider line:

Menu Builder (ऑर्डर मेनू): Utensils icon (Inactive).
Preview & Share (मैसेज भेजें): Share nodes icon (Inactive).
Saved Prices (रेट लिस्ट): Open book / price list icon (Active terracotta #C2410C highlight + bold label).
Settings (सेटिंग्स): Gear icon (Inactive).
4. Ready-to-Paste AI Prompt for UI / Code Generators
Create a high-fidelity mobile web screen (390px portrait viewport) for "Alpahaar Foods", a home food enterprise run by an Indian homemaker ("Auntyji"). This page is the "Saved Prices & Master Inventory" dashboard.

Design & Theming Guidelines:
- Aesthetic: Warm artisanal Indian culinary theme using terracotta orange (#c2410c), warm cream background (#fbf8fc), clean white cards (#ffffff), soft saffron highlights (#fed7aa / #fff7ed), and emerald green indicators (#16a34a).
- Typography: Plus Jakarta Sans with bilingual English and Hindi subtitles for clear, senior-friendly readability (50+ age friendly).
- Touch Targets: Large, accessible buttons (minimum 48px height) and high-contrast toggle switches.

Components to Include:
1. Top App Bar: Brand logo icon + "Alpahaar Foods" with subtitle "Maa Ke Haath Ka Swaad • Weekend Pre-orders", plus a profile circle on the right.
2. Status Strip: Badges for "📖 मास्टर रेट लिस्ट" and "✔ Auto-synced".
3. Header: Title "Saved Prices & Dishes", subtitle "रेट लिस्ट व डिशेज • घर का शुद्ध स्वाद", and brief instructions.
4. Summary KPI Cards: 3 side-by-side cards showing "8 Total Dishes (कुल आइटम)", "3 Categories (श्रेणियां)", and "Yesterday (अपडेटेड)".
5. Primary CTA: High-contrast terracotta button "+ Add New Dish or Item (नया आइटम जोड़ें)".
6. Horizontal Filter Bar: Pills for "All Items (8)" (active), "Hot Snacks (ताज़ा नाश्ता)", "Namkeen", and "Mithai".
7. Item Cards (at least 6-7 cards):
   - Crispy Samosa: Category "Hot Snack", Active toggle ON, Rate ₹25/pc, plus highlighted Party Offer tier "₹23/pc for 14+ pcs".
   - Aloo Bonda / Aloo Chops: ₹25/pc (Min order 2 pcs), Active toggle ON.
   - Bread Pakoda (Paneer Stuffed): ₹35/pc, Active toggle ON.
   - Veg Cutlet: Paused/Inactive demonstration card with gray badge "Paused / Inactive", toggle OFF, and label "Hidden".
   - Special Mixture Namkeen: ₹84/250g, 1kg jar tier ₹320.
   - Melt-in-Mouth Balushahi: ₹120/250g box (5-6 pcs).
   - Meethi Bundiya: ₹90/250g pack.
   - Each card MUST feature two distinct bottom action buttons: "✏️ Edit (बदलें)" and "🗑️ Delete (हटाएं)".
8. Reassurance Tip Card: Saffron box with lightbulb icon explaining that price updates automatically reflect in the WhatsApp Menu Builder.
9. Bottom Tab Bar: 4 tabs with icons and bilingual labels (Menu Builder, Preview & Share, Saved Prices [Active Highlighted], Settings).