import {
  Button,
  Count,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
  useKeyboardShortcuts,
  usePrettifyShortcut,
  VStack
} from "@carbon/react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useOptimisticLocation } from "~/hooks";

type DetailSidebarProps = {
  links: {
    name: string;
    to: string;
    icon?: ReactNode;
    count?: number;
    shortcut?: string;
  }[];
};

const DetailSidebar = ({ links }: DetailSidebarProps) => {
  const navigate = useNavigate();
  const location = useOptimisticLocation();
  const prettifyShortcut = usePrettifyShortcut();
  const isMobile = useIsMobile();

  useKeyboardShortcuts(
    links.reduce<Record<string, () => void>>((acc, link) => {
      if (link.shortcut) {
        acc[link.shortcut] = () => navigate(link.to);
      }
      return acc;
    }, {})
  );

  if (isMobile) {
    return (
      <div className="flex items-center gap-1 p-1.5 bg-card border border-border rounded-lg overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {links.map((route) => {
          const isActive = location.pathname.includes(route.to);
          return (
            <Button
              key={route.name}
              asChild
              leftIcon={route.icon}
              variant={isActive ? "active" : "ghost"}
              size="sm"
              className="shrink-0"
            >
              <Link to={route.to} prefetch="intent">
                {route.name}
                {route.count !== undefined && (
                  <Count count={route.count} className="ml-1.5" />
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <VStack
      className="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full"
      spacing={1}
    >
      {links.map((route) => {
        const isActive = location.pathname.includes(route.to);

        return (
          <Tooltip key={route.name}>
            <TooltipTrigger className="w-full">
              <Button
                asChild
                variant={isActive ? "active" : "ghost"}
                className="w-full justify-start"
              >
                <Link
                  to={route.to}
                  prefetch="intent"
                  className="flex items-center justify-start gap-2"
                >
                  {route.icon}
                  <span>{route.name}</span>
                  {route.count !== undefined && (
                    <Count count={route.count} className="ml-auto" />
                  )}
                </Link>
              </Button>
            </TooltipTrigger>
            {route.shortcut && (
              <TooltipContent side="right">
                <HStack>{prettifyShortcut(route.shortcut)}</HStack>
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </VStack>
  );
};

export default DetailSidebar;
