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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var notifications_1 = require("@carbon/ee/notifications");
var date_1 = require("@internationalized/date");
var supabase_js_1 = require("@supabase/supabase-js");
var react_router_1 = require("react-router");
var tiny_invariant_1 = require("tiny-invariant");
var quality_1 = require("~/modules/quality");
var quality_server_1 = require("~/modules/quality/quality.server");
var settings_server_1 = require("~/modules/settings/settings.server");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, formData, selectedIssueTypeId, createNcr, dispositionResult, _d, _e, _f, _g, serviceRole, _h, inspection, userDefaults, issueTypes, _j, _k, insp, issueType, locationId, _l, _m, supplierName, receiptReadableId, itemReadableId, inspectionReadableId, issueTitle, createResult, _o, _p, ncrId, scrapRowId, scrapRow, trackedEntityIds, receiptLineEntities, allLotEntityIds, entityQuantities, rows, tasks, _q, _r, integrations, err_1, _s, _t;
        var _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_18) {
            switch (_18.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality",
                            role: "employee"
                        })];
                case 1:
                    _c = _18.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.id;
                    (0, tiny_invariant_1.default)(id, "id is required");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _18.sent();
                    selectedIssueTypeId = ((_u = formData.get("nonConformanceTypeId")) === null || _u === void 0 ? void 0 : _u.trim()) || null;
                    createNcr = ((_v = formData.get("createNcr")) !== null && _v !== void 0 ? _v : "true") !== "false";
                    return [4 /*yield*/, (0, quality_server_1.dispositionInboundInspection)({
                            id: id,
                            decision: "Reject",
                            companyId: companyId,
                            dispositionedBy: userId
                        })];
                case 3:
                    dispositionResult = _18.sent();
                    if (!dispositionResult.error) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.inboundInspection(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(dispositionResult.error, "Failed to reject lot"))];
                case 4: throw _d.apply(void 0, _e.concat([_18.sent()]));
                case 5:
                    if (!!createNcr) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.inboundInspection(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Lot rejected"))];
                case 6: throw _f.apply(void 0, _g.concat([_18.sent()]));
                case 7: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 8:
                    serviceRole = _18.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, quality_1.getInboundInspection)(client, id),
                            (0, users_server_1.getUserDefaults)(client, userId, companyId),
                            (0, quality_1.getIssueTypesList)(client, companyId)
                        ])];
                case 9:
                    _h = _18.sent(), inspection = _h[0], userDefaults = _h[1], issueTypes = _h[2];
                    if (!(inspection.error || !inspection.data)) return [3 /*break*/, 11];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.inboundInspection(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(inspection.error, "Lot rejected, but failed to load it for NCR"))];
                case 10: throw _j.apply(void 0, _k.concat([_18.sent()]));
                case 11:
                    insp = inspection.data;
                    issueType = (_x = (_w = issueTypes.data) === null || _w === void 0 ? void 0 : _w.find(function (t) { return t.id === selectedIssueTypeId; })) !== null && _x !== void 0 ? _x : (_y = issueTypes.data) === null || _y === void 0 ? void 0 : _y[0];
                    locationId = (_0 = (_z = userDefaults.data) === null || _z === void 0 ? void 0 : _z.locationId) !== null && _0 !== void 0 ? _0 : null;
                    if (!(!issueType || !locationId)) return [3 /*break*/, 13];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.inboundInspection(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Lot rejected. Configure at least one Issue Type and a default user location to auto-create an NCR."))];
                case 12: throw _l.apply(void 0, _m.concat([_18.sent()]));
                case 13:
                    supplierName = (_2 = (_1 = insp.supplier) === null || _1 === void 0 ? void 0 : _1.name) !== null && _2 !== void 0 ? _2 : "supplier";
                    receiptReadableId = (_4 = (_3 = insp.receipt) === null || _3 === void 0 ? void 0 : _3.receiptId) !== null && _4 !== void 0 ? _4 : "";
                    itemReadableId = (_7 = (_6 = (_5 = insp.item) === null || _5 === void 0 ? void 0 : _5.readableId) !== null && _6 !== void 0 ? _6 : insp.itemReadableId) !== null && _7 !== void 0 ? _7 : insp.itemId;
                    inspectionReadableId = (_8 = insp.inboundInspectionId) !== null && _8 !== void 0 ? _8 : "";
                    issueTitle = [
                        "Rejected lot",
                        inspectionReadableId,
                        itemReadableId && "\u2014 ".concat(itemReadableId),
                        receiptReadableId && "on ".concat(receiptReadableId)
                    ]
                        .filter(Boolean)
                        .join(" ");
                    return [4 /*yield*/, (0, quality_1.insertIssue)(serviceRole, {
                            name: issueTitle,
                            description: "Auto-created from inbound inspection ".concat(inspectionReadableId, ". Lot size ").concat(insp.lotSize, ", sample ").concat(insp.sampleSize, ", Ac ").concat(insp.acceptanceNumber, " / Re ").concat(insp.rejectionNumber, ". Supplier: ").concat(supplierName, "."),
                            priority: "Medium",
                            source: "Internal",
                            locationId: locationId,
                            nonConformanceTypeId: issueType.id,
                            openDate: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            quantity: Number((_9 = insp.lotSize) !== null && _9 !== void 0 ? _9 : 0),
                            items: insp.itemId ? [insp.itemId] : [],
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 14:
                    createResult = _18.sent();
                    if (!(createResult.error || !createResult.data)) return [3 /*break*/, 16];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.inboundInspection(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createResult.error, "Lot rejected, but failed to create NCR"))];
                case 15: throw _o.apply(void 0, _p.concat([_18.sent()]));
                case 16:
                    ncrId = createResult.data.id;
                    scrapRowId = null;
                    if (!insp.itemId) return [3 /*break*/, 19];
                    return [4 /*yield*/, serviceRole
                            .from("nonConformanceItem")
                            .update({
                            quantity: Number((_10 = insp.lotSize) !== null && _10 !== void 0 ? _10 : 0),
                            disposition: "Scrap",
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("nonConformanceId", ncrId)
                            .eq("itemId", insp.itemId)];
                case 17:
                    _18.sent();
                    return [4 /*yield*/, serviceRole
                            .from("nonConformanceItem")
                            .select("id")
                            .eq("nonConformanceId", ncrId)
                            .eq("itemId", insp.itemId)
                            .single()];
                case 18:
                    scrapRow = _18.sent();
                    scrapRowId = (_12 = (_11 = scrapRow.data) === null || _11 === void 0 ? void 0 : _11.id) !== null && _12 !== void 0 ? _12 : null;
                    _18.label = 19;
                case 19: 
                // Link the source inspection to the NCR so the issue explorer can surface
                // the origin and deep-link back to the inspection lot.
                return [4 /*yield*/, serviceRole.from("nonConformanceInboundInspection").insert({
                        nonConformanceId: ncrId,
                        inboundInspectionId: insp.id,
                        companyId: companyId,
                        createdBy: userId
                    })];
                case 20:
                    // Link the source inspection to the NCR so the issue explorer can surface
                    // the origin and deep-link back to the inspection lot.
                    _18.sent();
                    if (!(insp.receiptLineId && insp.receiptId)) return [3 /*break*/, 22];
                    return [4 /*yield*/, serviceRole.from("nonConformanceReceiptLine").insert({
                            nonConformanceId: ncrId,
                            receiptLineId: insp.receiptLineId,
                            receiptId: insp.receiptId,
                            receiptReadableId: (_14 = (_13 = insp.receipt) === null || _13 === void 0 ? void 0 : _13.receiptId) !== null && _14 !== void 0 ? _14 : null,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 21:
                    _18.sent();
                    _18.label = 22;
                case 22:
                    trackedEntityIds = ((_15 = insp.inboundInspectionSample) !== null && _15 !== void 0 ? _15 : [])
                        .map(function (s) { return s.trackedEntityId; })
                        .filter(Boolean);
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id")
                            .eq("attributes ->> Receipt Line", insp.receiptLineId)
                            .eq("companyId", companyId)];
                case 23:
                    receiptLineEntities = _18.sent();
                    allLotEntityIds = Array.from(new Set(__spreadArray(__spreadArray([], trackedEntityIds, true), ((_16 = receiptLineEntities.data) !== null && _16 !== void 0 ? _16 : []).map(function (r) { return r.id; }), true)));
                    if (!(allLotEntityIds.length > 0)) return [3 /*break*/, 27];
                    return [4 /*yield*/, serviceRole.from("nonConformanceTrackedEntity").insert(allLotEntityIds.map(function (trackedEntityId) { return ({
                            nonConformanceId: ncrId,
                            trackedEntityId: trackedEntityId,
                            companyId: companyId,
                            createdBy: userId
                        }); }))];
                case 24:
                    _18.sent();
                    if (!scrapRowId) return [3 /*break*/, 27];
                    return [4 /*yield*/, serviceRole
                            .from("trackedEntity")
                            .select("id, quantity")
                            .in("id", allLotEntityIds)
                            .eq("companyId", companyId)];
                case 25:
                    entityQuantities = _18.sent();
                    rows = ((_17 = entityQuantities.data) !== null && _17 !== void 0 ? _17 : []).map(function (e) {
                        var _a;
                        return ({
                            nonConformanceItemId: scrapRowId,
                            trackedEntityId: e.id,
                            quantity: Number((_a = e.quantity) !== null && _a !== void 0 ? _a : 1),
                            companyId: companyId,
                            createdBy: userId
                        });
                    });
                    if (!(rows.length > 0)) return [3 /*break*/, 27];
                    return [4 /*yield*/, serviceRole
                            .from("nonConformanceItemTrackedEntity")
                            .insert(rows)];
                case 26:
                    _18.sent();
                    _18.label = 27;
                case 27: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "nonConformanceTasks",
                            id: ncrId,
                            companyId: companyId,
                            userId: userId
                        },
                        region: supabase_js_1.FunctionRegion.UsEast1
                    })];
                case 28:
                    tasks = _18.sent();
                    if (!tasks.error) return [3 /*break*/, 31];
                    return [4 /*yield*/, (0, quality_1.deleteIssue)(serviceRole, ncrId)];
                case 29:
                    _18.sent();
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.inboundInspection(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(tasks.error, "Lot rejected, but failed to create NCR tasks"))];
                case 30: throw _q.apply(void 0, _r.concat([_18.sent()]));
                case 31:
                    _18.trys.push([31, 34, , 35]);
                    return [4 /*yield*/, (0, settings_server_1.getCompanyIntegrations)(client, companyId)];
                case 32:
                    integrations = _18.sent();
                    return [4 /*yield*/, (0, notifications_1.notifyIssueCreated)({ client: client, serviceRole: serviceRole }, integrations, {
                            companyId: companyId,
                            userId: userId,
                            carbonUrl: "".concat(auth_1.ERP_URL).concat(path_1.path.to.issue(ncrId)),
                            issue: {
                                id: ncrId,
                                nonConformanceId: createResult.data.nonConformanceId,
                                title: issueTitle,
                                description: "Auto-created from inbound inspection ".concat(inspectionReadableId || id),
                                severity: "Medium"
                            }
                        })];
                case 33:
                    _18.sent();
                    return [3 /*break*/, 35];
                case 34:
                    err_1 = _18.sent();
                    console.error("Failed to send NCR notifications:", err_1);
                    return [3 /*break*/, 35];
                case 35:
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.issue(ncrId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Lot rejected — NCR opened"))];
                case 36: throw _s.apply(void 0, _t.concat([_18.sent()]));
            }
        });
    });
}
