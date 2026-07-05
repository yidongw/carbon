import { cn } from "@carbon/react";
import type { ReactNode } from "react";

type AppBannerVariant = "warning" | "destructive";

const variants: Record<AppBannerVariant, string> = {
  warning: "bg-yellow-100 text-yellow-900",
  destructive: "bg-destructive text-destructive-foreground"
};

export function AppBanner({
  variant = "warning",
  className,
  children
}: {
  variant?: AppBannerVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full shrink-0 px-4 py-1.5 text-center text-sm",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
