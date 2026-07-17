import {
  AUTH_PROVIDERS,
  assertIsPost,
  error,
  isAuthProviderEnabled,
  success
} from "@carbon/auth";
import {
  checkSmsVerifyCode,
  sendSmsVerifyCode
} from "@carbon/auth/aliyun-sms.server";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  findUserIdByIdentity,
  getUserIdentities,
  type LoginMethod,
  linkIdentity,
  unlinkIdentity
} from "@carbon/auth/identity.server";
import { toE164Phone } from "@carbon/auth/phone.server";
import { flash } from "@carbon/auth/session.server";
import {
  sendVerificationCode,
  verifyEmailCode
} from "@carbon/auth/verification.server";
import { validationError, validator } from "@carbon/form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  toast,
  VStack
} from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { startRegistration } from "@simplewebauthn/browser";
import { useEffect, useState } from "react";
import { LuFingerprint, LuTrash2 } from "react-icons/lu";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  redirect,
  useFetcher,
  useLoaderData,
  useRevalidator
} from "react-router";
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

type Passkey = {
  id: string;
  credentialName: string;
  createdAt: string;
  lastUsedAt: string | null;
  backedUp: boolean;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

  // OAuth callback redirects a failed identity link back here with the reason
  // in ?linkError=; read it server-side and surface it in the component.
  const linkError = new URL(request.url).searchParams.get("linkError");

  const [user, passkeysResult, identities] = await Promise.all([
    getAccount(client, userId),
    (serviceRole as any)
      .from("passkeyCredential")
      .select("id, credentialName, createdAt, lastUsedAt, backedUp")
      .eq("userId", userId)
      .order("createdAt", { ascending: false }),
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

  return {
    user: user.data,
    passkeys: (passkeysResult.data ?? []) as Passkey[],
    identities,
    enabledMethods,
    linkError
  };
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

  if (formData.get("intent") === "deletePasskey") {
    const credentialId = formData.get("credentialId") as string;
    if (!credentialId) {
      return data(error(null, "Missing credentialId"), { status: 400 });
    }

    const serviceRole = getCarbonServiceRole();
    const { error: dbError } = await (serviceRole as any)
      .from("passkeyCredential")
      .delete()
      .eq("id", credentialId)
      .eq("userId", userId);

    if (dbError) {
      return data(
        error(dbError, "Failed to delete passkey"),
        await flash(request, error(dbError, "Failed to delete passkey"))
      );
    }

    return data(success("Passkey removed"));
  }

  if (formData.get("intent") === "renamePasskey") {
    const credentialId = formData.get("credentialId") as string;
    const credentialName = (formData.get("credentialName") as string)?.trim();
    if (!credentialId || !credentialName) {
      return data(error(null, "Missing fields"), { status: 400 });
    }
    if (credentialName.length > 100) {
      return data(error(null, "Passkey name must be 100 characters or fewer"), {
        status: 400
      });
    }

    const serviceRole = getCarbonServiceRole();
    const { error: dbError } = await (serviceRole as any)
      .from("passkeyCredential")
      .update({ credentialName })
      .eq("id", credentialId)
      .eq("userId", userId);

    if (dbError) {
      return data(
        error(dbError, "Failed to rename passkey"),
        await flash(request, error(dbError, "Failed to rename passkey"))
      );
    }

    return data(success("Passkey renamed"));
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
    return data(
      { linked: true },
      await flash(request, success("Linked phone"))
    );
  }

  // Add email: send a code, then verify + link. On success the email becomes the
  // canonical auth email (replacing any synthetic placeholder).
  if (intent === "addEmailSend") {
    const email = formData.get("email") as string;
    if (!email || !email.includes("@")) {
      return data({ success: false, message: "Invalid email address" });
    }
    // Check all email-family types: Google/Outlook share the same address, so
    // an address linked via Google must also block re-adding it as Email.
    let owner: string | null = null;
    for (const t of ["email", "google", "azure"] as const) {
      owner = await findUserIdByIdentity(t, email);
      if (owner) break;
    }
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
    // Re-check across all email-family types in case state changed since send.
    let emailOwner: string | null = null;
    for (const t of ["email", "google", "azure"] as const) {
      emailOwner = await findUserIdByIdentity(t, email);
      if (emailOwner) break;
    }
    if (emailOwner && emailOwner !== userId) {
      return data({
        success: false,
        message: "That email is already linked to another account"
      });
    }
    if (emailOwner === userId) {
      // Already linked (e.g. via Google) — treat as success, no-op.
      return data(
        { linked: true },
        await flash(request, success("Linked email"))
      );
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
      console.error(
        "[addEmailVerify] updateUserById failed, rolling back",
        authError
      );
      await unlinkIdentity(userId, "email", email);
      return data(
        {},
        await flash(request, error(null, "Failed to link email"))
      );
    }
    await serviceRole.from("user").update({ email }).eq("id", userId);
    return data(
      { linked: true },
      await flash(request, success("Linked email"))
    );
  }

  return null;
}

export default function AccountProfile() {
  const { t } = useLingui();
  const { user, passkeys, identities, enabledMethods, linkError } =
    useLoaderData<typeof loader>();
  const deleteFetcher = useFetcher();
  const renameFetcher = useFetcher();
  const { revalidate } = useRevalidator();
  const passkeysEnabled = isAuthProviderEnabled("passkey");

  // OAuth link failures redirect back with ?linkError=; toast it (deferred one
  // tick so the Toaster subscribes first) and strip the param.
  useEffect(() => {
    if (!linkError) return;
    const id = setTimeout(() => toast.error(linkError), 0);
    const params = new URLSearchParams(window.location.search);
    if (params.has("linkError")) {
      params.delete("linkError");
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (qs ? `?${qs}` : "")
      );
    }
    return () => clearTimeout(id);
  }, [linkError]);
  const [registering, setRegistering] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<Passkey | null>(null);
  const [editedName, setEditedName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const onAddPasskey = async () => {
    if (!passkeysEnabled) {
      toast.error(t`Passkeys are disabled`);
      return;
    }
    setRegistering(true);
    try {
      const optRes = await fetch("/api/passkey/register/options", {
        method: "POST"
      });

      if (!optRes.ok) throw new Error(t`Failed to get options`);
      const options = await optRes.json();

      const credential = await startRegistration({
        optionsJSON: options
      } as any);

      const verifyRes = await fetch("/api/passkey/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential)
      });

      if (!verifyRes.ok) {
        const body = await verifyRes.json().catch(() => ({}));
        throw new Error(body.message ?? "Registration failed");
      }

      const result = await verifyRes.json();
      const credentialName = result.credentialName ?? t`Passkey`;
      toast.success(t`${credentialName} registered`);
      revalidate();
    } catch (e: any) {
      if (e?.name !== "NotAllowedError" && e?.name !== "AbortError") {
        toast.error(e.message ?? t`Failed to register passkey`);
      }
    } finally {
      setRegistering(false);
    }
  };

  const openPasskeyDrawer = (pk: Passkey) => {
    setSelectedPasskey(pk);
    setEditedName(pk.credentialName);
  };

  const closePasskeyDrawer = () => {
    setSelectedPasskey(null);
    setEditedName("");
  };

  const onRenamePasskey = () => {
    if (!selectedPasskey) return;
    const formData = new FormData();
    formData.append("intent", "renamePasskey");
    formData.append("credentialId", selectedPasskey.id);
    formData.append("credentialName", editedName);
    renameFetcher.submit(formData, { method: "post" });
    closePasskeyDrawer();
    revalidate();
  };

  const onConfirmDelete = () => {
    if (!confirmDeleteId) return;
    const formData = new FormData();
    formData.append("intent", "deletePasskey");
    formData.append("credentialId", confirmDeleteId);
    deleteFetcher.submit(formData, { method: "post" });
    setConfirmDeleteId(null);
    closePasskeyDrawer();
  };

  return (
    <VStack spacing={4} className="pb-6">
      <LoginMethodsForm
        identities={identities}
        enabledMethods={enabledMethods}
        wechatName={[user.firstName, user.lastName].filter(Boolean).join(" ")}
      />
      <ProfileForm user={user} />

      {passkeysEnabled && (
        <Card>
          <CardHeader>
            <HStack className="justify-between">
              <div>
                <CardTitle>
                  <Trans>Passkeys</Trans>
                </CardTitle>
                <CardDescription>
                  <Trans>
                    Sign in with biometrics instead of a magic link. Passkeys
                    are secured by Face ID, Touch ID, or your device PIN.
                  </Trans>
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={onAddPasskey}
                isDisabled={registering}
                isLoading={registering}
                leftIcon={<LuFingerprint className="size-4" />}
              >
                <Trans>Add Passkey</Trans>
              </Button>
            </HStack>
          </CardHeader>
          <CardContent>
            {passkeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                <Trans>No passkeys registered yet.</Trans>
              </p>
            ) : (
              <HStack spacing={2}>
                {passkeys.map((pk) => {
                  const createdAt = new Date(pk.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    }
                  );
                  const lastUsedAt = pk.lastUsedAt
                    ? new Date(pk.lastUsedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })
                    : null;

                  return (
                  <HStack
                    key={pk.id}
                    className="justify-between p-3 rounded-md border border-border space-x-4 cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => openPasskeyDrawer(pk)}
                  >
                    <HStack spacing={3} className="items-start">
                      <LuFingerprint className="size-4 text-muted-foreground shrink-0 mt-1" />
                      <VStack spacing={0}>
                        <p className="text-sm font-medium">
                          {pk.credentialName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <Trans>Added {createdAt}</Trans>
                          {pk.lastUsedAt && (
                            <>
                              {" · "}
                              <Trans>Last used {lastUsedAt}</Trans>
                            </>
                          )}
                          {pk.backedUp && (
                            <>
                              {" · "}
                              <Trans>Synced</Trans>
                            </>
                          )}
                        </p>
                      </VStack>
                    </HStack>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(pk.id);
                      }}
                      aria-label={t`Delete passkey`}
                      type="button"
                      variant="ghost"
                      icon={<LuTrash2 />}
                      className="cursor-pointer"
                    />
                  </HStack>
                  );
                })}
              </HStack>
            )}
          </CardContent>
        </Card>
      )}

      <Modal
        open={!!selectedPasskey}
        onOpenChange={(open) => {
          if (!open) closePasskeyDrawer();
        }}
      >
        <ModalContent size="small">
          <ModalHeader>
            <ModalTitle>
              <Trans>Edit Passkey</Trans>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4} className="w-full">
              <VStack className="w-full" spacing={0}>
                <label className="text-sm font-medium mb-1 block">
                  <Trans>Name</Trans>
                </label>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder={t`Passkey name`}
                />
              </VStack>
              {selectedPasskey && (
                <VStack spacing={1} className="w-full">
                  <p className="text-xs text-muted-foreground">
                    <Trans>
                      Added{" "}
                      {new Date(selectedPasskey.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </Trans>
                  </p>
                  {selectedPasskey.lastUsedAt && (
                    <p className="text-xs text-muted-foreground">
                      <Trans>
                        Last used{" "}
                        {new Date(
                          selectedPasskey.lastUsedAt
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </Trans>
                    </p>
                  )}
                  {selectedPasskey.backedUp && (
                    <p className="text-xs text-muted-foreground">
                      <Trans>Synced</Trans>
                    </p>
                  )}
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={closePasskeyDrawer}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="button"
              onClick={onRenamePasskey}
              isDisabled={
                !editedName.trim() ||
                editedName === selectedPasskey?.credentialName
              }
            >
              <Trans>Save</Trans>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        open={!!confirmDeleteId}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
      >
        <ModalContent size="small">
          <ModalHeader>
            <ModalTitle>
              <Trans>Delete Passkey</Trans>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <Trans>
              Are you sure you want to delete this passkey? You won't be able
              to use it to sign in anymore.
            </Trans>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmDeleteId(null)}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirmDelete}
              isLoading={deleteFetcher.state !== "idle"}
              isDisabled={deleteFetcher.state !== "idle"}
            >
              <Trans>Delete</Trans>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
