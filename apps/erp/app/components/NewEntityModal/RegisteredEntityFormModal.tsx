import { Spinner } from "@carbon/react";
import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import { EntityFormModal } from "./EntityFormModal";
import { getNewEntityModalEntry } from "./registry";

type RegisteredEntityFormModalProps = {
  loadedData?: unknown;
  onClose: () => void;
  to: string;
  searchParams?: URLSearchParams;
};

function LoadingModalChild() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <Spinner />
    </div>
  );
}

export function RegisteredEntityFormModal({
  loadedData,
  onClose,
  to,
  searchParams = new URLSearchParams()
}: RegisteredEntityFormModalProps) {
  const navigate = useNavigate();
  const loaderFetcher = useFetcher<any>();
  const entry = getNewEntityModalEntry(to);
  const resolvedLoadedData = loadedData ?? loaderFetcher.data;
  const shouldLoad =
    !!entry.loadDataPath &&
    loadedData === undefined &&
    resolvedLoadedData === undefined;

  useEffect(() => {
    if (!entry.loadDataPath || loadedData !== undefined) return;
    if (loaderFetcher.state !== "idle" || loaderFetcher.data !== undefined)
      return;

    loaderFetcher.load(entry.loadDataPath);
  }, [entry.loadDataPath, loadedData, loaderFetcher]);

  const child = shouldLoad ? (
    <LoadingModalChild />
  ) : (
    entry.render({
      loadedData: resolvedLoadedData,
      onClose,
      searchParams
    })
  );

  return (
    <EntityFormModal
      children={child}
      onCreated={(created) => {
        const to = entry.getCreatedPath?.(created, searchParams);

        if (to) {
          navigate(to);
        } else {
          onClose();
        }
      }}
      onClose={onClose}
    />
  );
}
