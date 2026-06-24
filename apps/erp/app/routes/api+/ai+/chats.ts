import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { memoryProvider } from "./chat+/agents/shared/agent";

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await requirePermissions(request, {});

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? undefined;
  const limit = Number(url.searchParams.get("limit") ?? 50);

  const chats = await memoryProvider.getChats({ userId, search, limit });

  return Response.json({ chats });
}

export async function action({ request }: ActionFunctionArgs) {
  const { userId } = await requirePermissions(request, {});

  if (request.method !== "DELETE") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { chatId } = await request.json();
  if (!chatId || typeof chatId !== "string") {
    return Response.json({ error: "chatId required" }, { status: 400 });
  }

  // Verify ownership before deleting
  const chat = await memoryProvider.getChat?.(chatId);
  if (!chat) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  if (chat.userId && chat.userId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await memoryProvider.deleteChat?.(chatId);

  return Response.json({ ok: true });
}
