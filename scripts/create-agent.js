"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var agentName = process.argv[2];
if (!agentName) {
    console.error("Error: Agent name is required");
    console.log("Usage: pnpm run agent:new <agentName>");
    console.log("Example: pnpm run agent:new inventory");
    process.exit(1);
}
// Convert agentName to kebab-case for file name
var fileName = agentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
var AGENTS_DIR = (0, path_1.join)(process.cwd(), "apps", "erp", "app", "routes", "api+", "ai+", "chat+", "agents");
if (!(0, fs_1.existsSync)(AGENTS_DIR)) {
    console.error("Error: Agents directory not found at ".concat(AGENTS_DIR));
    process.exit(1);
}
var agentFilePath = (0, path_1.join)(AGENTS_DIR, "".concat(fileName, "-agent.ts"));
if ((0, fs_1.existsSync)(agentFilePath)) {
    console.error("Error: Agent file already exists at ".concat(agentFilePath));
    process.exit(1);
}
// Convert to PascalCase for display name
var displayName = agentName.charAt(0).toUpperCase() +
    agentName.slice(1).replace(/([A-Z])/g, " $1");
var agentTemplate = "import { openai } from \"@ai-sdk/openai\";\nimport { createAgent } from \"./shared/agent\";\nimport { COMMON_AGENT_RULES, formatContextForLLM } from \"./shared/prompts\";\nimport type { AgentConfig } from \"./shared/tools\";\n\nexport const config: AgentConfig = {\n  name: \"".concat(agentName, "\",\n  displayName: \"").concat(displayName, " Agent\",\n  description: \"Description of what this agent does\",\n  executingMessage: \"Calling the ").concat(agentName, " agent...\",\n};\n\nexport const ").concat(agentName, "Agent = createAgent({\n  name: \"").concat(agentName, "\",\n  model: openai(\"gpt-4o\"),\n  temperature: 0.5,\n  instructions: (ctx) => `You are a ").concat(agentName, " specialist for ${ctx.companyName}.\n\n<background-data>\n${formatContextForLLM(ctx)}\n</background-data>\n\n${COMMON_AGENT_RULES}\n\n<capabilities>\n- Add your agent capabilities here\n</capabilities>`,\n  tools: {\n    // Add your tools here\n    // exampleTool: exampleToolTool,\n  },\n  handoffs: [],\n  maxTurns: 10,\n});\n");
try {
    (0, fs_1.writeFileSync)(agentFilePath, agentTemplate, "utf-8");
    console.log("\u2705 Successfully created agent at ".concat(agentFilePath));
    console.log("\nNext steps:");
    console.log("1. Edit ".concat(agentFilePath, " to implement your agent logic"));
    console.log("2. Add tools to the tools object");
    console.log("3. Update the instructions and capabilities");
    console.log("4. Configure handoffs to other agents if needed");
    console.log("5. Add the agent to the AgentStatus type in app/components/Chat/lib/types.ts");
    console.log("6. Import and add the agent to handoffs in orchestration-agent.ts if needed");
}
catch (error) {
    console.error("Failed to create agent file:", error);
    process.exit(1);
}
