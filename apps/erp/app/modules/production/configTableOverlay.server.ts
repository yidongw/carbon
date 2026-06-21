import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildConfigTableActionResponse } from "./configTableOverlay";
import type {
  ConfigReferenceSource,
  ConfigTableReferenceContext
} from "./configParamsTableColumns";
import { buildJobRemainingReferenceContext } from "./configParamsTableColumns";
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

  const [quantities, pickups] = await Promise.all([
    client
      .from("productionQuantity")
      .select("employeeId, configuration")
      .eq("jobOperationId", jobOperationId)
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("invalidatedAt", null),
    client
      .from("jobOperationPickup")
      .select("employeeId, quantity, configuration")
      .eq("jobOperationId", jobOperationId)
      .eq("companyId", companyId)
  ]);

  const reportedConfigurations = (quantities.data ?? [])
    .map((row) => row.configuration)
    .filter((config) => config != null);

  const reportedConfigurationsByEmployee: Record<string, unknown[]> = {};
  for (const row of quantities.data ?? []) {
    if (!row.employeeId || row.configuration == null) continue;
    if (!reportedConfigurationsByEmployee[row.employeeId]) {
      reportedConfigurationsByEmployee[row.employeeId] = [];
    }
    reportedConfigurationsByEmployee[row.employeeId].push(row.configuration);
  }

  // Group pickups by employee
  const pickupsByEmployee: Record<string, { quantity: number; configuration: unknown }[]> = {};
  for (const pickup of pickups.data ?? []) {
    if (!pickup.employeeId) continue;
    if (!pickupsByEmployee[pickup.employeeId]) {
      pickupsByEmployee[pickup.employeeId] = [];
    }
    pickupsByEmployee[pickup.employeeId].push({
      quantity: pickup.quantity,
      configuration: pickup.configuration
    });
  }

  return {
    jobConfiguration,
    reportedConfigurations,
    reportedConfigurationsByEmployee,
    pickupsByEmployee
  };
}

async function resolveJobIdForOperation(
  client: SupabaseClient<Database>,
  companyId: string,
  jobOperationId: string,
  jobId?: string
): Promise<string | undefined> {
  const trimmedJobId = jobId?.trim();
  if (trimmedJobId) return trimmedJobId;

  const { data: operation } = await client
    .from("jobOperation")
    .select("jobId")
    .eq("id", jobOperationId)
    .eq("companyId", companyId)
    .maybeSingle();

  return operation?.jobId?.trim() || undefined;
}

export async function resolveConfigTableReferenceContext(
  client: SupabaseClient<Database>,
  companyId: string,
  referenceContext: ConfigTableReferenceContext
): Promise<ConfigTableReferenceContext> {
  const jobOperationId = referenceContext.jobOperationId?.trim();
  if (!jobOperationId) {
    return referenceContext;
  }

  const jobId = await resolveJobIdForOperation(
    client,
    companyId,
    jobOperationId,
    referenceContext.jobId
  );
  if (!jobId) {
    return referenceContext;
  }

  const source = await getConfigReferenceSourceForOperation(client, {
    jobId,
    jobOperationId,
    companyId,
    reportKind: "productionQuantity"
  });
  if (!source) {
    return referenceContext;
  }

  return buildJobRemainingReferenceContext(source, {
    employeeId: referenceContext.employeeId,
    siblingLineConfigurations: referenceContext.siblingLineConfigurations ?? []
  });
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
    const otherLineConfigurations = Array.isArray(ctx.otherLineConfigurations)
      ? ctx.otherLineConfigurations
      : [];
    const jobId = typeof ctx.jobId === "string" ? ctx.jobId : undefined;
    const jobOperationId =
      typeof ctx.jobOperationId === "string" ? ctx.jobOperationId : undefined;
    if (
      otherLineConfigurations.length === 0 &&
      ctx.originalConfiguration == null &&
      !(jobId?.trim() && jobOperationId?.trim())
    ) {
      return undefined;
    }
    return {
      mode: ctx.mode,
      originalConfiguration: ctx.originalConfiguration,
      otherLineConfigurations,
      employeeId: typeof ctx.employeeId === "string" ? ctx.employeeId : undefined,
      jobId,
      jobOperationId,
      siblingLineConfigurations: Array.isArray(ctx.siblingLineConfigurations)
        ? ctx.siblingLineConfigurations
        : undefined
    };
  } catch {
    return undefined;
  }
}
