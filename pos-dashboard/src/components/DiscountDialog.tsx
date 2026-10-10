import { useEffect, useState } from "react";
import { Button, Dialog, Input, Tabs } from "@cloudflare/kumo";
import type { Discount } from "../types";

export function DiscountDialog({
  open,
  current,
  gross,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  current: Discount | null;
  /** Bill amount before discount, in paise. */
  gross: number;
  onOpenChange: (open: boolean) => void;
  onApply: (discount: Discount | null) => void;
}) {
  const [type, setType] = useState<Discount["type"]>("percent");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setType(current?.type ?? "percent");
      setValue(current ? String(current.value) : "");
    }
  }, [open, current]);

  const amount = Number(value);
  const max = type === "percent" ? 100 : gross / 100;
  const error = value !== "" && (!(amount > 0) || amount > max)
    ? type === "percent"
      ? "Enter a percentage between 1 and 100"
      : `Enter an amount up to the bill total`
    : undefined;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog size="sm" className="flex flex-col gap-4 p-6">
        <Dialog.Title className="text-lg font-semibold">Discount on this bill</Dialog.Title>
        <Dialog.Description className="text-sm text-kumo-subtle">
          Applied across all items. GST is recalculated on the discounted price.
        </Dialog.Description>
        <Tabs
          variant="segmented"
          value={type}
          onValueChange={(v) => setType(v as Discount["type"])}
          tabs={[
            { value: "percent", label: "Percent (%)" },
            { value: "amount", label: "Amount (₹)" },
          ]}
        />
        <Input
          label={type === "percent" ? "Discount %" : "Discount ₹"}
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={error}
          autoFocus
        />
        {type === "percent" && (
          <div className="flex gap-2">
            {[5, 10, 15].map((p) => (
              <Button key={p} size="sm" onClick={() => setValue(String(p))}>
                {p}%
              </Button>
            ))}
          </div>
        )}
        <div className="flex justify-between gap-2">
          {current ? (
            <Button variant="secondary-destructive" onClick={() => onApply(null)}>
              Remove
            </Button>
          ) : (
            <span />
          )}
          <Button variant="primary" disabled={value === "" || !!error} onClick={() => onApply({ type, value: amount })}>
            Apply discount
          </Button>
        </div>
      </Dialog>
    </Dialog.Root>
  );
}
