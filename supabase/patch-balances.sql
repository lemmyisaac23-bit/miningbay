-- Run once in Supabase → SQL Editor so hall-leads wallet edits stick.
-- Paste this SQL, not the file path. The wallet is profiles.balance_usd.

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

grant execute on function public.is_admin() to authenticated;

drop policy if exists "update profiles" on public.profiles;
create policy "update profiles" on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.txs to authenticated;

create or replace function public.admin_set_balance(p_user_id uuid, p_balance numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Hall leads role is required to set a wallet.';
  end if;
  update public.profiles
    set balance_usd = p_balance
    where id = p_user_id;
  if not found then
    raise exception 'No profile found for that client.';
  end if;
  return p_balance;
end;
$$;

create or replace function public.admin_set_balance_by_email(p_email text, p_balance numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Hall leads role is required to set a wallet.';
  end if;
  update public.profiles
    set balance_usd = p_balance
    where lower(email) = lower(p_email);
  if not found then
    raise exception 'No profile found for that client.';
  end if;
  return p_balance;
end;
$$;

create or replace function public.credit_own_balance(p_amount numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  next_balance numeric;
begin
  update public.profiles
    set balance_usd = balance_usd + p_amount
    where id = auth.uid()
    returning balance_usd into next_balance;
  if next_balance is null then
    raise exception 'No profile found.';
  end if;
  return next_balance;
end;
$$;

grant execute on function public.admin_set_balance(uuid, numeric) to authenticated;
grant execute on function public.admin_set_balance_by_email(text, numeric) to authenticated;
grant execute on function public.credit_own_balance(numeric) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception
  when duplicate_object then null;
end $$;

notify pgrst, 'reload schema';
