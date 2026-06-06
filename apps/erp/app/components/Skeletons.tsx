import { Skeleton } from "@carbon/react";

export function ExplorerSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

/**
 * Full-height placeholder for a data table while its rows stream in.
 * Mirrors the shared `Table` layout (toolbar + header + rows) so swapping
 * in the real table causes no layout shift.
 */
export function TableSkeleton({ rows = 12 }: { rows?: number }) {
  return (
    <div
      className="flex flex-col h-full w-full"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 h-[50px] flex-shrink-0">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      {/* Column header */}
      <div className="flex items-center gap-4 border-b border-border px-4 h-10 flex-shrink-0">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24 ml-auto" />
      </div>
      {/* Rows */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-4 h-12 flex-shrink-0"
          >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
