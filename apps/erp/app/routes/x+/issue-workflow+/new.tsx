import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, useLoaderData, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { issueWorkflowValidator } from "~/modules/quality/quality.models";
import {
  getRequiredActionsList,
  upsertIssueWorkflow
} from "~/modules/quality/quality.service";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    create: "quality"
  });

  const requiredActions = await getRequiredActionsList(client, companyId);

  return {
    requiredActions: requiredActions.data ?? []
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "quality"
  });
  const formData = await request.formData();
  const validation = await validator(issueWorkflowValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...d } = validation.data;

  const insertIssueWorkflow = await upsertIssueWorkflow(client, {
    ...d,
    companyId,
    createdBy: userId
  });

  if (insertIssueWorkflow.error || !insertIssueWorkflow.data?.id) {
    return data(
      {
        data: insertIssueWorkflow.data,
        error: {
          message: "Failed to insert issue workflow"
        }
      },
      await flash(
        request,
        error(insertIssueWorkflow.error, "Failed to insert issue workflow")
      )
    );
  }

  return data(
    {
      data: insertIssueWorkflow.data
    },
    await flash(request, success("Non-conformance workflow created"))
  );
}

export default function NewIssueWorkflowRoute() {
  const loadedData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <RegisteredEntityFormModal
      to={path.to.newIssueWorkflow}
      loadedData={loadedData}
      onClose={() => {
        if (from) {
          navigate(from);
        } else {
          navigate(-1);
        }
      }}
    />
  );
}
