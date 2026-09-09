-- Run this once in Supabase → SQL Editor if tickets or balance edits fail.
-- Safe to re-run.

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
