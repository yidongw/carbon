import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { reviewMembershipApplicationValidator } from "~/modules/users";
import {
  approveMembershipApplication,
  rejectMembershipApplication
} from "~/modules/users/invite-links.server";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "users"
  });

  const validation = await validator(
    reviewMembershipApplicationValidator
  ).validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, action: reviewAction, locationId } = validation.data;

  const result =
    reviewAction === "approve"
      ? await approveMembershipApplication(client, {
          id,
          companyId,
          reviewerId: userId,
          locationId: locationId || undefined
        })
      : await rejectMembershipApplication(client, {
          id,
          companyId,
          reviewerId: userId
        });

  if (!result.success) {
    return data(
      {},
      await flash(request, error(result.message, "Failed to review application"))
    );
  }

  return data(
    {},
    await flash(
      request,
      success(
        reviewAction === "approve"
          ? "Application approved"
          : "Application rejected"
      )
    )
  );
}
