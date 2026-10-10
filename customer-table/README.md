# Customer table

A customer list (name, ID, active/inactive status) built with Cloudflare's
[Kumo](https://www.npmjs.com/package/@cloudflare/kumo) design system, React, and Tailwind CSS v4.

Features: status filter (All / Active / Inactive), search by name or ID, and a light/dark toggle.

## Run locally

```bash
cd customer-table
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
```

## Data

Sample customers live in `src/customers.ts`. Replace that array (or fetch from an API) to show real data.

## Deploy

`.github/workflows/customer-table.yml` builds on every push and PR that touches this folder,
and publishes `dist/` to GitHub Pages from the default branch.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
