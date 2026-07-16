"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var toolName = process.argv[2];
if (!toolName) {
    console.error("Error: Tool name is required");
    console.log("Usage: pnpm run tool:new <toolName>");
    console.log("Example: pnpm run tool:new getPart");
    process.exit(1);
}
// Convert toolName to kebab-case for file name
var fileName = toolName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
var TOOLS_DIR = (0, path_1.join)(process.cwd(), "apps", "erp", "app", "routes", "api+", "ai+", "chat+", "tools");
if (!(0, fs_1.existsSync)(TOOLS_DIR)) {
    console.error("Error: Tools directory not found at ".concat(TOOLS_DIR));
    process.exit(1);
}
var toolFilePath = (0, path_1.join)(TOOLS_DIR, "".concat(fileName, ".ts"));
if ((0, fs_1.existsSync)(toolFilePath)) {
    console.error("Error: Tool file already exists at ".concat(toolFilePath));
    process.exit(1);
}
var toolTemplate = "import { tool } from \"ai\";\nimport { LuSearch } from \"react-icons/lu\";\nimport { z } from \"zod\";\nimport type { ToolConfig } from \"../agents/shared/tools\";\nimport type { ChatContext } from \"../agents/shared/context\";\n\nexport const config: ToolConfig = {\n  name: \"".concat(toolName, "\",\n  icon: LuSearch,\n  displayText: \"Processing ").concat(toolName, "\",\n  message: \"Processing ").concat(toolName.toLowerCase(), "...\",\n};\n\nexport const ").concat(toolName, "Schema = z.object({\n  // Add your schema properties here\n});\n\nexport const ").concat(toolName, "Tool = tool({\n  description: \"Description of what this tool does\",\n  inputSchema: ").concat(toolName, "Schema,\n  execute: async function (args, executionOptions) {\n    const context = executionOptions.experimental_context as ChatContext;\n\n    // TODO: Implement tool logic here\n\n    return {\n      message: \"Hello from ").concat(toolName, "!\",\n    };\n  },\n});\n");
try {
    (0, fs_1.writeFileSync)(toolFilePath, toolTemplate, "utf-8");
    console.log("\u2705 Successfully created tool at ".concat(toolFilePath));
    console.log("\nNext steps:");
    console.log("1. Edit ".concat(toolFilePath, " to implement your tool logic"));
    console.log("2. Update the schema in ".concat(toolName, "Schema"));
    console.log("3. Update the description and execute function");
    console.log("4. Change the icon if needed (from react-icons/lu)");
}
catch (error) {
    console.error("Failed to create tool file:", error);
    process.exit(1);
}
