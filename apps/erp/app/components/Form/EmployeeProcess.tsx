import { useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { getEmployeeProcessesByProcess } from "~/modules/resources";
import { path } from "~/utils/path";

/**
 * Loads the employees assigned to a process. Mirrors `useSupplierProcesses`,
 * but also reports `isLoading` so callers can avoid flashing the full,
 * unfiltered list before the assignments arrive: while loading they should
 * show nothing rather than falling back to everyone.
 */
export const useEmployeeProcesses = (args: { processId?: string }) => {
  const { processId } = args;
  const fetcher =
    useFetcher<Awaited<ReturnType<typeof getEmployeeProcessesByProcess>>>();

  const requestedProcessId = useRef<string | undefined>(undefined);
  const [loadedProcessId, setLoadedProcessId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!processId) return;
    requestedProcessId.current = processId;
    fetcher.load(path.to.api.employeeProcesses(processId));
  }, [processId, fetcher.load]);

  // Record which process the settled response belongs to, so a stale result
  // from a previous process isn't treated as "loaded" for the current one.
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) {
      setLoadedProcessId(requestedProcessId.current);
    }
  }, [fetcher.state, fetcher.data]);

  const employeeProcesses = useMemo(
    () => (fetcher.data?.data ? fetcher.data?.data : []),
    [fetcher.data]
  );

  const isLoading = Boolean(processId) && loadedProcessId !== processId;

  return { employeeProcesses, isLoading };
};
