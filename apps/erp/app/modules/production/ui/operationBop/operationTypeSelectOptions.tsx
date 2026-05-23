import { Trans } from "@lingui/react/macro";
import { useMemo } from "react";

export function useOperationTypeSelectOptions() {
  return useMemo(
    () => [
      { value: "Inside", label: <Trans>Inside</Trans> },
      { value: "Outside", label: <Trans>Outside</Trans> },
      {
        value: "Inside and Outside",
        label: <Trans>Inside and Outside</Trans>
      }
    ],
    []
  );
}

export const operationTypeConfigureListOptions = [
  "Inside",
  "Outside",
  "Inside and Outside"
] as const;
