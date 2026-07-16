"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = ProductionQuantitiesRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var productionQuantityDisplay_utils_1 = require("~/modules/production/productionQuantityDisplay.utils");
var ProductionQuantities_1 = require("~/modules/production/ui/ProductionQuantities");
var shared_1 = require("~/modules/shared");
var database_server_1 = require("~/services/database.server");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Process Completions"], ["Process Completions"]))),
    to: path_1.path.to.productionQuantities,
    module: "production"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, _d, limit, offset, sorts, filters, scope, status, search, serviceRole, _e, employeeOptions, employeeOptionsError, _f, jobOptions, itemOptions, operationOptions, filterOptionsError, _g, result, pendingLineData, pendingCountResult, baseRows, rows, itemIds, configurableItemIds;
        var _this = this;
        var _h, _j, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    scope = (0, production_1.resolveProductionQuantityPayScope)(filters);
                    status = (0, production_1.resolveProductionQuantityPayStatus)(filters);
                    search = searchParams.get("search");
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, client
                            .from("employeeSummary")
                            .select("id, name, avatarUrl")
                            .eq("companyId", companyId)
                            .order("name", { ascending: true })];
                case 2:
                    _e = _m.sent(), employeeOptions = _e.data, employeeOptionsError = _e.error;
                    return [4 /*yield*/, (0, production_1.getProductionQuantityReportFilterOptions)(client, companyId, serviceRole)];
                case 3:
                    _f = _m.sent(), jobOptions = _f.jobs, itemOptions = _f.items, operationOptions = _f.operations, filterOptionsError = _f.error;
                    if (employeeOptionsError) {
                        console.error("Failed to load employees for production quantity filters", employeeOptionsError);
                    }
                    if (filterOptionsError) {
                        console.error("Failed to load job/item filters for production quantities", filterOptionsError);
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getProductionQuantityReportPayRows)(client, companyId, scope, { search: search, limit: limit, offset: offset, sorts: sorts, filters: filters }, serviceRole),
                            serviceRole
                                .from("productionQuantity")
                                .select("reportId")
                                .eq("companyId", companyId)
                                .eq("type", "Production")
                                .is("paymentYear", null)
                                .is("invalidatedAt", null)
                                .not("reportId", "is", null)
                        ])];
                case 4:
                    _g = _m.sent(), result = _g[0], pendingLineData = _g[1];
                    pendingCountResult = {
                        count: new Set(((_h = pendingLineData.data) !== null && _h !== void 0 ? _h : [])
                            .map(function (l) { return l.reportId; })
                            .filter(function (id) { return Boolean(id); })).size
                    };
                    if (pendingLineData.error) {
                        console.error("Failed to load pending count", pendingLineData.error);
                    }
                    if (result.error) {
                        console.error("Failed to load production quantity rows", result.error);
                    }
                    baseRows = (_j = result.data) !== null && _j !== void 0 ? _j : [];
                    return [4 /*yield*/, Promise.all(baseRows.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                            var approvalRequestId, isPending, canApproveRow, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        approvalRequestId = row.approvalRequestId;
                                        isPending = row.approvalStatus === "Pending" && row.paymentYear == null;
                                        if (!(approvalRequestId && isPending)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                                                amount: row.amount,
                                                documentType: "productionQuantityReport",
                                                companyId: companyId
                                            }, userId)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = false;
                                        _b.label = 3;
                                    case 3:
                                        canApproveRow = _a;
                                        return [2 /*return*/, __assign(__assign({}, row), { canApprove: canApproveRow })];
                                }
                            });
                        }); }))];
                case 5:
                    rows = _m.sent();
                    itemIds = __spreadArray([], new Set(rows
                        .map(function (row) { return (0, productionQuantityDisplay_utils_1.getItemInternalId)(row); })
                        .filter(function (id) { return Boolean(id); })), true);
                    return [4 /*yield*/, (0, production_1.getItemIdsWithConfigurationParameters)(client, companyId, itemIds)];
                case 6:
                    configurableItemIds = _m.sent();
                    return [2 /*return*/, {
                            rows: rows,
                            count: (_k = result.count) !== null && _k !== void 0 ? _k : 0,
                            status: status,
                            pendingCount: (_l = pendingCountResult.count) !== null && _l !== void 0 ? _l : 0,
                            employees: (employeeOptions !== null && employeeOptions !== void 0 ? employeeOptions : []).filter(function (e) { return e.id != null; }),
                            jobs: jobOptions,
                            items: itemOptions,
                            operations: operationOptions,
                            configurableItemIds: configurableItemIds
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, url, year, month, formData, intent, approvalRequestId, serviceRole, _c, approvalRequest, fetchError, canApprove, db, reportId, linesJson, notes, parsedLines, lineValidation, _d, reportRow, reportRowError, amount, canAutoApprove, paymentYear, paymentMonth, update, requestedBy_1, e_1, result, requestedBy, e_2;
        var _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "people"
                        })];
                case 1:
                    userId = (_j.sent()).userId;
                    url = new URL(request.url);
                    year = Number((_e = url.searchParams.get("year")) !== null && _e !== void 0 ? _e : new Date().getFullYear());
                    month = Number((_f = url.searchParams.get("month")) !== null && _f !== void 0 ? _f : new Date().getMonth() + 1);
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    intent = formData.get("intent");
                    approvalRequestId = formData.get("approvalRequestId");
                    if (!approvalRequestId) {
                        return [2 /*return*/, { error: "Missing approvalRequestId" }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("approvalRequest")
                            .select("id, status, documentType, documentId, companyId, amount, requestedBy")
                            .eq("id", approvalRequestId)
                            .single()];
                case 3:
                    _c = _j.sent(), approvalRequest = _c.data, fetchError = _c.error;
                    if (fetchError || !approvalRequest) {
                        return [2 /*return*/, { error: "Approval request not found" }];
                    }
                    if (approvalRequest.documentType !== "productionQuantityReport") {
                        return [2 /*return*/, { error: "Invalid approval request type" }];
                    }
                    if (approvalRequest.status !== "Pending") {
                        return [2 /*return*/, { error: "Approval request is not pending" }];
                    }
                    return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                            amount: approvalRequest.amount,
                            documentType: approvalRequest.documentType,
                            companyId: approvalRequest.companyId
                        }, userId)];
                case 4:
                    canApprove = _j.sent();
                    if (!canApprove) {
                        return [2 /*return*/, { error: "You do not have permission to approve this request" }];
                    }
                    db = (0, database_server_1.getDatabaseClient)();
                    reportId = approvalRequest.documentId;
                    if (!(intent === "rejectWithCorrection")) return [3 /*break*/, 14];
                    linesJson = formData.get("lines");
                    notes = ((_g = formData.get("notes")) === null || _g === void 0 ? void 0 : _g.trim()) || null;
                    if (!linesJson) {
                        return [2 /*return*/, { error: "Missing quantity lines" }];
                    }
                    parsedLines = void 0;
                    try {
                        parsedLines = JSON.parse(linesJson);
                    }
                    catch (_k) {
                        return [2 /*return*/, { error: "Invalid quantity lines" }];
                    }
                    lineValidation = production_1.replaceProductionQuantityReportLinesValidator.safeParse({
                        notes: notes !== null && notes !== void 0 ? notes : undefined,
                        lines: parsedLines
                    });
                    if (!lineValidation.success) {
                        return [2 /*return*/, { error: "Invalid quantity lines" }];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("productionQuantityReport")
                            .select("employeeId")
                            .eq("id", reportId)
                            .eq("companyId", approvalRequest.companyId)
                            .single()];
                case 5:
                    _d = _j.sent(), reportRow = _d.data, reportRowError = _d.error;
                    if (reportRowError || !reportRow) {
                        return [2 /*return*/, { error: "Production quantity report not found" }];
                    }
                    return [4 /*yield*/, (0, production_1.computeProductionQuantityReportEarnedAmount)(serviceRole, reportId, approvalRequest.companyId)];
                case 6:
                    amount = _j.sent();
                    return [4 /*yield*/, (0, production_1.resolveProductionQuantityCanAutoApprove)(serviceRole, approvalRequest.companyId, userId, amount)];
                case 7:
                    canAutoApprove = _j.sent();
                    paymentYear = canAutoApprove ? year : null;
                    paymentMonth = canAutoApprove ? month : null;
                    return [4 /*yield*/, (0, production_1.replaceProductionQuantityReportLines)(serviceRole, {
                            reportId: reportId,
                            companyId: approvalRequest.companyId,
                            userId: userId,
                            notes: notes,
                            lines: lineValidation.data.lines.map(function (line) { return (__assign(__assign({}, line), { scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined })); }),
                            paymentYear: paymentYear,
                            paymentMonth: paymentMonth
                        })];
                case 8:
                    update = _j.sent();
                    if (update.error) {
                        return [2 /*return*/, { error: (_h = update.error.message) !== null && _h !== void 0 ? _h : "Failed to update quantities" }];
                    }
                    return [4 /*yield*/, (0, production_1.syncProductionQuantityReportApproval)(serviceRole, {
                            reportId: reportId,
                            companyId: approvalRequest.companyId,
                            userId: userId,
                            canAutoApprove: canAutoApprove,
                            paymentYear: paymentYear,
                            paymentMonth: paymentMonth
                        })];
                case 9:
                    _j.sent();
                    requestedBy_1 = approvalRequest.requestedBy;
                    if (!(requestedBy_1 && requestedBy_1 !== userId)) return [3 /*break*/, 13];
                    _j.label = 10;
                case 10:
                    _j.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: notifications_1.NotificationEvent.ApprovalRejected,
                            companyId: approvalRequest.companyId,
                            documentId: reportId,
                            documentType: "productionQuantityReport",
                            recipient: { type: "user", userId: requestedBy_1 },
                            from: userId
                        })];
                case 11:
                    _j.sent();
                    return [3 /*break*/, 13];
                case 12:
                    e_1 = _j.sent();
                    console.error("Failed to trigger approval decision notification", e_1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, { ok: true, report: update.data }];
                case 14: return [4 /*yield*/, (0, shared_1.approveRequest)(db, approvalRequestId, userId, undefined, {
                        productionPay: {
                            paymentYear: year,
                            paymentMonth: month,
                            supabaseClient: serviceRole
                        }
                    })];
                case 15:
                    result = _j.sent();
                    if (result.error)
                        return [2 /*return*/, { error: result.error.message }];
                    requestedBy = approvalRequest.requestedBy;
                    if (!(requestedBy && requestedBy !== userId)) return [3 /*break*/, 19];
                    _j.label = 16;
                case 16:
                    _j.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: notifications_1.NotificationEvent.ApprovalApproved,
                            companyId: approvalRequest.companyId,
                            documentId: reportId,
                            documentType: "productionQuantityReport",
                            recipient: { type: "user", userId: requestedBy },
                            from: userId
                        })];
                case 17:
                    _j.sent();
                    return [3 /*break*/, 19];
                case 18:
                    e_2 = _j.sent();
                    console.error("Failed to trigger approval decision notification", e_2);
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/, { ok: true }];
            }
        });
    });
}
function ProductionQuantitiesRoute() {
    var _a = (0, react_router_1.useLoaderData)(), rows = _a.rows, count = _a.count, status = _a.status, pendingCount = _a.pendingCount, employees = _a.employees, jobs = _a.jobs, items = _a.items, operations = _a.operations, configurableItemIds = _a.configurableItemIds;
    var location = (0, react_router_1.useLocation)();
    var submitAction = (0, react_2.useMemo)(function () {
        return location.search
            ? "".concat(location.pathname).concat(location.search)
            : location.pathname;
    }, [location.pathname, location.search]);
    return (<react_1.VStack spacing={0} className="h-full">
      <ProductionQuantities_1.ProductionQuantitiesTable data={rows} count={count} status={status} pendingCount={pendingCount} employees={employees} jobs={jobs} items={items} operations={operations} submitAction={submitAction} showCreateAction configurableItemIds={configurableItemIds}/>
    </react_1.VStack>);
}
var templateObject_1;
