import { useRouteData } from "@carbon/react";
import { path } from "~/utils/path";

/**
 * Whether the active company is a read-only free-plan company (unpaid Cloud).
 * Mirrors the server-side gate in `requirePermissions` — use it to hide
 * create/edit affordances so the UI matches what the server will allow.
 */
export function useReadOnly(): boolean {
  const data = useRouteData<{ readOnly?: boolean }>(
    path.to.authenticatedRoot
  );
  return data?.readOnly ?? false;
}
