import { openai } from "@ai-sdk/openai";
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
    let results = toolMetadata.tools as Array<{
      name: string;
      description: string;
      module: string;
      classification: string;
    }>;

    if (module)
      results = results.filter((t) =>
        t.module.toLowerCase().includes(module.toLowerCase())
      );
    if (classification)
      results = results.filter((t) => t.classification === classification);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.module.toLowerCase().includes(q)
      );
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
    const found = (
      toolMetadata.tools as Array<{
        name: string;
        module: string;
        classification: string;
        description: string;
        schema: unknown;
      }>
    ).find((t) => t.name === name);
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
    "Execute any ERP tool. companyId, userId, and createdBy are auto-injected — do not pass them manually.",
  inputSchema: z.object({
    name: z.string().describe("Exact tool name"),
    arguments: z
      .record(z.any())
      .optional()
      .describe("Tool arguments (omit companyId/userId — auto-filled)")
  }),
  execute: async ({ name, arguments: args }, executionOptions) => {
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

export const unifiedAgent = createAgent({
  name: "assistant",
  model: openai("gpt-4o"),
  temperature: 0.3,
  instructions: (ctx) => `You are an AI assistant for ${ctx.companyName}, a manufacturing ERP system.

You have full access to the ERP via three tools:
- search_tools: discover tools by name/description/module/classification
- describe_tool: get the input schema for a specific tool
- call_tool: execute any tool (companyId/userId auto-injected)

Workflow for any task:
1. Use search_tools to find relevant tools
2. Use describe_tool if you need to understand the parameters
3. Use call_tool to execute

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
    call_tool: callToolTool
  },
  handoffs: [],
  maxTurns: 20
});
