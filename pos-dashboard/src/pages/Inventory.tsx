import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  DropdownMenu,
  Empty,
  InputGroup,
  LayerCard,
  Select,
  Table,
  Tabs,
  Text,
  useKumoToastManager,
} from "@cloudflare/kumo";
import { DotsThreeIcon, MagnifyingGlassIcon, PackageIcon, PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react";
import { PageHeader } from "../components/PageHeader";
import { ProductDialog } from "../components/ProductDialog";
import { RestockDialog } from "../components/RestockDialog";
import { formatINRWhole } from "../lib/money";
import { navigate, useRoute } from "../lib/router";
import { useStore } from "../store";
import { CATEGORIES, stockStatus, type Product } from "../types";

type StockFilter = "all" | "reorder" | "out";

function StockBadge({ product }: { product: Product }) {
  const status = stockStatus(product);
  if (status === "out") return <Badge variant="error">Out of stock</Badge>;
  if (status === "low") return <Badge variant="warning">Low</Badge>;
  return <Badge variant="success" appearance="dot">In stock</Badge>;
}

export function Inventory() {
  const { products, saveProduct, restock } = useStore();
  const { params } = useRoute();
  const toasts = useKumoToastManager();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState<StockFilter>(() => (params.get("stock") === "reorder" ? "reorder" : "all"));
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [restockId, setRestockId] = useState<string | null>(params.get("restock"));

  // Follow links from the dashboard (e.g. #/inventory?restock=p19) even when already on this page.
  useEffect(() => {
    if (params.get("stock") === "reorder") setStock("reorder");
    if (params.get("restock")) setRestockId(params.get("restock"));
  }, [params]);

  const counts = {
    all: products.length,
    reorder: products.filter((p) => stockStatus(p) !== "in-stock").length,
    out: products.filter((p) => stockStatus(p) === "out").length,
  };

  const needle = query.trim().toLowerCase();
  const rows = products
    .filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (stock === "all" || (stock === "out" ? stockStatus(p) === "out" : stockStatus(p) !== "in-stock")) &&
        (needle === "" || p.name.toLowerCase().includes(needle) || p.sku.includes(needle)),
    )
    .sort((a, b) => (stock === "all" ? a.name.localeCompare(b.name) : a.stock - b.stock));

  const restocking = products.find((p) => p.id === restockId) ?? null;

  function closeRestock() {
    setRestockId(null);
    if (params.has("restock")) navigate("/inventory");
  }

  return (
    <>
      <PageHeader
        title="Inventory"
        description={`${counts.all} products · ${counts.reorder} need reordering`}
        actions={
          <Button variant="primary" icon={<PlusIcon />} onClick={() => setEditing(null)}>
            Add product
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="w-full sm:w-72">
          <InputGroup.Addon>
            <MagnifyingGlassIcon />
          </InputGroup.Addon>
          <InputGroup.Input
            placeholder="Search name or barcode"
            aria-label="Search products by name or barcode"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <Select
          aria-label="Category"
          className="w-full sm:w-48"
          value={category}
          onValueChange={(v) => setCategory((v as string) ?? "all")}
          items={{ all: "All categories", ...Object.fromEntries(CATEGORIES.map((c) => [c, c])) }}
        />
        <Tabs
          variant="segmented"
          value={stock}
          onValueChange={(v) => setStock(v as StockFilter)}
          tabs={[
            { value: "all", label: `All ${counts.all}` },
            { value: "reorder", label: `Needs reorder ${counts.reorder}` },
            { value: "out", label: `Out of stock ${counts.out}` },
          ]}
        />
      </div>

      <LayerCard className="overflow-x-auto p-0">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Product</Table.Head>
              <Table.Head>Category</Table.Head>
              <Table.Head className="text-right">Price</Table.Head>
              <Table.Head className="text-right">GST</Table.Head>
              <Table.Head className="text-right">Stock</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head sticky="right">
                <span className="sr-only">Actions</span>
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell className="min-w-56">
                  <div className="flex flex-col">
                    <span>{p.name}</span>
                    <Text variant="mono-secondary">{p.sku}</Text>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-kumo-subtle">{p.category}</Table.Cell>
                <Table.Cell className="text-right tabular-nums">{formatINRWhole(p.price)}</Table.Cell>
                <Table.Cell className="text-right tabular-nums text-kumo-subtle">{p.gstRate}%</Table.Cell>
                <Table.Cell className="text-right tabular-nums">
                  {p.stock}
                  <span className="block text-xs text-kumo-subtle">min {p.reorderLevel}</span>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <StockBadge product={p} />
                </Table.Cell>
                <Table.Cell sticky="right" className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" onClick={() => setRestockId(p.id)}>
                      Restock
                    </Button>
                    <DropdownMenu>
                      <DropdownMenu.Trigger
                        render={
                          <Button variant="ghost" size="sm" shape="square" aria-label={`More actions for ${p.name}`}>
                            <DotsThreeIcon weight="bold" size={16} />
                          </Button>
                        }
                      />
                      <DropdownMenu.Content>
                        <DropdownMenu.Item icon={PencilSimpleIcon} onClick={() => setEditing(p)}>
                          Edit product
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
            {rows.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <Empty
                    size="sm"
                    icon={<PackageIcon size={32} className="text-kumo-inactive" />}
                    title="No products match"
                    description="Try another search, category or stock filter."
                  />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </LayerCard>

      <ProductDialog
        open={editing !== undefined}
        product={editing ?? null}
        existingSkus={new Set(products.map((p) => p.sku))}
        onOpenChange={(open) => !open && setEditing(undefined)}
        onSave={(product) => {
          const isNew = editing === null;
          saveProduct(product);
          setEditing(undefined);
          toasts.add({ title: isNew ? `${product.name} added` : `${product.name} updated`, variant: "success" });
        }}
      />
      <RestockDialog
        product={restocking}
        onClose={closeRestock}
        onRestock={(qty) => {
          if (!restocking) return;
          restock(restocking.id, qty);
          toasts.add({
            title: `Added ${qty} × ${restocking.name}`,
            description: `${restocking.stock + qty} now in stock`,
            variant: "success",
          });
          closeRestock();
        }}
      />
    </>
  );
}
