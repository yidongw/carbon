"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = ApiIntroPage;
var code_block_1 = require("@/components/api/code-block");
var doc_1 = require("@/components/api/doc");
var page_footer_1 = require("@/components/api/page-footer");
var sdk_cards_1 = require("@/components/api/sdk-cards");
var api_data_1 = require("@/lib/api-data");
var highlight_1 = require("@/lib/highlight");
exports.metadata = {
    title: "Introduction — Carbon API",
    description: "The Carbon REST API — every table and view is an endpoint."
};
var ENV = "# .env\nCARBON_API_URL=".concat(api_data_1.apiBase, "\nCARBON_API_KEY=<your-api-key>");
var INIT = "import { createClient } from '@supabase/supabase-js'\n\nconst apiUrl = process.env.CARBON_API_URL\nconst apiKey = process.env.CARBON_API_KEY\n\nexport const carbon = createClient(apiUrl, apiKey)";
function ApiIntroPage() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, env, init;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, highlight_1.highlight)(ENV, "curl"),
                        (0, highlight_1.highlight)(INIT, "javascript")
                    ])];
                case 1:
                    _a = _b.sent(), env = _a[0], init = _a[1];
                    return [2 /*return*/, (<doc_1.DocPage>
      <doc_1.DocEyebrow>REST API</doc_1.DocEyebrow>
      <doc_1.DocTitle>Introduction</doc_1.DocTitle>
      <doc_1.Lead>
        The Carbon API is a REST interface over your manufacturing data — every
        table and view is an endpoint, with full read and write access.
      </doc_1.Lead>
      <doc_1.P>
        There are three ways to call it: directly over HTTP, through the{" "}
        <doc_1.DocLink href="#client-libraries">JavaScript SDK</doc_1.DocLink>, or from the{" "}
        <doc_1.DocLink href="/mcp">MCP server</doc_1.DocLink>. Start by creating an{" "}
        <doc_1.DocLink href="/api-reference/authentication">API key</doc_1.DocLink>.
      </doc_1.P>

      <doc_1.H2 id="client-libraries">Client libraries</doc_1.H2>
      <doc_1.P>
        Carbon's API is standard REST, so it works from any language. The
        recommended client is the JavaScript SDK, built on{" "}
        <doc_1.Code>supabase-js</doc_1.Code>.
      </doc_1.P>
      <sdk_cards_1.SdkCards />

      <doc_1.H2 id="quickstart">Quickstart</doc_1.H2>
      <doc_1.P>Save your key and the API URL as environment variables:</doc_1.P>
      <code_block_1.CodeBlock html={env} code={ENV} label=".env"/>
      <doc_1.P>Then initialize the client:</doc_1.P>
      <code_block_1.CodeBlock html={init} code={INIT} label="lib/carbon.ts"/>
      <doc_1.P>
        You can now query any resource with <doc_1.Code>carbon.from('…')</doc_1.Code>. Pick
        a resource from the sidebar for its endpoints and ready-to-copy samples
        — pointed at your configured instance.
      </doc_1.P>

      <page_footer_1.ContentFooter next={{ label: "Authentication", url: "/api-reference/authentication" }}/>
    </doc_1.DocPage>)];
            }
        });
    });
}
