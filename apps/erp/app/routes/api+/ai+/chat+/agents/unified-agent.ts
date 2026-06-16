import { openai } from "@ai-sdk/openai";
import { redis } from "@carbon/kv";
import { tool } from "ai";
import { z } from "zod";
import {
  executeFunction,
  type ExecutorContext
} from "~/routes/api+/mcp+/lib/direct-executor";
import toolMetadata from "~/routes/api+/mcp+/lib/tool-metadata.json";
import { createAgent } from "./shared/agent";
import type { ChatContext } from "./shared/context";
import { COMMON_AGENT_RULES, formatContextForLLM } from "./shared/prompts";

type ToolMeta = {
  name: string;
  description: string;
  module: string;
  classification: "READ" | "WRITE" | "DESTRUCTIVE";
  schema?: unknown;
};

const TOOLS = toolMetadata.tools as ToolMeta[];

function getClassification(name: string): ToolMeta["classification"] | null {
  return TOOLS.find((t) => t.name === name)?.classification ?? null;
}

const searchToolsTool = tool({
  description:
    "Discover available ERP tools by name, description, or module. Always call this first before attempting a task you haven't done before.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("Search term matching tool names or descriptions"),
    module: z.string().optional().describe("Filter by module name"),
    classification: z
      .enum(["READ", "WRITE", "DESTRUCTIVE"])
      .optional()
      .describe("Filter by operation type"),
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).default(0)
  }),
  execute: async ({ query, module, classification, limit = 20, offset = 0 }) => {
    let results = TOOLS as ToolMeta[];

    if (module)
      results = results.filter((t) =>
        t.module.toLowerCase().includes(module.toLowerCase())
      );
    if (classification)
      results = results.filter((t) => t.classification === classification);
    if (query) {
      const q = query.toLowerCase();
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      results = results.filter((t) => {
        const text = `${t.name} ${t.description} ${t.module}`.toLowerCase();
        return text.includes(q) || words.some((w) => text.includes(w));
      });
      results.sort((a, b) => {
        const aText = `${a.name} ${a.description} ${a.module}`.toLowerCase();
        const bText = `${b.name} ${b.description} ${b.module}`.toLowerCase();
        const aFull = aText.includes(q) ? 1 : 0;
        const bFull = bText.includes(q) ? 1 : 0;
        return bFull - aFull;
      });
    }

    const paginated = results.slice(offset, offset + limit);
    return {
      total: results.length,
      showing: paginated.length,
      tools: paginated.map((t) => ({
        name: t.name,
        description: t.description,
        module: t.module,
        classification: t.classification
      }))
    };
  }
});

const describeToolTool = tool({
  description:
    "Get the full input schema and description for a specific ERP tool before calling it.",
  inputSchema: z.object({
    name: z.string().describe("Exact tool name from search_tools results")
  }),
  execute: async ({ name }) => {
    const found = TOOLS.find((t) => t.name === name);
    if (!found) return { error: `Tool '${name}' not found` };
    return {
      name: found.name,
      module: found.module,
      classification: found.classification,
      description: found.description,
      schema: found.schema
    };
  }
});

const callToolTool = tool({
  description:
    "Execute a READ-only ERP tool. Use this for fetching/listing/searching data. WRITE and DESTRUCTIVE tools are rejected here — use propose_writes for those.",
  inputSchema: z.object({
    name: z.string().describe("Exact tool name"),
    arguments: z
      .record(z.any())
      .optional()
      .describe("Tool arguments (omit companyId/userId — auto-filled)")
  }),
  execute: async ({ name, arguments: args }, executionOptions) => {
    const classification = getClassification(name);
    if (classification === "WRITE" || classification === "DESTRUCTIVE") {
      return {
        error: `Tool '${name}' is ${classification} and cannot be executed directly. Use propose_writes to ask the user for confirmation first.`
      };
    }

    const ctx = executionOptions?.experimental_context as ChatContext;
    const executorCtx: ExecutorContext = {
      client: ctx.client,
      companyId: ctx.companyId,
      companyGroupId: ctx.companyGroupId,
      userId: ctx.userId
    };

    const result = await executeFunction(name, executorCtx, args ?? {});

    if (!result.success) return { error: result.error };

    const data = result.data;
    if (data && typeof data === "object" && "data" in data) {
      const d = data as { data: unknown; error?: unknown; count?: number };
      if (d.error) return { error: JSON.stringify(d.error) };
      return { data: d.data, count: d.count };
    }
    return { data };
  }
});

export type PendingProposalChange = {
  name: string;
  arguments: Record<string, unknown>;
  description: string;
  module: string;
  classification: "WRITE" | "DESTRUCTIVE";
};

export type PendingProposal = {
  id: string;
  chatId: string;
  userId: string;
  companyId: string;
  title: string;
  summary: string;
  changes: PendingProposalChange[];
  createdAt: string;
};

const PROPOSAL_TTL_SECONDS = 60 * 60; // 1h
const proposalKey = (id: string) => `ai:proposal:${id}`;

const proposeWritesTool = tool({
  description:
    "Stage one or more WRITE or DESTRUCTIVE ERP operations for the user to confirm. Use this for anything that creates, updates, or deletes data. Bundle every related write (e.g. a purchase order header plus its line items) into a single call so the user sees them as one batch. The tools are NOT executed yet — the user reviews a card and clicks Confirm. After calling this, stop and wait for their decision; do not call call_tool or anything else.",
  inputSchema: z.object({
    title: z
      .string()
      .describe(
        "Short title for the confirmation card, e.g. 'Create part Widget-X' or 'Create PO with 5 line items'"
      ),
    summary: z
      .string()
      .describe(
        "One-sentence plain-language description of what will happen if confirmed"
      ),
    changes: z
      .array(
        z.object({
          name: z.string().describe("Exact tool name from search_tools"),
          arguments: z
            .record(z.any())
            .describe(
              "Arguments to pass to the tool (omit companyId/userId — auto-filled at execution time)"
            ),
          description: z
            .string()
            .describe(
              "One-line description of this specific change in plain language"
            )
        })
      )
      .min(1)
      .max(20)
      .describe("List of WRITE/DESTRUCTIVE operations to stage")
  }),
  execute: async ({ title, summary, changes }, executionOptions) => {
    const ctx = executionOptions?.experimental_context as ChatContext;

    // Validate every change refers to a known WRITE/DESTRUCTIVE tool
    const enriched: PendingProposalChange[] = [];
    for (const c of changes) {
      const meta = TOOLS.find((t) => t.name === c.name);
      if (!meta) {
        return {
          error: `Tool '${c.name}' not found. Use search_tools to discover the correct name.`
        };
      }
      if (meta.classification !== "WRITE" && meta.classification !== "DESTRUCTIVE") {
        return {
          error: `Tool '${c.name}' is ${meta.classification}, not WRITE/DESTRUCTIVE. Use call_tool for READ operations.`
        };
      }
      enriched.push({
        name: c.name,
        arguments: c.arguments,
        description: c.description,
        module: meta.module,
        classification: meta.classification
      });
    }

    const id = `prop_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;

    const proposal: PendingProposal = {
      id,
      chatId: ctx.chatId,
      userId: ctx.userId,
      companyId: ctx.companyId,
      title,
      summary,
      changes: enriched,
      createdAt: new Date().toISOString()
    };

    await redis.setex(
      proposalKey(id),
      PROPOSAL_TTL_SECONDS,
      JSON.stringify(proposal)
    );

    return {
      status: "awaiting_confirmation" as const,
      proposalId: id,
      title,
      summary,
      changes: enriched
    };
  }
});

export const unifiedAgent = createAgent({
  name: "assistant",
  model: openai.chat("gpt-5-mini"),
  temperature: 0.3,
  modelSettings: {
    parallel_tool_calls: false
  },
  instructions: (ctx) => `You are an AI assistant for ${ctx.companyName}, a manufacturing ERP system.

You have four tools:
- search_tools: discover tools by name/description/module/classification
- describe_tool: get the input schema for a specific tool
- call_tool: execute a READ-only tool (fetch/list/search). WRITE/DESTRUCTIVE tools are rejected here.
- propose_writes: stage one or more WRITE/DESTRUCTIVE operations for the user to confirm

Workflow for READ tasks ("show me…", "list…", "find…"):
1. search_tools → describe_tool (if needed) → call_tool
2. Summarize results for the user

Workflow for WRITE/DESTRUCTIVE tasks ("create…", "add…", "update…", "delete…", "submit…", "approve…"):
1. search_tools → describe_tool to confirm parameters
2. Gather every related change (e.g. a purchase order header and all its line items) into one propose_writes call
3. After propose_writes returns, STOP. Tell the user briefly that you've staged the changes and they should review the card. DO NOT call any further tools. The user will click Confirm or Cancel.
4. Wait for the next user turn. They will tell you the result.

NEVER call a WRITE/DESTRUCTIVE tool through call_tool — it will be rejected.
NEVER call propose_writes for READ operations.
NEVER call any tool after propose_writes in the same turn — let the user respond first.

Module guide (use exact module names when filtering search_tools):
- items: parts, services, tools, consumables, unit of measure, materials, configurations
- purchasing: purchase orders, suppliers, RFQs, supplier quotes
- sales: customers, quotes, orders, invoices
- inventory: stock, locations, receipts, transfers, shelf life
- production: jobs, work orders, work cells, operations
- accounting: ledger, journal entries, fixed assets, cost centers
- quality: inspections, specs, non-conformances
- people: employees, contractors, departments
- resources: equipment, work centers, calendars
- settings: company config, document templates, numbering
- documents: file attachments

<background-data>
${formatContextForLLM(ctx)}
</background-data>

${COMMON_AGENT_RULES}`,
  tools: {
    search_tools: searchToolsTool,
    describe_tool: describeToolTool,
    call_tool: callToolTool,
    propose_writes: proposeWritesTool
  },
  handoffs: [],
  maxTurns: 20,
  lastMessages: 100
});
