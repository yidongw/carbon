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
exports.default = AuthenticationPage;
var code_block_1 = require("@/components/api/code-block");
var doc_1 = require("@/components/api/doc");
var page_footer_1 = require("@/components/api/page-footer");
var highlight_1 = require("@/lib/highlight");
exports.metadata = {
    title: "Authentication — Carbon API",
    description: "Create a scoped API key and authenticate requests with a bearer token."
};
var REQUEST = "curl 'https://rest.carbon.ms/item?limit=1' \\\n  -H \"Authorization: Bearer <api-key>\"";
function Row(_a) {
    var cells = _a.cells, cols = _a.cols, _b = _a.head, head = _b === void 0 ? false : _b;
    return (<div className="grid border-t border-[#E3E3DF] first:border-t-0" style={{ gridTemplateColumns: cols }}>
      {cells.map(function (c, i) { return (<div key={i} className={"px-[12px] py-[9px] text-[14px] leading-[150%] ".concat(head ? "font-[560] text-[#262323]" : "text-[rgba(38,35,35,0.82)]", " ").concat(i > 0 ? "border-l border-[#E3E3DF]" : "")}>
          {c}
        </div>); })}
    </div>);
}
function Table(_a) {
    var children = _a.children;
    return (<div className="my-[18px] overflow-hidden rounded-[10px] border border-[#E3E3DF]">
      {children}
    </div>);
}
function AuthenticationPage() {
    return __awaiter(this, void 0, void 0, function () {
        var html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, highlight_1.highlight)(REQUEST, "curl")];
                case 1:
                    html = _a.sent();
                    return [2 /*return*/, (<doc_1.DocPage>
      <doc_1.DocEyebrow>REST API</doc_1.DocEyebrow>
      <doc_1.DocTitle>Authentication</doc_1.DocTitle>
      <doc_1.Lead>
        Carbon authenticates public API requests with a scoped, optionally
        expiring API key.
      </doc_1.Lead>
      <doc_1.P>
        Create a key in{" "}
        <doc_1.DocLink href="https://app.carbon.ms/x/settings/api-keys">
          Settings → API Keys
        </doc_1.DocLink>
        , then send it on every request as a bearer token:{" "}
        <doc_1.Code>Authorization: Bearer &lt;api-key&gt;</doc_1.Code>.
      </doc_1.P>
      <code_block_1.CodeBlock html={html} code={REQUEST} label="Example request"/>

      <doc_1.H2 id="creating-a-key">Creating a key</doc_1.H2>
      <doc_1.P>
        Choosing <strong>New API Key</strong> opens a dialog with three fields:
      </doc_1.P>
      <Table>
        <Row head cols="120px 1fr 84px" cells={["Field", "Description", "Required"]}/>
        <Row cols="120px 1fr 84px" cells={[
                                "Name",
                                "A label to identify the key in your list. Not sent with requests.",
                                "Yes"
                            ]}/>
        <Row cols="120px 1fr 84px" cells={[
                                "Expires At",
                                "Date the key stops working. Leave blank for a key that never expires.",
                                "No"
                            ]}/>
        <Row cols="120px 1fr 84px" cells={[
                                "Permissions",
                                "A grid of every module against View / Create / Update / Delete. The key can only perform the actions you check.",
                                "Yes"
                            ]}/>
      </Table>
      <doc_1.Warn title="The key is shown only once">
        Copy the <doc_1.Code>crbn_…</doc_1.Code> token when it is generated — Carbon stores
        only a hash and cannot show it again. Keep it server-side; it carries
        every permission you grant. Lost a key? Delete it and create a new one.
      </doc_1.Warn>

      <doc_1.H2 id="permissions">Permissions</doc_1.H2>
      <doc_1.P>
        Each checkbox grants one action on one module. The action maps to the
        HTTP method of the request:
      </doc_1.P>
      <Table>
        <Row head cols="110px 1fr 96px" cells={["Action", "Grants", "Method"]}/>
        <Row cols="110px 1fr 96px" cells={["View", "Read rows", <doc_1.Code key="g">GET</doc_1.Code>]}/>
        <Row cols="110px 1fr 96px" cells={["Create", "Insert rows", <doc_1.Code key="p">POST</doc_1.Code>]}/>
        <Row cols="110px 1fr 96px" cells={["Update", "Modify rows", <doc_1.Code key="pa">PATCH</doc_1.Code>]}/>
        <Row cols="110px 1fr 96px" cells={["Delete", "Remove rows", <doc_1.Code key="d">DELETE</doc_1.Code>]}/>
      </Table>
      <doc_1.P>
        Reading from <doc_1.Code>/item</doc_1.Code>, for example, needs{" "}
        <strong>Parts → View</strong>. A request for an action the key does not
        hold returns <doc_1.Code>403</doc_1.Code>. Some modules omit actions they do not
        support (Accounting has no Delete, shown as <doc_1.Code>--</doc_1.Code>).
      </doc_1.P>

      <doc_1.H2 id="expiration">Expiration & errors</doc_1.H2>
      <doc_1.P>
        If a key is past its <strong>Expires At</strong> date, requests fail
        with <doc_1.Code>401</doc_1.Code> before anything runs. Other authentication
        failures:
      </doc_1.P>
      <Table>
        <Row head cols="72px 1fr" cells={["Status", "When it happens"]}/>
        <Row cols="72px 1fr" cells={[
                                <doc_1.Code key="a">401</doc_1.Code>,
                                "Missing or invalid key, or the key has expired."
                            ]}/>
        <Row cols="72px 1fr" cells={[
                                <doc_1.Code key="b">403</doc_1.Code>,
                                "The key lacks the required module permission (or the company is on the Starter plan)."
                            ]}/>
        <Row cols="72px 1fr" cells={[
                                <doc_1.Code key="c">429</doc_1.Code>,
                                "Rate limit exceeded — back off and retry per the X-RateLimit-* response headers."
                            ]}/>
      </Table>

      <page_footer_1.ContentFooter prev={{ label: "Introduction", url: "/api-reference" }}/>
    </doc_1.DocPage>)];
            }
        });
    });
}
