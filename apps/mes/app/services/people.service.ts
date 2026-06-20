import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitize } from "~/utils/supabase";

export async function getOpenClockEntry(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("timeCardEntry")
    .select("*")
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .is("clockOut", null)
    .maybeSingle();
}

export async function clockIn(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
    createdBy: string;
  }
) {
  const existing = await getOpenClockEntry(
    client,
    args.employeeId,
    args.companyId
  );
  if (existing.data) {
    return { data: null, error: { message: "Already clocked in" } };
  }

  return client.from("timeCardEntry").insert({
    employeeId: args.employeeId,
    companyId: args.companyId,
    createdBy: args.createdBy
  });
}

export async function clockOut(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
    updatedBy: string;
    clockOut?: string;
    note?: string;
  }
) {
  const open = await getOpenClockEntry(client, args.employeeId, args.companyId);
  if (!open.data) {
    return { data: null, error: { message: "Not currently clocked in" } };
  }

  return client
    .from("timeCardEntry")
    .update(
      sanitize({
        clockOut: args.clockOut ?? new Date().toISOString(),
        note: args.note,
        updatedBy: args.updatedBy,
        updatedAt: new Date().toISOString()
      })
    )
    .eq("id", open.data.id);
}

export async function updateTimeCardEntry(
  client: SupabaseClient<Database>,
  args: {
    entryId: string;
    clockIn?: string;
    clockOut?: string | null;
    note?: string | null;
    updatedBy: string;
  }
) {
  return client
    .from("timeCardEntry")
    .update(
      sanitize({
        clockIn: args.clockIn,
        clockOut: args.clockOut,
        note: args.note,
        updatedBy: args.updatedBy,
        updatedAt: new Date().toISOString()
      })
    )
    .eq("id", args.entryId);
}

// ─── Salary (employee self-view) ───────────────────────────────────────────

export async function getMyCompletions(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string,
  year: number,
  month: number
) {
  return client
    .from("productionQuantity")
    .select(
      `id, quantity, createdAt, paymentYear, paymentMonth,
       jobOperation!inner(id, description, insideUnitCost, jobId,
         process:processId(name),
         job:jobId(jobId)
       )`
    )
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .eq("paymentYear", year)
    .eq("paymentMonth", month)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

export async function getMyPendingCompletions(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("productionQuantity")
    .select(
      `id, quantity, createdAt,
       jobOperation!inner(id, description, insideUnitCost, jobId,
         process:processId(name),
         job:jobId(jobId)
       )`
    )
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("paymentYear", null)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

export async function getMySalaryRecord(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string,
  year: number,
  month: number
): Promise<{
  data: { totalEarned: number; totalPaid: number; status: string; amountOwed: number } | null;
  error: unknown;
}> {
  return (client as any)
    .from("employeeSalaryRecords")
    .select("*")
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();
}

export async function getMySalaryHistory(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
): Promise<{
  data: Array<{ year: number; month: number; totalEarned: number; totalPaid: number; status: string; amountOwed: number }> | null;
  error: unknown;
}> {
  return (client as any)
    .from("employeeSalaryRecords")
    .select("year, month, totalEarned, totalPaid, status, amountOwed")
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .limit(12);
}

