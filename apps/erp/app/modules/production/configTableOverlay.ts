import { computeJobConfigTableTotal } from "./jobConfiguration";

export type ConfigTableOverlaySuccess = {
  ok: true;
  configuration: {
    configTable: Record<string, string | number | boolean>[];
    configTablePrimaryKeys: string[];
  };
  total: number;
  primaryKeys: string[];
};

export function isConfigTableOverlaySuccess(
  data: unknown
): data is ConfigTableOverlaySuccess {
  return (
    typeof data === "object" &&
    data !== null &&
    "ok" in data &&
    data.ok === true &&
    "configuration" in data &&
    "total" in data &&
    "primaryKeys" in data
  );
}

export function buildConfigTableActionResponse(
  configuration: Record<string, unknown>
): ConfigTableOverlaySuccess {
  const primaryKeysRaw = configuration.configTablePrimaryKeys;
  const primaryKeys = Array.isArray(primaryKeysRaw)
    ? primaryKeysRaw.filter((k): k is string => typeof k === "string")
    : ["Quantities"];

  return {
    ok: true,
    configuration: configuration as ConfigTableOverlaySuccess["configuration"],
    total: computeJobConfigTableTotal(configuration),
    primaryKeys
  };
}
