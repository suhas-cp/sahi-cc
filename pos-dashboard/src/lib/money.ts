// All amounts are stored in paise (integer) to avoid floating-point drift.

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrWhole = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,23,456.50 — bills, cart, receipts. */
export const formatINR = (paise: number) => inr.format(paise / 100);

/** ₹1,23,457 — prices and dashboard figures. */
export const formatINRWhole = (paise: number) => inrWhole.format(paise / 100);

/** ₹500 / ₹12.3K / ₹1.2L / ₹3.4Cr — chart axes. Browsers disagree on Indian compact notation, so it's done by hand. */
export function formatINRCompact(paise: number): string {
  const r = paise / 100;
  const fmt = (n: number, unit: string) => `₹${Number(n.toFixed(1)).toLocaleString("en-IN")}${unit}`;
  if (Math.abs(r) >= 1e7) return fmt(r / 1e7, "Cr");
  if (Math.abs(r) >= 1e5) return fmt(r / 1e5, "L");
  if (Math.abs(r) >= 1e3) return fmt(r / 1e3, "K");
  return `₹${Math.round(r)}`;
}

export const rupees = (amount: number) => Math.round(amount * 100);
