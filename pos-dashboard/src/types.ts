export const CATEGORIES = [
  "Snacks",
  "Beverages",
  "Dairy & bakery",
  "Staples",
  "Personal care",
  "Household",
  "Stationery",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const GST_RATES = [0, 5, 12, 18, 28] as const;
export type GstRate = (typeof GST_RATES)[number];

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  /** Selling price in paise, inclusive of GST (MRP). */
  price: number;
  gstRate: GstRate;
  stock: number;
  /** Alert when stock falls to or below this level. */
  reorderLevel: number;
}

export type StockStatus = "in-stock" | "low" | "out";

export function stockStatus(p: Pick<Product, "stock" | "reorderLevel">): StockStatus {
  if (p.stock <= 0) return "out";
  if (p.stock <= p.reorderLevel) return "low";
  return "in-stock";
}

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  gstRate: GstRate;
  qty: number;
}

export type Discount = { type: "percent" | "amount"; value: number };

export interface Totals {
  itemCount: number;
  gross: number;
  discount: number;
  taxable: number;
  gst: number;
  roundOff: number;
  total: number;
}

export type PaymentMethod = "upi" | "cash" | "card";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  upi: "UPI",
  cash: "Cash",
  card: "Card",
};

export interface Payment {
  method: PaymentMethod;
  /** Cash handed over, in paise. */
  tendered?: number;
  change?: number;
}

export interface Sale {
  id: string;
  createdAt: number;
  lines: CartLine[];
  discount: Discount | null;
  totals: Totals;
  payment: Payment;
  customerPhone?: string;
}
