import { createContext, useContext } from "react";
import type { ItemFile } from "~/modules/items";
import type { PartSummary } from "../../types";

export type ResolvedPartRouteData = {
  partSummary: PartSummary;
  files: Promise<ItemFile[]>;
  supplierParts: Promise<unknown>;
  pickMethods: Promise<unknown>;
  makeMethods: Promise<unknown>;
  tags: Promise<unknown>;
};

const PartResolvedDataContext = createContext<ResolvedPartRouteData | null>(
  null
);

export function PartResolvedDataProvider({
  value,
  children
}: {
  value: ResolvedPartRouteData;
  children: React.ReactNode;
}) {
  return (
    <PartResolvedDataContext.Provider value={value}>
      {children}
    </PartResolvedDataContext.Provider>
  );
}

export function usePartRouteData() {
  return useContext(PartResolvedDataContext);
}
