import {
  assertIsPost,
  error,
  getAppUrl,
  RESEND_DOMAIN,
  success
} from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { InviteEmail } from "@carbon/documents/email";
import { validationError, validator } from "@carbon/form";
import { sendEmail } from "@carbon/lib/resend.server";
import { render } from "@react-email/components";
import { nanoid } from "nanoid";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { updateInviteValidator } from "~/modules/users";
import { updateEmployeeInvite } from "~/modules/users/users.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId: paramUserId } = params;
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  if (!isOverlay) {
    const token = overlayToken(overlay.to.editInvite({ userId: paramUserId! }));
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query ? `${path.to.employeeAccounts}?${query}` : path.to.employeeAccounts
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    update: "users"
  });

  const serviceRole = getCarbonServiceRole();
  const [userRow, employeeRow] = await Promise.all([
    serviceRole
      .from("user")
      .select("email, phone")
      .eq("id", paramUserId!)
      .single(),
    client
      .from("employee")
      .select("employeeTypeId")
      .eq("id", paramUserId!)
      .eq("companyId", companyId)
      .single()
  ]);

  if (userRow.error || employeeRow.error) {
    throw redirect(path.to.employeeAccounts);
  }

  return {
    userId: paramUserId!,
    email: userRow.data.email ?? null,
    phone: (userRow.data as { phone?: string | null }).phone ?? null,
    employeeTypeId: employeeRow.data.employeeTypeId ?? ""
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const {
    client,
    companyId,
    userId: currentUserId
  } = await requirePermissions(request, { update: "users" });

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
  const { userId: paramUserId } = params;
  const formData = await request.formData();

  const validation = await validator(updateInviteValidator).validate(formData);
  if (validation.error) {
    return validationError(validation.error);
  }

  const { email, phone, employeeType } = validation.data;

  const serviceRole = getCarbonServiceRole();
  const userRow = await serviceRole
    .from("user")
    .select("email, phone, fullName")
    .eq("id", paramUserId!)
    .single();

  if (userRow.error) {
    const msg = "Could not load invitee";
    if (isOverlay) {
      return data(
        { ok: false as const, error: msg },
        await flash(request, error(null, msg))
      );
    }
    throw redirect(
      path.to.employeeAccounts,
      await flash(request, error(null, msg))
    );
  }

  const currentEmail = userRow.data.email ?? null;
  const currentPhone =
    (userRow.data as { phone?: string | null }).phone ?? null;

  const result = await updateEmployeeInvite(client, {
    userId: paramUserId!,
    email: email?.toLowerCase(),
    phone,
    employeeType,
    companyId,
    currentEmail,
    currentPhone
  });

  if (!result.success) {
    const msg = result.message ?? "Failed to update invite";
    if (isOverlay) {
      return data(
        { ok: false as const, error: msg },
        await flash(request, error(null, msg))
      );
    }
    throw redirect(
      path.to.employeeAccounts,
      await flash(request, error(null, msg))
    );
  }

  // Resend invite email when the email address changed.
  if (result.newEmailCode && email) {
    const location = request.headers.get("x-vercel-ip-city") ?? "Unknown";
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    const [company, inviter] = await Promise.all([
      client.from("company").select("name").eq("id", companyId).single(),
      client
        .from("user")
        .select("email, fullName")
        .eq("id", currentUserId)
        .single()
    ]);

    if (company.data) {
      await sendEmail({
        from: `Carbon <no-reply@${RESEND_DOMAIN}>`,
        to: email,
        subject: `You have been invited to join ${company.data.name} on Carbon`,
        headers: { "X-Entity-Ref-ID": nanoid() },
        html: await render(
          InviteEmail({
            invitedByEmail: inviter.data?.email ?? "",
            invitedByName: inviter.data?.fullName ?? "",
            email,
            name: userRow.data.fullName ?? "",
            companyName: company.data.name,
            inviteLink: `${getAppUrl()}/invite/${result.newEmailCode}`,
            ip,
            location
          })
        )
      });
    }
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Invite updated"))
    );
  }

  throw redirect(
    path.to.employeeAccounts,
    await flash(request, success("Invite updated"))
  );
}

export default function () {
  return null;
}
