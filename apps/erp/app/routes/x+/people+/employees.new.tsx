import {
  assertIsPost,
  error,
  getAppUrl,
  RESEND_DOMAIN,
  success
} from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { InviteEmail } from "@carbon/documents/email";
import { validationError, validator } from "@carbon/form";
import { sendEmail } from "@carbon/lib/resend.server";
import { render } from "@react-email/components";
import { nanoid } from "nanoid";
import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs,
  LoaderFunctionArgs
} from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { checkSeatAvailability } from "~/modules/settings";
import { createEmployeeValidator } from "~/modules/users";
import { createEmployeeAccount } from "~/modules/users/users.server";
import { path } from "~/utils/path";
import { getCompanyId } from "~/utils/react-query";

export async function loader({ request }: LoaderFunctionArgs) {
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav / Create menu): redirect to the list with the
  // overlay open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newEmployee());
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query ? `${path.to.employeeAccounts}?${query}` : path.to.employeeAccounts
    );
  }

  // The form self-loads employee types and seeds location from the session; the
  // loader only gates permission and signals the overlay to render.
  await requirePermissions(request, { create: "users" });

  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "users"
  });

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const formData = await request.formData();

  const validation = await validator(createEmployeeValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    email,
    phone,
    firstName,
    lastName,
    locationId,
    employeeType,
    number
  } = validation.data;

  // One-time annual plans have a hard seat cap — block adds beyond it.
  const seat = await checkSeatAvailability(client, companyId, 1);
  if (!seat.ok) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: seat.message },
        await flash(request, error(null, seat.message))
      );
    }
    throw redirect(
      path.to.employeeAccounts,
      await flash(request, error(null, seat.message))
    );
  }

  const result = await createEmployeeAccount(client, {
    email: email?.toLowerCase(),
    phone,
    firstName,
    lastName,
    employeeType,
    locationId,
    companyId,
    createdBy: userId,
    number
  });

  if (!result.success) {
    console.error(result);
    const message = result.message ?? "Failed to create employee account";
    if (isOverlay) {
      return data(
        { ok: false as const, error: message },
        await flash(request, error(result, message))
      );
    }
    throw redirect(
      path.to.employeeAccounts,
      await flash(request, error(result, message))
    );
  }

  // Phone invites carry no email link — Aliyun's SMS template is verify-code-only, so
  // there is nothing to send. The invitee is activated when they log in via phone OTP.
  if (email) {
    const location = request.headers.get("x-vercel-ip-city") ?? "Unknown";
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const [company, user] = await Promise.all([
      client.from("company").select("name").eq("id", companyId).single(),
      client.from("user").select("email, fullName").eq("id", userId).single()
    ]);

    if (!company.data || !user.data) {
      throw new Error("Failed to load company or user");
    }

    await sendEmail({
      from: `Jilio <no-reply@${RESEND_DOMAIN}>`,
      to: email,
      subject: `You have been invited to join ${company.data?.name} on Jilio`,
      headers: {
        "X-Entity-Ref-ID": nanoid()
      },
      html: await render(
        InviteEmail({
          invitedByEmail: user.data.email ?? "",
          invitedByName: user.data.fullName ?? "",
          email,
          name: `${firstName} ${lastName}`.trim(),
          companyName: company.data.name,
          inviteLink: `${getAppUrl()}/invite/${result.code}`,
          ip,
          location
        })
      )
    });
  }

  if (isOverlay) {
    return data(
      {
        ok: true as const,
        userId: result.userId,
        firstName,
        lastName
      },
      await flash(request, success("Successfully invited employee"))
    );
  }

  throw redirect(
    path.to.personJob(result.userId),
    await flash(request, success("Successfully invited employee"))
  );
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const companyId = getCompanyId();
  window.clientCache?.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey as string[];
      return queryKey[0] === "groupsByType" && queryKey[1] === companyId;
    }
  });
  return await serverAction();
}

// Rendered as a registry overlay (see overlay.registry.tsx `newEmployee`), not a page.
export default function () {
  return null;
}
