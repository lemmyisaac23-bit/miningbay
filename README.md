# Volt Mining Bay

Industrial-styled **hosted hashpower** portfolio for Volt Mining Bay: lease hashpower lanes, dock contracts, and watch a live bay wallet.

Live site: [voltminingbay.com](https://voltminingbay.com)

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

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
- Auth: register / sign in (stored in the browser)
- Dashboard: overview, plans, portfolio, contracts, wallet, referrals
- New accounts start with a 0 balance
- Active contracts stream tiny payouts every few seconds

This is a frontend portfolio. Balances are not on-chain.
