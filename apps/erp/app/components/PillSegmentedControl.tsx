import { cn } from "@carbon/react";
import type { ReactNode } from "react";

type PillSegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
  "aria-label"?: string;
};

/** Pill-style segmented control matching `DirectionAwareTabs` tab bar styling. */
export function PillSegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel
}: PillSegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1 shadow-inner",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ring-ring",
            value === option.value
              ? "bg-background text-foreground border border-border shadow-sm"
              : "text-foreground/60 hover:text-foreground/80"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
