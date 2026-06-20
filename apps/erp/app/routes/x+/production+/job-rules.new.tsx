import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { jobAssignmentRuleValidator, upsertJobAssignmentRule } from "~/modules/people";
import { JobRuleForm } from "~/modules/production/ui/JobRules";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    create: "production"
  });

  const groups = await client
    .from("group")
    .select("id, name")
    .order("name", { ascending: true });

  return { groups: groups.data ?? [] };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const formData = await request.formData();
  const validation = await validator(jobAssignmentRuleValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const result = await upsertJobAssignmentRule(client, {
    ...validation.data,
    companyId,
    userId
  });

  if (result.error) {
    throw redirect(
      path.to.jobRules,
      await flash(request, error(result.error, "Failed to create rule"))
    );
  }

  throw redirect(
    path.to.jobRules,
    await flash(request, success("Assignment rule created"))
  );
}

export default function NewJobRuleRoute() {
  const { groups } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <JobRuleForm
      initialValues={{
        name: "",
        description: "",
        conditions: "[]",
        targetGroupId: "",
        priority: 0,
        active: true
      }}
      groups={groups}
      onClose={() => navigate(path.to.jobRules)}
    />
  );
}
