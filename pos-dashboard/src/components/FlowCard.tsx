import { Badge, LayerCard, Text, cn } from "@cloudflare/kumo";
import { ArrowRightIcon } from "@phosphor-icons/react";
import type { Flow } from "../data/flows";
import { href } from "../lib/router";

export function FlowStatusBadge({ status }: { status: Flow["status"] }) {
  return status === "built" ? (
    <Badge variant="success" appearance="dot">
      Built
    </Badge>
  ) : (
    <Badge variant="neutral" appearance="dot">
      Planned
    </Badge>
  );
}

export function FlowCard({ flow }: { flow: Flow }) {
  const built = flow.status === "built";
  return (
    <LayerCard id={`flow-${flow.id}`} className="flex min-w-0 scroll-mt-20 flex-col">
      <LayerCard.Secondary className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          {flow.title}
          <FlowStatusBadge status={flow.status} />
        </span>
        {built && (
          <a href={href(flow.screen)} className="flex items-center gap-1 text-sm text-kumo-link hover:underline">
            Open screen <ArrowRightIcon size={14} />
          </a>
        )}
      </LayerCard.Secondary>
      <LayerCard.Primary className="flex flex-1 flex-col gap-4">
        <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-kumo-subtle">Who</dt>
          <dd>{flow.actor}</dd>
          <dt className="text-kumo-subtle">Starts when</dt>
          <dd>{flow.trigger}</dd>
          <dt className="text-kumo-subtle">Ends with</dt>
          <dd>{flow.outcome}</dd>
        </dl>

        <ol className="flex flex-col">
          {flow.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-3 pb-4 last:pb-0">
              {i < flow.steps.length - 1 && <span className="absolute top-7 bottom-1 left-3 w-px bg-kumo-line" aria-hidden />}
              <span
                className={cn(
                  "relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  built ? "bg-kumo-brand text-white" : "bg-kumo-recessed text-kumo-subtle ring ring-kumo-line",
                )}
              >
                {i + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Text size="sm" bold as="span">
                    {step.title}
                  </Text>
                  {step.optional && <Badge variant="outline">Optional</Badge>}
                  {built && step.screen && (
                    <a href={href(step.screen)} className="text-xs text-kumo-link hover:underline">
                      Try it
                    </a>
                  )}
                </div>
                <Text variant="secondary" size="sm">
                  {step.detail}
                </Text>
                {step.branches && (
                  <div className="mt-1 grid gap-2 sm:grid-cols-3">
                    {step.branches.map((b, j) => (
                      <div key={b.title} className="flex flex-col gap-0.5 rounded-md bg-kumo-recessed p-2.5">
                        <Text size="xs" bold as="span">
                          {j > 0 && <span className="font-normal text-kumo-subtle">or </span>}
                          {b.title}
                        </Text>
                        <Text variant="secondary" size="xs">
                          {b.detail}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </LayerCard.Primary>
    </LayerCard>
  );
}
