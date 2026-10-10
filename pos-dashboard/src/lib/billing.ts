import type { CartLine, Discount, Totals } from "../types";

/** Shelf prices in India are MRP, inclusive of GST. This splits a bill into its parts. */
export function computeTotals(lines: CartLine[], discount: Discount | null): Totals {
  const gross = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  let discountAmount = 0;
  if (discount && gross > 0) {
    discountAmount =
      discount.type === "percent"
        ? Math.round((gross * Math.min(discount.value, 100)) / 100)
        : Math.min(Math.round(discount.value * 100), gross);
  }

  const net = gross - discountAmount;
  const share = gross > 0 ? net / gross : 0;

  // GST contained in each line after its share of the discount.
  const gst = Math.round(
    lines.reduce((sum, l) => {
      const lineNet = l.price * l.qty * share;
      return sum + (lineNet * l.gstRate) / (100 + l.gstRate);
    }, 0),
  );

  // Bills are rounded to the nearest rupee, shown as a separate "Round off" line.
  const total = Math.round(net / 100) * 100;

  return {
    itemCount: lines.reduce((sum, l) => sum + l.qty, 0),
    gross,
    discount: discountAmount,
    taxable: net - gst,
    gst,
    roundOff: total - net,
    total,
  };
}

/** Next round amounts a customer is likely to hand over for a cash bill. */
export function suggestedCash(total: number): number[] {
  const notes = [10, 50, 100, 500, 2000].map((n) => n * 100);
  const options = new Set<number>([total]);
  for (const note of notes) {
    const rounded = Math.ceil(total / note) * note;
    if (rounded > total) options.add(rounded);
    if (options.size >= 5) break;
  }
  return [...options].sort((a, b) => a - b);
}
