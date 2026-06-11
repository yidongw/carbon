import {
  Count,
  cn,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
  useKeyboardShortcuts,
  usePrettifyShortcut
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import type { IconType } from "react-icons";
import { Link, useNavigate } from "react-router";
import { usePanels } from "~/components/Layout/Panels";
import { useOptimisticLocation, useUrlParams } from "~/hooks";

type DetailTopbarProps = {
  links: {
    name: string;
    to: string;
    icon?: IconType;
    count?: number;
    shortcut?: string;
    isActive?: (pathname: string) => boolean;
  }[];

  preserveParams?: boolean;
};

const DetailTopbar = ({
  links,

  preserveParams = false
}: DetailTopbarProps) => {
  const navigate = useNavigate();
  const location = useOptimisticLocation();
  const [params] = useUrlParams();
  const prettifyShortcut = usePrettifyShortcut();
  const isMobile = useIsMobile();
  const { hasProperties, isPropertiesTabActive, setIsPropertiesTabActive } =
    usePanels();

  useKeyboardShortcuts(
    links.reduce<Record<string, () => void>>((acc, link) => {
      if (link.shortcut) {
        acc[link.shortcut] = () => {
          const url = preserveParams
            ? `${link.to}?${params.toString()}`
            : link.to;
          navigate(url);
        };
      }
      return acc;
    }, {})
  );

  return (
    <div className="inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]  border-b border-border">
      {isMobile && hasProperties && (
        <button
          type="button"
          onClick={() => setIsPropertiesTabActive(true)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isPropertiesTabActive &&
              "bg-background text-foreground shadow-button-base"
          )}
        >
          <Trans>Properties</Trans>
        </button>
      )}
      {links.map((route) => {
        const isActive =
          !isPropertiesTabActive &&
          (route.isActive
            ? route.isActive(location.pathname)
            : location.pathname.includes(route.to));

        const linkTo = preserveParams
          ? `${route.to}?${params.toString()}`
          : route.to;

        return (
          <Tooltip key={route.name}>
            <TooltipTrigger className="w-full">
              <Link
                to={linkTo}
                prefetch="intent"
                onClick={() => setIsPropertiesTabActive(false)}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive && "bg-background text-foreground shadow-button-base"
                )}
              >
                {route.icon && <route.icon className="mr-2" />}
                <span>{route.name}</span>
                {route.count !== undefined && (
                  <Count count={route.count} className="ml-auto" />
                )}
              </Link>
            </TooltipTrigger>
            {route.shortcut && (
              <TooltipContent side="bottom">
                <HStack>{prettifyShortcut(route.shortcut)}</HStack>
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </div>
  );
};

export default DetailTopbar;
