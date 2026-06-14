import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import {
  jobAssignmentRuleConditionValidator,
  type jobAssignmentRuleValidator
} from "./people.models";

export async function getJobAssignmentRules(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("jobAssignmentRules")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "priority", ascending: true },
      { column: "name", ascending: true }
    ]);
  } else {
    query = query.order("priority", { ascending: true }).order("name", {
      ascending: true
    });
  }

  return query;
}

export async function getJobAssignmentRule(
  client: SupabaseClient<Database>,
  ruleId: string
) {
  return client
    .from("jobAssignmentRules")
    .select("*")
    .eq("id", ruleId)
    .single();
}

export async function upsertJobAssignmentRule(
  client: SupabaseClient<Database>,
  data: z.infer<typeof jobAssignmentRuleValidator> & {
    companyId: string;
    userId: string;
  }
) {
  // The validator already parses + validates conditions into an array, so
  // data.conditions is the structured form here. Re-validate just to be safe
  // against callers that bypass the validator.
  const conditionsResult = z
    .array(jobAssignmentRuleConditionValidator)
    .safeParse(data.conditions);
  if (!conditionsResult.success) {
    return {
      data: null,
      error: { message: "Conditions failed validation" } as Error
    };
  }

  const record = sanitize({
    id: data.id,
    name: data.name,
    description: data.description ?? null,
    conditions: conditionsResult.data,
    targetGroupId: data.targetGroupId,
    priority: data.priority,
    active: data.active,
    companyId: data.companyId,
    createdBy: data.userId,
    updatedBy: data.id ? data.userId : undefined,
    updatedAt: data.id ? new Date().toISOString() : undefined
  });

  return client
    .from("jobAssignmentRule")
    .upsert(record)
    .select("id")
    .single();
}

export async function deleteJobAssignmentRule(
  client: SupabaseClient<Database>,
  ruleId: string
) {
  return client.from("jobAssignmentRule").delete().eq("id", ruleId);
}

export async function getJobGroupAssignments(
  client: SupabaseClient<Database>,
  jobId: string
) {
  return client
    .from("jobGroupAssignment")
    .select("*, group:group(id, name), rule:jobAssignmentRule(id, name)")
    .eq("jobId", jobId);
}

export async function createJobGroupAssignment(
  client: SupabaseClient<Database>,
  data: {
    jobId: string;
    groupId: string;
    companyId: string;
    ruleId?: string;
    assignedBy: string;
  }
) {
  return client
    .from("jobGroupAssignment")
    .upsert({
      jobId: data.jobId,
      groupId: data.groupId,
      companyId: data.companyId,
      ruleId: data.ruleId ?? null,
      assignedBy: data.assignedBy,
      assignedAt: new Date().toISOString()
    })
    .select("id")
    .single();
}

export async function deleteJobGroupAssignment(
  client: SupabaseClient<Database>,
  jobId: string,
  groupId: string
) {
  return client
    .from("jobGroupAssignment")
    .delete()
    .eq("jobId", jobId)
    .eq("groupId", groupId);
}

// Returns currently open/in-progress jobs with enough context to evaluate rules
export async function getJobsForSimulation(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("job")
    .select(`
      id, jobId, status, customerId, locationId, tags,
      jobMakeMethod:jobMakeMethod(
        jobOperation:jobOperation(processId, workCenterId)
      )
    `)
    .eq("companyId", companyId)
    .in("status", ["Draft", "Confirmed", "In Progress", "Released"])
    .order("jobId", { ascending: true });
}
