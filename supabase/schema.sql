-- Volt Mining Bay — paste this into Supabase → SQL Editor → Run
--
-- After this runs:
-- 1. Authentication → Providers → Email → disable "Confirm email"
--    (or keep it on if you want clients to confirm before sign-in)
-- 2. Authentication → URL Configuration
--      Site URL: https://voltminingbay.com
--      Redirect URLs: https://voltminingbay.com/**  and  http://localhost:5173/**
-- 3. Authentication → Users → Add user
--      email: voltminingbay@gmail.com
--      password: the hall leads password you will use to sign in
-- 4. Run this once so that user is hall leads:
--      update public.profiles set role = 'admin' where email = 'voltminingbay@gmail.com';

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  country text not null default '',
  address_line text,
  city text,
  state text,
  zip text,
  profile_verified boolean not null default false,
  balance_usd numeric not null default 0,
  referral_code text not null,
  role text not null default 'client' check (role in ('client', 'admin')),
  joined_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id text not null,
  started_at timestamptz not null,
  ends_at timestamptz not null,
  earned_usd numeric not null default 0,
  active boolean not null default true,
  paused boolean not null default false,
  last_mined_at timestamptz
);

create table if not exists public.txs (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  label text not null,
  amount_usd numeric not null,
  at timestamptz not null default now()
);

create table if not exists public.withdrawals (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  email text not null,
  wallet text not null,
  amount_usd numeric not null,
  at timestamptz not null default now(),
  status text not null default 'pending'
);

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

create index if not exists contracts_user_id_idx on public.contracts (user_id);
create index if not exists txs_user_id_idx on public.txs (user_id);
create index if not exists withdrawals_user_id_idx on public.withdrawals (user_id);
create index if not exists tickets_user_id_idx on public.tickets (user_id);
create index if not exists ticket_replies_ticket_id_idx on public.ticket_replies (ticket_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  code text;
begin
  code := 'VOLT-' || upper(substr(split_part(new.email, '@', 1), 1, 3))
    || '-' || upper(substr(md5(new.id::text), 1, 3));
  insert into public.profiles (
    id, email, first_name, last_name, phone, country, referral_code
  )
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'country', ''),
    code
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.contracts enable row level security;
alter table public.txs enable row level security;
alter table public.withdrawals enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_replies enable row level security;

drop policy if exists "read profiles" on public.profiles;
create policy "read profiles" on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "update profiles" on public.profiles;
create policy "update profiles" on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "read contracts" on public.contracts;
create policy "read contracts" on public.contracts
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "write contracts" on public.contracts;
create policy "write contracts" on public.contracts
  for all to authenticated
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "read txs" on public.txs;
create policy "read txs" on public.txs
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "write txs" on public.txs;
create policy "write txs" on public.txs
  for all to authenticated
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "read withdrawals" on public.withdrawals;
create policy "read withdrawals" on public.withdrawals
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert withdrawals" on public.withdrawals;
create policy "insert withdrawals" on public.withdrawals
  for insert to authenticated
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "update withdrawals" on public.withdrawals;
create policy "update withdrawals" on public.withdrawals
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

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
