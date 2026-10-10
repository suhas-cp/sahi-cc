import { useEffect, useState } from "react";
import { Button, Dialog, Input, Text } from "@cloudflare/kumo";
import type { Product } from "../types";

export function RestockDialog({
  product,
  onClose,
  onRestock,
}: {
  product: Product | null;
  onClose: () => void;
  onRestock: (qty: number) => void;
}) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (product) setValue("");
  }, [product?.id]);

  const qty = Number(value);
  const valid = /^\d+$/.test(value) && qty > 0;

  return (
    <Dialog.Root
      open={product !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog size="sm" className="flex flex-col gap-4 p-6">
        {product && (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) onRestock(qty);
            }}
          >
            <div className="flex flex-col gap-1">
              <Dialog.Title className="text-lg font-semibold">Restock</Dialog.Title>
              <Dialog.Description className="text-sm text-kumo-subtle">{product.name}</Dialog.Description>
            </div>
            <Input
              label="Quantity received"
              type="number"
              inputMode="numeric"
              min={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              {[6, 12, 24, 48].map((n) => (
                <Button key={n} size="sm" onClick={() => setValue(String(n))}>
                  +{n}
                </Button>
              ))}
            </div>
            <div className="flex justify-between rounded-lg bg-kumo-recessed px-4 py-3 text-sm">
              <Text variant="secondary" as="span">
                In stock {product.stock} → after restock
              </Text>
              <Text bold as="span">
                {product.stock + (valid ? qty : 0)}
              </Text>
            </div>
            <div className="flex justify-end gap-2">
              <Dialog.Close render={(props) => <Button {...props}>Cancel</Button>} />
              <Button type="submit" variant="primary" disabled={!valid}>
                Add to stock
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </Dialog.Root>
  );
}
