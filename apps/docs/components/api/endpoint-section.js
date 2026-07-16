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
exports.EndpointSection = EndpointSection;
var highlight_1 = require("@/lib/highlight");
var code_panel_1 = require("./code-panel");
var fields_1 = require("./fields");
var method_badge_1 = require("./method-badge");
function EndpointSection(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, curl, javascript, python, go, responseHtml, bodyTitle;
        var endpoint = _b.endpoint, base = _b.base;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, highlight_1.highlight)(endpoint.samples.curl, "curl"),
                        (0, highlight_1.highlight)(endpoint.samples.javascript, "javascript"),
                        (0, highlight_1.highlight)(endpoint.samples.python, "python"),
                        (0, highlight_1.highlight)(endpoint.samples.go, "go"),
                        (0, highlight_1.highlight)(endpoint.response, "json"),
                    ])];
                case 1:
                    _c = _d.sent(), curl = _c[0], javascript = _c[1], python = _c[2], go = _c[3], responseHtml = _c[4];
                    bodyTitle = endpoint.kind === "create" || endpoint.kind === "update" ? "Body parameters" : "Attributes";
                    return [2 /*return*/, (<section id={endpoint.id} className="grid scroll-mt-[88px] grid-cols-1 gap-x-[56px] gap-y-[24px] border-t border-[#E7E7E3] py-[44px] lg:grid-cols-2">
      <div className="min-w-0">
        <div className="flex items-center gap-[10px]">
          <method_badge_1.MethodBadge method={endpoint.method}/>
          <code className="font-[family-name:var(--font-mono)] text-[13.5px] text-[rgba(38,35,35,0.63)]">
            {endpoint.path}
          </code>
        </div>
        <h2 className="m-0 mt-[14px] text-[24px] font-[560] leading-[130%] text-[#262323]">
          {endpoint.title}
        </h2>
        <p className="m-0 mt-[10px] text-[15.5px] leading-[160%] text-[rgba(38,35,35,0.8)]">
          {endpoint.description}
        </p>
        <fields_1.Fields title="Query parameters" query={endpoint.query}/>
        <fields_1.Fields title={bodyTitle} attributes={endpoint.attributes}/>
      </div>

      <div className="min-w-0">
        <code_panel_1.CodePanel samples={endpoint.samples} highlighted={{ curl: curl, javascript: javascript, python: python, go: go }} method={endpoint.method} fullPath={"".concat(base).concat(endpoint.path)} response={endpoint.response} responseHtml={responseHtml}/>
      </div>
    </section>)];
            }
        });
    });
}
