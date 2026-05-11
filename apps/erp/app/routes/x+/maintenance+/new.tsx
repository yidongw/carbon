import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, useLoaderData, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import {
  getFailureModesList,
  maintenanceDispatchValidator,
  upsertMaintenanceDispatch
} from "~/modules/resources";
import { getNextSequence } from "~/modules/settings";
import { getUserDefaults } from "~/modules/users/users.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Maintenance`,
  to: path.to.maintenanceDispatches,
  module: "resources"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "resources"
  });

  const [failureModes, defaults] = await Promise.all([
    getFailureModesList(client, companyId),
    getUserDefaults(client, userId, companyId)
  ]);

  return {
    failureModes: failureModes.data ?? [],
    defaultLocationId: defaults.data?.locationId ?? undefined
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "resources"
  });

  const formData = await request.formData();
  const validation = await validator(maintenanceDispatchValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const nextSequence = await getNextSequence(
    client,
    "maintenanceDispatch",
    companyId
  );
  if (nextSequence.error) {
    return data(
      {
        error: {
          message: "Failed to get next sequence"
        }
      },
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  const content = validation.data.content
    ? JSON.parse(validation.data.content)
    : {};

  const insertDispatch = await upsertMaintenanceDispatch(client, {
    maintenanceDispatchId: nextSequence.data,
    status: validation.data.status,
    priority: validation.data.priority,
    severity: validation.data.severity || "Support Required",
    source: validation.data.source || "Reactive",
    oeeImpact: validation.data.oeeImpact || "No Impact",
    workCenterId: validation.data.workCenterId || undefined,
    locationId: validation.data.locationId,
    assignee: validation.data.assignee || undefined,
    suspectedFailureModeId: validation.data.suspectedFailureModeId || undefined,
    plannedStartTime: validation.data.plannedStartTime || undefined,
    plannedEndTime: validation.data.plannedEndTime || undefined,
    content,
    companyId,
    createdBy: userId
  });

  if (insertDispatch.error) {
    return data(
      {
        data: insertDispatch.data,
        error: {
          message: "Failed to create maintenance dispatch"
        }
      },
      await flash(
        request,
        error(insertDispatch.error, "Failed to create maintenance dispatch")
      )
    );
  }

  const newId = insertDispatch.data?.id;
  if (!newId) {
    return data(
      {
        error: {
          message: "Failed to get new dispatch ID"
        }
      },
      await flash(request, error(null, "Failed to get new dispatch ID"))
    );
  }

  return data(
    {
      data: insertDispatch.data
    },
    await flash(request, success("Created maintenance dispatch"))
  );
}

export default function NewMaintenanceDispatchRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const loadedData = useLoaderData<typeof loader>();

  return (
    <RegisteredEntityFormModal
      to={path.to.newMaintenanceDispatch}
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
