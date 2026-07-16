import { AUTH_PROVIDERS, assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  CreateInviteLinkModal,
  createInviteLinkValidator,
  INVITE_LOGIN_METHODS,
  parseInviteLoginMethods
} from "~/modules/users";
import { createInviteLink } from "~/modules/users/invite-links.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, { create: "users" });
  // Only offer login methods that are actually enabled in this deployment, in
  // the canonical order (WeChat, Phone, Email, …).
  const enabled = AUTH_PROVIDERS.split(",").map((p) => p.trim());
  const availableMethods = INVITE_LOGIN_METHODS.filter((m) =>
    enabled.includes(m)
  );
  return { availableMethods };
}

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
  const loginMethods = parseInviteLoginMethods(validation.data.loginMethods);

  const result = await createInviteLink(client, {
    companyId,
    createdBy: userId,
    employeeTypeId,
    locationId,
    label: label || null,
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    loginMethods
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
  const { availableMethods } = useLoaderData<typeof loader>();
  return <CreateInviteLinkModal availableMethods={availableMethods} />;
}
