 grant usage on schema public to authenticated;
   grant select, insert, update, delete on public.dishes     to authenticated;
   grant select, insert, update, delete on public.settings   to authenticated;
   grant select, insert, update, delete on public.batches    to authenticated;
   grant select, insert, update, delete on public.broadcasts to authenticated;