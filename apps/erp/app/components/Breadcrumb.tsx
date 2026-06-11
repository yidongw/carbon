import { cn, getValidChildren } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ComponentProps, Ref } from "react";
import { cloneElement, forwardRef } from "react";
import type { LinkProps } from "react-router";
import { Link } from "react-router";

const Breadcrumbs = forwardRef<
  HTMLElement,
  ComponentProps<"nav"> & {
    useReactRouter?: boolean;
  }
>(({ className, children, useReactRouter = true, ...props }, ref) => {
  const { t } = useLingui();
  const validChildren = getValidChildren(children);
  const count = validChildren.length;
  const clones = validChildren.map((child, index) =>
    cloneElement(child, {
      isFirstChild: index === 0,
      isLastChild: index === count - 1
    })
  );
  return (
    <nav
      aria-label={t`Breadcrumb`}
      ref={ref}
      className={cn("reset flex", className)}
      {...props}
    >
      <ol className="inline-flex items-center space-x-1">{clones}</ol>
    </nav>
  );
});
Breadcrumbs.displayName = "Breadcrumbs";

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  ComponentProps<"li"> & {
    isFirstChild?: boolean;
    isLastChild?: boolean;
  }
>(({ className, children, isFirstChild, isLastChild, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center", className)}
    {...props}
  >
    {!isFirstChild && <span className="text-muted-foreground">/</span>}
    {children}
  </li>
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const breadcrumbLinkClassName = (isCurrentPage?: boolean, className?: string) =>
  cn(
    "inline-flex min-w-0 max-w-full truncate rounded-sm outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isCurrentPage
      ? "font-medium"
      : "text-muted-foreground hover:text-foreground hover:underline",
    className
  );

const BreadcrumbLink = forwardRef<
  HTMLElement,
  LinkProps & {
    isCurrentPage?: boolean;
  }
>(({ className, children, isCurrentPage, to, ...props }, ref) => {
  if (isCurrentPage) {
    return (
      <span
        aria-current="page"
        ref={ref}
        className={breadcrumbLinkClassName(true, className)}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      ref={ref as Ref<HTMLAnchorElement>}
      to={to}
      prefetch="intent"
      className={breadcrumbLinkClassName(false, className)}
      {...props}
    >
      {children}
    </Link>
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

export { BreadcrumbItem, BreadcrumbLink, Breadcrumbs };
