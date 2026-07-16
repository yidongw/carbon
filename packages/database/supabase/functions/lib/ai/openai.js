"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
var openai_2_0_60_1 = require("npm:@ai-sdk/openai@2.0.60");
exports.openai = (0, openai_2_0_60_1.createOpenAI)({
    apiKey: (_a = Deno.env.get("OPENAI_API_KEY")) !== null && _a !== void 0 ? _a : "",
});
