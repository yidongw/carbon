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
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var storage_rules_server_1 = require("@carbon/ee/storage-rules.server");
var jobs_1 = require("@carbon/jobs");
var printing_server_1 = require("@carbon/printing/printing.server");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, receiptId, formData, acknowledged, serviceRole, lines, receiptForSurface, surfaces, evalLines, allViolations, allRuleNames, _i, surfaces_1, surface, _d, violations, ruleNames, placeSurfaces, _e, placeSurfaces_1, surface, _f, violations, ruleNames, deduped, setPendingState, _g, _h, receiptMetadata, companySettings, postReceipt, _j, _k, shouldUpdateLeadTimesOnReceipt, leadTimeUpdate, receipt, locationId, config, e_1, thrown_1;
        var _l, _m, _o, _p;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    receiptId = params.receiptId;
                    if (!receiptId)
                        throw new Error("receiptId not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _q.sent();
                    acknowledged = formData.get("acknowledged") === "true";
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("receiptLine")
                            .select("id, itemId, storageUnitId, receivedQuantity, locationId, receiptId, requiresSerialTracking")
                            .eq("receiptId", receiptId)
                            .eq("companyId", companyId)];
                case 3:
                    lines = (_q.sent()).data;
                    return [4 /*yield*/, serviceRole
                            .from("receipt")
                            .select("sourceDocument")
                            .eq("id", receiptId)
                            .single()];
                case 4:
                    receiptForSurface = (_q.sent()).data;
                    surfaces = ["receipt"];
                    if ((receiptForSurface === null || receiptForSurface === void 0 ? void 0 : receiptForSurface.sourceDocument) === "Inbound Transfer") {
                        surfaces.push("warehouseTransfer");
                    }
                    evalLines = (lines !== null && lines !== void 0 ? lines : []).map(function (l) {
                        var _a;
                        return ({
                            lineId: l.id,
                            itemId: l.itemId,
                            storageUnitId: l.storageUnitId,
                            quantity: Number((_a = l.receivedQuantity) !== null && _a !== void 0 ? _a : 0),
                            locationId: l.locationId
                        });
                    });
                    allViolations = [];
                    allRuleNames = {};
                    _i = 0, surfaces_1 = surfaces;
                    _q.label = 5;
                case 5:
                    if (!(_i < surfaces_1.length)) return [3 /*break*/, 8];
                    surface = surfaces_1[_i];
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "item",
                            surface: surface,
                            lines: evalLines
                        })];
                case 6:
                    _d = _q.sent(), violations = _d.violations, ruleNames = _d.ruleNames;
                    allViolations.push.apply(allViolations, violations);
                    Object.assign(allRuleNames, ruleNames);
                    _q.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    placeSurfaces = ["place"];
                    if ((receiptForSurface === null || receiptForSurface === void 0 ? void 0 : receiptForSurface.sourceDocument) === "Inbound Transfer") {
                        placeSurfaces.push("warehouseTransfer");
                    }
                    _e = 0, placeSurfaces_1 = placeSurfaces;
                    _q.label = 9;
                case 9:
                    if (!(_e < placeSurfaces_1.length)) return [3 /*break*/, 12];
                    surface = placeSurfaces_1[_e];
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "item",
                            surface: surface,
                            lines: evalLines
                        })];
                case 10:
                    _f = _q.sent(), violations = _f.violations, ruleNames = _f.ruleNames;
                    allViolations.push.apply(allViolations, violations);
                    Object.assign(allRuleNames, ruleNames);
                    _q.label = 11;
                case 11:
                    _e++;
                    return [3 /*break*/, 9];
                case 12:
                    deduped = (0, storage_rules_server_1.dedupeViolations)(allViolations);
                    if (deduped.length > 0 && (0, storage_rules_server_1.isBlocked)(deduped, acknowledged)) {
                        return [2 /*return*/, {
                                error: null,
                                data: null,
                                violations: deduped,
                                ruleNames: allRuleNames
                            }];
                    }
                    // Serial-tracked lines can accumulate stale tracked entities (reduced
                    // quantity leaves orphans, edited serials leave duplicates) that would
                    // otherwise be flipped to Available as phantom serials. Clear them before
                    // posting.
                    return [4 /*yield*/, (0, inventory_1.reconcileReceiptSerialEntities)(serviceRole, {
                            receiptId: receiptId,
                            companyId: companyId,
                            lines: lines !== null && lines !== void 0 ? lines : []
                        })];
                case 13:
                    // Serial-tracked lines can accumulate stale tracked entities (reduced
                    // quantity leaves orphans, edited serials leave duplicates) that would
                    // otherwise be flipped to Available as phantom serials. Clear them before
                    // posting.
                    _q.sent();
                    return [4 /*yield*/, client
                            .from("receipt")
                            .update({
                            status: "Pending"
                        })
                            .eq("id", receiptId)];
                case 14:
                    setPendingState = _q.sent();
                    if (!setPendingState.error) return [3 /*break*/, 16];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.receipt(receiptId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(setPendingState.error, "Failed to post receipt"))];
                case 15: throw _g.apply(void 0, _h.concat([_q.sent()]));
                case 16:
                    _q.trys.push([16, 31, , 33]);
                    return [4 /*yield*/, serviceRole
                            .from("receipt")
                            .select("sourceDocument,sourceDocumentId")
                            .eq("id", receiptId)
                            .single()];
                case 17:
                    receiptMetadata = _q.sent();
                    return [4 /*yield*/, serviceRole.from("companySettings")
                            .select("updateLeadTimesOnReceipt,printing")
                            .eq("id", companyId)
                            .single()];
                case 18:
                    companySettings = _q.sent();
                    return [4 /*yield*/, serviceRole.functions.invoke("post-receipt", {
                            body: {
                                receiptId: receiptId,
                                userId: userId,
                                companyId: companyId
                            }
                        })];
                case 19:
                    postReceipt = _q.sent();
                    if (!postReceipt.error) return [3 /*break*/, 22];
                    return [4 /*yield*/, client
                            .from("receipt")
                            .update({
                            status: "Draft"
                        })
                            .eq("id", receiptId)];
                case 20:
                    _q.sent();
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.receipt(receiptId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(postReceipt.error, "Failed to post receipt"))];
                case 21: throw _j.apply(void 0, _k.concat([_q.sent()]));
                case 22:
                    shouldUpdateLeadTimesOnReceipt = Boolean((_l = companySettings.data) === null || _l === void 0 ? void 0 : _l.updateLeadTimesOnReceipt);
                    if (!(shouldUpdateLeadTimesOnReceipt &&
                        ((_m = receiptMetadata.data) === null || _m === void 0 ? void 0 : _m.sourceDocument) === "Purchase Order" &&
                        ((_o = receiptMetadata.data) === null || _o === void 0 ? void 0 : _o.sourceDocumentId))) return [3 /*break*/, 24];
                    return [4 /*yield*/, serviceRole.functions.invoke("update-purchased-prices", {
                            body: {
                                source: "purchaseOrder",
                                purchaseOrderId: receiptMetadata.data.sourceDocumentId,
                                companyId: companyId,
                                userId: userId,
                                updatePrices: false,
                                updateLeadTimes: true
                            }
                        })];
                case 23:
                    leadTimeUpdate = _q.sent();
                    if (leadTimeUpdate.error) {
                        console.error("Failed to update lead time on receipt posting:", leadTimeUpdate.error);
                    }
                    _q.label = 24;
                case 24:
                    _q.trys.push([24, 29, , 30]);
                    return [4 /*yield*/, serviceRole
                            .from("receipt")
                            .select("locationId")
                            .eq("id", receiptId)
                            .single()];
                case 25:
                    receipt = (_q.sent()).data;
                    locationId = receipt === null || receipt === void 0 ? void 0 : receipt.locationId;
                    if (!locationId) return [3 /*break*/, 28];
                    return [4 /*yield*/, (0, printing_server_1.getCachedPrinterConfig)(serviceRole, companyId, locationId, "receiving")];
                case 26:
                    config = _q.sent();
                    if (!((_p = config === null || config === void 0 ? void 0 : config.autoPrint) !== null && _p !== void 0 ? _p : true)) return [3 /*break*/, 28];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Receipt",
                            sourceDocumentId: receiptId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId
                        })];
                case 27:
                    _q.sent();
                    _q.label = 28;
                case 28: return [3 /*break*/, 30];
                case 29:
                    e_1 = _q.sent();
                    console.error("Auto-print failed:", e_1);
                    return [3 /*break*/, 30];
                case 30: return [3 /*break*/, 33];
                case 31:
                    thrown_1 = _q.sent();
                    // Re-throw redirects — don't swallow them
                    if (thrown_1 instanceof Response)
                        throw thrown_1;
                    // Only reset to Draft for actual errors
                    return [4 /*yield*/, client
                            .from("receipt")
                            .update({
                            status: "Draft"
                        })
                            .eq("id", receiptId)];
                case 32:
                    // Only reset to Draft for actual errors
                    _q.sent();
                    return [3 /*break*/, 33];
                case 33: throw (0, react_router_1.redirect)(path_1.path.to.receipt(receiptId));
            }
        });
    });
}
