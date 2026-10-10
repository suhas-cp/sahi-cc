import { Badge, LayerCard, Table, Text } from "@cloudflare/kumo";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { FlowCard } from "../components/FlowCard";
import { PageHeader } from "../components/PageHeader";
import { allFlows, flowGroups } from "../data/flows";
import { href } from "../lib/router";

// How the built screens hand off to each other.
const CONNECTIONS: { from: string; fromPath: string; via: string; to: string; toPath: string }[] = [
  { from: "Dashboard", fromPath: "/", via: "New sale button", to: "New sale", toPath: "/checkout" },
  { from: "Dashboard", fromPath: "/", via: "Restock on a low-stock item", to: "Inventory restock", toPath: "/inventory" },
  { from: "New sale", fromPath: "/checkout", via: "Payment confirmed", to: "Receipt, then the next sale", toPath: "/checkout" },
  { from: "New sale", fromPath: "/checkout", via: "Every completed bill", to: "Dashboard numbers and stock levels", toPath: "/" },
  { from: "Inventory", fromPath: "/inventory", via: "Add or restock a product", to: "Sellable in New sale right away", toPath: "/checkout" },
];

function scrollToFlow(id: string) {
  document.getElementById(`flow-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Flows() {
  const built = allFlows.filter((f) => f.status === "built").length;

  return (
    <>
      <PageHeader
        title="Flow map"
        description="Every job this POS covers, who does it, and the steps. Built flows link to the live screens."
        actions={
          <>
            <Badge variant="success" appearance="dot">
              {built} built
            </Badge>
            <Badge variant="neutral" appearance="dot">
              {allFlows.length - built} planned
            </Badge>
          </>
        }
      />

      <LayerCard>
        <LayerCard.Secondary>A day at the store</LayerCard.Secondary>
        <LayerCard.Primary className="flex flex-col gap-4">
          {flowGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <Text bold size="sm" as="span">
                  {group.title}
                </Text>
                <Text variant="secondary" size="xs" as="span">
                  {group.description}
                </Text>
              </div>
              <ol className="flex flex-wrap items-center gap-2">
                {group.flows.map((flow, i) => (
                  <li key={flow.id} className="flex items-center gap-2">
                    {i > 0 && <ArrowRightIcon size={14} className="text-kumo-subtle" aria-hidden />}
                    <button
                      type="button"
                      onClick={() => scrollToFlow(flow.id)}
                      className="flex items-center gap-2 rounded-lg bg-kumo-base px-3 py-1.5 text-sm ring ring-kumo-line hover:bg-kumo-tint focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:outline-none"
                    >
                      <span
                        className={flow.status === "built" ? "size-2 rounded-full bg-kumo-success" : "size-2 rounded-full bg-kumo-fill"}
                        aria-hidden
                      />
                      {flow.title}
                      <span className="sr-only">({flow.status})</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard className="overflow-x-auto">
        <LayerCard.Secondary>How the built screens connect</LayerCard.Secondary>
        <Table>
          <Table.Header variant="compact">
            <Table.Row>
              <Table.Head>From</Table.Head>
              <Table.Head>Through</Table.Head>
              <Table.Head>To</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {CONNECTIONS.map((c) => (
              <Table.Row key={c.from + c.via}>
                <Table.Cell className="whitespace-nowrap">
                  <a href={href(c.fromPath)} className="text-kumo-link hover:underline">
                    {c.from}
                  </a>
                </Table.Cell>
                <Table.Cell className="text-kumo-subtle">{c.via}</Table.Cell>
                <Table.Cell>
                  <a href={href(c.toPath)} className="text-kumo-link hover:underline">
                    {c.to}
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </LayerCard>

      {flowGroups.map((group, i) => (
        <section key={group.title} className="flex flex-col gap-3" aria-labelledby={`flow-group-${i}`}>
          <div className="flex flex-col gap-0.5">
            <Text variant="heading" as="h2">
              <span id={`flow-group-${i}`}>{group.title}</span>
            </Text>
            <Text variant="secondary" size="sm">
              {group.description}
            </Text>
          </div>
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {group.flows.map((flow) => (
              <FlowCard key={flow.id} flow={flow} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
