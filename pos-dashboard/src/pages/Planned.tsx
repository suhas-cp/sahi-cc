import { Banner, Button, Empty } from "@cloudflare/kumo";
import { CompassIcon, FlowArrowIcon } from "@phosphor-icons/react";
import { FlowCard, FlowStatusBadge } from "../components/FlowCard";
import { PageHeader } from "../components/PageHeader";
import { allFlows } from "../data/flows";
import { navigate } from "../lib/router";

const TITLES: Record<string, string> = {
  "/orders": "Orders & refunds",
  "/customers": "Customers",
  "/shift": "Shift & cash",
  "/settings": "Settings",
};

export function Planned({ path }: { path: string }) {
  const title = TITLES[path];
  const flows = allFlows.filter((f) => f.screen === path);

  if (!title) {
    return (
      <Empty
        icon={<CompassIcon size={48} className="text-kumo-inactive" />}
        title="Page not found"
        description="This link doesn't match any screen."
        contents={
          <Button variant="primary" onClick={() => navigate("/")}>
            Go to dashboard
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader title={title} actions={<FlowStatusBadge status="planned" />} />
      <Banner
        icon={<FlowArrowIcon />}
        title="Not built yet"
        description="Below is the flow this screen will cover, so the team can review it before design starts."
        action={
          <Button size="sm" onClick={() => navigate("/flows")}>
            See all flows
          </Button>
        }
      />
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {flows.map((flow) => (
          <FlowCard key={flow.id} flow={flow} />
        ))}
      </div>
    </>
  );
}
