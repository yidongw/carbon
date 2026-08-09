import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getJobVariantQuantities,
  jobVariantQuantitiesToTable
} from "./jobVariantQuantity.service";
import { getJob } from "./production.service";
import { buildVariantsQuantityActionResponse } from "./variantsQuantityOverlay";
import type {
  VariantsQuantityReferenceContext,
  VariantsQuantityReferenceSource
} from "./variantsQuantityTableColumns";
import { buildJobRemainingReferenceContext } from "./variantsQuantityTableColumns";
import { computeVariantTableTotal } from "./variantTable";

export { buildVariantsQuantityActionResponse };

/** Persist configuration and keep `job.quantity` in sync with the config table total. */
export function variantTableUpdateFields(
  configuration: Record<string, unknown>
): { configuration: Json; quantity: number } {
  return {
    configuration: configuration as Json,
    quantity: computeVariantTableTotal(configuration)
  };
}

export function parseConfigurationFormValue(
  raw: FormDataEntryValue | null
): Record<string, unknown> | null {
  if (typeof raw !== "string" || !raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parseInitialVariantTableFromRequest(
  request: Request
): Record<string, string | number | boolean>[] | undefined {
  const raw = new URL(request.url).searchParams.get("configuration");
  if (!raw) return undefined;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return undefined;
    }
    const cfg = parsed as Record<string, unknown>;
    const variantTable = cfg.variantTable ?? cfg.configTable;
    return Array.isArray(variantTable)
      ? (variantTable as Record<string, string | number | boolean>[])
      : undefined;
  } catch {
    return undefined;
  }
}

export async function getVariantsQuantityReferenceSourceForOperation(
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
): Promise<VariantsQuantityReferenceSource | null> {
  const job = await getJob(client, jobId);
  const planned = await getJobVariantQuantities(client, jobId, companyId);
  const jobVariantTable =
    planned.data.length > 0
      ? jobVariantQuantitiesToTable(planned.data)
      : (job.data?.configuration ?? null);
  if (!jobVariantTable) return null;

  if (!jobOperationId) {
    return { jobVariantTable, reportedConfigurations: [] };
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

    return { jobVariantTable, reportedConfigurations };
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
  const pickupsByEmployee: Record<
    string,
    { quantity: number; configuration: unknown }[]
  > = {};
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
    jobVariantTable,
    reportedConfigurations,
    reportedConfigurationsByEmployee,
    pickupsByEmployee
  };
}

/**
 * Read a single reported row's saved configuration by record id. Used as the
 * deep-link fallback for the read-only `itemVariantsQuantity` overlay: in-app it
 * gets the config via props, but a pasted URL has only the record id.
 */
export async function getReportedConfigurationById(
  client: SupabaseClient<Database>,
  {
    recordId,
    reportKind,
    companyId
  }: {
    recordId: string;
    reportKind: "pickup" | "productionQuantity";
    companyId: string;
  }
): Promise<unknown | null> {
  const table =
    reportKind === "pickup" ? "jobOperationPickup" : "productionQuantity";
  const { data } = await client
    .from(table)
    .select("configuration")
    .eq("id", recordId)
    .eq("companyId", companyId)
    .maybeSingle();
  return data?.configuration ?? null;
}

export async function resolveJobIdForOperation(
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

export async function resolveVariantsQuantityReferenceContext(
  client: SupabaseClient<Database>,
  companyId: string,
  referenceContext: VariantsQuantityReferenceContext
): Promise<VariantsQuantityReferenceContext> {
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

  const source = await getVariantsQuantityReferenceSourceForOperation(client, {
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
): VariantsQuantityReferenceContext | undefined {
  const raw = new URL(request.url).searchParams.get("referenceContext");
  if (!raw) return undefined;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return undefined;
    }
    const ctx = parsed as Record<string, unknown>;
    if (ctx.mode !== "original" && ctx.mode !== "remaining") {
      return undefined;
    }
    const otherLineVariantTables = Array.isArray(ctx.otherLineVariantTables)
      ? ctx.otherLineVariantTables
      : [];
    const jobId = typeof ctx.jobId === "string" ? ctx.jobId : undefined;
    const jobOperationId =
      typeof ctx.jobOperationId === "string" ? ctx.jobOperationId : undefined;
    if (
      otherLineVariantTables.length === 0 &&
      ctx.originalVariantTable == null &&
      !(jobId?.trim() && jobOperationId?.trim())
    ) {
      return undefined;
    }
    return {
      mode: ctx.mode,
      originalVariantTable: ctx.originalVariantTable,
      otherLineVariantTables,
      employeeId:
        typeof ctx.employeeId === "string" ? ctx.employeeId : undefined,
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
