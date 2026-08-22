import {
  Badge,
  type BadgeProps,
  cn,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@carbon/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LuTag } from "react-icons/lu";
import { Link } from "react-router";
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

/**
 * Detail ID styled as a breadcrumb continuation on desktop. It expands to use
 * the available width and only truncates when it runs out of room (the copy
 * button and overflow menu are `shrink-0` siblings, so flexbox already reserves
 * their space — no fixed max-width needed).
 *
 * The full id is always available in a tooltip: on hover/focus, and — for the
 * plain (no `to`) variant — on click/tap too, so touch users can reveal a
 * truncated id without triggering navigation.
 */
export function DetailTopbarId({ to, children }: DetailTopbarIdProps) {
  const [open, setOpen] = useState(false);

  const idText = (
    <span className="min-w-0 truncate font-semibold text-foreground">
      {children}
    </span>
  );

  return (
    <div className="flex min-w-0 shrink items-center overflow-hidden">
      <span
        aria-hidden
        className="hidden md:inline shrink-0 px-1.5 text-accent-foreground"
      >
        /
      </span>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          {to ? (
            <Link
              to={to}
              className="flex min-w-0 items-center rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              {idText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex min-w-0 items-center rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {idText}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-[min(90vw,32rem)] break-all font-semibold"
        >
          {children}
        </TooltipContent>
      </Tooltip>
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
