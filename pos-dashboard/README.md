# Store POS dashboard

A point-of-sale prototype for a local general store in India, built with Cloudflare's
[Kumo](https://www.npmjs.com/package/@cloudflare/kumo) design system, React, and Tailwind CSS v4.
Prices are in ₹ (MRP, GST-inclusive) and payments cover UPI, cash and card.

## Screens

| Screen | Status | What it does |
| --- | --- | --- |
| New sale (`#/checkout`) | Built | Search, scan or tap items; edit quantities; customer mobile; discount; GST and round-off; pay by UPI, cash (with change) or card; printable receipt |
| Dashboard (`#/`) | Built | Today's sales, bills, average bill and items sold against yesterday at the same time; sales by hour; payment mix; top items; low-stock alerts; recent bills |
| Inventory (`#/inventory`) | Built | Search and filter products, needs-reorder and out-of-stock views, add and edit products, restock |
| Flow map (`#/flows`) | Built | Every POS flow, who does it, its trigger, outcome and steps; built steps link to the live screen |
| Orders & refunds, Customers, Shift & cash, Settings | Planned | Each shows the flow it will cover, for review before design starts |

The screens share one in-memory store, so a sale made in New sale updates the dashboard and stock levels straight away.
The data is a fictional sample store ("Nukkad Mart"): a seeded catalogue plus generated bills for yesterday and today. It resets on reload.

## Run locally

```bash
cd pos-dashboard
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
```

## Where things live

- `src/data/flows.ts` — the flow map content (edit here to change flows or mark one built)
- `src/data/products.ts`, `src/data/sales.ts` — sample catalogue and generated bills
- `src/lib/billing.ts` — GST-inclusive totals, discount, round-off, cash suggestions
- `src/pages/` — one file per screen; `src/components/` — dialogs, receipt, cards

## Deploy

`.github/workflows/pages.yml` builds this app and the customer table, and publishes them together to GitHub Pages
from the default branch. This app is served at `/pos/`: https://suhas-cp.github.io/sahi-cc/pos/
