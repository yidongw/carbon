import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import {
  upsertWarehouseTransfer,
  warehouseTransferValidator
} from "~/modules/inventory";
import { getNextSequence } from "~/modules/settings";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`New Transfer`,
  to: path.to.warehouseTransfers
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "inventory"
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const formData = await request.formData();
  const validation = await validator(warehouseTransferValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  let transferId = validation.data.transferId;
  const useNextSequence = !transferId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(
      client,
      "warehouseTransfer",
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
    transferId = nextSequence.data;
  }

  if (!transferId) throw new Error("transferId is not defined");
  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...d } = validation.data;

  const createTransfer = await upsertWarehouseTransfer(client, {
    ...d,
    transferId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createTransfer.error || !createTransfer.data) {
    return data(
      {
        data: createTransfer.data,
        error: {
          message: "Failed to create warehouse transfer"
        }
      },
      await flash(
        request,
        error(createTransfer.error, "Failed to create warehouse transfer")
      )
    );
  }

  return data({ data: createTransfer.data }, { status: 201 });
}

export default function WarehouseTransferNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <RegisteredEntityFormModal
      to={path.to.newWarehouseTransfer}
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
