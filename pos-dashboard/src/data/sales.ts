import { computeTotals, suggestedCash } from "../lib/billing";
import type { CartLine, Discount, Payment, PaymentMethod, Product, Sale } from "../types";

export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 22;

// Average bills per hour: a morning rush for milk and bread, a bigger one after work.
const BILLS_PER_HOUR: Record<number, number> = {
  8: 6, 9: 7, 10: 5, 11: 4, 12: 5, 13: 4, 14: 3, 15: 3, 16: 4, 17: 6, 18: 9, 19: 10, 20: 8, 21: 5,
};

const POPULARITY: Record<string, number> = {
  Snacks: 3, Beverages: 3, "Dairy & bakery": 4, Staples: 2, "Personal care": 1.5, Household: 1.2, Stationery: 0.8,
};

/** Small deterministic PRNG so the sample day looks the same on every reload. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function generateDay(dayStart: number, until: number, products: Product[], firstBillNo: number): Sale[] {
  const d = new Date(dayStart);
  const rand = mulberry32(d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate());
  const weights = products.map((p) => POPULARITY[p.category] ?? 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const pickProduct = () => {
    let r = rand() * totalWeight;
    for (let i = 0; i < products.length; i++) {
      r -= weights[i];
      if (r <= 0) return products[i];
    }
    return products[products.length - 1];
  };

  const sales: Sale[] = [];
  let billNo = firstBillNo;

  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    const count = Math.round(BILLS_PER_HOUR[hour] * (0.7 + rand() * 0.6));
    const minutes = Array.from({ length: count }, () => Math.floor(rand() * 60)).sort((a, b) => a - b);

    for (const minute of minutes) {
      const createdAt = dayStart + hour * 3_600_000 + minute * 60_000 + Math.floor(rand() * 60_000);
      if (createdAt > until) return sales;

      const lineCount = 1 + Math.floor(rand() * rand() * 5);
      const lines = new Map<string, CartLine>();
      for (let i = 0; i < lineCount; i++) {
        const p = pickProduct();
        const qty = rand() < 0.75 ? 1 : 2 + Math.floor(rand() * 2);
        const existing = lines.get(p.id);
        if (existing) existing.qty += qty;
        else lines.set(p.id, { productId: p.id, name: p.name, price: p.price, gstRate: p.gstRate, qty });
      }

      const cart = [...lines.values()];
      const discount: Discount | null = rand() < 0.06 ? { type: "percent", value: 5 } : null;
      const totals = computeTotals(cart, discount);

      const roll = rand();
      const method: PaymentMethod = roll < 0.55 ? "upi" : roll < 0.9 ? "cash" : "card";
      const payment: Payment = { method };
      if (method === "cash") {
        const options = suggestedCash(totals.total);
        payment.tendered = options[Math.floor(rand() * options.length)];
        payment.change = payment.tendered - totals.total;
      }

      sales.push({
        id: `B${billNo++}`,
        createdAt,
        lines: cart,
        discount,
        totals,
        payment,
        customerPhone: rand() < 0.2 ? `98${String(Math.floor(rand() * 1e8)).padStart(8, "0")}` : undefined,
      });
    }
  }
  return sales;
}

/** Yesterday's full trading day plus today's sales up to the current time. */
export function seedSales(products: Product[], now = Date.now()): Sale[] {
  const today = startOfDay(now);
  const yesterday = startOfDay(today - 12 * 3_600_000);
  const past = generateDay(yesterday, today, products, 1001);
  const current = generateDay(today, now, products, 1001 + past.length);
  return [...past, ...current];
}
