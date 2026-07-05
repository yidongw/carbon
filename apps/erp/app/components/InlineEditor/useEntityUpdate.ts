import { toast } from "@carbon/react";
import { useCallback, useEffect } from "react";
import { useFetcher } from "react-router";
import type { EntityUpdateConfig } from "./types";

/**
 * Returns an `onUpdate(id, field, value)` that submits a single-field edit to a
 * module's bulk-update action (one row id), so all cascade logic runs server-side
 * and loaders revalidate. Errors surface via toast, matching the detail panels.
 *
 * Pass a module-scope config constant so its identity is stable across renders.
 */
export function useEntityUpdate({ action, idKey }: EntityUpdateConfig) {
  const fetcher = useFetcher<{ error: { message: string } | null }>();

  useEffect(() => {
    if (fetcher.data?.error) toast.error(fetcher.data.error.message);
  }, [fetcher.data]);

  return useCallback(
    (id: string, field: string, value: string | null) => {
      const formData = new FormData();
      formData.append(idKey, id);
      formData.append("field", field);
      formData.append("value", value ?? "");
      fetcher.submit(formData, { method: "post", action });
    },
    [fetcher, action, idKey]
  );
}
