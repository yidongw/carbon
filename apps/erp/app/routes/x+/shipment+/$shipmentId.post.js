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
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var documents_1 = require("~/modules/documents");
var _id___pdf_1 = require("~/routes/file+/shipment+/$id[.]pdf");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, shipmentId, formData, acknowledged, serviceRole, lines, shipmentForSurface, surfaces, evalLines, allViolations, allRuleNames, _i, surfaces_1, surface, _d, violations, ruleNames, pickSurfaces, _e, pickSurfaces_1, surface, _f, violations, ruleNames, deduped, companySettings, shelfLifeBlob, expiredPolicy, shipmentTrackedEntities, todayLocal, expiredEntities, expiredWarning, ids, message, _g, _h, setPendingState, _j, _k, shipment, salesOrder, pdfArgs, pdf, file, fileName, documentFilePath, documentFileUpload, err_1, postShipment, _l, _m, shipmentForPrint, locationId, config, e_1, splitEntityIds, _o, splitEntityIds_1, entityId, e_2, thrown_1, _p, _q;
        var _r, _s, _t;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    _c = _u.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    shipmentId = params.shipmentId;
                    if (!shipmentId)
                        throw new Error("shipmentId not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _u.sent();
                    acknowledged = formData.get("acknowledged") === "true";
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("shipmentLine")
                            .select("id, itemId, storageUnitId, shippedQuantity, locationId, shipmentId")
                            .eq("shipmentId", shipmentId)
                            .eq("companyId", companyId)];
                case 3:
                    lines = (_u.sent()).data;
                    return [4 /*yield*/, serviceRole
                            .from("shipment")
                            .select("sourceDocument")
                            .eq("id", shipmentId)
                            .single()];
                case 4:
                    shipmentForSurface = (_u.sent()).data;
                    surfaces = ["shipment"];
                    if ((shipmentForSurface === null || shipmentForSurface === void 0 ? void 0 : shipmentForSurface.sourceDocument) === "Outbound Transfer") {
                        surfaces.push("warehouseTransfer");
                    }
                    evalLines = (lines !== null && lines !== void 0 ? lines : []).map(function (l) {
                        var _a;
                        return ({
                            lineId: l.id,
                            itemId: l.itemId,
                            storageUnitId: l.storageUnitId,
                            quantity: Number((_a = l.shippedQuantity) !== null && _a !== void 0 ? _a : 0),
                            locationId: l.locationId
                        });
                    });
                    allViolations = [];
                    allRuleNames = {};
                    _i = 0, surfaces_1 = surfaces;
                    _u.label = 5;
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
                    _d = _u.sent(), violations = _d.violations, ruleNames = _d.ruleNames;
                    allViolations.push.apply(allViolations, violations);
                    Object.assign(allRuleNames, ruleNames);
                    _u.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    pickSurfaces = ["pick"];
                    if ((shipmentForSurface === null || shipmentForSurface === void 0 ? void 0 : shipmentForSurface.sourceDocument) === "Outbound Transfer") {
                        pickSurfaces.push("warehouseTransfer");
                    }
                    _e = 0, pickSurfaces_1 = pickSurfaces;
                    _u.label = 9;
                case 9:
                    if (!(_e < pickSurfaces_1.length)) return [3 /*break*/, 12];
                    surface = pickSurfaces_1[_e];
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "item",
                            surface: surface,
                            lines: evalLines
                        })];
                case 10:
                    _f = _u.sent(), violations = _f.violations, ruleNames = _f.ruleNames;
                    allViolations.push.apply(allViolations, violations);
                    Object.assign(allRuleNames, ruleNames);
                    _u.label = 11;
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
                    return [4 /*yield*/, serviceRole
                            .from("companySettings")
                            .select("inventoryShelfLife")
                            .eq("id", companyId)
                            .single()];
                case 13:
                    companySettings = (_u.sent()).data;
                    shelfLifeBlob = companySettings === null || companySettings === void 0 ? void 0 : companySettings.inventoryShelfLife;
                    expiredPolicy = (_r = shelfLifeBlob === null || shelfLifeBlob === void 0 ? void 0 : shelfLifeBlob.expiredEntityPolicy) !== null && _r !== void 0 ? _r : "Block";
                    return [4 /*yield*/, serviceRole
                            .from("trackedEntity")
                            .select("id, readableId, expirationDate")
                            .eq("attributes ->> Shipment", shipmentId)
                            .eq("companyId", companyId)];
                case 14:
                    shipmentTrackedEntities = (_u.sent()).data;
                    todayLocal = (0, date_1.today)((0, date_1.getLocalTimeZone)());
                    expiredEntities = (shipmentTrackedEntities !== null && shipmentTrackedEntities !== void 0 ? shipmentTrackedEntities : []).filter(function (e) {
                        if (!e.expirationDate)
                            return false;
                        try {
                            return (0, date_1.parseDate)(e.expirationDate).compare(todayLocal) < 0;
                        }
                        catch (_a) {
                            return false;
                        }
                    });
                    expiredWarning = null;
                    if (!(expiredEntities.length > 0)) return [3 /*break*/, 17];
                    ids = expiredEntities.map(function (e) { var _a; return (_a = e.readableId) !== null && _a !== void 0 ? _a : e.id; }).join(", ");
                    message = "Cannot post shipment with expired batch".concat(expiredEntities.length === 1 ? "" : "es", ": ").concat(ids);
                    if (!(expiredPolicy === "Block" || expiredPolicy === "BlockWithOverride")) return [3 /*break*/, 16];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.shipmentDetails(shipmentId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, message))];
                case 15: throw _g.apply(void 0, _h.concat([_u.sent()]));
                case 16:
                    expiredWarning = "Posted shipment with expired batch".concat(expiredEntities.length === 1 ? "" : "es", ": ").concat(ids);
                    _u.label = 17;
                case 17: return [4 /*yield*/, client
                        .from("shipment")
                        .update({
                        status: "Pending"
                    })
                        .eq("id", shipmentId)];
                case 18:
                    setPendingState = _u.sent();
                    if (!setPendingState.error) return [3 /*break*/, 20];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.shipments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(setPendingState.error, "Failed to post shipment"))];
                case 19: throw _j.apply(void 0, _k.concat([_u.sent()]));
                case 20:
                    _u.trys.push([20, 48, , 50]);
                    return [4 /*yield*/, serviceRole
                            .from("shipment")
                            .select("sourceDocument, sourceDocumentId, shipmentId")
                            .eq("id", shipmentId)
                            .single()];
                case 21:
                    shipment = (_u.sent()).data;
                    if (!((shipment === null || shipment === void 0 ? void 0 : shipment.sourceDocument) === "Sales Order" &&
                        (shipment === null || shipment === void 0 ? void 0 : shipment.sourceDocumentId))) return [3 /*break*/, 30];
                    _u.label = 22;
                case 22:
                    _u.trys.push([22, 29, , 30]);
                    return [4 /*yield*/, serviceRole
                            .from("salesOrder")
                            .select("opportunityId")
                            .eq("id", shipment.sourceDocumentId)
                            .single()];
                case 23:
                    salesOrder = (_u.sent()).data;
                    if (!(salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.opportunityId)) return [3 /*break*/, 28];
                    pdfArgs = {
                        request: request,
                        params: { id: shipmentId },
                        context: {}
                    };
                    return [4 /*yield*/, (0, _id___pdf_1.loader)(pdfArgs)];
                case 24:
                    pdf = _u.sent();
                    if (!(pdf.headers.get("content-type") === "application/pdf")) return [3 /*break*/, 28];
                    return [4 /*yield*/, pdf.arrayBuffer()];
                case 25:
                    file = _u.sent();
                    fileName = (0, string_1.stripSpecialCharacters)("".concat(shipment.shipmentId, " - ").concat(new Date()
                        .toISOString()
                        .slice(0, -5), ".pdf"));
                    documentFilePath = "".concat(companyId, "/opportunity/").concat(salesOrder.opportunityId, "/").concat(fileName);
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .upload(documentFilePath, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            contentType: "application/pdf",
                            upsert: true
                        })];
                case 26:
                    documentFileUpload = _u.sent();
                    if (!!documentFileUpload.error) return [3 /*break*/, 28];
                    // Create document record
                    return [4 /*yield*/, (0, documents_1.upsertDocument)(serviceRole, {
                            path: documentFilePath,
                            name: fileName,
                            size: Math.round(file.byteLength / 1024),
                            sourceDocument: "Shipment",
                            sourceDocumentId: shipmentId,
                            readGroups: [userId],
                            writeGroups: [userId],
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 27:
                    // Create document record
                    _u.sent();
                    _u.label = 28;
                case 28: return [3 /*break*/, 30];
                case 29:
                    err_1 = _u.sent();
                    // Continue with posting even if PDF generation fails
                    console.error("Failed to generate packing slip PDF:", err_1);
                    return [3 /*break*/, 30];
                case 30: return [4 /*yield*/, serviceRole.functions.invoke("post-shipment", {
                        body: {
                            type: "post",
                            shipmentId: shipmentId,
                            userId: userId,
                            companyId: companyId
                        }
                    })];
                case 31:
                    postShipment = _u.sent();
                    if (!postShipment.error) return [3 /*break*/, 34];
                    return [4 /*yield*/, client
                            .from("shipment")
                            .update({
                            status: "Draft"
                        })
                            .eq("id", shipmentId)];
                case 32:
                    _u.sent();
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.shipmentDetails(shipmentId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(postShipment.error, "Failed to post shipment"))];
                case 33: throw _l.apply(void 0, _m.concat([_u.sent()]));
                case 34:
                    _u.trys.push([34, 39, , 40]);
                    return [4 /*yield*/, serviceRole
                            .from("shipment")
                            .select("locationId")
                            .eq("id", shipmentId)
                            .single()];
                case 35:
                    shipmentForPrint = (_u.sent()).data;
                    locationId = shipmentForPrint === null || shipmentForPrint === void 0 ? void 0 : shipmentForPrint.locationId;
                    if (!locationId) return [3 /*break*/, 38];
                    return [4 /*yield*/, (0, printing_server_1.getCachedPrinterConfig)(serviceRole, companyId, locationId, "shipping")];
                case 36:
                    config = _u.sent();
                    if (!((_s = config === null || config === void 0 ? void 0 : config.autoPrint) !== null && _s !== void 0 ? _s : true)) return [3 /*break*/, 38];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Shipment",
                            sourceDocumentId: shipmentId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId
                        })];
                case 37:
                    _u.sent();
                    _u.label = 38;
                case 38: return [3 /*break*/, 40];
                case 39:
                    e_1 = _u.sent();
                    console.error("Auto-print failed:", e_1);
                    return [3 /*break*/, 40];
                case 40:
                    splitEntityIds = ((_t = postShipment.data) === null || _t === void 0 ? void 0 : _t.splitEntityIds) || [];
                    if (!(splitEntityIds.length > 0)) return [3 /*break*/, 47];
                    _u.label = 41;
                case 41:
                    _u.trys.push([41, 46, , 47]);
                    _o = 0, splitEntityIds_1 = splitEntityIds;
                    _u.label = 42;
                case 42:
                    if (!(_o < splitEntityIds_1.length)) return [3 /*break*/, 45];
                    entityId = splitEntityIds_1[_o];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Split",
                            sourceDocumentId: entityId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 43:
                    _u.sent();
                    _u.label = 44;
                case 44:
                    _o++;
                    return [3 /*break*/, 42];
                case 45: return [3 /*break*/, 47];
                case 46:
                    e_2 = _u.sent();
                    console.error("Auto-print for split entities failed:", e_2);
                    return [3 /*break*/, 47];
                case 47: return [3 /*break*/, 50];
                case 48:
                    thrown_1 = _u.sent();
                    if (thrown_1 instanceof Response)
                        throw thrown_1;
                    return [4 /*yield*/, client
                            .from("shipment")
                            .update({
                            status: "Draft"
                        })
                            .eq("id", shipmentId)];
                case 49:
                    _u.sent();
                    return [3 /*break*/, 50];
                case 50:
                    if (!expiredWarning) return [3 /*break*/, 52];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.shipmentDetails(shipmentId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)(expiredWarning))];
                case 51: throw _p.apply(void 0, _q.concat([_u.sent()]));
                case 52: throw (0, react_router_1.redirect)(path_1.path.to.shipmentDetails(shipmentId));
            }
        });
    });
}
