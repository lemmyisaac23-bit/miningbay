-- Paste this SQL into Supabase → SQL Editor and Run.
-- Do not paste a Windows file path.

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

create or replace function public.guard_balance_usd()
returns trigger
language plpgsql
as $$
begin
  if new.balance_usd is not distinct from old.balance_usd then
    return new;
  end if;
  if current_setting('app.allow_balance', true) = '1' then
    return new;
  end if;
  new.balance_usd := old.balance_usd;
  return new;
end;
$$;

drop trigger if exists guard_balance_usd on public.profiles;
create trigger guard_balance_usd
  before update on public.profiles
  for each row execute procedure public.guard_balance_usd();

drop function if exists public.admin_set_balance(uuid, numeric);

create or replace function public.admin_set_balance(p_user_id text, p_balance numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Hall leads role is required to set a wallet.';
  end if;
  perform set_config('app.allow_balance', '1', true);
  update public.profiles
    set balance_usd = p_balance
    where id = p_user_id::uuid;
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
  perform set_config('app.allow_balance', '1', true);
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
  perform set_config('app.allow_balance', '1', true);
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

grant execute on function public.admin_set_balance(text, numeric) to authenticated;
grant execute on function public.admin_set_balance_by_email(text, numeric) to authenticated;
grant execute on function public.credit_own_balance(numeric) to authenticated;

notify pgrst, 'reload schema';
