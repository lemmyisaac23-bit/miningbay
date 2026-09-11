-- Run once in Supabase → SQL Editor so hall-leads replies show on client Support.
-- Safe to re-run. Does not create a new kind of table — tickets + ticket_replies
-- are the two tables this already uses.

create table if not exists public.tickets (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  email text not null,
  name text not null,
  subject text not null,
  body text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.ticket_replies (
  id text primary key,
  ticket_id text not null references public.tickets (id) on delete cascade,
  from_role text not null check (from_role in ('client', 'admin')),
  body text not null,
  at timestamptz not null default now()
);

create index if not exists tickets_user_id_idx on public.tickets (user_id);
create index if not exists ticket_replies_ticket_id_idx on public.ticket_replies (ticket_id);

alter table public.tickets enable row level security;
alter table public.ticket_replies enable row level security;

grant select, insert, update, delete on table public.tickets to authenticated;
grant select, insert, update, delete on table public.ticket_replies to authenticated;

drop policy if exists "read tickets" on public.tickets;
create policy "read tickets" on public.tickets
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "write tickets" on public.tickets;
create policy "write tickets" on public.tickets
  for all to authenticated
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "read ticket replies" on public.ticket_replies;
create policy "read ticket replies" on public.ticket_replies
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.tickets t
      where t.id = ticket_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "insert ticket replies" on public.ticket_replies;
create policy "insert ticket replies" on public.ticket_replies
  for insert to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1 from public.tickets t
      where t.id = ticket_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "update ticket replies" on public.ticket_replies;
create policy "update ticket replies" on public.ticket_replies
  for update to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.tickets t
      where t.id = ticket_id and t.user_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.tickets t
      where t.id = ticket_id and t.user_id = auth.uid()
    )
  );

notify pgrst, 'reload schema';
