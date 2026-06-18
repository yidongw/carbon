import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { revokeInviteLinkValidator } from "~/modules/users";
import { revokeInviteLink } from "~/modules/users/invite-links.server";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId } = await requirePermissions(request, {
    update: "users"
  });

  const validation = await validator(revokeInviteLinkValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const result = await revokeInviteLink(client, {
    id: validation.data.id,
    companyId
  });

  if (result.error) {
    return data(
      {},
      await flash(request, error(result.error, "Failed to revoke invite link"))
    );
  }

  return data(
    {},
    await flash(request, success("Invite link revoked"))
  );
}
