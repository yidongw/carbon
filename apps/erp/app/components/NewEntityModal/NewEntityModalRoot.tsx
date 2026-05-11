import { useMemo } from "react";
import { useNewEntityModal } from "./context";
import { RegisteredEntityFormModal } from "./RegisteredEntityFormModal";
import { isNewEntityModalRoute } from "./registry";

export function NewEntityModalRoot() {
  const { state, close } = useNewEntityModal();

  const searchParams = useMemo(
    () => new URLSearchParams(state?.search ?? ""),
    [state?.search]
  );

  if (!state || !isNewEntityModalRoute(state.path)) return null;

  return (
    <RegisteredEntityFormModal
      to={state.path}
      searchParams={searchParams}
      onClose={close}
    />
  );
}
