import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { jobOperationPickupValidator } from "~/services/models";
import { upsertJobOperationPickup } from "~/services/operations.service";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {});

  const formData = await request.formData();
  const validation = await validator(jobOperationPickupValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { configuration: rawConfiguration, ...rest } = validation.data;

  let configuration: unknown;
  if (rawConfiguration) {
    try {
      configuration =
        typeof rawConfiguration === "string"
          ? JSON.parse(rawConfiguration)
          : rawConfiguration;
    } catch {
      configuration = undefined;
    }
  }

  const insert = await upsertJobOperationPickup(client, {
    ...rest,
    configuration,
    companyId,
    createdBy: userId
  });

  if (insert.error) {
    return data(
      {},
      await flash(request, error(insert.error, "Failed to log pickup"))
    );
  }

  return data(
    insert.data,
    await flash(request, success("Pickup logged successfully"))
  );
}
