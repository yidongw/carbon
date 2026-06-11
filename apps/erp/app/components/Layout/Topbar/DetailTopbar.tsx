import {
  Badge,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type BadgeProps
} from "@carbon/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { LuTag } from "react-icons/lu";
import { BreadcrumbLink } from "~/components";
import { useTopbarLeft } from "./TopbarContext";

type DetailTopbarContentProps = {
  children: ReactNode;
};

/** Consistent layout for detail identity rendered in the topbar portal slot. */
export function DetailTopbarContent({ children }: DetailTopbarContentProps) {
  const { setHasDetailTopbar } = useTopbarLeft();

  useEffect(() => {
    setHasDetailTopbar(true);
    return () => setHasDetailTopbar(false);
  }, [setHasDetailTopbar]);

  return (
    <HStack
      className="items-center min-w-0 flex-shrink overflow-hidden"
      spacing={1}
    >
      {children}
    </HStack>
  );
}

type DetailTopbarIdProps = {
  to: string;
  children: ReactNode;
};

/** Detail ID styled as a breadcrumb continuation on desktop. */
export function DetailTopbarId({ to, children }: DetailTopbarIdProps) {
  return (
    <div className="inline-flex items-center min-w-0">
      <span className="text-muted-foreground hidden md:inline">/</span>
      <BreadcrumbLink to={to} isCurrentPage className="max-w-[8rem] sm:max-w-xs">
        <span className="truncate font-medium">{children}</span>
      </BreadcrumbLink>
    </div>
  );
}

type DetailTopbarPlainIdProps = {
  children: ReactNode;
};

/** Detail ID without a link (e.g. stock transfers). */
export function DetailTopbarPlainId({ children }: DetailTopbarPlainIdProps) {
  return (
    <div className="inline-flex items-center min-w-0">
      <span className="text-muted-foreground hidden md:inline">/</span>
      <BreadcrumbLink to="" isCurrentPage className="max-w-[8rem] sm:max-w-xs">
        <span className="truncate font-medium">{children}</span>
      </BreadcrumbLink>
    </div>
  );
}

type DetailTopbarBadgeProps = BadgeProps & {
  label: ReactNode;
  icon?: ReactNode;
};

/** Icon-only badge with label shown in a tooltip — for topbar detail metadata. */
export function DetailTopbarBadge({
  label,
  icon,
  className,
  ...props
}: DetailTopbarBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={cnIconBadge(className)} {...props}>
          {icon ?? <LuTag className="size-3.5" />}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}

function cnIconBadge(className?: string) {
  return ["px-1.5 min-w-0", className].filter(Boolean).join(" ");
}

/** Shared class for properties panel roots — prevents horizontal scroll. */
export const PROPERTIES_PANEL_CLASS =
  "w-full min-w-0 max-w-sm shrink-0 bg-card h-full overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent border-l border-border px-4 py-2 text-sm";
