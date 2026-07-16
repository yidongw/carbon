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
var client_server_1 = require("@carbon/auth/client.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var zod_1 = require("zod");
var purchasing_models_1 = require("~/modules/purchasing/purchasing.models");
var purchasing_service_1 = require("~/modules/purchasing/purchasing.service");
var settings_1 = require("~/modules/settings");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, formData, intent, serviceRole, quote, companySettings, _c, validation, _d, digitalSupplierQuoteSubmittedBy, digitalSupplierQuoteSubmittedByEmail, note, now, validation, _e, digitalSupplierQuoteSubmittedBy, digitalSupplierQuoteSubmittedByEmail, selectedLinesRaw, parsedData, nestedSelectedLinesValidator, parseResult, selectedLines, priceRecordsToProcess, _i, _f, _g, lineId, lineSelections, _h, _j, _k, quantityStr, selectedLine, quantity, existingPriceChecks, priceUpdates, priceInserts, i, _l, lineId, quantity, selectedLine, existingPrice, now, err_1, lineId, notesRaw, notes, updateResult;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, request.formData()];
                case 1:
                    formData = _z.sent();
                    intent = String(formData.get("intent"));
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, purchasing_service_1.getSupplierQuoteByExternalLinkId)(serviceRole, id)];
                case 2:
                    quote = _z.sent();
                    if (quote.error || !quote.data) {
                        console.error("Quote not found", quote.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Quote not found"
                            }];
                    }
                    return [4 /*yield*/, (0, settings_1.getCompanySettings)(serviceRole, quote.data.companyId)];
                case 3:
                    companySettings = _z.sent();
                    _c = intent;
                    switch (_c) {
                        case "decline": return [3 /*break*/, 4];
                        case "submit": return [3 /*break*/, 9];
                        case "updateNotes": return [3 /*break*/, 20];
                    }
                    return [3 /*break*/, 22];
                case 4: return [4 /*yield*/, (0, form_1.validator)(purchasing_models_1.externalSupplierQuoteValidator).validate(formData)];
                case 5:
                    validation = _z.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, digitalSupplierQuoteSubmittedBy = _d.digitalSupplierQuoteSubmittedBy, digitalSupplierQuoteSubmittedByEmail = _d.digitalSupplierQuoteSubmittedByEmail, note = _d.note;
                    now = new Date().toISOString();
                    // Update supplierQuote
                    return [4 /*yield*/, serviceRole
                            .from("supplierQuote")
                            .update({
                            status: "Declined",
                            updatedAt: now,
                            externalNotes: __assign(__assign({}, (quote.data.externalNotes || {})), { declineNote: note !== null && note !== void 0 ? note : null, declinedBy: digitalSupplierQuoteSubmittedBy, declinedByEmail: digitalSupplierQuoteSubmittedByEmail, declinedAt: now })
                        })
                            .eq("id", quote.data.id)];
                case 6:
                    // Update supplierQuote
                    _z.sent();
                    if (!quote.data.externalLinkId) return [3 /*break*/, 8];
                    return [4 /*yield*/, serviceRole
                            .from("externalLink")
                            .update({
                            declinedAt: now,
                            declinedBy: digitalSupplierQuoteSubmittedBy,
                            declinedByEmail: digitalSupplierQuoteSubmittedByEmail,
                            declineNote: note !== null && note !== void 0 ? note : null
                        })
                            .eq("id", quote.data.externalLinkId)];
                case 7:
                    _z.sent();
                    _z.label = 8;
                case 8: return [2 /*return*/, {
                        success: true,
                        message: "Quote declined successfully"
                    }];
                case 9: return [4 /*yield*/, (0, form_1.validator)(purchasing_models_1.externalSupplierQuoteValidator).validate(formData)];
                case 10:
                    validation = _z.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _e = validation.data, digitalSupplierQuoteSubmittedBy = _e.digitalSupplierQuoteSubmittedBy, digitalSupplierQuoteSubmittedByEmail = _e.digitalSupplierQuoteSubmittedByEmail;
                    selectedLinesRaw = (_m = formData.get("selectedLines")) !== null && _m !== void 0 ? _m : "{}";
                    if (typeof selectedLinesRaw !== "string") {
                        return [2 /*return*/, { success: false, message: "Invalid selected lines data" }];
                    }
                    parsedData = void 0;
                    try {
                        parsedData = JSON.parse(selectedLinesRaw);
                        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                    }
                    catch (e) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Invalid JSON in selected lines data"
                            }];
                    }
                    nestedSelectedLinesValidator = zod_1.z.record(zod_1.z.string(), zod_1.z.record(zod_1.z.string(), purchasing_models_1.selectedLineSchema));
                    parseResult = nestedSelectedLinesValidator.safeParse(parsedData);
                    if (!parseResult.success) {
                        console.error("Validation error:", parseResult.error);
                        return [2 /*return*/, { success: false, message: "Invalid selected lines data" }];
                    }
                    selectedLines = parseResult.data;
                    priceRecordsToProcess = [];
                    for (_i = 0, _f = Object.entries(selectedLines); _i < _f.length; _i++) {
                        _g = _f[_i], lineId = _g[0], lineSelections = _g[1];
                        // lineSelections is Record<number, SelectedLine>
                        for (_h = 0, _j = Object.entries(lineSelections); _h < _j.length; _h++) {
                            _k = _j[_h], quantityStr = _k[0], selectedLine = _k[1];
                            quantity = Number(quantityStr);
                            // Only process if quantity > 0 (line is selected)
                            if (quantity > 0 && selectedLine.quantity > 0) {
                                priceRecordsToProcess.push({
                                    lineId: lineId,
                                    quantity: quantity,
                                    selectedLine: selectedLine
                                });
                            }
                        }
                    }
                    return [4 /*yield*/, Promise.all(priceRecordsToProcess.map(function (_a) {
                            var lineId = _a.lineId, quantity = _a.quantity;
                            return serviceRole
                                .from("supplierQuoteLinePrice")
                                .select("id")
                                .eq("supplierQuoteLineId", lineId)
                                .eq("quantity", quantity)
                                .maybeSingle();
                        }))];
                case 11:
                    existingPriceChecks = _z.sent();
                    priceUpdates = [];
                    priceInserts = [];
                    for (i = 0; i < priceRecordsToProcess.length; i++) {
                        _l = priceRecordsToProcess[i], lineId = _l.lineId, quantity = _l.quantity, selectedLine = _l.selectedLine;
                        existingPrice = existingPriceChecks[i];
                        if (existingPrice.data) {
                            // Update existing price record
                            priceUpdates.push(serviceRole
                                .from("supplierQuoteLinePrice")
                                .update({
                                supplierUnitPrice: (_o = selectedLine.supplierUnitPrice) !== null && _o !== void 0 ? _o : 0,
                                leadTime: (_p = selectedLine.leadTime) !== null && _p !== void 0 ? _p : 0,
                                supplierShippingCost: (_q = selectedLine.supplierShippingCost) !== null && _q !== void 0 ? _q : 0,
                                supplierTaxAmount: (_r = selectedLine.supplierTaxAmount) !== null && _r !== void 0 ? _r : 0,
                                updatedAt: new Date().toISOString(),
                                updatedBy: quote.data.createdBy
                            })
                                .eq("supplierQuoteLineId", lineId)
                                .eq("quantity", quantity));
                        }
                        else {
                            // Insert new price record
                            priceInserts.push({
                                supplierQuoteId: quote.data.id,
                                supplierQuoteLineId: lineId,
                                quantity: quantity,
                                supplierUnitPrice: (_s = selectedLine.supplierUnitPrice) !== null && _s !== void 0 ? _s : 0,
                                leadTime: (_t = selectedLine.leadTime) !== null && _t !== void 0 ? _t : 0,
                                supplierShippingCost: (_u = selectedLine.supplierShippingCost) !== null && _u !== void 0 ? _u : 0,
                                supplierTaxAmount: (_v = selectedLine.supplierTaxAmount) !== null && _v !== void 0 ? _v : 0,
                                exchangeRate: (_w = quote.data.exchangeRate) !== null && _w !== void 0 ? _w : 1,
                                createdBy: quote.data.createdBy
                            });
                        }
                    }
                    // Execute all updates and inserts
                    return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray([], priceUpdates, true), [
                            priceInserts.length > 0
                                ? serviceRole.from("supplierQuoteLinePrice").insert(priceInserts)
                                : Promise.resolve({ data: null, error: null })
                        ], false))];
                case 12:
                    // Execute all updates and inserts
                    _z.sent();
                    now = new Date().toISOString();
                    // Update quote status to Active (submit moves from Draft to Active)
                    return [4 /*yield*/, serviceRole
                            .from("supplierQuote")
                            .update({
                            status: "Active",
                            updatedAt: now,
                            externalNotes: __assign(__assign({}, (quote.data.externalNotes || {})), { lastSubmittedBy: digitalSupplierQuoteSubmittedBy, lastSubmittedByEmail: digitalSupplierQuoteSubmittedByEmail, lastSubmittedAt: now })
                        })
                            .eq("id", quote.data.id)];
                case 13:
                    // Update quote status to Active (submit moves from Draft to Active)
                    _z.sent();
                    if (!quote.data.externalLinkId) return [3 /*break*/, 15];
                    return [4 /*yield*/, serviceRole
                            .from("externalLink")
                            .update({
                            submittedAt: now,
                            submittedBy: digitalSupplierQuoteSubmittedBy,
                            submittedByEmail: digitalSupplierQuoteSubmittedByEmail
                        })
                            .eq("id", quote.data.externalLinkId)];
                case 14:
                    _z.sent();
                    _z.label = 15;
                case 15:
                    if (companySettings.error) {
                        console.error("Failed to get company settings", companySettings.error);
                    }
                    if (!((_y = (_x = companySettings.data) === null || _x === void 0 ? void 0 : _x.supplierQuoteNotificationGroup) === null || _y === void 0 ? void 0 : _y.length)) return [3 /*break*/, 19];
                    _z.label = 16;
                case 16:
                    _z.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companySettings.data.id,
                            documentId: quote.data.id,
                            event: notifications_1.NotificationEvent.SupplierQuoteResponse,
                            recipient: {
                                type: "group",
                                groupIds: companySettings.data.supplierQuoteNotificationGroup
                            }
                        })];
                case 17:
                    _z.sent();
                    return [3 /*break*/, 19];
                case 18:
                    err_1 = _z.sent();
                    console.error("Failed to trigger supplier quote notification", err_1);
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/, {
                        success: true,
                        message: "Quote submitted successfully"
                    }];
                case 20:
                    lineId = formData.get("lineId");
                    notesRaw = formData.get("notes");
                    if (!lineId || typeof lineId !== "string") {
                        return [2 /*return*/, { success: false, message: "Invalid line ID" }];
                    }
                    notes = null;
                    if (notesRaw && typeof notesRaw === "string") {
                        try {
                            notes = JSON.parse(notesRaw);
                            // biome-ignore lint/correctness/noUnusedVariables: suppressed
                        }
                        catch (e) {
                            return [2 /*return*/, { success: false, message: "Invalid notes format" }];
                        }
                    }
                    return [4 /*yield*/, serviceRole
                            .from("supplierQuoteLine")
                            .update({
                            externalNotes: notes,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", lineId)
                            .eq("supplierQuoteId", quote.data.id)];
                case 21:
                    updateResult = _z.sent();
                    if (updateResult.error) {
                        console.error("Failed to update notes", updateResult.error);
                        return [2 /*return*/, { success: false, message: "Failed to update notes" }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Notes updated successfully"
                        }];
                case 22: return [2 /*return*/, { success: false, message: "Invalid intent" }];
            }
        });
    });
}
