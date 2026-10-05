# Alpahaar Foods – Weekend Menu Builder

Next.js 15 (App Router, React 19) + Supabase + server-side AI (OpenAI / Claude / Gemini) + ElevenLabs voice. Ready to deploy on Render.

`HTML/`, `Prototypes/` and `Design.md` are the original design references; the app itself lives in `src/`.

## How it fits together

| Piece | Where |
|---|---|
| Screens (Menu, Preview, Prices, Settings, Login) | `src/app/(app)/*`, `src/app/login`, `src/components/*` |
| Original styling, ported 1:1 | `src/app/globals.css` |
| Database, auth, photo storage | Supabase – schema in `supabase/migrations/0001_init.sql` |
| WhatsApp message writer | `POST /api/generate-message` → `src/lib/ai/*` |
| Voice read-out | `POST /api/tts` → ElevenLabs |
| Starter dishes (from the prototype) | `src/lib/defaults.ts` – inserted on first sign-in |

**API keys never reach the browser.** They are read from environment variables on the server only, so the old "paste your key in Settings" fields are replaced by status badges.
Prices in generated messages always come from the database, and every AI message is checked to contain each selected dish's price – otherwise the standard template message is used.

## 1. Supabase

1. Create a project at supabase.com.
2. SQL Editor → paste and run `supabase/migrations/0001_init.sql` (tables, row-level security, `dish-images` storage bucket).
3. Authentication → Providers → Email: keep enabled. Authentication → Sign In / Providers: **turn off "Allow new users to sign up"** (the app is private and spends AI credits).
4. Project Settings → API: copy the project URL, the anon/publishable key and (for step 5 only) the service-role key.

## 2. Environment

```bash
cp .env.example .env.local   # already created for you – fill in the values
```

See `.env.example` for every variable. Minimum to run: the two `NEXT_PUBLIC_SUPABASE_*` values. Each AI provider / ElevenLabs lights up once its key is set (`DEFAULT_AI_PROVIDER` picks the default).
ElevenLabs needs voice **IDs** (not names): copy them from elevenlabs.io → Voices. Kavita defaults to voice `iPmVSMDLX3FRQaONHDW2` with model `eleven_v4`; read-outs get a `[warm]` audio tag (change via `ELEVENLABS_STYLE_TAG`).

## 3. Run locally

```bash
npm install
npm run create-user -- auntyji@example.com "choose-a-strong-password"   # uses SUPABASE_SERVICE_ROLE_KEY
npm run dev        # http://localhost:3000
```

## 4. Deploy on Render

1. Push this folder to a GitHub repo.
2. Render → New → **Blueprint** → pick the repo (it reads `render.yaml`), or create a Web Service manually with:
   - Build: `npm ci && npm run build`
   - Start: `npm start`
   - Health check path: `/api/health`
3. Fill in the environment variables marked `sync: false` (Render prompts for them). `NEXT_PUBLIC_*` values must be set **before** the first build.
4. Optional: set `ALLOWED_EMAILS=auntyji@example.com` to restrict who can use the app.

Render's free plan sleeps after inactivity (first open can take ~30 s). Use the Starter plan if that is annoying.

## Notes / decisions

- Ollama was dropped from Settings (it can't reach a home server from Render). OpenAI, Claude and Gemini are supported; default models are env-configurable (`*_MODEL`).
- The mobile layout is capped at 430 px wide like the prototype and centred on larger screens; pinch-zoom stays enabled for readability.
- Sharing opens the WhatsApp / Telegram / SMS share sheet with the message pre-filled (no unofficial sending); each share is logged under "Recent Broadcasts".
