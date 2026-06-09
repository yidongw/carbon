import { cn } from "@carbon/react";
import type { ComponentProps, PropsWithChildren } from "react";
import { LuPanelRight } from "react-icons/lu";
import type { LinkProps } from "react-router";
import { Link } from "react-router";

const Hyperlink = ({
  children,
  className,
  prefetch = "intent",
  ...props
}:
  | PropsWithChildren<LinkProps>
  | PropsWithChildren<ComponentProps<"span">>) => {
  return "to" in props && props.to ? (
    <Link
      prefetch={prefetch}
      className={cn(
        "group/hyperlink inline-flex items-center gap-1 text-foreground font-medium cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      {props.to && props.to !== "#" && (
        <LuPanelRight className="hidden md:block h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50 transition-colors duration-150 group-hover/hyperlink:text-foreground" />
      )}
    </Link>
  ) : (
    <span className={cn("text-foreground", className)} {...props}>
      {children}
    </span>
  );
};

export default Hyperlink;
