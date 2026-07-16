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
exports.generateStaticParams = generateStaticParams;
exports.generateMetadata = generateMetadata;
exports.default = ResourcePage;
var navigation_1 = require("next/navigation");
var base_url_1 = require("@/components/api/base-url");
var endpoint_section_1 = require("@/components/api/endpoint-section");
var api_data_1 = require("@/lib/api-data");
function generateStaticParams() {
    return (0, api_data_1.allResourceParams)();
}
function generateMetadata(props) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, module, resource, found;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, props.params];
                case 1:
                    _a = _b.sent(), module = _a.module, resource = _a.resource;
                    found = (0, api_data_1.getResource)(module, resource);
                    return [2 /*return*/, {
                            title: found ? "".concat(found.resource.name, " \u2014 Carbon API") : "Carbon API",
                            description: found === null || found === void 0 ? void 0 : found.resource.description
                        }];
            }
        });
    });
}
function ResourcePage(props) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, module, resource, found, mod, r;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, props.params];
                case 1:
                    _a = _d.sent(), module = _a.module, resource = _a.resource;
                    found = (0, api_data_1.getResource)(module, resource);
                    if (!found)
                        (0, navigation_1.notFound)();
                    mod = found.module, r = found.resource;
                    return [2 /*return*/, (<div className="max-w-[1180px]">
      <p className="m-0 font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-[0.08em] text-[rgba(38,35,35,0.5)]">
        {mod.name}
      </p>
      <h1 className="m-0 mt-[8px] text-[34px] font-[560] leading-[120%] text-[#262323]">
        {r.name}
      </h1>
      <p className="m-0 mt-[12px] max-w-[640px] text-[16.5px] leading-[160%] text-[rgba(38,35,35,0.8)]">
        {r.description}
      </p>
      <base_url_1.BaseUrl path={(_c = (_b = r.endpoints[0]) === null || _b === void 0 ? void 0 : _b.path) !== null && _c !== void 0 ? _c : ""}/>

      {r.endpoints.map(function (e) { return (<endpoint_section_1.EndpointSection key={e.id} endpoint={e} base={api_data_1.apiBase}/>); })}
    </div>)];
            }
        });
    });
}
