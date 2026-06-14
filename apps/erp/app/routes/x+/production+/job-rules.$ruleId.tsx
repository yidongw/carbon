import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate } from "react-router";
import {
  getJobAssignmentRule,
  jobAssignmentRuleValidator,
  upsertJobAssignmentRule
} from "~/modules/people";
import { JobRuleForm } from "~/modules/production/ui/JobRules";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { ruleId } = params;
  if (!ruleId) throw redirect(path.to.jobRules);

  const [rule, groups] = await Promise.all([
    getJobAssignmentRule(client, ruleId),
    client
      .from("group")
      .select("id, name")
      .order("name", { ascending: true })
  ]);

  if (rule.error || !rule.data) {
    throw redirect(
      path.to.jobRules,
      await flash(request, error(rule.error, "Rule not found"))
    );
  }

  return {
    rule: rule.data,
    groups: groups.data ?? []
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { ruleId } = params;
  const formData = await request.formData();

  // Handle toggle active
  if (formData.get("_action") === "toggle") {
    const active = formData.get("active") === "on";
    const result = await client
      .from("jobAssignmentRule")
      .update({ active, updatedBy: userId, updatedAt: new Date().toISOString() })
      .eq("id", ruleId!);
    if (result.error) {
      return { error: result.error };
    }
    return { ok: true };
  }

  const validation = await validator(jobAssignmentRuleValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const result = await upsertJobAssignmentRule(client, {
    ...validation.data,
    id: ruleId,
    companyId,
    userId
  });

  if (result.error) {
    throw redirect(
      path.to.jobRules,
      await flash(request, error(result.error, "Failed to update rule"))
    );
  }

  throw redirect(
    path.to.jobRules,
    await flash(request, success("Assignment rule updated"))
  );
}

export default function EditJobRuleRoute() {
  const { rule, groups } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <JobRuleForm
      initialValues={{
        id: rule.id,
        name: rule.name ?? "",
        description: rule.description ?? "",
        conditions: JSON.stringify(rule.conditions ?? []),
        targetGroupId: rule.targetGroupId ?? "",
        priority: rule.priority ?? 0,
        active: rule.active ?? true
      }}
      groups={groups}
      onClose={() => navigate(path.to.jobRules)}
    />
  );
}
