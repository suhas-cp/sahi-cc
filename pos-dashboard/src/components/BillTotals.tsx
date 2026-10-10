import type { ReactNode } from "react";
import { formatINR } from "../lib/money";
import type { Discount, Totals } from "../types";

function Row({ label, value, strong }: { label: ReactNode; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between text-base font-semibold text-kumo-default" : "flex justify-between"}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export function BillTotals({ totals, discount, showGstSplit }: { totals: Totals; discount: Discount | null; showGstSplit?: boolean }) {
  return (
    <dl className="flex flex-col gap-1.5 text-sm text-kumo-subtle">
      <Row label={`Items (${totals.itemCount})`} value={formatINR(totals.gross)} />
      {totals.discount > 0 && (
        <Row
          label={discount?.type === "percent" ? `Discount (${discount.value}%)` : "Discount"}
          value={`−${formatINR(totals.discount)}`}
        />
      )}
      {totals.roundOff !== 0 && (
        <Row label="Round off" value={`${totals.roundOff > 0 ? "+" : "−"}${formatINR(Math.abs(totals.roundOff))}`} />
      )}
      <div className="my-1 border-t border-kumo-hairline" />
      <Row label="Total" value={formatINR(totals.total)} strong />
      {showGstSplit ? (
        <>
          <Row label="Taxable value" value={formatINR(totals.taxable)} />
          <Row label="CGST" value={formatINR(Math.floor(totals.gst / 2))} />
          <Row label="SGST" value={formatINR(Math.ceil(totals.gst / 2))} />
        </>
      ) : (
        <p className="text-xs">Prices include GST of {formatINR(totals.gst)}</p>
      )}
    </dl>
  );
}
