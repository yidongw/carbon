import {
  Button,
  Count,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useKeyboardShortcuts,
  usePrettifyShortcut
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

  useKeyboardShortcuts(
    links.reduce<Record<string, () => void>>((acc, link) => {
      if (link.shortcut) {
        acc[link.shortcut] = () => navigate(link.to);
      }
      return acc;
    }, {})
  );

  return (
    <nav className="flex flex-row md:flex-col w-full items-stretch gap-1 overflow-x-auto md:overflow-y-auto md:h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
      {links.map((route) => {
        const isActive = location.pathname.includes(route.to);

        return (
          <Tooltip key={route.name}>
            <TooltipTrigger className="shrink-0 md:w-full">
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
                  <span className="whitespace-nowrap">{route.name}</span>
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
    </nav>
  );
};

export default DetailSidebar;
