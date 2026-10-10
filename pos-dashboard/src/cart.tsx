import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartLine, Discount, Product } from "./types";

// The in-progress bill lives above the pages so it survives switching screens mid-sale.

interface Cart {
  lines: CartLine[];
  discount: Discount | null;
  customerPhone: string;
  /** Adds one unit. Returns false when there isn't enough stock. */
  add: (product: Product) => boolean;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  setDiscount: (discount: Discount | null) => void;
  setCustomerPhone: (phone: string) => void;
  clear: () => void;
}

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [customerPhone, setCustomerPhone] = useState("");

  const cart: Cart = {
    lines,
    discount,
    customerPhone,
    add(product) {
      const inCart = lines.find((l) => l.productId === product.id)?.qty ?? 0;
      if (inCart + 1 > product.stock) return false;
      setLines((prev) =>
        inCart > 0
          ? prev.map((l) => (l.productId === product.id ? { ...l, qty: l.qty + 1 } : l))
          : [...prev, { productId: product.id, name: product.name, price: product.price, gstRate: product.gstRate, qty: 1 }],
      );
      return true;
    },
    setQty(productId, qty) {
      setLines((prev) =>
        qty <= 0 ? prev.filter((l) => l.productId !== productId) : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
      );
    },
    remove(productId) {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
    },
    setDiscount,
    setCustomerPhone,
    clear() {
      setLines([]);
      setDiscount(null);
      setCustomerPhone("");
    },
  };

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart(): Cart {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
