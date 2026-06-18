import { error } from "@carbon/auth";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash, getAuthSession } from "@carbon/auth/session.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { submitMembershipApplication } from "~/modules/users/invite-links.server";
import { path } from "~/utils/path";

async function handleApply(
  request: Request,
  code: string,
  userId: string
) {
  const serviceRole = getCarbonServiceRole();
  const result = await submitMembershipApplication(serviceRole, code, userId);

  if (!result.success) {
    throw redirect(
      path.to.joinLink(code),
      await flash(request, error(result.message, result.message))
    );
  }

  throw redirect(path.to.joinLinkSubmitted(code));
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { code } = params;
  if (!code) throw new Error("No code provided");

  const authSession = await getAuthSession(request);
  if (!authSession) {
    throw redirect(
      `${path.to.login}?redirectTo=${encodeURIComponent(path.to.joinLinkApply(code))}`
    );
  }

  if (request.method === "GET") {
    await handleApply(request, code, authSession.userId);
  }

  return null;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { code } = params;
  if (!code) throw new Error("No code provided");

  const authSession = await getAuthSession(request);
  if (!authSession) {
    throw redirect(
      `${path.to.login}?redirectTo=${encodeURIComponent(path.to.joinLinkApply(code))}`
    );
  }

  await handleApply(request, code, authSession.userId);
  return null;
}

export default function Route() {
  return null;
}
