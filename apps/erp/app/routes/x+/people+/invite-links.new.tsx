import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { CreateInviteLinkModal, createInviteLinkValidator } from "~/modules/users";
import { createInviteLink } from "~/modules/users/invite-links.server";
import { path } from "~/utils/path";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "users"
  });

  const validation = await validator(createInviteLinkValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { label, employeeTypeId, locationId, expiresAt } = validation.data;

  const result = await createInviteLink(client, {
    companyId,
    createdBy: userId,
    employeeTypeId,
    locationId,
    label: label || null,
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
  });

  if (result.error) {
    throw redirect(
      path.to.peopleInviteLinks,
      await flash(request, error(result.error, "Failed to create invite link"))
    );
  }

  throw redirect(
    path.to.peopleInviteLinks,
    await flash(request, success("Invite link created"))
  );
}

export default function Route() {
  return <CreateInviteLinkModal />;
}
