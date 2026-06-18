import { client } from "./client";

const TARGET_URL_ERP = process.env.TARGET_URL_ERP ?? "app.jilio.xyz";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function withWeChatProvider(authProviders: string | null): string {
  const providers = (authProviders ?? "email,google")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!providers.includes("wechat")) providers.push("wechat");
  return providers.join(",");
}

async function setWeChatCredentials(): Promise<void> {
  const appId = requireEnv("WECHAT_MP_APP_ID");
  const appSecret = requireEnv("WECHAT_MP_APP_SECRET");
  const webhookToken = requireEnv("WECHAT_WEBHOOK_TOKEN");

  const { data: workspace, error: fetchError } = await client
    .from("workspaces")
    .select("id, url_erp, auth_providers")
    .eq("url_erp", TARGET_URL_ERP)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch workspace: ${fetchError.message}`);
  }
  if (!workspace) {
    throw new Error(`No workspace found for url_erp=${TARGET_URL_ERP}`);
  }

  const authProviders = withWeChatProvider(workspace.auth_providers);

  const { error: updateError } = await client
    .from("workspaces")
    .update({
      auth_providers: authProviders,
      wechat_mp_app_id: appId,
      wechat_mp_app_secret: appSecret,
      wechat_webhook_token: webhookToken,
    })
    .eq("id", workspace.id);

  if (updateError) {
    throw new Error(`Failed to update workspace: ${updateError.message}`);
  }

  console.log(
    `✅ Updated workspace ${workspace.id} (${TARGET_URL_ERP}) with WeChat credentials`
  );
  console.log(`   auth_providers=${authProviders}`);
}

setWeChatCredentials().catch((error) => {
  console.error("🔴 Failed to set WeChat credentials", error);
  process.exit(1);
});
