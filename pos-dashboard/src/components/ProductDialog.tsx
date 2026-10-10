import { useEffect, useState } from "react";
import { Button, Dialog, Input, Select, Text } from "@cloudflare/kumo";
import { formatINR, rupees } from "../lib/money";
import { CATEGORIES, GST_RATES, type Category, type GstRate, type Product } from "../types";

interface Form {
  name: string;
  sku: string;
  category: Category;
  price: string;
  gstRate: string;
  stock: string;
  reorderLevel: string;
}

const toForm = (p: Product | null): Form => ({
  name: p?.name ?? "",
  sku: p?.sku ?? "",
  category: p?.category ?? "Snacks",
  price: p ? String(p.price / 100) : "",
  gstRate: String(p?.gstRate ?? 18),
  stock: p ? String(p.stock) : "",
  reorderLevel: p ? String(p.reorderLevel) : "10",
});

const isWhole = (v: string) => /^\d+$/.test(v);

export function ProductDialog({
  open,
  product,
  existingSkus,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  /** Null when adding a new product. */
  product: Product | null;
  existingSkus: Set<string>;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
}) {
  const [form, setForm] = useState<Form>(() => toForm(product));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(toForm(product));
      setSubmitted(false);
    }
  }, [open, product?.id]);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const errors: Partial<Record<keyof Form, string>> = {};
  if (!form.name.trim()) errors.name = "Enter a product name";
  if (!/^\d{8,14}$/.test(form.sku)) errors.sku = "Barcode is 8 to 14 digits";
  else if (existingSkus.has(form.sku) && form.sku !== product?.sku) errors.sku = "Another product already uses this barcode";
  if (!(Number(form.price) > 0)) errors.price = "Enter a price above ₹0";
  if (!isWhole(form.stock)) errors.stock = "Enter a whole number";
  if (!isWhole(form.reorderLevel)) errors.reorderLevel = "Enter a whole number";
  const valid = Object.keys(errors).length === 0;
  const show = (key: keyof Form) => (submitted || form[key] !== "" ? errors[key] : undefined);

  const price = rupees(Number(form.price) || 0);
  const rate = Number(form.gstRate);
  const exGst = Math.round((price * 100) / (100 + rate));

  function save() {
    setSubmitted(true);
    if (!valid) return;
    onSave({
      id: product?.id ?? `p${Date.now()}`,
      name: form.name.trim(),
      sku: form.sku,
      category: form.category,
      price,
      gstRate: rate as GstRate,
      stock: Number(form.stock),
      reorderLevel: Number(form.reorderLevel),
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog size="lg" className="flex max-h-[90svh] flex-col gap-5 overflow-y-auto p-6">
        <div className="flex flex-col gap-1">
          <Dialog.Title className="text-lg font-semibold">{product ? "Edit product" : "Add product"}</Dialog.Title>
          <Dialog.Description className="text-sm text-kumo-subtle">
            {product ? "Changes apply to new bills only." : "It appears in New sale as soon as you save."}
          </Dialog.Description>
        </div>

        <form
          className="grid items-start gap-4 sm:grid-cols-2 [&>*]:min-w-0"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div className="sm:col-span-2">
            <Input className="w-full min-w-0" label="Product name" placeholder="e.g. Toned milk 500 ml" value={form.name} onChange={set("name")} error={show("name")} />
          </div>
          <Input className="w-full min-w-0" label="Barcode" inputMode="numeric" placeholder="Scan or type" value={form.sku} onChange={set("sku")} error={show("sku")} />
          <Select
            className="w-full"
            label="Category"
            value={form.category}
            onValueChange={(v) => setForm((f) => ({ ...f, category: (v as Category) ?? f.category }))}
            items={Object.fromEntries(CATEGORIES.map((c) => [c, c]))}
          />
          <Input
            className="w-full min-w-0"
            label="Selling price (₹, incl. GST)"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={form.price}
            onChange={set("price")}
            error={show("price")}
           
            description={price > 0 ? `${formatINR(exGst)} before GST` : "The MRP printed on the pack"}
          />
          <Select
            className="w-full"
            label="GST rate"
            value={form.gstRate}
            onValueChange={(v) => setForm((f) => ({ ...f, gstRate: (v as string) ?? f.gstRate }))}
            items={Object.fromEntries(GST_RATES.map((r) => [String(r), `${r}%`]))}
          />
          <Input
            className="w-full min-w-0"
            label={product ? "Stock on hand" : "Opening stock"}
            type="number"
            inputMode="numeric"
            min={0}
            value={form.stock}
            onChange={set("stock")}
            error={show("stock")}
           
          />
          <Input
            className="w-full min-w-0"
            label="Reorder level"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.reorderLevel}
            onChange={set("reorderLevel")}
            error={show("reorderLevel")}
           
            description="Flag as low stock at or below this"
          />
          <div className="flex items-center justify-end gap-2 sm:col-span-2">
            {submitted && !valid && (
              <Text variant="error" size="sm" as="span">
                Fix the highlighted fields
              </Text>
            )}
            <Dialog.Close render={(props) => <Button {...props}>Cancel</Button>} />
            <Button type="submit" variant="primary">
              {product ? "Save changes" : "Add product"}
            </Button>
          </div>
        </form>
      </Dialog>
    </Dialog.Root>
  );
}
