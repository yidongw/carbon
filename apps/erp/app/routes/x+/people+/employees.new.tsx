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
import { data, redirect, useLoaderData } from "react-router";
import { checkSeatAvailability } from "~/modules/settings";
import {
  CreateEmployeeModal,
  createEmployeeValidator,
  getInvitable
} from "~/modules/users";
import { createEmployeeAccount } from "~/modules/users/users.server";
import { path } from "~/utils/path";
import { getCompanyId } from "~/utils/react-query";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    create: "users"
  });

  const invitable = await getInvitable(client, companyId);
  if (invitable.error) {
    throw redirect(
      path.to.employeeAccounts,
      await flash(
        request,
        error(invitable.error, "Failed to load invitable users")
      )
    );
  }

  return {
    invitable: invitable.data ?? []
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "users"
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(createEmployeeValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { email, firstName, lastName, locationId, employeeType, number } =
    validation.data;

  // One-time annual plans have a hard seat cap — block adds beyond it.
  const seat = await checkSeatAvailability(client, companyId, 1);
  if (!seat.ok) {
    if (modal) {
      return data(
        { success: false as const, message: seat.message },
        await flash(request, error(null, seat.message))
      );
    }
    throw redirect(
      path.to.employeeAccounts,
      await flash(request, error(null, seat.message))
    );
  }

  const result = await createEmployeeAccount(client, {
    email: email.toLowerCase(),
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
    if (modal) {
      return data(
        { success: false as const, message },
        await flash(request, error(result, message))
      );
    }
    throw redirect(
      path.to.employeeAccounts,
      await flash(request, error(result, message))
    );
  }

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
    from: `Carbon <no-reply@${RESEND_DOMAIN}>`,
    to: email,
    subject: `You have been invited to join ${company.data?.name} on Carbon`,
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

  if (modal) {
    return data(
      {
        success: true as const,
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

export default function () {
  const { invitable } = useLoaderData<typeof loader>();

  return <CreateEmployeeModal invitable={invitable} />;
}
