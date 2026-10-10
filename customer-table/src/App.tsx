import { useState } from "react";
import {
  Badge,
  Empty,
  InputGroup,
  LayerCard,
  Switch,
  Table,
  Tabs,
  Text,
} from "@cloudflare/kumo";
import { MagnifyingGlassIcon, UsersIcon } from "@phosphor-icons/react";
import { customers, type CustomerStatus } from "./customers";

type StatusFilter = "all" | CustomerStatus;

const counts: Record<StatusFilter, number> = {
  all: customers.length,
  active: customers.filter((c) => c.status === "active").length,
  inactive: customers.filter((c) => c.status === "inactive").length,
};

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {text}
      <span className="text-kumo-subtle tabular-nums">{count}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: CustomerStatus }) {
  return status === "active" ? (
    <Badge variant="success" appearance="dot">
      Active
    </Badge>
  ) : (
    <Badge variant="neutral" appearance="dot">
      Inactive
    </Badge>
  );
}

export function App() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(
    () => document.documentElement.dataset.mode === "dark",
  );

  function changeMode(nextDark: boolean) {
    const mode = nextDark ? "dark" : "light";
    setDark(nextDark);
    document.documentElement.dataset.mode = mode;
    try {
      localStorage.setItem("color-mode", mode);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }

  const needle = query.trim().toLowerCase();
  const rows = customers.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      (c.name.toLowerCase().includes(needle) ||
        c.id.toLowerCase().includes(needle)),
  );

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Text variant="heading" size="lg" as="h1">
            Customers
          </Text>
          <Text variant="secondary">
            Every customer, their ID, and whether their account is active.
          </Text>
        </div>
        <Switch
          label="Dark mode"
          checked={dark}
          onCheckedChange={changeMode}
          controlFirst={false}
        />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          variant="segmented"
          value={filter}
          onValueChange={(value) => setFilter(value as StatusFilter)}
          tabs={[
            { value: "all", label: <TabLabel text="All" count={counts.all} /> },
            {
              value: "active",
              label: <TabLabel text="Active" count={counts.active} />,
            },
            {
              value: "inactive",
              label: <TabLabel text="Inactive" count={counts.inactive} />,
            },
          ]}
        />
        <InputGroup className="w-full sm:w-72">
          <InputGroup.Addon>
            <MagnifyingGlassIcon />
          </InputGroup.Addon>
          <InputGroup.Input
            type="search"
            placeholder="Search by name or ID"
            aria-label="Search customers by name or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <LayerCard className="overflow-x-auto p-0">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Customer name</Table.Head>
              <Table.Head>Customer ID</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((customer) => (
              <Table.Row key={customer.id}>
                <Table.Cell className="whitespace-nowrap">
                  {customer.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <Text variant="mono-secondary">{customer.id}</Text>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={customer.status} />
                </Table.Cell>
              </Table.Row>
            ))}
            {rows.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={3}>
                  <Empty
                    size="sm"
                    icon={<UsersIcon size={32} className="text-kumo-inactive" />}
                    title="No customers found"
                    description="Try a different name, ID, or status filter."
                  />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </LayerCard>

      <Text variant="secondary" size="sm" as="p">
        Showing {rows.length} of {customers.length} customers
      </Text>
    </main>
  );
}
