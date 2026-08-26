import {
  Button,
  Count,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  VStack
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { Link, useParams } from "react-router";
import { DetailSidebar } from "~/components/Layout";
import { useOptimisticLocation, useRouteData } from "~/hooks";
import type {
  SupplierContact,
  SupplierDetail,
  SupplierLocation
} from "~/modules/purchasing";
import { path } from "~/utils/path";
import { useSupplierSidebar } from "./useSupplierSidebar";

type SupplierLink = {
  name: string;
  to: string;
  icon?: ReactNode;
  count?: number;
  shortcut?: string;
};

const SupplierSidebar = () => {
  const { supplierId } = useParams();

  if (!supplierId)
    throw new Error(
      "SupplierSidebar requires an supplierId and could not find supplierId in params"
    );

  const routeData = useRouteData<{
    purchaseOrder: SupplierDetail;
    contacts: SupplierContact[];
    locations: SupplierLocation[];
  }>(path.to.supplier(supplierId));

  const links = useSupplierSidebar({
    contacts: routeData?.contacts.length ?? 0,
    locations: routeData?.locations.length ?? 0
  });

  return (
    <div className="h-full w-full">
      {/* Desktop: full sidebar in the left column */}
      <div className="hidden h-full md:block">
        <DetailSidebar links={links} />
      </div>
      {/* Mobile: compact trigger that opens a left drawer */}
      <div className="md:hidden">
        <SupplierSidebarMobile links={links} />
      </div>
    </div>
  );
};

const SupplierSidebarMobile = ({ links }: { links: SupplierLink[] }) => {
  const { t } = useLingui();
  const [open, setOpen] = useState(false);
  const location = useOptimisticLocation();

  const isActive = (to: string) =>
    location.pathname.includes(to.split("?")[0]);
  const active = links.find((link) => isActive(link.to)) ?? links[0];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="w-full justify-between"
          rightIcon={<LuMenu />}
        >
          <span className="flex items-center gap-2">
            {active?.icon}
            <span>{active?.name}</span>
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent position="left" size="sm" className="w-72 max-w-[85vw]">
        <DrawerHeader>
          <DrawerTitle>{t`Sections`}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
          <VStack spacing={1} className="w-full">
            {links.map((route) => (
              <Button
                key={route.name}
                asChild
                variant={isActive(route.to) ? "active" : "ghost"}
                className="w-full justify-start"
              >
                <Link
                  to={route.to}
                  prefetch="intent"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start gap-2"
                >
                  {route.icon}
                  <span>{route.name}</span>
                  {route.count !== undefined && (
                    <Count count={route.count} className="ml-auto" />
                  )}
                </Link>
              </Button>
            ))}
          </VStack>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SupplierSidebar;
