import { createContext, useContext, useReducer, type ReactNode } from "react";
import { seedProducts } from "./data/products";
import { seedSales } from "./data/sales";
import type { CartLine, Discount, Payment, Product, Sale } from "./types";
import { computeTotals } from "./lib/billing";

interface State {
  products: Product[];
  sales: Sale[];
  nextBillNo: number;
}

type Action =
  | { type: "completeSale"; sale: Sale }
  | { type: "saveProduct"; product: Product }
  | { type: "restock"; productId: string; qty: number }
  | { type: "reset" };

function initialState(): State {
  const products = seedProducts.map((p) => ({ ...p }));
  const sales = seedSales(products);
  return { products, sales, nextBillNo: 1001 + sales.length };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "completeSale": {
      const sold = new Map(action.sale.lines.map((l) => [l.productId, l.qty]));
      return {
        products: state.products.map((p) =>
          sold.has(p.id) ? { ...p, stock: Math.max(0, p.stock - sold.get(p.id)!) } : p,
        ),
        sales: [...state.sales, action.sale],
        nextBillNo: state.nextBillNo + 1,
      };
    }
    case "saveProduct": {
      const exists = state.products.some((p) => p.id === action.product.id);
      return {
        ...state,
        products: exists
          ? state.products.map((p) => (p.id === action.product.id ? action.product : p))
          : [...state.products, action.product],
      };
    }
    case "restock":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.productId ? { ...p, stock: p.stock + action.qty } : p,
        ),
      };
    case "reset":
      return initialState();
  }
}

interface SaleInput {
  lines: CartLine[];
  discount: Discount | null;
  payment: Payment;
  customerPhone?: string;
}

interface Store extends State {
  completeSale: (input: SaleInput) => Sale;
  saveProduct: (product: Product) => void;
  restock: (productId: string, qty: number) => void;
  reset: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const store: Store = {
    ...state,
    completeSale(input) {
      const sale: Sale = {
        ...input,
        id: `B${state.nextBillNo}`,
        createdAt: Date.now(),
        totals: computeTotals(input.lines, input.discount),
      };
      dispatch({ type: "completeSale", sale });
      return sale;
    },
    saveProduct: (product) => dispatch({ type: "saveProduct", product }),
    restock: (productId, qty) => dispatch({ type: "restock", productId, qty }),
    reset: () => dispatch({ type: "reset" }),
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
