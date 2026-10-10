import { LayerCard, Text } from "@cloudflare/kumo";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";

export function StatTile({
  label,
  value,
  current,
  previous,
}: {
  label: string;
  value: string;
  /** Raw numbers for the delta against the same point yesterday. */
  current: number;
  previous: number;
}) {
  const change = previous > 0 ? (current - previous) / previous : null;
  const up = change !== null && change >= 0;
  return (
    <LayerCard>
      <LayerCard.Primary className="flex flex-col gap-1.5">
        <Text variant="secondary" size="sm">
          {label}
        </Text>
        <span className="text-2xl font-semibold text-kumo-default">{value}</span>
        {change === null ? (
          <Text variant="secondary" size="xs">
            No sales yesterday by now
          </Text>
        ) : (
          <span className="flex items-center gap-1 text-xs">
            <span className={up ? "flex items-center gap-0.5 text-kumo-success" : "flex items-center gap-0.5 text-kumo-danger"}>
              {up ? <ArrowUpRightIcon size={14} weight="bold" /> : <ArrowDownRightIcon size={14} weight="bold" />}
              <span className="sr-only">{up ? "Up" : "Down"}</span>
              {Math.abs(change * 100).toFixed(0)}%
            </span>
            <span className="text-kumo-subtle">vs yesterday by this time</span>
          </span>
        )}
      </LayerCard.Primary>
    </LayerCard>
  );
}
