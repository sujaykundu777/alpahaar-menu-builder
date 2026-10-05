Here is the complete specification, component architecture, and ready-to-paste AI prompt in plain text format so you can prototype or recreate the Settings & AI API Keys (AI & Voice Settings) screen (Alpahaar Foods - Settings & AI API Keys) in any tool such as Figma, v0, Cursor, Lovable, Claude Artifacts, or Bolt.new:

Prototype Specification: Alpahaar Foods – Settings & AI API Keys (Mobile)
1. App Context & Purpose
App Name: Alpahaar Foods (अल्पाहार - माँ के हाथ का स्वाद)
Target User: Smt. Shashi Sharma ("Auntyji"), a 50+ homemaker running a weekend homemade catering business, aided by family members.
Screen Role: AI & Voice Settings (AI व वॉयस सेटिंग्स) — The central configuration hub where Auntyji or her family set up the smart AI copywriter (OpenAI GPT-4o, Anthropic Claude, or Ollama local), connect ElevenLabs Text-to-Speech API keys, pick narration voice personas (Kavita, Sunita, Maa's Voice Clone), test audio playback speed, and save UPI / society delivery defaults.
Device & Viewport: Mobile portrait viewport (approx. 390px – 430px wide, e.g., iPhone 14/15/16).
2. Design System Tokens & Styling Rules
Color Palette:
Brand / Accent Primary: Warm Terracotta / Burnt Orange (#C2410C / #EA580C)
Base Canvas Background: Warm Culinary Cream (#FBF8FC)
Card Containers: Pure White (#FFFFFF) with soft borders (#E7E5E4 / #DCD9DD)
Connected / Ready Green: Emerald Green (#16A34A / #22C55E, background tint #DCFCE7)
Highlight / Selected Container: Warm Peach / Saffron Tint (#FFF7ED, border #EA580C or #FED7AA)
Typography: Dark Charcoal (#1C1917 primary headings/body), Muted Warm Gray (#78716C secondary)
Typography & Accessibility:
Font: Plus Jakarta Sans (clean, modern, highly legible).
Bilingual cues throughout (English technical label + warm Hindi phonetic explanation).
Senior-friendly touch targets (inputs and buttons ≥ 48px height, clear radio buttons, high-contrast eye toggles).
Corner radius: rounded-2xl (16px) for master section cards, rounded-xl (12px) for nested options.
3. Screen Structure & Component Hierarchy (Top to Bottom)
A. Top Header App Bar
Left: Samosa brand mark emblem in orange (#EA580C) + Title: "Alpahaar Foods" with subtitle "Menu Builder • Maa Ke Haath Ka Swaad".
Right: Settings gear icon button (#78716C) + Circular profile avatar for Shashi Auntyji (#C2410C).
B. Page Title Banner Card
Icon: Sliders/Tune icon in a soft terracotta circle.
Title: "AI & Voice Settings" + badge pill: "सेटिंग्स".
Description: "Set up smart writing and warm voice narration so Auntyji can easily create WhatsApp broadcasts and listen with a single tap."
Hindi Subtitle: "आसान सेटिंग्स: एक क्लिक में संदेश लिखें और आवाज में सुनें".
C. Section 1: Voice Read-Out (ElevenLabs TTS) Card
Clean white rounded container with clear hierarchy:

Section Header:
Left: Green speaker icon + "Voice Read-Out (आवाज)" + subtext: "ElevenLabs Text-to-Speech".
Right: Pill badge "• Connected (कनेक्टेड)" in soft green (#DCFCE7).
API Key Input Field:
Label: "ElevenLabs API Key • की (Secret)"
Masked input field with hidden dots (••••••••••••••••••••••••••••••••)
Trailing action: Eye icon button (show/hide toggle).
Voice Persona Selector:
Subheading: "Choose Narration Voice • आवाज चुनें"
Option 1: Kavita (कविता) [SELECTED]:
Radio button (Active terracotta dot).
Title: "Kavita (कविता)" + badge: "Recommended".
Sound-wave indicator icon on the right.
Description: "Warm Indian Homemaker • Hindi & Hinglish friendly".
Container: Soft saffron/peach background (#FFF7ED) with light orange border.
Option 2: Sunita (सुनीता):
Radio button (Unchecked).
Speaker icon on right.
Description: "Energetic, friendly neighborhood aunty tone".
Option 3: Maa's Real Voice Clone (माँ की आवाज):
Radio button (Unchecked).
Badge: "माँ की आवाज" (dark green pill) + microphone icon on right.
Description: "Authentic AI clone recorded from 2-minute voice sample".
Sample Audio Preview Sub-box:
Header: "Sample Preview (सुनकर देखें):" + right status: "Ready".
Primary Play Button: Terracotta button with play icon: "▶ Test Read-out (आवाज सुनें)".
Live sample quotation in italics: "नमस्ते जी! इस शनिवार ताज़ा मेथी मठरी और बेसन के लड्डू तैयार हैं..."
Speaking Speed Slider (बोलने की रफ़्तार):
Header: "Speaking Speed (बोलने की रफ़्तार)" + value tag: "1.0x (Normal)".
Interactive horizontal slider with orange accent track and circular knob.
Three scale guide marks below:
Left: 0.75x (Slow for Elders / साफ आवाज)
Middle: 1.0x (Standard)
Right: 1.25x (Fast)
D. Section 2: AI Message Writer (मैसेज मॉडल) Card
Section Header:
Left: AI/robot head icon + "AI Message Writer (मैसेज मॉडल)" + subtext: "WhatsApp Broadcast Generation".
Right: Pill badge: "• Ready" in green.
Model Provider Cards (Selectable 1-of-3):
Option 1: OpenAI (GPT-4o / GPT-4o-mini) [SELECTED]:
Solid terracotta card (#C2410C) with white text and verified checkmark badge.
Icon: OpenAI spark/brain icon.
Title: "OpenAI (GPT-4o / GPT-4o-mini)".
Description: "Best Indian recipe & Hinglish phrasing".
Option 2: Anthropic Claude (Claude 3.5 Sonnet):
Light gray card (#F5F3F6), dark text.
Title: "Anthropic Claude (Claude 3.5 Sonnet)".
Description: "Very polite, warm conversational nuances".
Option 3: Ollama Local Server (Llama 3 / Mistral):
Light gray card (#F5F3F6), dark text.
Title: "Ollama Local Server (Llama 3 / Mistral)".
Description: "100% Free • Society Home Server".
OpenAI API Key Field:
Status tag: "✔ Validated & Saved" in green text.
Masked input with dots (••••••••••••••••••••••••••••••••) + show/hide eye icon.
Trailing state: Verified checkmark circle.
Default WhatsApp Tone & Style Dropdown:
Label: "Default WhatsApp Tone & Style • बात करने का अंदाज".
Select field with chevron down: "Warm Hinglish Society Aunty (माँ जैसा अपनापन - 'नमस्ते जी!')".
E. Section 3: Kitchen & UPI Payment Details Card
Embedded automatically into outgoing order broadcasts:

Section Header:
Storefront icon + "Kitchen & UPI Details" + subtext: "डिफ़ॉल्ट पता और पेमेंट नंबर".
Google Pay / PhonePe UPI Mobile:
Label: "Google Pay / PhonePe UPI Mobile • यूपीआई नंबर".
Input pill with wallet/ID icon: "6362307567".
Society WhatsApp Group Name:
Label: "Society WhatsApp Group Name • ग्रुप का नाम".
Input pill with users/group icon: "GR Lavender Foodies Club".
Pickup Flat / Kitchen Counter:
Label: "Pickup Flat / Kitchen Counter • पिकअप का पता".
Input pill with location pin: "Flat E401, GR Lavender Apartments".
F. Primary Save Action & Security Note
Save Button:
Full-width large pill button in rich terracotta (#C2410C):
"💾 Save Settings & Test (सेव करें)" (Height: 52px, bold white text).
Security & Privacy Reassurance Box:
Padlock shield icon.
Text: "100% Secure & Private: All API keys remain encrypted strictly on this phone. They are never sent to third-party tracking servers or shared outside Alpahaar Foods."
G. Persistent Bottom Tab Bar (Fixed Navigation)
Height 68px, white surface with top border line:

Menu Builder (ऑर्डर मेनू): Utensils icon (Inactive).
Preview & Share (मैसेज भेजें): Share nodes icon (Inactive).
Saved Prices (रेट लिस्ट): Open book icon (Inactive).
Settings (सेटिंग्स): Gear icon (Active terracotta #C2410C highlight + bold label).
4. Ready-to-Paste AI Prompt for UI / Code Generators
Create a high-fidelity mobile web screen (390px portrait viewport) for "Alpahaar Foods", an Indian homemade weekend food service. This page is the "Settings & AI API Keys (AI & Voice Settings)" screen.

Design & Theming Rules:
- Visual Theme: Warm Indian artisanal culinary aesthetic using warm terracotta orange (#c2410c), warm cream background (#fbf8fc), clean white cards (#ffffff), soft saffron highlights (#fff7ed / #fed7aa), and soft green status pills (#dcfce7 / #16a34a).
- Typography & Accessibility: Plus Jakarta Sans with clear bilingual English + Hindi subtitles for 50+ age senior-friendly readability. High-contrast touch targets (inputs ≥ 48px).

Screen Components (Top to Bottom):
1. Top Bar: Alpahaar Foods logo + subtitle "Maa Ke Haath Ka Swaad", settings gear, and profile avatar.
2. Intro Banner: Sliders icon, title "AI & Voice Settings (सेटिंग्स)", and subtitle explaining automated WhatsApp writing and voice read-outs.
3. Voice Read-Out (ElevenLabs) Card:
   - Header with speaker icon, title "Voice Read-Out (आवाज)", and "• Connected (कनेक्टेड)" green pill.
   - Masked ElevenLabs API Key field with show/hide eye icon.
   - Narration Voice Selector with 3 choices:
     * "Kavita (कविता)" [Selected, warm peach highlight, "Recommended" badge, soundwave icon].
     * "Sunita (सुनीता)" [Energetic neighborhood aunty tone].
     * "Maa's Real Voice Clone" ["माँ की आवाज" badge, microphone icon].
   - Sample Audio Preview: Button "▶ Test Read-out (आवाज सुनें)" with Hindi audio dialogue preview.
   - Speaking Speed Slider: "1.0x (Normal)" with tick marks for 0.75x (Slow for Elders), 1.0x (Standard), and 1.25x (Fast).
4. AI Message Writer Card:
   - Header with AI icon and "• Ready" green pill.
   - 3 Selectable model provider cards:
     * "OpenAI (GPT-4o / GPT-4o-mini)" [Selected in dark terracotta with checkmark].
     * "Anthropic Claude (Claude 3.5 Sonnet)".
     * "Ollama Local Server (Llama 3 / Mistral) - 100% Free".
   - Masked OpenAI API Key input with "✔ Validated & Saved" status.
   - Tone dropdown: "Warm Hinglish Society Aunty (माँ जैसा अपनापन - 'नमस्ते जी!')".
5. Kitchen & Payment Details Card:
   - UPI mobile number (6362307567).
   - Society WhatsApp group name ("GR Lavender Foodies Club").
   - Pickup apartment ("Flat E401, GR Lavender Apartments").
6. Primary Action & Security:
   - Large full-width terracotta CTA button "💾 Save Settings & Test (सेव करें)".
   - Privacy security note with lock icon stating keys stay safely encrypted on the local device.
7. Fixed Bottom Navigation Bar:
   - 4 Tabs: Menu Builder, Preview & Share, Saved Prices, and Settings [Active & highlighted in orange].