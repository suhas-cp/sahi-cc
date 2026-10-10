import { useState } from "react";
import {
  Badge,
  Banner,
  Button,
  ChartPalette,
  LayerCard,
  Table,
  Tabs,
  Text,
  TimeseriesChart,
  Tooltip,
} from "@cloudflare/kumo";
import { ArrowRightIcon, CashRegisterIcon } from "@phosphor-icons/react";
import { PageHeader } from "../components/PageHeader";
import { StatTile } from "../components/StatTile";
import { useColorMode } from "../lib/colorMode";
import { echarts } from "../lib/echarts";
import { hourLabel, hourly, metrics, paymentMix, splitDays, topItems } from "../lib/metrics";
import { formatINR, formatINRCompact, formatINRWhole } from "../lib/money";
import { href, navigate } from "../lib/router";
import { useStore } from "../store";
import { PAYMENT_LABELS, stockStatus, type PaymentMethod } from "../types";

// Payment colours: Kumo chart hues validated as a set (light and dark) for colour-blind separation.
const PAYMENT_COLORS: Record<PaymentMethod, string> = { upi: "#4290F0", cash: "#D37536", card: "#8D58EE" };
// Yesterday is context, so it recedes to grey while today carries the accent.
const CONTEXT_GREY = { light: "#A3A3A3", dark: "#6B6B6B" };

function CardHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <LayerCard.Secondary className="flex items-center justify-between gap-2">
      <span>{title}</span>
      {children}
    </LayerCard.Secondary>
  );
}

function ViewToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Tabs
      size="sm"
      value={value}
      onValueChange={onChange}
      tabs={[
        { value: "chart", label: "Chart" },
        { value: "table", label: "Table" },
      ]}
    />
  );
}

function SalesByHour() {
  const { sales } = useStore();
  const { dark } = useColorMode();
  const [view, setView] = useState("chart");
  const days = splitDays(sales);
  const buckets = hourly(days.today, days.yesterday, days.todayStart, days.yesterdayStart);
  const todayColor = ChartPalette.categorical(0, dark);
  const greyColor = dark ? CONTEXT_GREY.dark : CONTEXT_GREY.light;

  const legend = [
    { name: "Today", color: todayColor, total: metrics(days.today).net, note: "so far" },
    { name: "Yesterday", color: greyColor, total: metrics(days.yesterday).net, note: "full day" },
  ];

  return (
    <LayerCard className="min-w-0 lg:col-span-3">
      <CardHeader title="Sales by hour">
        <ViewToggle value={view} onChange={setView} />
      </CardHeader>
      <LayerCard.Primary className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {legend.map((l) => (
            <span key={l.name} className="flex items-center gap-2 text-sm">
              <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: l.color }} aria-hidden />
              <span className="text-kumo-subtle">{l.name}</span>
              <span className="font-medium text-kumo-default">{formatINRWhole(l.total)}</span>
              <span className="text-xs text-kumo-subtle">{l.note}</span>
            </span>
          ))}
        </div>
        {view === "chart" ? (
          <TimeseriesChart
            echarts={echarts}
            isDarkMode={dark}
            height={260}
            data={[
              {
                name: "Yesterday",
                color: greyColor,
                data: buckets.map((b) => [b.timestamp, b.yesterday] as [number, number]),
              },
              {
                name: "Today",
                color: todayColor,
                data: buckets.filter((b) => b.today !== null).map((b) => [b.timestamp, b.today!] as [number, number]),
              },
            ]}
            xAxisTickFormat={(ts) => hourLabel(new Date(ts).getHours())}
            yAxisTickFormat={(v) => formatINRCompact(v)}
            tooltipValueFormat={(v) => formatINRWhole(v)}
            tooltipFollowCursor="x"
            ariaDescription="Sales per hour today compared with yesterday. The table view lists every value."
          />
        ) : (
          <div className="max-h-[260px] overflow-y-auto">
            <Table>
              <Table.Header variant="compact">
                <Table.Row>
                  <Table.Head>Hour</Table.Head>
                  <Table.Head className="text-right">Today</Table.Head>
                  <Table.Head className="text-right">Yesterday</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {buckets.map((b) => (
                  <Table.Row key={b.hour}>
                    <Table.Cell>{hourLabel(b.hour)}</Table.Cell>
                    <Table.Cell className="text-right tabular-nums">{b.today === null ? "—" : formatINRWhole(b.today)}</Table.Cell>
                    <Table.Cell className="text-right tabular-nums">{formatINRWhole(b.yesterday)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </LayerCard.Primary>
    </LayerCard>
  );
}

function PaymentMix() {
  const { sales } = useStore();
  const mix = paymentMix(splitDays(sales).today);
  const total = mix.reduce((a, m) => a + m.amount, 0);
  const pct = (amount: number) => (total > 0 ? Math.round((amount / total) * 100) : 0);
  const cash = mix.find((m) => m.method === "cash")!;

  return (
    <LayerCard className="flex min-w-0 flex-col">
      <CardHeader title="Payment mix" />
      <LayerCard.Primary className="flex flex-1 flex-col gap-4">
        {total === 0 ? (
          <Text variant="secondary">No payments yet today.</Text>
        ) : (
          <>
            <div className="flex h-3 w-full gap-0.5" role="img" aria-label={mix.map((m) => `${PAYMENT_LABELS[m.method]} ${pct(m.amount)}%`).join(", ")}>
              {mix
                .filter((m) => m.amount > 0)
                .map((m) => (
                  <Tooltip
                    key={m.method}
                    content={`${PAYMENT_LABELS[m.method]} · ${formatINRWhole(m.amount)} · ${pct(m.amount)}%`}
                    render={
                      <span
                        tabIndex={0}
                        className="h-full first:rounded-l last:rounded-r hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
                        style={{ width: `${(m.amount / total) * 100}%`, backgroundColor: PAYMENT_COLORS[m.method] }}
                      />
                    }
                  />
                ))}
            </div>
            <Table>
              <Table.Body>
                {mix.map((m) => (
                  <Table.Row key={m.method}>
                    <Table.Cell>
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-sm" style={{ backgroundColor: PAYMENT_COLORS[m.method] }} aria-hidden />
                        {PAYMENT_LABELS[m.method]}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-right tabular-nums">{formatINRWhole(m.amount)}</Table.Cell>
                    <Table.Cell className="text-right text-kumo-subtle tabular-nums">{pct(m.amount)}%</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Text variant="secondary" size="sm">
              Expect about {formatINRWhole(cash.amount)} in cash sales in the drawer, on top of the opening float.
            </Text>
          </>
        )}
      </LayerCard.Primary>
    </LayerCard>
  );
}

function TopItems() {
  const { sales } = useStore();
  const items = topItems(splitDays(sales).today);
  const max = items[0]?.revenue ?? 0;
  return (
    <LayerCard className="flex min-w-0 flex-col">
      <CardHeader title="Top items today" />
      <LayerCard.Primary className="flex-1">
        {items.length === 0 ? (
          <Text variant="secondary">Nothing sold yet today.</Text>
        ) : (
          <ol className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.productId} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-kumo-default">{item.name}</span>
                  <span className="shrink-0 tabular-nums text-kumo-default">
                    {formatINRWhole(item.revenue)} <span className="text-kumo-subtle">· {item.qty} sold</span>
                  </span>
                </div>
                <div className="h-1.5 w-full" aria-hidden>
                  <div className="h-full rounded-r" style={{ width: `${(item.revenue / max) * 100}%`, backgroundColor: ChartPalette.categorical(0) }} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </LayerCard.Primary>
    </LayerCard>
  );
}

function LowStock() {
  const { products } = useStore();
  const low = products
    .filter((p) => stockStatus(p) !== "in-stock")
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));
  return (
    <LayerCard className="flex min-w-0 flex-col">
      <CardHeader title="Low stock">
        <a href={href("/inventory?stock=reorder")} className="flex items-center gap-1 text-sm text-kumo-link hover:underline">
          Inventory <ArrowRightIcon size={14} />
        </a>
      </CardHeader>
      <LayerCard.Primary className="flex-1">
        {low.length === 0 ? (
          <Text variant="secondary">Everything is above its reorder level.</Text>
        ) : (
          <ul className="flex flex-col divide-y divide-kumo-hairline">
            {low.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2">
                <div className="flex min-w-0 flex-1 flex-col">
                  <Text size="sm" truncate>
                    {p.name}
                  </Text>
                  <Text variant="secondary" size="xs">
                    {p.stock} left · reorder at {p.reorderLevel}
                  </Text>
                </div>
                {stockStatus(p) === "out" ? <Badge variant="error">Out of stock</Badge> : <Badge variant="warning">Low</Badge>}
                <Button size="xs" onClick={() => navigate(`/inventory?restock=${p.id}`)}>
                  Restock
                </Button>
              </li>
            ))}
          </ul>
        )}
      </LayerCard.Primary>
    </LayerCard>
  );
}

function RecentBills() {
  const { sales } = useStore();
  const recent = splitDays(sales).today.slice(-6).reverse();
  return (
    <LayerCard className="min-w-0 overflow-x-auto lg:col-span-3">
      <CardHeader title="Recent bills" />
      <Table>
        <Table.Header variant="compact">
          <Table.Row>
            <Table.Head>Bill</Table.Head>
            <Table.Head>Time</Table.Head>
            <Table.Head>Items</Table.Head>
            <Table.Head>Paid by</Table.Head>
            <Table.Head className="text-right">Total</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {recent.map((s) => (
            <Table.Row key={s.id}>
              <Table.Cell>
                <Text variant="mono">{s.id}</Text>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap">
                {new Date(s.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
              </Table.Cell>
              <Table.Cell className="max-w-64 truncate text-kumo-subtle">
                {s.lines.map((l) => (l.qty > 1 ? `${l.name} ×${l.qty}` : l.name)).join(", ")}
              </Table.Cell>
              <Table.Cell>
                <Badge variant="neutral">{PAYMENT_LABELS[s.payment.method]}</Badge>
              </Table.Cell>
              <Table.Cell className="text-right tabular-nums">{formatINR(s.totals.total)}</Table.Cell>
            </Table.Row>
          ))}
          {recent.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-kumo-subtle">
                No bills yet today.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </LayerCard>
  );
}

export function Dashboard() {
  const { sales } = useStore();
  const days = splitDays(sales);
  const t = metrics(days.today);
  const y = metrics(days.yesterdaySoFar);
  const time = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Today so far, compared with yesterday up to ${time}`}
        actions={
          <Button variant="primary" icon={<CashRegisterIcon />} onClick={() => navigate("/checkout")}>
            New sale
          </Button>
        }
      />

      {t.bills === 0 && (
        <Banner
          title="No sales yet today"
          description="The store opens at 8 AM. Ring up a sale and it shows here straight away."
        />
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Net sales" value={formatINRWhole(t.net)} current={t.net} previous={y.net} />
        <StatTile label="Bills" value={t.bills.toLocaleString("en-IN")} current={t.bills} previous={y.bills} />
        <StatTile label="Average bill" value={formatINRWhole(t.avgBill)} current={t.avgBill} previous={y.avgBill} />
        <StatTile label="Items sold" value={t.items.toLocaleString("en-IN")} current={t.items} previous={y.items} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SalesByHour />
        <PaymentMix />
        <TopItems />
        <LowStock />
        <RecentBills />
      </div>
    </>
  );
}
