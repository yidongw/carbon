import { buildConfigTableActionResponse } from "./configTableOverlay";
import type { ConfigTableReferenceContext } from "./configParamsTableColumns";

export { buildConfigTableActionResponse };

export function parseConfigurationFormValue(
  raw: FormDataEntryValue | null
): Record<string, unknown> | null {
  if (typeof raw !== "string" || !raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parseInitialConfigurationFromRequest(
  request: Request
): Record<string, string | number | boolean>[] | undefined {
  const raw = new URL(request.url).searchParams.get("configuration");
  if (!raw) return undefined;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }
    const configTable = (parsed as Record<string, unknown>).configTable;
    return Array.isArray(configTable)
      ? (configTable as Record<string, string | number | boolean>[])
      : undefined;
  } catch {
    return undefined;
  }
}

export function parseReferenceContextFromRequest(
  request: Request
): ConfigTableReferenceContext | undefined {
  const raw = new URL(request.url).searchParams.get("referenceContext");
  if (!raw) return undefined;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }
    const ctx = parsed as Record<string, unknown>;
    if (ctx.mode !== "original" && ctx.mode !== "remaining") {
      return undefined;
    }
    if (!Array.isArray(ctx.otherLineConfigurations)) {
      return undefined;
    }
    return {
      mode: ctx.mode,
      originalConfiguration: ctx.originalConfiguration,
      otherLineConfigurations: ctx.otherLineConfigurations
    };
  } catch {
    return undefined;
  }
}
