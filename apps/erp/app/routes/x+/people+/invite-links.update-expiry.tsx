import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { updateInviteLinkExpiryValidator } from "~/modules/users";
import { updateInviteLinkExpiry } from "~/modules/users/invite-links.server";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId } = await requirePermissions(request, {
    update: "users"
  });

  const validation = await validator(updateInviteLinkExpiryValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, expiresAt } = validation.data;

  const result = await updateInviteLinkExpiry(client, {
    id,
    companyId,
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
  });

  if (result.error) {
    return data(
      {},
      await flash(
        request,
        error(result.error, "Failed to update invite link expiration")
      )
    );
  }

  return data(
    {},
    await flash(request, success("Invite link expiration updated"))
  );
}
