"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var production_service_1 = require("~/modules/production/production.service");
var settings_server_1 = require("~/modules/settings/settings.server");
var integrationMetadataParser = zod_1.z.object({
    processes: zod_1.z.array(zod_1.z.string())
});
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, integration, metadata, processes, result, jobDocumentsCache_1, serviceRole_1, enrichedData;
        var _this = this;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _d.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, settings_server_1.getCompanyIntegration)(client, companyId, "radan")];
                case 2:
                    integration = _d.sent();
                    if (!integration) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, error: "Integration not active" }, { status: 400 })];
                    }
                    metadata = integrationMetadataParser.safeParse(integration.metadata);
                    if (!metadata.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, error: "Invalid metadata" }, { status: 400 })];
                    }
                    processes = metadata.data.processes;
                    if (!params.version) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, error: "Version is required" }, { status: 400 })];
                    }
                    if (!(params.version === "v1")) return [3 /*break*/, 5];
                    return [4 /*yield*/, client.rpc("get_radan_v1", {
                            company_id: companyId,
                            processes: processes
                        })];
                case 3:
                    result = _d.sent();
                    if (result.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, error: result.error.message }, { status: 500 })];
                    }
                    jobDocumentsCache_1 = new Map();
                    serviceRole_1 = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all(result.data.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var documents;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!item.jobId) return [3 /*break*/, 4];
                                        documents = void 0;
                                        if (!jobDocumentsCache_1.has(item.jobId)) return [3 /*break*/, 1];
                                        documents = jobDocumentsCache_1.get(item.jobId);
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, (0, production_service_1.getJobDocuments)(serviceRole_1, companyId, {
                                            id: item.jobId,
                                            salesOrderLineId: item.salesOrderLineId,
                                            itemId: item.itemId
                                        })];
                                    case 2:
                                        documents = _a.sent();
                                        jobDocumentsCache_1.set(item.jobId, documents);
                                        _a.label = 3;
                                    case 3: return [2 /*return*/, __assign(__assign({}, item), { documents: documents })];
                                    case 4: return [2 /*return*/, item];
                                }
                            });
                        }); }))];
                case 4:
                    enrichedData = _d.sent();
                    return [2 /*return*/, { success: true, data: enrichedData }];
                case 5: return [2 /*return*/, {
                        success: false,
                        error: "version ".concat(params.version, " is invalid")
                    }];
            }
        });
    });
}
