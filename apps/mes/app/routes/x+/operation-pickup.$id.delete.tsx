import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { deleteJobOperationPickup } from "~/services/operations.service";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {});

  const { id } = params;
  if (!id) throw new Error("id is required");

  const result = await deleteJobOperationPickup(client, id);

  if (result.error) {
    return data(
      {},
      await flash(request, error(result.error, "Failed to delete pickup"))
    );
  }

  return data(
    {},
    await flash(request, success("Pickup deleted"))
  );
}
