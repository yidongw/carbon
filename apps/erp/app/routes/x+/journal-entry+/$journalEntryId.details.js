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
exports.action = action;
exports.default = JournalEntryDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var accounting_1 = require("~/modules/accounting");
var JournalEntries_1 = require("~/modules/accounting/ui/JournalEntries");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, companyGroupId, journalEntryId, formData, intent, postingDate, description, linesJson, _d, _e, lines, _f, _g, _h, _i, lines_1, line, _j, _k, _l, _m, saveResult, _o, _p, postResult, _q, _r, _s, _t, _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "accounting"
                        })];
                case 1:
                    _c = _w.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId, companyGroupId = _c.companyGroupId;
                    journalEntryId = params.journalEntryId;
                    if (!journalEntryId)
                        throw new Error("Could not find journalEntryId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _w.sent();
                    intent = formData.get("intent");
                    postingDate = formData.get("postingDate");
                    description = formData.get("description");
                    linesJson = formData.get("lines");
                    if (!!postingDate) return [3 /*break*/, 4];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Posting date is required"))];
                case 3: return [2 /*return*/, _d.apply(void 0, _e.concat([_w.sent()]))];
                case 4:
                    _w.trys.push([4, 5, , 7]);
                    lines = JSON.parse(linesJson);
                    return [3 /*break*/, 7];
                case 5:
                    _f = _w.sent();
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid lines data"))];
                case 6: return [2 /*return*/, _g.apply(void 0, _h.concat([_w.sent()]))];
                case 7:
                    _i = 0, lines_1 = lines;
                    _w.label = 8;
                case 8:
                    if (!(_i < lines_1.length)) return [3 /*break*/, 13];
                    line = lines_1[_i];
                    if (!!line.accountId) return [3 /*break*/, 10];
                    _j = react_router_1.data;
                    _k = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Each line must have an account"))];
                case 9: return [2 /*return*/, _j.apply(void 0, _k.concat([_w.sent()]))];
                case 10:
                    if (!((line.debit <= 0 && line.credit <= 0) ||
                        (line.debit > 0 && line.credit > 0))) return [3 /*break*/, 12];
                    _l = react_router_1.data;
                    _m = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Each line must have either a debit or credit amount"))];
                case 11: return [2 /*return*/, _l.apply(void 0, _m.concat([_w.sent()]))];
                case 12:
                    _i++;
                    return [3 /*break*/, 8];
                case 13: return [4 /*yield*/, (0, accounting_1.saveJournalEntryWithLines)(client, {
                        journalEntryId: journalEntryId,
                        postingDate: postingDate,
                        description: description,
                        updatedBy: userId,
                        lines: lines,
                        companyId: companyId,
                        companyGroupId: companyGroupId
                    })];
                case 14:
                    saveResult = _w.sent();
                    if (!saveResult.error) return [3 /*break*/, 16];
                    _o = react_router_1.data;
                    _p = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(saveResult.error, "Failed to save journal entry"))];
                case 15: return [2 /*return*/, _o.apply(void 0, _p.concat([_w.sent()]))];
                case 16:
                    if (!(intent === "post")) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, accounting_1.postJournalEntry)(client, journalEntryId, userId)];
                case 17:
                    postResult = _w.sent();
                    if (!postResult.error) return [3 /*break*/, 19];
                    _q = react_router_1.data;
                    _r = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(postResult.error, "Failed to post journal entry"))];
                case 18: return [2 /*return*/, _q.apply(void 0, _r.concat([_w.sent()]))];
                case 19:
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.journalEntryDetails(journalEntryId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Journal entry posted"))];
                case 20: throw _s.apply(void 0, _t.concat([_w.sent()]));
                case 21:
                    _u = react_router_1.redirect;
                    _v = [path_1.path.to.journalEntryDetails(journalEntryId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Journal entry saved"))];
                case 22: throw _u.apply(void 0, _v.concat([_w.sent()]));
            }
        });
    });
}
function JournalEntryDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g;
    var journalEntryId = (0, react_router_1.useParams)().journalEntryId;
    if (!journalEntryId)
        throw new Error("Could not find journalEntryId");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.journalEntry(journalEntryId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.journalEntry))
        throw new Error("Could not find journal entry in routeData");
    var isPosted = routeData.journalEntry.status !== "Draft";
    var initialLines = ((_a = routeData.journalEntry.journalLine) !== null && _a !== void 0 ? _a : []).map(function (line) {
        var _a, _b, _c, _d;
        var amount = Number(line.amount);
        var accountClass = (_b = (_a = line.account) === null || _a === void 0 ? void 0 : _a.class) !== null && _b !== void 0 ? _b : "Asset";
        return {
            id: line.id,
            accountId: (_c = line.accountId) !== null && _c !== void 0 ? _c : "",
            description: (_d = line.description) !== null && _d !== void 0 ? _d : "",
            debit: (0, utils_1.toDisplayDebit)(amount, accountClass) || null,
            credit: (0, utils_1.toDisplayCredit)(amount, accountClass) || null,
            dimensions: []
        };
    });
    return (<JournalEntries_1.JournalEntryForm key={routeData.journalEntry.id} journalEntryId={journalEntryId} displayId={routeData.journalEntry.journalEntryId} status={routeData.journalEntry.status} sourceType={(_b = routeData.journalEntry.sourceType) !== null && _b !== void 0 ? _b : "Manual"} reversedById={routeData.journalEntry.reversedById} initialValues={{
            id: routeData.journalEntry.id,
            companyId: routeData.journalEntry.companyId,
            sourceType: (_c = routeData.journalEntry.sourceType) !== null && _c !== void 0 ? _c : "Manual",
            postingDate: routeData.journalEntry.postingDate,
            description: (_d = routeData.journalEntry.description) !== null && _d !== void 0 ? _d : ""
        }} initialLines={initialLines} companies={(_e = routeData.companies) !== null && _e !== void 0 ? _e : []} dimensions={(_f = routeData.dimensions) !== null && _f !== void 0 ? _f : []} lineDimensions={(_g = routeData.lineDimensions) !== null && _g !== void 0 ? _g : {}} isDisabled={isPosted}/>);
}
