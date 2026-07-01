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
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { LuMail, LuPhone, LuTrash2 } from "react-icons/lu";
import { SiGoogle, SiWechat } from "react-icons/si";
import { useFetcher, useRevalidator } from "react-router";
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

  // React to each add-fetcher response exactly once. Keying on a ref (not on
  // draft) avoids acting on stale data — e.g. a previous link left
  // `{ linked: true }` on the fetcher, which would otherwise close a freshly
  // opened draft the moment you click Connect again.
  const handledAddData = useRef<unknown>(null);
  useEffect(() => {
    if (addFetcher.state !== "idle" || !addFetcher.data) return;
    if (handledAddData.current === addFetcher.data) return;
    handledAddData.current = addFetcher.data;

    if (
      addFetcher.data.step === "addPhoneSent" ||
      addFetcher.data.step === "addEmailSent"
    ) {
      setDraft((d) => (d && d.step === "enter" ? { ...d, step: "code" } : d));
    } else if (addFetcher.data.linked) {
      setDraft(null);
    }
  }, [addFetcher.state, addFetcher.data]);

  const onLinkOAuth = async (provider: "google" | "azure") => {
    const { error } = await carbonClient.auth.linkIdentity({
      provider,
      options: { redirectTo: `${window.location.origin}/callback` }
    });
    if (error) toast.error(error.message);
  };

  const revalidator = useRevalidator();
  const wechatFetcher = useFetcher<{ url: string | null; scene?: string | null }>();
  const [wechatOpen, setWechatOpen] = useState(false);
  const wechatScene = wechatFetcher.data?.scene ?? null;

  // In the WeChat in-app browser, connecting is an OAuth redirect; on desktop we
  // show a QR to scan (mirrors WeChat login).
  const onConnectWeChat = () => {
    setDraft(null);
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      window.location.href = `/auth/wechat?link=1&redirectTo=${encodeURIComponent(
        path.to.profile
      )}`;
      return;
    }
    setWechatOpen(true);
    wechatFetcher.load("/api/wechat-qr-url?link=1");
  };

  // While the QR is shown, poll the scene; the webhook links it once scanned.
  useEffect(() => {
    if (!wechatOpen || !wechatScene) return;
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/wechat-qr-status?scene=${encodeURIComponent(wechatScene)}`
        );
        if (!res.ok || !active) return;
        const json = (await res.json()) as { status: string; reason?: string };
        if (json.status === "linked") {
          setWechatOpen(false);
          revalidator.revalidate();
        } else if (json.status === "link_failed") {
          setWechatOpen(false);
          toast.error(
            json.reason === "conflict"
              ? t`That WeChat is already linked to another account`
              : t`Failed to link WeChat`
          );
        } else if (json.status === "expired") {
          setWechatOpen(false);
        }
      } catch {
        // transient — keep polling
      }
    };
    const id = setInterval(poll, 2000);
    poll();
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [wechatOpen, wechatScene, revalidator, t]);

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
            const wechatPanelOpen = method === "wechat" && wechatOpen;
            // Can't add a second email-family method once one is linked.
            const blockedByEmail = EMAIL_FAMILY.has(method) && hasEmailFamily;

            return (
              <div key={method} className="w-full rounded-lg border border-border">
                <HStack className="w-full justify-between p-3">
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
                      onClick={() => {
                        setWechatOpen(false);
                        setDraft({
                          method: method as "email" | "phone",
                          step: "enter",
                          contact: "",
                          code: ""
                        });
                      }}
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
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={onConnectWeChat}
                    >
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
                      className="border-t border-border p-3"
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

                {wechatPanelOpen && (
                  <VStack
                    spacing={2}
                    className="items-center border-t border-border p-3"
                  >
                    {wechatFetcher.state === "loading" ||
                    !wechatFetcher.data ? (
                      <p className="text-sm text-muted-foreground">
                        <Trans>Loading…</Trans>
                      </p>
                    ) : wechatFetcher.data.url ? (
                      <>
                        <div className="rounded-xl bg-white p-3">
                          <QRCodeSVG
                            value={wechatFetcher.data.url}
                            size={160}
                            className="block"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <Trans>Scan with WeChat to connect</Trans>
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-red-500">
                        <Trans>WeChat is unavailable right now</Trans>
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setWechatOpen(false)}
                    >
                      <Trans>Cancel</Trans>
                    </Button>
                  </VStack>
                )}
              </div>
            );
          })}
        </VStack>
      </CardContent>
    </Card>
  );
}
