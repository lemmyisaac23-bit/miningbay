# Volt Mining Bay

Industrial-styled **hosted hashpower** portfolio for Volt Mining Bay: lease hashpower lanes, dock contracts, and watch a live bay wallet.

Live site: [voltminingbay.com](https://voltminingbay.com)

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Without Supabase keys the app still runs in the browser (local demo data). To persist real accounts, follow **Supabase** below.

## Supabase

The live site stays on GitHub Pages. Supabase holds sign-in and bay data (profiles, docks, tickets, withdrawals).

1. Create a project at [supabase.com](https://supabase.com).
2. In the project: **SQL Editor** → paste `supabase/schema.sql` → **Run**.
3. **Authentication → Providers → Email** → turn **off** Confirm email (unless you want clients to confirm first).
4. **Authentication → URL Configuration**
   - Site URL: `https://voltminingbay.com`
   - Redirect URLs: `https://voltminingbay.com/**` and `http://localhost:5173/**`
5. **Authentication → Users → Add user**
   - Email: `voltminingbay@gmail.com`
   - Password: the hall leads password you will use to sign in
6. In SQL Editor run:

```sql
update public.profiles set role = 'admin' where email = 'voltminingbay@gmail.com';
```

7. **Project Settings → API**: copy **Project URL** and **anon public** key.
8. In this repo, copy `.env.example` to `.env.local` and paste the URL and anon key:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Never put the **service_role** key in the frontend.

9. Restart `npm run dev`. Create account / sign in should now save to Supabase.

### GitHub Pages production

In the GitHub repo: **Settings → Secrets and variables → Actions**, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Pages deploy workflow injects these at build time so voltminingbay.com talks to the same project.

## Hosting (GitHub Pages)

Pushes to `main` build and publish the site. Custom domain: `voltminingbay.com`.

At your domain registrar, set:

**A records** for `voltminingbay.com` →

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

**CNAME** for `www` → `lemmyisaac23-bit.github.io`

In the GitHub repo: **Settings → Pages → Source: GitHub Actions**, then add custom domain `voltminingbay.com` and enable HTTPS once DNS has propagated.

## What’s in the bay

- Marketing site: home, facilities, FAQ
- Auth: register / sign in (Supabase when keys are set, otherwise the browser)
- Dashboard: overview, plans, portfolio, contracts, wallet, referrals
- New accounts start with a 0 balance
- Active contracts stream tiny payouts every few seconds

This is a frontend portfolio. Crypto deposits stay pending until hall leads credit the wallet.
