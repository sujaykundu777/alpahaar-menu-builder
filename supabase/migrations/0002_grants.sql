-- Table privileges for the signed-in role. Row Level Security (0001) still limits
-- every user to their own rows; these grants only let the policies be evaluated.
-- Safe to run more than once.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.dishes     to authenticated;
grant select, insert, update, delete on public.settings   to authenticated;
grant select, insert, update, delete on public.batches    to authenticated;
grant select, insert, update, delete on public.broadcasts to authenticated;
