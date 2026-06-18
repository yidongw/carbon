import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildConfigTableActionResponse } from "./configTableOverlay";
import type {
  ConfigReferenceSource,
  ConfigTableReferenceContext
} from "./configParamsTableColumns";
import { computeJobConfigTableTotal } from "./jobConfiguration";
import { getJob } from "./production.service";

export { buildConfigTableActionResponse };

/** Persist configuration and keep `job.quantity` in sync with the config table total. */
export function jobConfigurationUpdateFields(
  configuration: Record<string, unknown>
): { configuration: Json; quantity: number } {
  return {
    configuration: configuration as Json,
    quantity: computeJobConfigTableTotal(configuration)
  };
}

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

export async function getConfigReferenceSourceForOperation(
  client: SupabaseClient<Database>,
  {
    jobId,
    jobOperationId,
    companyId,
    reportKind
  }: {
    jobId: string;
    jobOperationId?: string;
    companyId: string;
    reportKind: "pickup" | "productionQuantity";
  }
): Promise<ConfigReferenceSource | null> {
  const job = await getJob(client, jobId);
  const jobConfiguration = job.data?.configuration ?? null;
  if (!jobConfiguration) return null;

  if (!jobOperationId) {
    return { jobConfiguration, reportedConfigurations: [] };
  }

  if (reportKind === "pickup") {
    const [employeePickups, supplierPickups] = await Promise.all([
      client
        .from("jobOperationPickup")
        .select("configuration")
        .eq("jobOperationId", jobOperationId)
        .eq("companyId", companyId),
      client
        .from("jobOperationSupplierPickup")
        .select("configuration")
        .eq("jobOperationId", jobOperationId)
        .eq("companyId", companyId)
    ]);

    const reportedConfigurations = [
      ...(employeePickups.data ?? []),
      ...(supplierPickups.data ?? [])
    ]
      .map((row) => row.configuration)
      .filter((config) => config != null);

    return { jobConfiguration, reportedConfigurations };
  }

  const quantities = await client
    .from("productionQuantity")
    .select("configuration")
    .eq("jobOperationId", jobOperationId)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("invalidatedAt", null);

  const reportedConfigurations = (quantities.data ?? [])
    .map((row) => row.configuration)
    .filter((config) => config != null);

  return { jobConfiguration, reportedConfigurations };
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
