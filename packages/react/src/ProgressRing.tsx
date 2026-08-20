import type { ComponentProps } from "react";
import { cn } from "./utils/cn";

// A determinate progress ring that spins while its arc grows from a dot to a
// full circle as `value` goes 0 -> 1. Fills the gap between Spinner
// (indeterminate) and Progress (a horizontal bar) — e.g. a compact progress
// indicator inside a button.
const ProgressRing = ({
  value,
  size = 16,
  strokeWidth = 2,
  className,
  ...props
}: ComponentProps<"svg"> & {
  /** Progress from 0 to 1. */
  value: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const half = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const frac = Math.max(0.08, Math.min(1, value)); // keep a visible dot at 0
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={cn("animate-spin", className)}
      {...props}
    >
      <circle
        cx={half}
        cy={half}
        r={r}
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={half}
        cy={half}
        r={r}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - frac)}
        transform={`rotate(-90 ${half} ${half})`}
        style={{ transition: "stroke-dashoffset 150ms linear" }}
      />
    </svg>
  );
};

export { ProgressRing };
