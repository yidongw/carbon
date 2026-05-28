import { AUTH_PROVIDERS } from "@carbon/auth";
import { buildWeChatOpenAuthUrl } from "@carbon/auth/wechat.server";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { wechatStateStorage } from "~/services/wechat-state.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const providers = AUTH_PROVIDERS.split(",");
  if (!providers.includes("wechat")) {
    return data({ url: null }, { status: 404 });
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") ?? "";

  const state = crypto.randomUUID();
  const authUrl = buildWeChatOpenAuthUrl(state);

  const session = await wechatStateStorage.getSession();
  session.set("state", state);
  session.set("redirectTo", redirectTo);
  session.set("type", "open");

  return data(
    { url: authUrl },
    {
      headers: {
        "Set-Cookie": await wechatStateStorage.commitSession(session)
      }
    }
  );
}
