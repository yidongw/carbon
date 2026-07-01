import { AUTH_PROVIDERS, assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  checkSmsVerifyCode,
  sendSmsVerifyCode
} from "@carbon/auth/aliyun-sms.server";
import {
  findUserIdByIdentity,
  getUserIdentities,
  linkIdentity,
  unlinkIdentity,
  type LoginMethod
} from "@carbon/auth/identity.server";
import { toE164Phone } from "@carbon/auth/phone.server";
import { flash } from "@carbon/auth/session.server";
import {
  sendVerificationCode,
  verifyEmailCode
} from "@carbon/auth/verification.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import {
  accountProfileValidator,
  getAccount,
  updateAvatar,
  updatePublicAccount
} from "~/modules/account";
import { LoginMethodsForm, ProfileForm } from "~/modules/account/ui/Profile";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

const KNOWN_METHODS = ["email", "google", "azure", "phone", "wechat"] as const;

export const handle: Handle = {
  breadcrumb: msg`Profile`,
  to: path.to.profile
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Convert ?linkError= from the OAuth callback into a flash toast and redirect
  // to the clean URL — the flashClientMiddleware shows it on the next render.
  const linkError = new URL(request.url).searchParams.get("linkError");
  if (linkError) {
    throw redirect(path.to.profile, await flash(request, error(null, linkError)));
  }

  const { client, userId } = await requirePermissions(request, {});

  const [user, identities] = await Promise.all([
    getAccount(client, userId),
    getUserIdentities(userId)
  ]);

  if (user.error || !user.data) {
    throw redirect(
      path.to.authenticatedRoot,
      await flash(request, error(user.error, "Failed to get user"))
    );
  }

  // Login methods enabled in this deployment (shown in the card).
  const enabled = AUTH_PROVIDERS.split(",");
  const enabledMethods = KNOWN_METHODS.filter((m) => enabled.includes(m));

  return { user: user.data, identities, enabledMethods };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {});
  const formData = await request.formData();

  if (formData.get("intent") === "about") {
    const validation = await validator(accountProfileValidator).validate(
      formData
    );

    if (validation.error) {
      return validationError(validation.error);
    }

    const { firstName, lastName, about, phone, number } = validation.data;

    const updateAccount = await updatePublicAccount(client, {
      id: userId,
      firstName,
      lastName,
      about,
      phone,
      number
    });
    if (updateAccount.error)
      return data(
        {},
        await flash(
          request,
          error(updateAccount.error, "Failed to update profile")
        )
      );

    return data({}, await flash(request, success("Updated profile")));
  }

  if (formData.get("intent") === "photo") {
    const photoPath = formData.get("path");
    if (photoPath === null || typeof photoPath === "string") {
      const avatarUpdate = await updateAvatar(client, userId, photoPath);
      if (avatarUpdate.error) {
        throw redirect(
          path.to.profile,
          await flash(
            request,
            error(avatarUpdate.error, "Failed to update avatar")
          )
        );
      }

      throw redirect(
        path.to.profile,
        await flash(
          request,
          success(photoPath === null ? "Removed avatar" : "Updated avatar")
        )
      );
    } else {
      throw redirect(
        path.to.profile,
        await flash(request, error(null, "Invalid avatar path"))
      );
    }
  }

  const intent = formData.get("intent");

  if (intent === "removeIdentity") {
    const type = formData.get("type") as LoginMethod;
    const value = formData.get("value") as string;
    const result = await unlinkIdentity(userId, type, value);
    if (!result.success) {
      return data(
        {},
        await flash(
          request,
          error(
            null,
            result.reason === "last_method"
              ? "You can't remove your only login method"
              : "Failed to remove login method"
          )
        )
      );
    }
    return data({}, await flash(request, success("Removed login method")));
  }

  // Add phone: send an SMS code, then verify + link to this account.
  if (intent === "addPhoneSend") {
    const phone = formData.get("phone") as string;
    if (!/^1[3-9]\d{9}$/.test(phone ?? "")) {
      return data({ success: false, message: "Invalid phone number" });
    }
    // Don't spend an SMS if the number can't be linked anyway.
    const owner = await findUserIdByIdentity("phone", toE164Phone(phone));
    if (owner) {
      return data({
        success: false,
        message:
          owner === userId
            ? "This phone is already linked to your account"
            : "That phone is already linked to another account"
      });
    }
    const sent = await sendSmsVerifyCode(phone);
    return sent
      ? data({ success: true, step: "addPhoneSent", phone })
      : data({ success: false, message: "Failed to send verification code" });
  }

  if (intent === "addPhoneVerify") {
    const phone = formData.get("phone") as string;
    const code = formData.get("code") as string;
    if (!(await checkSmsVerifyCode(phone, code))) {
      return data({ success: false, message: "Invalid or expired code" });
    }
    const link = await linkIdentity(userId, "phone", toE164Phone(phone));
    if (!link.success) {
      return data(
        {},
        await flash(
          request,
          error(
            null,
            link.reason === "conflict"
              ? "That phone is already linked to another account"
              : "Failed to link phone"
          )
        )
      );
    }
    return data({ linked: true }, await flash(request, success("Linked phone")));
  }

  // Add email: send a code, then verify + link. On success the email becomes the
  // canonical auth email (replacing any synthetic placeholder).
  if (intent === "addEmailSend") {
    const email = formData.get("email") as string;
    if (!email || !email.includes("@")) {
      return data({ success: false, message: "Invalid email address" });
    }
    const owner = await findUserIdByIdentity("email", email);
    if (owner) {
      return data({
        success: false,
        message:
          owner === userId
            ? "This email is already linked to your account"
            : "That email is already linked to another account"
      });
    }
    const sent = await sendVerificationCode(email);
    return sent
      ? data({ success: true, step: "addEmailSent", email })
      : data({ success: false, message: "Failed to send verification code" });
  }

  if (intent === "addEmailVerify") {
    const email = formData.get("email") as string;
    const code = formData.get("code") as string;
    if (!(await verifyEmailCode(email, code))) {
      return data({ success: false, message: "Invalid or expired code" });
    }
    const link = await linkIdentity(userId, "email", email);
    if (!link.success) {
      return data(
        {},
        await flash(
          request,
          error(
            null,
            link.reason === "conflict"
              ? "That email is already linked to another account"
              : "Failed to link email"
          )
        )
      );
    }
    const serviceRole = getCarbonServiceRole();
    const { error: authError } = await serviceRole.auth.admin.updateUserById(
      userId,
      { email, email_confirm: true }
    );
    if (authError) {
      console.error("[addEmailVerify] updateUserById failed, rolling back", authError);
      await unlinkIdentity(userId, "email", email);
      return data({}, await flash(request, error(null, "Failed to link email")));
    }
    await serviceRole.from("user").update({ email }).eq("id", userId);
    return data({ linked: true }, await flash(request, success("Linked email")));
  }

  return null;
}

export default function AccountProfile() {
  const { user, identities, enabledMethods } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={4}>
      <LoginMethodsForm
        identities={identities}
        enabledMethods={enabledMethods}
        wechatName={[user.firstName, user.lastName].filter(Boolean).join(" ")}
      />
      <ProfileForm user={user} />
    </VStack>
  );
}
