import { CLOSE_HOUR, OPEN_HOUR, startOfDay } from "../data/sales";
import type { PaymentMethod, Sale } from "../types";

const HOUR = 3_600_000;

export interface DayMetrics {
  net: number;
  bills: number;
  avgBill: number;
  items: number;
}

export function metrics(sales: Sale[]): DayMetrics {
  const net = sales.reduce((s, x) => s + x.totals.total, 0);
  const items = sales.reduce((s, x) => s + x.totals.itemCount, 0);
  return { net, bills: sales.length, avgBill: sales.length ? Math.round(net / sales.length) : 0, items };
}

/** Today's sales, yesterday's full day, and yesterday up to the same time of day (for fair deltas). */
export function splitDays(sales: Sale[], now = Date.now()) {
  const todayStart = startOfDay(now);
  const yesterdayStart = startOfDay(todayStart - 12 * HOUR);
  const elapsed = now - todayStart;
  const today = sales.filter((s) => s.createdAt >= todayStart);
  const yesterday = sales.filter((s) => s.createdAt >= yesterdayStart && s.createdAt < todayStart);
  const yesterdaySoFar = yesterday.filter((s) => s.createdAt - yesterdayStart <= elapsed);
  return { todayStart, yesterdayStart, today, yesterday, yesterdaySoFar };
}

export interface HourBucket {
  hour: number;
  /** Bucket start, placed on today's date so both days share one time axis. */
  timestamp: number;
  today: number | null;
  yesterday: number;
}

export function hourly(today: Sale[], yesterday: Sale[], todayStart: number, yesterdayStart: number, now = Date.now()): HourBucket[] {
  const currentHour = new Date(now).getHours();
  const sumByHour = (sales: Sale[], dayStart: number) => {
    const sums = new Map<number, number>();
    for (const s of sales) {
      const h = Math.floor((s.createdAt - dayStart) / HOUR);
      sums.set(h, (sums.get(h) ?? 0) + s.totals.total);
    }
    return sums;
  };
  const t = sumByHour(today, todayStart);
  const y = sumByHour(yesterday, yesterdayStart);
  const buckets: HourBucket[] = [];
  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    buckets.push({
      hour,
      timestamp: todayStart + hour * HOUR,
      today: hour <= currentHour ? (t.get(hour) ?? 0) : null,
      yesterday: y.get(hour) ?? 0,
    });
  }
  return buckets;
}

export function paymentMix(sales: Sale[]): { method: PaymentMethod; amount: number; bills: number }[] {
  const order: PaymentMethod[] = ["upi", "cash", "card"];
  return order.map((method) => {
    const subset = sales.filter((s) => s.payment.method === method);
    return { method, amount: subset.reduce((a, s) => a + s.totals.total, 0), bills: subset.length };
  });
}

export function topItems(sales: Sale[], limit = 5) {
  const byProduct = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const s of sales) {
    const share = s.totals.gross > 0 ? s.totals.total / s.totals.gross : 0;
    for (const l of s.lines) {
      const entry = byProduct.get(l.productId) ?? { name: l.name, qty: 0, revenue: 0 };
      entry.qty += l.qty;
      entry.revenue += l.price * l.qty * share;
      byProduct.set(l.productId, entry);
    }
  }
  return [...byProduct.entries()]
    .map(([productId, v]) => ({ productId, ...v, revenue: Math.round(v.revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function hourLabel(hour: number) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${hour < 12 ? "AM" : "PM"}`;
}
