import { Spinner } from "@carbon/react";
import type { ReactElement } from "react";
import { createContext, Suspense, useContext } from "react";
import { CardFormModal } from "./CardFormModal";

type CreatedRecord = Record<string, any> | null;

type EntityFormModalContextValue = {
  onClose: () => void;
  onCreated?: (created: CreatedRecord) => void;
};

type EntityFormModalProps = {
  children: ReactElement<any>;
  onCreated?: (created: CreatedRecord) => void;
  onClose: () => void;
};

const EntityFormModalContext =
  createContext<EntityFormModalContextValue | null>(null);

export function useEntityFormModalContext() {
  return useContext(EntityFormModalContext);
}

export function EntityFormModal({
  children,
  onCreated,
  onClose
}: EntityFormModalProps) {
  const fallback = (
    <div className="flex items-center justify-center w-full h-64">
      <Spinner />
    </div>
  );

  return (
    <CardFormModal onClose={onClose}>
      <EntityFormModalContext.Provider value={{ onClose, onCreated }}>
        <Suspense fallback={fallback}>{children}</Suspense>
      </EntityFormModalContext.Provider>
    </CardFormModal>
  );
}
