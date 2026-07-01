import { carbonClient } from "@carbon/auth";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Input,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { LuMail, LuPhone, LuTrash2 } from "react-icons/lu";
import { SiGoogle, SiWechat } from "react-icons/si";
import { useFetcher } from "react-router";
import { path } from "~/utils/path";

type Method = "email" | "google" | "azure" | "phone" | "wechat";

type Identity = {
  id: string;
  type: string;
  value: string;
  verifiedAt: string | null;
  createdAt: string;
};

const META: Record<Method, { label: string; icon: React.ReactElement }> = {
  email: { label: "Email", icon: <LuMail className="size-4" /> },
  google: { label: "Google", icon: <SiGoogle className="size-4" /> },
  azure: { label: "Outlook", icon: <LuMail className="size-4" /> },
  phone: { label: "Phone", icon: <LuPhone className="size-4" /> },
  wechat: {
    label: "WeChat",
    icon: <SiWechat className="size-4" style={{ color: "#07C160" }} />
  }
};

const OTP_METHODS = new Set<Method>(["email", "phone"]);
const OAUTH_METHODS = new Set<Method>(["google", "azure"]);
// email / google / azure all resolve to the one account email, so once any is
// linked the others can't be added (you can only have one email address).
const EMAIL_FAMILY = new Set<Method>(["email", "google", "azure"]);

// This is the user's own account page, so show the real value. The WeChat value
// is an opaque unionid, so we omit it (the label alone is enough).
function displayValue(type: string, value: string) {
  return type === "wechat" ? "" : value;
}

type FetcherData = {
  success?: boolean;
  message?: string;
  step?: "addPhoneSent" | "addEmailSent";
  linked?: boolean;
};

type Draft = {
  method: "email" | "phone";
  step: "enter" | "code";
  contact: string;
  code: string;
};

export default function LoginMethodsForm({
  identities,
  enabledMethods
}: {
  identities: Identity[];
  enabledMethods: Method[];
}) {
  const { t } = useLingui();
  const addFetcher = useFetcher<FetcherData>();
  const removeFetcher = useFetcher();
  const [draft, setDraft] = useState<Draft | null>(null);

  const byType = new Map(identities.map((i) => [i.type, i]));
  const canRemove = identities.length > 1;
  const hasEmailFamily = identities.some((i) =>
    EMAIL_FAMILY.has(i.type as Method)
  );
  const busy = addFetcher.state !== "idle";
  const sentTo = draft?.contact ?? "";

  // Advance to the code step once a code is sent; close the form once linked.
  useEffect(() => {
    if (addFetcher.state !== "idle" || !addFetcher.data) return;
    if (
      (addFetcher.data.step === "addPhoneSent" ||
        addFetcher.data.step === "addEmailSent") &&
      draft?.step === "enter"
    ) {
      setDraft((d) => (d ? { ...d, step: "code" } : d));
    }
    if (addFetcher.data.linked) setDraft(null);
  }, [addFetcher.state, addFetcher.data, draft?.step]);

  const onLinkOAuth = async (provider: "google" | "azure") => {
    const { error } = await carbonClient.auth.linkIdentity({
      provider,
      options: { redirectTo: `${window.location.origin}/callback` }
    });
    if (error) toast.error(error.message);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans>Login methods</Trans>
        </CardTitle>
        <CardDescription>
          <Trans>Ways you can sign in. Only you can change these.</Trans>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VStack spacing={2}>
          {enabledMethods.map((method) => {
            const identity = byType.get(method);
            const meta = META[method];
            const draftOpen = draft?.method === method;
            // Can't add a second email-family method once one is linked.
            const blockedByEmail = EMAIL_FAMILY.has(method) && hasEmailFamily;

            return (
              <VStack key={method} spacing={2} className="w-full">
                <HStack className="w-full justify-between rounded-lg border border-border p-3">
                  <HStack spacing={2}>
                    {meta.icon}
                    <span className="text-sm font-medium">{meta.label}</span>
                    {identity && displayValue(method, identity.value) && (
                      <span className="text-sm text-muted-foreground">
                        {displayValue(method, identity.value)}
                      </span>
                    )}
                  </HStack>

                  {identity ? (
                    <removeFetcher.Form method="post" action={path.to.profile}>
                      <input type="hidden" name="intent" value="removeIdentity" />
                      <input type="hidden" name="type" value={identity.type} />
                      <input type="hidden" name="value" value={identity.value} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        isDisabled={!canRemove}
                        leftIcon={<LuTrash2 className="size-4" />}
                      >
                        <Trans>Remove</Trans>
                      </Button>
                    </removeFetcher.Form>
                  ) : OTP_METHODS.has(method) ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      isDisabled={blockedByEmail}
                      onClick={() =>
                        setDraft({
                          method: method as "email" | "phone",
                          step: "enter",
                          contact: "",
                          code: ""
                        })
                      }
                    >
                      <Trans>Connect</Trans>
                    </Button>
                  ) : OAUTH_METHODS.has(method) ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      isDisabled={blockedByEmail}
                      onClick={() => onLinkOAuth(method as "google" | "azure")}
                    >
                      <Trans>Connect</Trans>
                    </Button>
                  ) : (
                    <Button type="button" variant="secondary" size="sm" isDisabled>
                      <Trans>Connect</Trans>
                    </Button>
                  )}
                </HStack>

                {draftOpen && draft && (
                  <addFetcher.Form
                    method="post"
                    action={path.to.profile}
                    className="w-full"
                  >
                    <VStack
                      spacing={2}
                      className="rounded-lg border border-border p-3"
                    >
                      {draft.step === "enter" ? (
                        <>
                          <input
                            type="hidden"
                            name="intent"
                            value={
                              method === "phone" ? "addPhoneSend" : "addEmailSend"
                            }
                          />
                          <Input
                            name={method === "phone" ? "phone" : "email"}
                            placeholder={
                              method === "phone"
                                ? t`Phone Number`
                                : t`Email Address`
                            }
                            value={draft.contact}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, contact: e.target.value } : d
                              )
                            }
                          />
                        </>
                      ) : (
                        <>
                          <input
                            type="hidden"
                            name="intent"
                            value={
                              method === "phone"
                                ? "addPhoneVerify"
                                : "addEmailVerify"
                            }
                          />
                          <input
                            type="hidden"
                            name={method === "phone" ? "phone" : "email"}
                            value={draft.contact}
                          />
                          <p className="text-sm text-muted-foreground">
                            <Trans>We've sent a code to {sentTo}</Trans>
                          </p>
                          <Input
                            name="code"
                            placeholder={t`Verification code`}
                            value={draft.code}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, code: e.target.value } : d
                              )
                            }
                          />
                        </>
                      )}

                      {addFetcher.data?.success === false &&
                        addFetcher.data.message && (
                          <span className="text-sm text-red-500">
                            {addFetcher.data.message}
                          </span>
                        )}

                      <HStack spacing={2}>
                        <Button
                          type="submit"
                          size="sm"
                          isLoading={busy}
                          isDisabled={busy}
                        >
                          {draft.step === "enter" ? (
                            <Trans>Send code</Trans>
                          ) : (
                            <Trans>Verify & link</Trans>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDraft(null)}
                        >
                          <Trans>Cancel</Trans>
                        </Button>
                      </HStack>
                    </VStack>
                  </addFetcher.Form>
                )}
              </VStack>
            );
          })}
        </VStack>
      </CardContent>
    </Card>
  );
}
