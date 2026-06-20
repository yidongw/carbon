import {
  Badge,
  cn,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type BadgeProps
} from "@carbon/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import { LuTag } from "react-icons/lu";
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
      className="items-center min-w-0 flex-1 overflow-visible [&>*:not(:first-child)]:shrink-0"
      spacing={1}
    >
      {children}
    </HStack>
  );
}

type DetailTopbarIdProps = {
  to?: string;
  children: ReactNode;
};

/** Max width leaves room for status badges, copy, and overflow menu. */
const DETAIL_ID_MAX_WIDTH = "max-w-[calc(100%-7rem)]";

/** Detail ID styled as a breadcrumb continuation on desktop. Pass `to` for a link, omit for plain text. */
export function DetailTopbarId({ to, children }: DetailTopbarIdProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 shrink items-center overflow-hidden",
        DETAIL_ID_MAX_WIDTH
      )}
    >
      <span aria-hidden className="hidden md:inline shrink-0 px-1.5 text-accent-foreground">
        /
      </span>
      {to ? (
        <Link
          to={to}
          className="min-w-0 truncate font-semibold text-foreground hover:underline"
        >
          {children}
        </Link>
      ) : (
        <span className="truncate font-semibold text-foreground">{children}</span>
      )}
    </div>
  );
}

/** @deprecated Use `<DetailTopbarId>` without `to` instead. */
export function DetailTopbarPlainId({ children }: { children: ReactNode }) {
  return <DetailTopbarId>{children}</DetailTopbarId>;
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
        <Badge className={cn("px-1.5 min-w-0 shrink-0", className)} {...props}>
          {icon ?? <LuTag className="size-3.5" />}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
