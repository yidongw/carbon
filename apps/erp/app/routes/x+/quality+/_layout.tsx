import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { MetaFunction } from "react-router";
import { Outlet } from "react-router";
import { GroupedContentSidebar } from "~/components/Layout";
import { CollapsibleSidebarProvider } from "~/components/Layout/Navigation";
import useQualitySubmodules from "~/modules/quality/ui/useQualitySubmodules";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Quality" }];
};

export const handle: Handle = {
  breadcrumb: msg`Quality`,
  to: path.to.qualityDashboard,
  module: "quality"
};

export default function QualityRoute() {
  const { groups } = useQualitySubmodules();

  return (
    <CollapsibleSidebarProvider>
      <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] w-full h-full">
        <GroupedContentSidebar groups={groups} />
        <VStack spacing={0} className="h-full flex-1 min-h-0">
          <Outlet />
        </VStack>
      </div>
    </CollapsibleSidebarProvider>
  );
}
