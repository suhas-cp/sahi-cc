import { Badge, Button, Dialog, Text } from "@cloudflare/kumo";
import { CheckCircleIcon, PrinterIcon } from "@phosphor-icons/react";
import { formatINR } from "../lib/money";
import { PAYMENT_LABELS, type Sale } from "../types";
import { BillTotals } from "./BillTotals";
import { STORE_NAME } from "../config";

export function ReceiptDialog({ sale, onClose }: { sale: Sale | null; onClose: () => void }) {
  return (
    <Dialog.Root open={sale !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog className="flex max-h-[90svh] flex-col gap-4 overflow-y-auto p-6">
        {sale && (
          <>
            <div className="flex items-center gap-2">
              <CheckCircleIcon size={24} weight="fill" className="text-kumo-success" />
              <Dialog.Title className="text-lg font-semibold">Sale complete</Dialog.Title>
            </div>
            <Dialog.Description className="sr-only">Receipt for bill {sale.id}</Dialog.Description>

            <div className="print-receipt flex flex-col gap-3 rounded-lg border border-kumo-hairline bg-kumo-base p-4 font-mono text-xs">
              <div className="flex flex-col items-center gap-0.5 text-center">
                <Text bold>{STORE_NAME}</Text>
                <span className="text-kumo-subtle">GSTIN: set in Settings</span>
              </div>
              <div className="flex justify-between text-kumo-subtle">
                <span>Bill {sale.id}</span>
                <span>
                  {new Date(sale.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {sale.customerPhone && <span className="text-kumo-subtle">Customer: ******{sale.customerPhone.slice(-4)}</span>}
              <div className="border-t border-dashed border-kumo-line" />
              <ul className="flex flex-col gap-1.5">
                {sale.lines.map((l) => (
                  <li key={l.productId} className="flex justify-between gap-3">
                    <span>
                      {l.name}
                      <span className="block text-kumo-subtle">
                        {l.qty} × {formatINR(l.price)} · GST {l.gstRate}%
                      </span>
                    </span>
                    <span className="tabular-nums">{formatINR(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-dashed border-kumo-line" />
              <BillTotals totals={sale.totals} discount={sale.discount} showGstSplit />
              <div className="border-t border-dashed border-kumo-line" />
              <div className="flex justify-between">
                <span>Paid by {PAYMENT_LABELS[sale.payment.method]}</span>
                <span className="tabular-nums">{formatINR(sale.payment.tendered ?? sale.totals.total)}</span>
              </div>
              {sale.payment.change !== undefined && sale.payment.change > 0 && (
                <div className="flex justify-between">
                  <span>Change returned</span>
                  <span className="tabular-nums">{formatINR(sale.payment.change)}</span>
                </div>
              )}
              <p className="text-center text-kumo-subtle">Thank you, visit again!</p>
            </div>

            {sale.payment.change !== undefined && sale.payment.change > 0 && (
              <Badge variant="success" className="self-start">
                Give back {formatINR(sale.payment.change)} change
              </Badge>
            )}

            <div className="flex justify-end gap-2">
              <Button icon={<PrinterIcon />} onClick={() => window.print()}>
                Print
              </Button>
              <Button variant="primary" onClick={onClose} autoFocus>
                New sale
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </Dialog.Root>
  );
}
