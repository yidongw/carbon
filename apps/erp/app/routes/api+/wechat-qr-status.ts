import { AUTH_PROVIDERS, safeRedirect } from "@carbon/auth";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { redis } from "@carbon/kv";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { createWeChatAuthSession } from "~/services/wechat-session.server";
import { path } from "~/utils/path";

const SCENE_PREFIX = "wechat-qr:";

/**
 * Poll endpoint for the QR scan-login. While pending → { status: "pending" }.
 * Once the webhook marks the scene authed, mint the session (Set-Cookie) and
 * return the redirect target for the browser to navigate to.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const providers = AUTH_PROVIDERS.split(",");
  if (!providers.includes("wechat")) {
    return data({ status: "disabled" as const }, { status: 404 });
  }

  const url = new URL(request.url);
  const scene = url.searchParams.get("scene") ?? "";
  const redirectTo = url.searchParams.get("redirectTo") ?? "";
  if (!scene) return data({ status: "expired" as const });

  const key = `${SCENE_PREFIX}${scene}`;
  const raw = await redis.get(key);
  if (!raw) return data({ status: "expired" as const });

  const parsed = JSON.parse(raw as string) as {
    status: "pending" | "authed";
    userId?: string;
  };

  if (parsed.status !== "authed" || !parsed.userId) {
    return data({ status: "pending" as const });
  }

  // Authed — load the user row, mint the session, and clear the scene.
  const serviceRole = getCarbonServiceRole();
  const { data: user } = await serviceRole
    .from("user")
    .select("id, wechat_unionid")
    .eq("id", parsed.userId)
    .single();

  if (!user) return data({ status: "expired" as const });

  const headers = await createWeChatAuthSession(request, user);
  if (!headers) {
    // Keep the scene so the next poll can retry rather than silently dropping it.
    return data({ status: "pending" as const });
  }
  await redis.del(key);

  return data(
    {
      status: "authed" as const,
      redirectTo: safeRedirect(redirectTo, path.to.authenticatedRoot)
    },
    { headers }
  );
}
