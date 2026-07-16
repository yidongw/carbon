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
exports.default = PrintJobsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var jobs_1 = require("@carbon/jobs");
var printing_1 = require("@carbon/printing");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, _d, limit, offset, filters, status, origin, sourceDocument, contentType, result;
        var _e, _f, _g, _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, filters = _d.filters;
                    status = (_e = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "status"; })) === null || _e === void 0 ? void 0 : _e.value;
                    origin = (_f = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "origin"; })) === null || _f === void 0 ? void 0 : _f.value;
                    sourceDocument = (_g = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "sourceDocument"; })) === null || _g === void 0 ? void 0 : _g.value;
                    contentType = (_h = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "contentType"; })) === null || _h === void 0 ? void 0 : _h.value;
                    return [4 /*yield*/, (0, printing_1.getPrintJobs)(client, companyId, {
                            status: status,
                            origin: origin,
                            sourceDocument: sourceDocument,
                            contentType: contentType,
                            search: search,
                            limit: limit,
                            offset: offset
                        })];
                case 2:
                    result = _l.sent();
                    return [2 /*return*/, {
                            jobs: ((_j = result.data) !== null && _j !== void 0 ? _j : []),
                            count: (_k = result.count) !== null && _k !== void 0 ? _k : 0
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, intent, _d, validation, _e, _f, _g, printJobId, overrideUrl, original, originalMeta, _h, _j, _k, _l, newJob, _m, _o, e_1, _p, _q, printJobId, _r, _s, result, _t, _u, _v, _w, printJobId, content;
        var _x, _y;
        var request = _b.request;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings"
                        })];
                case 1:
                    _c = _z.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _z.sent();
                    intent = formData.get("intent");
                    _d = intent;
                    switch (_d) {
                        case "reprint": return [3 /*break*/, 3];
                        case "delete": return [3 /*break*/, 19];
                        case "viewContent": return [3 /*break*/, 26];
                    }
                    return [3 /*break*/, 28];
                case 3:
                    validation = printing_1.reprintValidator.safeParse(Object.fromEntries(formData));
                    if (!!validation.success) return [3 /*break*/, 5];
                    _e = react_router_1.data;
                    _f = [{ success: false, message: "Invalid reprint request" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid reprint request"))];
                case 4: return [2 /*return*/, _e.apply(void 0, _f.concat([_z.sent()]))];
                case 5:
                    _g = validation.data, printJobId = _g.printJobId, overrideUrl = _g.printerUrl;
                    return [4 /*yield*/, (0, printing_1.getPrintJobContent)(client, printJobId, companyId)];
                case 6:
                    original = _z.sent();
                    return [4 /*yield*/, (0, printing_1.getPrintJob)(client, printJobId, companyId)];
                case 7:
                    originalMeta = _z.sent();
                    if (!(original.error ||
                        !original.data ||
                        originalMeta.error ||
                        !originalMeta.data)) return [3 /*break*/, 9];
                    _h = react_router_1.data;
                    _j = [{ success: false, message: "Failed to load print job" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)((_x = original.error) !== null && _x !== void 0 ? _x : originalMeta.error, "Failed to load print job"))];
                case 8: return [2 /*return*/, _h.apply(void 0, _j.concat([_z.sent()]))];
                case 9:
                    if (!(!original.data.content || !original.data.contentType)) return [3 /*break*/, 11];
                    _k = react_router_1.data;
                    _l = [{ success: false, message: "Cannot reprint a job with no content" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Cannot reprint a job that is still generating"))];
                case 10: return [2 /*return*/, _k.apply(void 0, _l.concat([_z.sent()]))];
                case 11: return [4 /*yield*/, (0, printing_1.createPrintJob)(client, {
                        companyId: companyId,
                        contentType: original.data.contentType,
                        content: original.data.content,
                        printerUrl: overrideUrl || originalMeta.data.printerUrl,
                        sourceDocument: originalMeta.data.sourceDocument,
                        sourceDocumentId: originalMeta.data.sourceDocumentId,
                        sourceDocumentReadableId: (_y = originalMeta.data.sourceDocumentReadableId) !== null && _y !== void 0 ? _y : undefined,
                        description: originalMeta.data.description,
                        status: "queued",
                        origin: "reprint",
                        createdBy: userId
                    })];
                case 12:
                    newJob = _z.sent();
                    if (!(newJob.error || !newJob.data)) return [3 /*break*/, 14];
                    _m = react_router_1.data;
                    _o = [{ success: false, message: "Failed to create reprint job" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(newJob.error, "Failed to create reprint"))];
                case 13: return [2 /*return*/, _m.apply(void 0, _o.concat([_z.sent()]))];
                case 14:
                    _z.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job-deliver", {
                            printJobId: newJob.data.id,
                            companyId: companyId
                        })];
                case 15:
                    _z.sent();
                    return [3 /*break*/, 17];
                case 16:
                    e_1 = _z.sent();
                    console.error("Failed to trigger delivery:", e_1);
                    return [3 /*break*/, 17];
                case 17:
                    _p = react_router_1.data;
                    _q = [{ success: true, message: "Reprint job created" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Reprint job created"))];
                case 18: return [2 /*return*/, _p.apply(void 0, _q.concat([_z.sent()]))];
                case 19:
                    printJobId = formData.get("printJobId");
                    if (!!printJobId) return [3 /*break*/, 21];
                    _r = react_router_1.data;
                    _s = [{ success: false, message: "Print job ID required" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Print job ID required"))];
                case 20: return [2 /*return*/, _r.apply(void 0, _s.concat([_z.sent()]))];
                case 21: return [4 /*yield*/, client
                        .from("printJob")
                        .delete()
                        .eq("id", printJobId)
                        .eq("companyId", companyId)];
                case 22:
                    result = _z.sent();
                    if (!result.error) return [3 /*break*/, 24];
                    _t = react_router_1.data;
                    _u = [{ success: false, message: result.error.message }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to delete job"))];
                case 23: return [2 /*return*/, _t.apply(void 0, _u.concat([_z.sent()]))];
                case 24:
                    _v = react_router_1.data;
                    _w = [{ success: true, message: "Print job deleted" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Print job deleted"))];
                case 25: return [2 /*return*/, _v.apply(void 0, _w.concat([_z.sent()]))];
                case 26:
                    printJobId = formData.get("printJobId");
                    if (!printJobId)
                        return [2 /*return*/, { success: false, message: "Print job ID required" }];
                    return [4 /*yield*/, (0, printing_1.getPrintJobContent)(client, printJobId, companyId)];
                case 27:
                    content = _z.sent();
                    if (content.error || !content.data)
                        return [2 /*return*/, { success: false, message: "Failed to load content" }];
                    return [2 /*return*/, {
                            success: true,
                            content: content.data.content,
                            contentType: content.data.contentType,
                            printJobId: content.data.id
                        }];
                case 28: return [2 /*return*/, { success: false, message: "Unknown intent" }];
            }
        });
    });
}
function PrintJobsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), jobs = _a.jobs, count = _a.count;
    var navigate = (0, react_router_1.useNavigate)();
    (0, hooks_1.useRealtime)("printJob");
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open) {
                navigate(path_1.path.to.printingSettings);
            }
        }}>
      <react_1.DrawerContent size="full">
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>Print Jobs</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody className="p-0">
          <settings_1.PrintJobsTable jobs={jobs} count={count}/>
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
