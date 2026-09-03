import { requirePermissions } from "@carbon/auth/auth.server";
import { getUserClaims } from "@carbon/auth/users.server";
import { smoothStream } from "ai";
import type { ActionFunctionArgs } from "react-router";
import { createChatContext } from "./agents/shared/context";
import { unifiedAgent as orchestrationAgent } from "./agents/unified-agent";

// Resolve who is actually chatting — their real role name and which modules
// their permissions let them see — from the authenticated session (NOT from
// anything the user tells the assistant). This is injected into the prompt so
// the assistant knows who it's talking to and answers permission questions
// from the truth. Note: this is context for the model, not a security gate —
// the real access boundary is the user's JWT + row-level security on every
// tool call. Best-effort: never let a lookup failure break the chat.
async function resolveCurrentUser(
  client: Awaited<ReturnType<typeof requirePermissions>>["client"],
  userId: string,
  companyId: string
): Promise<{
  userRole: string | null;
  userViewableModules: string[];
  userEditableModules: string[];
}> {
  const empty = {
    userRole: null,
    userViewableModules: [],
    userEditableModules: []
  };

  try {
    const [roleResult, claims] = await Promise.all([
      client
        .from("employee")
        .select("employeeType:employeeTypeId(name)")
        .eq("id", userId)
        .eq("companyId", companyId)
        .single(),
      getUserClaims(userId, companyId)
    ]);

    const employeeType = roleResult.data?.employeeType as
      | { name?: string }
      | { name?: string }[]
      | null
      | undefined;
    const userRole = Array.isArray(employeeType)
      ? (employeeType[0]?.name ?? null)
      : (employeeType?.name ?? null);

    const allows = (arr?: string[]) =>
      Array.isArray(arr) && (arr.includes(companyId) || arr.includes("0"));

    const userViewableModules: string[] = [];
    const userEditableModules: string[] = [];
    for (const [moduleName, perm] of Object.entries(claims.permissions ?? {})) {
      const p = perm as {
        view?: string[];
        create?: string[];
        update?: string[];
        delete?: string[];
      };
      if (allows(p.view)) userViewableModules.push(moduleName);
      if (allows(p.create) || allows(p.update) || allows(p.delete)) {
        userEditableModules.push(moduleName);
      }
    }

    return { userRole, userViewableModules, userEditableModules };
  } catch {
    return empty;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { client, userId, companyId, companyGroupId } =
    await requirePermissions(request, {});

  const payload = await request.json();

  const {
    message,
    id,
    timezone,
    locale,
    agentChoice,
    toolChoice,
    country,
    city,
    fullName,
    companyName,
    baseCurrency
  } = payload;

  const { userRole, userViewableModules, userEditableModules } =
    await resolveCurrentUser(client, userId, companyId);

  const context = createChatContext({
    userId,
    companyId,
    companyGroupId,
    client,
    fullName,
    companyName,
    country,
    city,
    chatId: id,
    timezone,
    locale,
    baseCurrency,
    userRole,
    userViewableModules,
    userEditableModules
  });

  return orchestrationAgent.toUIMessageStream({
    message,
    context,
    agentChoice,
    toolChoice,
    strategy: "auto",
    maxRounds: 5,
    maxSteps: 20,
    experimental_transform: smoothStream({
      chunking: "word"
    }),
    sendSources: true
  });
}
