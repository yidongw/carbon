import { requirePermissions } from "@carbon/auth/auth.server";
import { redis } from "@carbon/kv";
import { type ActionFunctionArgs } from "react-router";
import {
  executeFunction,
  type ExecutorContext
} from "~/routes/api+/mcp+/lib/direct-executor";
import type { PendingProposal } from "./agents/unified-agent";

const proposalKey = (id: string) => `ai:proposal:${id}`;

export async function action({ request }: ActionFunctionArgs) {
  const { client, userId, companyId, companyGroupId } =
    await requirePermissions(request, {});

  const { proposalId } = (await request.json()) as { proposalId?: string };
  if (!proposalId) {
    return Response.json({ error: "proposalId is required" }, { status: 400 });
  }

  const raw = await redis.get(proposalKey(proposalId));
  if (!raw) {
    return Response.json(
      { error: "Proposal not found or expired. Ask the agent to propose again." },
      { status: 404 }
    );
  }

  const proposal: PendingProposal = JSON.parse(raw);

  if (proposal.userId !== userId || proposal.companyId !== companyId) {
    return Response.json(
      { error: "Not authorized for this proposal" },
      { status: 403 }
    );
  }

  // Consume the proposal up-front so a double-click can't run it twice.
  await redis.del(proposalKey(proposalId));

  const executorCtx: ExecutorContext = {
    client,
    companyId,
    companyGroupId,
    userId
  };

  const results: Array<{
    name: string;
    description: string;
    success: boolean;
    data?: unknown;
    error?: string;
  }> = [];

  for (const change of proposal.changes) {
    try {
      const result = await executeFunction(
        change.name,
        executorCtx,
        change.arguments
      );

      if (!result.success) {
        results.push({
          name: change.name,
          description: change.description,
          success: false,
          error: result.error
        });
        continue;
      }

      const data = result.data;
      if (data && typeof data === "object" && "error" in data && (data as any).error) {
        results.push({
          name: change.name,
          description: change.description,
          success: false,
          error: JSON.stringify((data as any).error)
        });
        continue;
      }

      results.push({
        name: change.name,
        description: change.description,
        success: true,
        data:
          data && typeof data === "object" && "data" in data
            ? (data as any).data
            : data
      });
    } catch (err) {
      results.push({
        name: change.name,
        description: change.description,
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.length - succeeded;

  return Response.json({
    proposalId,
    title: proposal.title,
    summary: proposal.summary,
    succeeded,
    failed,
    results
  });
}
