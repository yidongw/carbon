import { Button, useIsMobile, VStack } from "@carbon/react";
import { Link } from "react-router";
import { useOptimisticLocation, useUrlParams } from "~/hooks";
import type { Route } from "~/types";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const ContentSidebar = ({ links }: { links: Route[] }) => {
  const isMobile = useIsMobile();
  const location = useOptimisticLocation();
  const [params] = useUrlParams();
  const filter = params.get("q") ?? undefined;

  if (isMobile) {
    return (
      <div className="flex items-center gap-1 px-2 py-1.5 bg-card border-b border-border overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {links.map((route) => {
          const isActive =
            location.pathname.includes(route.to) && route.q === filter;
          return (
            <Button
              key={route.name}
              asChild
              leftIcon={route.icon}
              variant={isActive ? "active" : "ghost"}
              size="sm"
              className="shrink-0"
            >
              <Link
                to={route.to + (route.q ? `?q=${route.q}` : "")}
                prefetch="intent"
                replace
              >
                {route.name}
              </Link>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <CollapsibleSidebar>
      <div className="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full w-full pb-8">
        <VStack>
          <VStack spacing={1} className="p-2">
            {links.map((route) => {
              const isActive =
                location.pathname.includes(route.to) && route.q === filter;
              return (
                <Button
                  key={route.name}
                  asChild
                  leftIcon={route.icon}
                  variant={isActive ? "active" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link
                    to={route.to + (route.q ? `?q=${route.q}` : "")}
                    prefetch="intent"
                  >
                    {route.name}
                  </Link>
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </div>
    </CollapsibleSidebar>
  );
};

export default ContentSidebar;
