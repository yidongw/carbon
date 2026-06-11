import { Copy, HStack, Tooltip, TooltipContent, TooltipTrigger } from "@carbon/react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BreadcrumbLink } from "~/components";

export type DetailNavBadge = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type DetailNavState = {
  id: string;
  idTo?: string;
  copyText?: string;
  suffix?: ReactNode;
  badges?: DetailNavBadge[];
};

type DetailNavContextValue = {
  detailNav: DetailNavState | null;
  setDetailNav: (detailNav: DetailNavState | null) => void;
};

const DetailNavContext = createContext<DetailNavContextValue | null>(null);

export function DetailNavProvider({ children }: { children: ReactNode }) {
  const [detailNav, setDetailNav] = useState<DetailNavState | null>(null);
  const value = useMemo(
    () => ({
      detailNav,
      setDetailNav
    }),
    [detailNav]
  );

  return (
    <DetailNavContext.Provider value={value}>{children}</DetailNavContext.Provider>
  );
}

export function useDetailNav() {
  const context = useContext(DetailNavContext);
  if (!context) {
    throw new Error("useDetailNav must be used within a DetailNavProvider");
  }
  return context;
}

export function useSetDetailNav(detailNav: DetailNavState | null) {
  const { setDetailNav } = useDetailNav();
  const resolved = detailNav?.id ? detailNav : null;

  useEffect(() => {
    setDetailNav(resolved);
    return () => setDetailNav(null);
  }, [resolved, setDetailNav]);
}

export function DetailBreadcrumbSegment({
  detailNav,
  isCurrentPage = false
}: {
  detailNav: DetailNavState;
  isCurrentPage?: boolean;
}) {
  return (
    <HStack spacing={1} className="min-w-0 items-center">
      {detailNav.idTo && !isCurrentPage ? (
        <BreadcrumbLink to={detailNav.idTo}>
          <span className="truncate font-medium">
            {detailNav.id}
            {detailNav.suffix}
          </span>
        </BreadcrumbLink>
      ) : (
        <span
          className="truncate px-2 text-sm font-medium text-foreground"
          aria-current={isCurrentPage ? "page" : undefined}
        >
          {detailNav.id}
          {detailNav.suffix}
        </span>
      )}
      {detailNav.copyText ? <Copy text={detailNav.copyText} /> : null}
      {detailNav.badges?.map((badge) => (
        <DetailNavIconBadge key={badge.key} icon={badge.icon} label={badge.label} />
      ))}
    </HStack>
  );
}

export function DetailNavIconBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm">
          {icon}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export function DetailNavStatusDot({
  color,
  label
}: {
  color: "gray" | "yellow" | "blue" | "orange" | "green" | "red";
  label: string;
}) {
  const dotColor = {
    gray: "bg-muted-foreground",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    red: "bg-red-500"
  }[color];

  return (
    <DetailNavIconBadge
      icon={<span className={`size-2 rounded-full ${dotColor}`} />}
      label={label}
    />
  );
}
