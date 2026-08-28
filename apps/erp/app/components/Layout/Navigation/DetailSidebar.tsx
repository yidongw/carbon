import {
  Button,
  Count,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
  useKeyboardShortcuts,
  usePrettifyShortcut,
  VStack
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useState } from "react";
import { LuChevronDown, LuPanelLeft } from "react-icons/lu";
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
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts(
    links.reduce<Record<string, () => void>>((acc, link) => {
      if (link.shortcut) {
        acc[link.shortcut] = () => navigate(link.to);
      }
      return acc;
    }, {})
  );

  if (isMobile) {
    const current = links.find((route) => location.pathname.includes(route.to));
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="secondary"
            leftIcon={<LuPanelLeft />}
            rightIcon={<LuChevronDown className="opacity-60" />}
            className="justify-start font-semibold"
          >
            {current?.name ?? links[0]?.name}
          </Button>
        </DrawerTrigger>
        <DrawerContent
          position="left"
          size="content"
          className="w-[78vw] max-w-xs"
        >
          <DrawerHeader>
            <DrawerTitle>
              <Trans>Navigation</Trans>
            </DrawerTitle>
          </DrawerHeader>
          <VStack
            spacing={1}
            className="w-full flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent"
          >
            {links.map((route) => {
              const isActive = location.pathname.includes(route.to);
              return (
                <Button
                  key={route.name}
                  asChild
                  variant={isActive ? "active" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
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
              );
            })}
          </VStack>
        </DrawerContent>
      </Drawer>
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
