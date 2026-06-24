import { cn } from "@carbon/react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { operationDetailSectionGridClass } from "./operationFormLayout";

export type OperationDetailSection = {
  id: string;
  label: ReactNode;
  icon: ReactNode;
  accessibilityLabel: string;
  summary?: string;
  summaryTitle?: string;
  content: ReactNode;
  contentClassName?: string;
};

export function OperationDetailTabs({
  sections
}: {
  sections: OperationDetailSection[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedSection = sections.find((section) => section.id === expandedId);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-b-lg border border-border bg-card shadow-sm">
      <div
        className={cn(
          "grid w-full grid-cols-2 gap-px bg-border sm:grid-cols-4",
          expandedSection && "border-b border-border"
        )}
      >
        {sections.map((section) => {
          const isExpanded = expandedId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              title={
                section.summary && !isExpanded
                  ? section.summaryTitle
                  : undefined
              }
              aria-label={
                section.summary && !isExpanded && section.summaryTitle
                  ? `${section.accessibilityLabel}, ${section.summaryTitle}`
                  : section.accessibilityLabel
              }
              className={cn(
                "group relative flex min-w-0 items-center gap-2 border-b-2 bg-muted/40 px-3 py-2.5 text-left transition-[color,background-color,border-color] duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                isExpanded
                  ? "z-10 -mb-px border-b-primary bg-background text-foreground"
                  : "z-0 border-b-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setExpandedId(isExpanded ? null : section.id)}
            >
              <motion.span
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                className={cn(
                  "flex shrink-0 transition-colors duration-200",
                  isExpanded
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                <LuChevronRight className="h-4 w-4" />
              </motion.span>
              <span
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  isExpanded
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {section.icon}
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 text-sm font-medium text-balance tabular-nums transition-colors duration-200",
                  isExpanded
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                  section.summary && !isExpanded && "text-foreground/90"
                )}
              >
                {section.summary && !isExpanded
                  ? section.summary
                  : section.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="relative overflow-hidden rounded-b-lg border-t border-border bg-background">
        {sections.map((section) => {
          const isVisible = expandedId === section.id;
          return (
            <div
              key={section.id}
              className={cn(
                section.contentClassName ?? operationDetailSectionGridClass,
                "transition-opacity duration-200",
                isVisible
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden opacity-0"
              )}
            >
              {section.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
