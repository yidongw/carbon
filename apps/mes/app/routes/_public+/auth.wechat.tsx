import { AUTH_PROVIDERS } from "@carbon/auth";
import {
  buildWeChatMpAuthUrl,
  buildWeChatOpenAuthUrl
} from "@carbon/auth/wechat.server";
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
  const userAgent = request.headers.get("user-agent") ?? "";
  const isWeChatBrowser = /MicroMessenger/i.test(userAgent);

  const state = crypto.randomUUID();

  const authUrl = isWeChatBrowser
    ? buildWeChatMpAuthUrl(state)
    : buildWeChatOpenAuthUrl(state);

  const session = await wechatStateStorage.getSession();
  session.set("state", state);
  session.set("redirectTo", redirectTo);
  session.set("type", isWeChatBrowser ? "mp" : "open");

  return redirect(authUrl, {
    headers: {
      "Set-Cookie": await wechatStateStorage.commitSession(session)
    }
  });
}

export default function WeChatAuthRoute() {
  return null;
}
