import { Suspense, lazy, useEffect, type ComponentType } from "react";
import { Badge, Loader, Sidebar, Text, Toasty, useSidebar } from "@cloudflare/kumo";
import {
  ArrowCounterClockwiseIcon,
  CashRegisterIcon,
  ChartLineUpIcon,
  FlowArrowIcon,
  GearSixIcon,
  MoonIcon,
  PackageIcon,
  ReceiptIcon,
  StorefrontIcon,
  SunIcon,
  UsersIcon,
  VaultIcon,
} from "@phosphor-icons/react";
import { CartProvider } from "./cart";
import { STORE_NAME } from "./config";
import { ColorModeProvider, useColorMode } from "./lib/colorMode";
import { href, useRoute } from "./lib/router";
import { StoreProvider, useStore } from "./store";
import { Checkout } from "./pages/Checkout";
import { Flows } from "./pages/Flows";
import { Inventory } from "./pages/Inventory";
import { Planned } from "./pages/Planned";

// The dashboard carries the charting library; load it on demand so the till screen stays light.
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));

interface NavItem {
  path: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  planned?: boolean;
}

const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Sell", items: [{ path: "/checkout", label: "New sale", icon: CashRegisterIcon }] },
  {
    group: "Manage",
    items: [
      { path: "/", label: "Dashboard", icon: ChartLineUpIcon },
      { path: "/inventory", label: "Inventory", icon: PackageIcon },
    ],
  },
  {
    group: "Coming next",
    items: [
      { path: "/orders", label: "Orders & refunds", icon: ReceiptIcon, planned: true },
      { path: "/customers", label: "Customers", icon: UsersIcon, planned: true },
      { path: "/shift", label: "Shift & cash", icon: VaultIcon, planned: true },
      { path: "/settings", label: "Settings", icon: GearSixIcon, planned: true },
    ],
  },
  { group: "Plan", items: [{ path: "/flows", label: "Flow map", icon: FlowArrowIcon }] },
];

function AppSidebar({ path }: { path: string }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { dark, setDark } = useColorMode();
  const { reset } = useStore();

  // Close the mobile sheet after navigating.
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [path, isMobile, setOpenMobile]);

  return (
    <Sidebar className="md:sticky md:top-0 md:h-svh">
      <Sidebar.Header>
        <div className="flex items-center gap-2 overflow-hidden px-1 py-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-kumo-brand text-white">
            <StorefrontIcon size={18} weight="bold" />
          </span>
          <div className="flex min-w-0 flex-col">
            <Text bold truncate>
              {STORE_NAME}
            </Text>
            <Text variant="secondary" size="xs" truncate>
              Point of sale
            </Text>
          </div>
        </div>
      </Sidebar.Header>
      <Sidebar.Content>
        {NAV.map(({ group, items }) => (
          <Sidebar.Group key={group}>
            <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>
            <Sidebar.Menu>
              {items.map((item) => (
                <Sidebar.MenuButton
                  key={item.path}
                  icon={item.icon}
                  href={href(item.path)}
                  active={path === item.path}
                  tooltip={item.label}
                >
                  {item.label}
                  {item.planned && <Sidebar.MenuBadge>Planned</Sidebar.MenuBadge>}
                </Sidebar.MenuButton>
              ))}
            </Sidebar.Menu>
          </Sidebar.Group>
        ))}
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Menu>
          <Sidebar.MenuButton
            icon={dark ? SunIcon : MoonIcon}
            tooltip={dark ? "Light mode" : "Dark mode"}
            onClick={() => setDark(!dark)}
          >
            {dark ? "Light mode" : "Dark mode"}
          </Sidebar.MenuButton>
          <Sidebar.MenuButton icon={ArrowCounterClockwiseIcon} tooltip="Reset demo data" onClick={reset}>
            Reset demo data
          </Sidebar.MenuButton>
        </Sidebar.Menu>
      </Sidebar.Footer>
    </Sidebar>
  );
}

function CurrentPage({ path }: { path: string }) {
  switch (path) {
    case "/":
      return <Dashboard />;
    case "/checkout":
      return <Checkout />;
    case "/inventory":
      return <Inventory />;
    case "/flows":
      return <Flows />;
    default:
      return <Planned path={path} />;
  }
}

function Shell() {
  const { path } = useRoute();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  return (
    <Sidebar.Provider defaultOpen collapsible="icon">
      <AppSidebar path={path} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-kumo-hairline bg-kumo-base px-3">
          <Sidebar.Trigger aria-label="Toggle navigation" />
          <Text variant="secondary" size="sm">
            {today}
          </Text>
          <Badge variant="outline" className="ml-auto">
            Demo data · resets on reload
          </Badge>
        </header>
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
          <Suspense
            fallback={
              <div className="flex justify-center py-24">
                <Loader size={24} />
              </div>
            }
          >
            <CurrentPage path={path} />
          </Suspense>
        </main>
      </div>
    </Sidebar.Provider>
  );
}

export function App() {
  return (
    <Toasty>
      <ColorModeProvider>
        <StoreProvider>
          <CartProvider>
            <Shell />
          </CartProvider>
        </StoreProvider>
      </ColorModeProvider>
    </Toasty>
  );
}
