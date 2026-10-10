import { useEffect, useState } from "react";
import { Button, Dialog, Input, Tabs, Text } from "@cloudflare/kumo";
import { CreditCardIcon, MoneyIcon, QrCodeIcon, XIcon } from "@phosphor-icons/react";
import { suggestedCash } from "../lib/billing";
import { formatINR, formatINRWhole, rupees } from "../lib/money";
import type { Payment, PaymentMethod } from "../types";

function MethodLabel({ icon: Icon, text }: { icon: typeof QrCodeIcon; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon size={16} />
      {text}
    </span>
  );
}

function Panel({ icon: Icon, children }: { icon: typeof QrCodeIcon; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-kumo-line px-6 py-8 text-center">
      <Icon size={56} weight="thin" className="text-kumo-subtle" />
      {children}
    </div>
  );
}

export function PaymentDialog({
  open,
  total,
  onOpenChange,
  onPaid,
}: {
  open: boolean;
  total: number;
  onOpenChange: (open: boolean) => void;
  onPaid: (payment: Payment) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [cashInput, setCashInput] = useState("");

  const tendered = cashInput === "" ? 0 : rupees(Number(cashInput));
  const change = tendered - total;

  // Each bill starts fresh on UPI, the most common method.
  useEffect(() => {
    if (open) {
      setMethod("upi");
      setCashInput("");
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog size="lg" className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Dialog.Title className="text-lg font-semibold">Take payment</Dialog.Title>
            <Dialog.Description className="text-3xl font-semibold text-kumo-default">{formatINR(total)}</Dialog.Description>
          </div>
          <Dialog.Close
            aria-label="Close"
            render={(props) => <Button {...props} variant="ghost" shape="square" icon={<XIcon />} aria-label="Close" />}
          />
        </div>

        <Tabs
          variant="segmented"
          value={method}
          onValueChange={(v) => setMethod(v as PaymentMethod)}
          tabs={[
            { value: "upi", label: <MethodLabel icon={QrCodeIcon} text="UPI" /> },
            { value: "cash", label: <MethodLabel icon={MoneyIcon} text="Cash" /> },
            { value: "card", label: <MethodLabel icon={CreditCardIcon} text="Card" /> },
          ]}
        />

        {method === "upi" && (
          <>
            <Panel icon={QrCodeIcon}>
              <Text bold>Show the store's UPI QR to the customer</Text>
              <Text variant="secondary" size="sm">
                Wait for the payment confirmation on your phone or soundbox before confirming.
              </Text>
            </Panel>
            <Button variant="primary" size="lg" onClick={() => onPaid({ method: "upi" })}>
              {formatINR(total)} received
            </Button>
          </>
        )}

        {method === "cash" && (
          <>
            <div className="flex flex-col gap-3">
              <Input
                label="Cash received (₹)"
                type="number"
                inputMode="decimal"
                min={0}
                placeholder={String(total / 100)}
                value={cashInput}
                onChange={(e) => setCashInput(e.target.value)}
                autoFocus
              />
              <div className="flex flex-wrap gap-2">
                {suggestedCash(total).map((amount) => (
                  <Button key={amount} size="sm" onClick={() => setCashInput(String(amount / 100))}>
                    {amount === total ? "Exact" : formatINRWhole(amount)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-kumo-recessed px-4 py-3">
              <Text variant="secondary">{tendered > 0 && change < 0 ? "Still due" : "Change to return"}</Text>
              <Text variant={tendered > 0 && change < 0 ? "error" : "body"} size="lg" bold>
                {tendered === 0 ? "—" : formatINR(Math.abs(change))}
              </Text>
            </div>
            <Button
              variant="primary"
              size="lg"
              disabled={tendered < total}
              onClick={() => onPaid({ method: "cash", tendered, change })}
            >
              Complete sale
            </Button>
          </>
        )}

        {method === "card" && (
          <>
            <Panel icon={CreditCardIcon}>
              <Text bold>Ask the customer to tap or insert their card</Text>
              <Text variant="secondary" size="sm">
                Enter {formatINR(total)} on the card machine, then confirm once it prints approved.
              </Text>
            </Panel>
            <Button variant="primary" size="lg" onClick={() => onPaid({ method: "card" })}>
              Card approved
            </Button>
          </>
        )}
      </Dialog>
    </Dialog.Root>
  );
}
