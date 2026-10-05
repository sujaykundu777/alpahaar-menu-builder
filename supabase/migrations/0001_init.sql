-- Alpahaar Foods – initial schema
-- Run in Supabase → SQL Editor (or `supabase db push`).

-- ───────────── Tables ─────────────
create table if not exists public.dishes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name_en       text not null,
  name_hi       text,
  desc_en       text,
  desc_hi       text,
  category      text not null default 'hot-snacks' check (category in ('hot-snacks','namkeen','mithai')),
  emoji         text not null default '🥟',
  price         numeric(10,2) not null check (price >= 0),
  unit          text not null default 'piece' check (unit in ('piece','250g','500g','1kg','box','pack')),
  party_price   numeric(10,2) check (party_price >= 0),
  party_min_qty integer check (party_min_qty > 0),
  party_note    text,
  notes         text,
  image_url     text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists dishes_user_idx on public.dishes (user_id, created_at);

create table if not exists public.settings (
  user_id         uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  upi_number      text not null default '',
  group_name      text not null default '',
  pickup_address  text not null default '',
  drop_time       text not null default '6:00 PM',
  cutoff_text     text not null default 'Sunday 11:00 AM',
  ai_provider     text not null default 'gemini' check (ai_provider in ('openai','claude','gemini')),
  default_tone    text not null default 'hinglish' check (default_tone in ('hinglish','english','hindi')),
  writing_style   text not null default 'warm' check (writing_style in ('warm','professional','traditional','modern')),
  voice_key       text not null default 'kavita' check (voice_key in ('kavita','sunita','maa')),
  voice_speed     integer not null default 100 check (voice_speed between 75 and 125),
  updated_at      timestamptz not null default now()
);

create table if not exists public.batches (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users(id) on delete cascade,
  batch_no         integer not null,
  batch_date       date not null,
  drop_time        text not null default '6:00 PM',
  cutoff_text      text not null default 'Sunday 11:00 AM',
  pickup_address   text not null default '',
  tone             text not null default 'hinglish' check (tone in ('hinglish','english','hindi')),
  dish_ids         uuid[] not null default '{}',
  message          text not null default '',
  message_source   text not null default 'template' check (message_source in ('template','ai','edited')),
  status           text not null default 'draft' check (status in ('draft','sent')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, batch_no)
);
create index if not exists batches_user_idx on public.batches (user_id, created_at desc);

create table if not exists public.broadcasts (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  batch_id  uuid not null references public.batches(id) on delete cascade,
  channel   text not null check (channel in ('whatsapp','whatsapp-group','telegram','sms','clipboard')),
  sent_at   timestamptz not null default now()
);
create index if not exists broadcasts_user_idx on public.broadcasts (user_id, sent_at desc);

-- ───────────── updated_at trigger ─────────────
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists dishes_touch on public.dishes;
create trigger dishes_touch before update on public.dishes
  for each row execute function public.touch_updated_at();
drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();
drop trigger if exists batches_touch on public.batches;
create trigger batches_touch before update on public.batches
  for each row execute function public.touch_updated_at();

-- ───────────── Row Level Security: each user only sees their own rows ─────────────
alter table public.dishes     enable row level security;
alter table public.settings   enable row level security;
alter table public.batches    enable row level security;
alter table public.broadcasts enable row level security;

drop policy if exists "own dishes" on public.dishes;
create policy "own dishes" on public.dishes
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own settings" on public.settings;
create policy "own settings" on public.settings
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own batches" on public.batches;
create policy "own batches" on public.batches
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own broadcasts" on public.broadcasts;
create policy "own broadcasts" on public.broadcasts
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ───────────── Storage: dish photos (public read, owner write) ─────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dish-images', 'dish-images', true, 5242880, array['image/jpeg','image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "dish images public read" on storage.objects;
create policy "dish images public read" on storage.objects
  for select using (bucket_id = 'dish-images');

drop policy if exists "dish images owner insert" on storage.objects;
create policy "dish images owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'dish-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "dish images owner update" on storage.objects;
create policy "dish images owner update" on storage.objects
  for update to authenticated
  using (bucket_id = 'dish-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "dish images owner delete" on storage.objects;
create policy "dish images owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'dish-images' and (storage.foldername(name))[1] = auth.uid()::text);
