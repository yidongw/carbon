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
exports.loader = loader;
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, operationId, url, page, summaryOnly, _d, summary, summaryError, result;
        var _e;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, companyId = _c.companyId;
                    operationId = params.operationId;
                    if (!operationId)
                        throw (0, auth_1.notFound)("operationId not found");
                    url = new URL(request.url);
                    page = Number((_e = url.searchParams.get("page")) !== null && _e !== void 0 ? _e : "1");
                    summaryOnly = url.searchParams.get("summary") === "true";
                    if (!summaryOnly) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, production_1.getOperationQuantitySummary)(client, operationId, companyId)];
                case 2:
                    _d = _f.sent(), summary = _d.data, summaryError = _d.error;
                    if (summaryError) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                error: summaryError instanceof Error
                                    ? summaryError.message
                                    : String(summaryError)
                            }, { status: 500 })];
                    }
                    return [2 /*return*/, { summary: summary }];
                case 3: return [4 /*yield*/, (0, production_1.listJobOperationSupplierQuantityReportsForOperation)(client, {
                        jobOperationId: operationId,
                        companyId: companyId,
                        page: Number.isFinite(page) ? page : 1
                    })];
                case 4:
                    result = _f.sent();
                    if (result.error) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                error: result.error instanceof Error
                                    ? result.error.message
                                    : String(result.error)
                            }, { status: 500 })];
                    }
                    return [2 /*return*/, {
                            reports: result.data,
                            count: result.count,
                            hasMore: result.hasMore
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, operationId, _d, operation, operationError, viewClient, job, body, parsed, _e, supplierProcessId, notes, lines, operationUnitCost, operationMinimumCost, snapshotPricingEdited, result;
        var _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "production"
                        })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    operationId = params.operationId;
                    if (!operationId)
                        throw (0, auth_1.notFound)("operationId not found");
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobId")
                            .eq("id", operationId)
                            .eq("companyId", companyId)
                            .single()];
                case 2:
                    _d = _g.sent(), operation = _d.data, operationError = _d.error;
                    if (operationError || !(operation === null || operation === void 0 ? void 0 : operation.jobId)) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Operation not found" }, { status: 404 })];
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "production"
                        })];
                case 3:
                    viewClient = (_g.sent()).client;
                    return [4 /*yield*/, viewClient
                            .from("job")
                            .select("status")
                            .eq("id", operation.jobId)
                            .single()];
                case 4:
                    job = (_g.sent()).data;
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, production_1.isJobLocked)(job === null || job === void 0 ? void 0 : job.status),
                            redirectTo: "/x/job/".concat(operation.jobId),
                            message: "Cannot modify a locked job. Reopen it first."
                        })];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, request.json()];
                case 6:
                    body = _g.sent();
                    parsed = production_1.createJobOperationSupplierQuantityReportValidator.safeParse(body);
                    if (!parsed.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: parsed.error.flatten() }, { status: 400 })];
                    }
                    _e = parsed.data, supplierProcessId = _e.supplierProcessId, notes = _e.notes, lines = _e.lines, operationUnitCost = _e.operationUnitCost, operationMinimumCost = _e.operationMinimumCost, snapshotPricingEdited = _e.snapshotPricingEdited;
                    return [4 /*yield*/, (0, production_1.createJobOperationSupplierQuantityReport)(client, {
                            companyId: companyId,
                            jobId: operation.jobId,
                            jobOperationId: operationId,
                            supplierProcessId: supplierProcessId,
                            userId: userId,
                            notes: notes !== null && notes !== void 0 ? notes : null,
                            lines: lines,
                            snapshotPricing: operationUnitCost != null
                                ? {
                                    operationUnitCost: operationUnitCost,
                                    operationMinimumCost: operationMinimumCost !== null && operationMinimumCost !== void 0 ? operationMinimumCost : 0
                                }
                                : undefined,
                            snapshotPricingEdited: snapshotPricingEdited === true
                        })];
                case 7:
                    result = _g.sent();
                    if (result.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: (_f = result.error.message) !== null && _f !== void 0 ? _f : "Failed to create report" }, { status: 500 })];
                    }
                    return [2 /*return*/, { report: result.data }];
            }
        });
    });
}
