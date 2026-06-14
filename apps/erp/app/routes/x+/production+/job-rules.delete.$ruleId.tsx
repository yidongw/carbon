import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { useUrlParams } from "~/hooks";
import { ConfirmDelete } from "~/components/Modals";
import { deleteJobAssignmentRule, getJobAssignmentRule } from "~/modules/people";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { ruleId } = params;
  if (!ruleId) throw notFound("ruleId not found");

  const rule = await getJobAssignmentRule(client, ruleId);
  if (rule.error || !rule.data) {
    throw redirect(
      `${path.to.jobRules}?${getParams(request)}`,
      await flash(request, error(rule.error, "Rule not found"))
    );
  }

  return { rule: rule.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "production"
  });

  const { ruleId } = params;
  if (!ruleId) throw redirect(`${path.to.jobRules}?${getParams(request)}`);

  const result = await deleteJobAssignmentRule(client, ruleId);

  if (result.error) {
    throw redirect(
      `${path.to.jobRules}?${getParams(request)}`,
      await flash(request, error(result.error, "Failed to delete rule"))
    );
  }

  throw redirect(
    `${path.to.jobRules}?${getParams(request)}`,
    await flash(request, success("Assignment rule deleted"))
  );
}

export default function DeleteJobRuleRoute() {
  const { ruleId } = useParams();
  const { rule } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [params] = useUrlParams();
  const { t } = useLingui();

  if (!rule || !ruleId) return null;

  return (
    <ConfirmDelete
      action={path.to.deleteJobRule(ruleId)}
      name={rule.name ?? ""}
      text={t`Are you sure you want to delete the assignment rule: ${rule.name ?? ""}? This cannot be undone.`}
      onCancel={() => navigate(`${path.to.jobRules}?${params.toString()}`)}
    />
  );
}
