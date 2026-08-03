import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useParams } from "react-router";
import { PersonProcesses } from "~/modules/people/ui/Person";
import {
  employeeProcessesValidator,
  getEmployeeProcessesByEmployee,
  upsertEmployeeProcesses
} from "~/modules/resources";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "people"
  });

  const { personId } = params;
  if (!personId) throw new Error("Could not find personId");

  const employeeProcesses = await getEmployeeProcessesByEmployee(
    client,
    personId,
    companyId
  );
  if (employeeProcesses.error) {
    throw redirect(
      path.to.people,
      await flash(
        request,
        error(employeeProcesses.error, "Failed to load processes")
      )
    );
  }

  return {
    processes: (employeeProcesses.data ?? [])
      .map((row) => row.processId)
      .filter((id): id is string => Boolean(id))
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "people"
  });
  const { personId } = params;
  if (!personId) throw new Error("No person ID provided");

  const formData = await request.formData();
  const validation = await validator(employeeProcessesValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const update = await upsertEmployeeProcesses(client, {
    ...validation.data,
    companyId,
    createdBy: userId
  });
  if (update.error) {
    throw redirect(
      path.to.personProcesses(personId),
      await flash(request, error(update.error, "Failed to update processes"))
    );
  }

  throw redirect(
    path.to.personProcesses(personId),
    await flash(request, success("Successfully updated processes"))
  );
}

export default function PersonProcessesRoute() {
  const { processes } = useLoaderData<typeof loader>();
  const { personId } = useParams();

  const initialValues = {
    employeeId: personId ?? "",
    processes
  };

  return <PersonProcesses key={personId} initialValues={initialValues} />;
}
