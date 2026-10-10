import { useMemo, useState } from "react";
import {
  Button,
  Empty,
  InputGroup,
  LayerCard,
  Tabs,
  Text,
  cn,
  useKumoToastManager,
} from "@cloudflare/kumo";
import {
  BarcodeIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PercentIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useCart } from "../cart";
import { BillTotals } from "../components/BillTotals";
import { DiscountDialog } from "../components/DiscountDialog";
import { PageHeader } from "../components/PageHeader";
import { PaymentDialog } from "../components/PaymentDialog";
import { ReceiptDialog } from "../components/ReceiptDialog";
import { computeTotals } from "../lib/billing";
import { formatINR, formatINRWhole } from "../lib/money";
import { useStore } from "../store";
import { CATEGORIES, PAYMENT_LABELS, stockStatus, type Payment, type Product, type Sale } from "../types";

function ProductTile({ product, inCart, onAdd }: { product: Product; inCart: number; onAdd: () => void }) {
  const status = stockStatus(product);
  const left = product.stock - inCart;
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={status === "out"}
      className={cn(
        "relative flex min-h-24 flex-col justify-between gap-2 rounded-lg bg-kumo-base p-3 text-left ring ring-kumo-hairline transition-colors",
        "hover:bg-kumo-tint focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-kumo-base",
        inCart > 0 && "ring-2 ring-kumo-brand",
      )}
    >
      <span className="line-clamp-2 text-sm font-medium text-kumo-default">{product.name}</span>
      <span className="flex items-end justify-between gap-2">
        <span className="text-sm font-semibold text-kumo-default">{formatINRWhole(product.price)}</span>
        <span className={cn("text-xs", status === "in-stock" ? "text-kumo-subtle" : status === "low" ? "text-kumo-warning" : "text-kumo-danger")}>
          {status === "out" ? "Out of stock" : `${left} left`}
        </span>
      </span>
      {inCart > 0 && (
        <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-kumo-brand text-xs font-semibold text-white">
          {inCart}
        </span>
      )}
    </button>
  );
}

function QtyStepper({ qty, max, onChange, name }: { qty: number; max: number; onChange: (qty: number) => void; name: string }) {
  return (
    <div className="flex items-center gap-1">
      <Button size="xs" shape="square" icon={<MinusIcon />} aria-label={`One less ${name}`} onClick={() => onChange(qty - 1)} />
      <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
      <Button
        size="xs"
        shape="square"
        icon={<PlusIcon />}
        aria-label={`One more ${name}`}
        disabled={qty >= max}
        onClick={() => onChange(qty + 1)}
      />
    </div>
  );
}

export function Checkout() {
  const { products, completeSale, nextBillNo } = useStore();
  const cart = useCart();
  const toasts = useKumoToastManager();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [paying, setPaying] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [receipt, setReceipt] = useState<Sale | null>(null);

  const totals = computeTotals(cart.lines, cart.discount);
  const qtyInCart = (id: string) => cart.lines.find((l) => l.productId === id)?.qty ?? 0;
  const stockOf = (id: string) => products.find((p) => p.id === id)?.stock ?? 0;

  const needle = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          (needle === "" || p.name.toLowerCase().includes(needle) || p.sku.includes(needle)),
      ),
    [products, category, needle],
  );

  function add(product: Product) {
    if (!cart.add(product)) {
      toasts.add({
        title: product.stock === 0 ? `${product.name} is out of stock` : `Only ${product.stock} ${product.name} in stock`,
        variant: "warning",
      });
    }
  }

  // Barcode scanners type the code and press Enter: add the exact match and clear the box.
  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const match = products.find((p) => p.sku === needle) ?? (visible.length === 1 ? visible[0] : undefined);
    if (match) {
      add(match);
      setQuery("");
    }
  }

  function onPaid(payment: Payment) {
    const sale = completeSale({
      lines: cart.lines,
      discount: cart.discount,
      payment,
      customerPhone: cart.customerPhone || undefined,
    });
    setPaying(false);
    cart.clear();
    setReceipt(sale);
    toasts.add({
      title: `Bill ${sale.id} paid`,
      description: `${formatINR(sale.totals.total)} by ${PAYMENT_LABELS[payment.method]}`,
      variant: "success",
    });
  }

  const phoneError = cart.customerPhone !== "" && !/^\d{10}$/.test(cart.customerPhone);

  return (
    <>
      <PageHeader title="New sale" description={`Bill B${nextBillNo} · scan a barcode or tap items to add them`} />

      <div className="grid gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:pb-0">
        <section className="flex min-w-0 flex-col gap-4" aria-label="Products">
          <InputGroup>
            <InputGroup.Addon>
              <MagnifyingGlassIcon />
            </InputGroup.Addon>
            <InputGroup.Input
              placeholder="Search items or scan barcode"
              aria-label="Search items or scan barcode"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKey}
              // Ready for the barcode scanner at the counter; skip on touch screens so the keyboard doesn't pop up.
              autoFocus={window.matchMedia("(pointer: fine)").matches}
            />
            <InputGroup.Addon align="end">
              <BarcodeIcon />
            </InputGroup.Addon>
          </InputGroup>

          <Tabs
            variant="underline"
            value={category}
            onValueChange={setCategory}
            tabs={["All", ...CATEGORIES].map((c) => ({ value: c, label: c }))}
          />

          {visible.length === 0 ? (
            <Empty
              size="sm"
              icon={<MagnifyingGlassIcon size={32} className="text-kumo-inactive" />}
              title="No items match"
              description="Try another name or category, or check the barcode."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => (
                <ProductTile key={p.id} product={p} inCart={qtyInCart(p.id)} onAdd={() => add(p)} />
              ))}
            </div>
          )}
        </section>

        <aside id="cart" aria-label="Current bill" className="lg:sticky lg:top-18 lg:self-start">
          <LayerCard>
            <LayerCard.Secondary className="flex items-center justify-between">
              <span>Current bill</span>
              {cart.lines.length > 0 && (
                <Button variant="ghost" size="xs" onClick={cart.clear}>
                  Clear
                </Button>
              )}
            </LayerCard.Secondary>
            <LayerCard.Primary className="flex flex-col gap-4">
              {cart.lines.length === 0 ? (
                <Empty
                  size="sm"
                  icon={<ShoppingCartIcon size={32} className="text-kumo-inactive" />}
                  title="No items yet"
                  description="Tap an item or scan a barcode to start the bill."
                />
              ) : (
                <ul className="flex max-h-[40svh] flex-col divide-y divide-kumo-hairline overflow-y-auto">
                  {cart.lines.map((l) => (
                    <li key={l.productId} className="flex items-center gap-3 py-2">
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Text size="sm" truncate>
                          {l.name}
                        </Text>
                        <Text variant="secondary" size="xs">
                          {formatINR(l.price)} each
                        </Text>
                      </div>
                      <QtyStepper qty={l.qty} max={stockOf(l.productId)} name={l.name} onChange={(q) => cart.setQty(l.productId, q)} />
                      <span className="w-20 text-right text-sm tabular-nums">{formatINR(l.price * l.qty)}</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        shape="square"
                        icon={<TrashIcon />}
                        aria-label={`Remove ${l.name}`}
                        onClick={() => cart.remove(l.productId)}
                      />
                    </li>
                  ))}
                </ul>
              )}

              <InputGroup size="sm">
                <InputGroup.Addon>
                  <UserIcon />
                </InputGroup.Addon>
                <InputGroup.Input
                  placeholder="Customer mobile (optional)"
                  aria-label="Customer mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  value={cart.customerPhone}
                  onChange={(e) => cart.setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                />
              </InputGroup>
              {phoneError && (
                <Text variant="error" size="xs">
                  Enter a 10-digit mobile number
                </Text>
              )}

              <Button
                variant="outline"
                size="sm"
                icon={<PercentIcon />}
                disabled={cart.lines.length === 0}
                onClick={() => setDiscountOpen(true)}
                className="self-start"
              >
                {cart.discount ? "Edit discount" : "Add discount"}
              </Button>

              <BillTotals totals={totals} discount={cart.discount} />

              <Button
                variant="primary"
                size="lg"
                className="hidden w-full lg:inline-flex"
                disabled={cart.lines.length === 0 || phoneError}
                onClick={() => setPaying(true)}
              >
                Charge {formatINR(totals.total)}
              </Button>
            </LayerCard.Primary>
          </LayerCard>
        </aside>
      </div>

      {/* On phones and small tablets the bill sits below the items, so keep the total in reach. */}
      {cart.lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-kumo-hairline bg-kumo-base px-4 py-3 lg:hidden">
          <a href="#cart" className="flex min-w-0 flex-1 flex-col" onClick={(e) => { e.preventDefault(); document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" }); }}>
            <Text variant="secondary" size="xs">
              {totals.itemCount} items · view bill
            </Text>
            <Text bold>{formatINR(totals.total)}</Text>
          </a>
          <Button variant="primary" size="lg" disabled={phoneError} onClick={() => setPaying(true)}>
            Charge
          </Button>
        </div>
      )}

      <DiscountDialog
        open={discountOpen}
        current={cart.discount}
        gross={totals.gross}
        onOpenChange={setDiscountOpen}
        onApply={(d) => {
          cart.setDiscount(d);
          setDiscountOpen(false);
        }}
      />
      <PaymentDialog open={paying} total={totals.total} onOpenChange={setPaying} onPaid={onPaid} />
      <ReceiptDialog sale={receipt} onClose={() => setReceipt(null)} />
    </>
  );
}
