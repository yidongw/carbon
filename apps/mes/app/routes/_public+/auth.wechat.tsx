import { AUTH_PROVIDERS } from "@carbon/auth";
import { buildWeChatMpAuthUrl } from "@carbon/auth/wechat.server";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { wechatStateStorage } from "~/services/wechat-state.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const providers = AUTH_PROVIDERS.split(",");
  if (!providers.includes("wechat")) {
    throw new Response("WeChat auth not enabled", { status: 404 });
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") ?? "";
  const state = crypto.randomUUID();
  // Behind the tunnel the local server sees http; trust the forwarded proto so the
  // redirect_uri is the public https URL WeChat will accept.
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    url.protocol.replace(":", "");
  const authUrl = buildWeChatMpAuthUrl(state, `${proto}://${url.host}`);

  const session = await wechatStateStorage.getSession();
  session.set("state", state);
  session.set("redirectTo", redirectTo);

  return redirect(authUrl, {
    headers: {
      "Set-Cookie": await wechatStateStorage.commitSession(session)
    }
  });
}

export default function WeChatAuthRoute() {
  return null;
}
