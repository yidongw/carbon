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
var auth_server_1 = require("@carbon/auth/auth.server");
var zpl_1 = require("@carbon/documents/zpl");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var inventory_service_1 = require("~/modules/inventory/inventory.service");
var settings_1 = require("~/modules/settings");
var labelLogo_server_1 = require("~/modules/settings/labelLogo.server");
var settings_service_1 = require("~/modules/settings/settings.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, companySettings, shipmentTracking, url, labelParam, lineIdParam, labelSizeId, labelSize, filteredTracking, itemEntityIds, trackedEntities, items, template, company, logo, zplCommands, zplOutput, headers;
        var _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, Promise.all([
                            (0, settings_service_1.getCompanySettings)(client, companyId),
                            (0, inventory_service_1.getShipmentTracking)(client, id, companyId)
                        ])];
                case 2:
                    _d = _h.sent(), companySettings = _d[0], shipmentTracking = _d[1];
                    url = new URL(request.url);
                    labelParam = url.searchParams.get("labelSize");
                    lineIdParam = url.searchParams.get("lineId");
                    labelSizeId = labelParam || ((_e = companySettings.data) === null || _e === void 0 ? void 0 : _e.productLabelSize) || "label2x1";
                    labelSize = utils_1.labelSizes.find(function (size) { return size.id === labelSizeId; });
                    if (!labelSize) {
                        throw new Error("Invalid label size");
                    }
                    if (!labelSize.zpl) {
                        throw (0, react_router_1.redirect)(path_1.path.to.file.shipmentLabelsPdf(id, {
                            labelSize: labelSize.id,
                            lineId: lineIdParam !== null && lineIdParam !== void 0 ? lineIdParam : undefined
                        }));
                    }
                    filteredTracking = shipmentTracking.data;
                    // Filter by lineId if provided
                    if (lineIdParam) {
                        filteredTracking =
                            (_f = filteredTracking === null || filteredTracking === void 0 ? void 0 : filteredTracking.filter(function (tracking) {
                                return tracking.attributes &&
                                    tracking.attributes["Shipment Line"] ===
                                        lineIdParam;
                            })) !== null && _f !== void 0 ? _f : [];
                    }
                    itemEntityIds = (_g = filteredTracking === null || filteredTracking === void 0 ? void 0 : filteredTracking.filter(function (tracking) {
                        return "Split Entity ID" in tracking.attributes;
                    })) === null || _g === void 0 ? void 0 : _g.map(function (tracking) {
                        var _a;
                        return (_a = tracking.attributes["Split Entity ID"]) !== null && _a !== void 0 ? _a : "";
                    }).sort(function (a, b) { return a.localeCompare(b); }).filter(Boolean);
                    if (!itemEntityIds || itemEntityIds.length === 0) {
                        return [2 /*return*/, new Response("No items found for shipment ".concat(id).concat(lineIdParam ? " and line ".concat(lineIdParam) : ""), { status: 404 })];
                    }
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .in("id", itemEntityIds)
                            .eq("companyId", companyId)];
                case 3:
                    trackedEntities = _h.sent();
                    if (!trackedEntities.data || trackedEntities.data.length === 0) {
                        return [2 /*return*/, new Response("No items found for shipment ".concat(id).concat(lineIdParam ? " and line ".concat(lineIdParam) : ""), { status: 404 })];
                    }
                    items = trackedEntities.data
                        .map(function (tracking) {
                        var _a, _b;
                        return ({
                            itemId: (_a = tracking.sourceDocumentReadableId) !== null && _a !== void 0 ? _a : "",
                            revision: "0",
                            number: (_b = tracking.readableId) !== null && _b !== void 0 ? _b : "",
                            trackedEntityId: tracking.id,
                            quantity: tracking.quantity,
                            trackingType: tracking.quantity > 1 ? "Batch" : "Serial"
                        });
                    })
                        .sort(function (a, b) {
                        if (a.itemId === b.itemId) {
                            return a.number.localeCompare(b.number);
                        }
                        return a.itemId.localeCompare(b.itemId);
                    });
                    if (!Array.isArray(items) || items.length === 0) {
                        return [2 /*return*/, new Response("No items found for shipment ".concat(id).concat(lineIdParam ? " and line ".concat(lineIdParam) : ""), { status: 404 })];
                    }
                    if (!(labelSize === null || labelSize === void 0 ? void 0 : labelSize.zpl)) {
                        throw new Error("Invalid label size or missing ZPL configuration");
                    }
                    return [4 /*yield*/, (0, settings_1.getDocumentTemplateConfig)(client, companyId, "trackingLabel")];
                case 4:
                    template = _h.sent();
                    return [4 /*yield*/, (0, settings_1.getCompany)(client, companyId)];
                case 5:
                    company = _h.sent();
                    return [4 /*yield*/, (0, labelLogo_server_1.resolveLabelLogo)(company.data, template, labelSize)];
                case 6:
                    logo = _h.sent();
                    zplCommands = items.map(function (item) {
                        return (0, zpl_1.generateProductLabelZPL)(item, labelSize, template, logo);
                    });
                    zplOutput = zplCommands.join("\n");
                    headers = new Headers({
                        "Content-Type": "application/zpl",
                        "Content-Disposition": "attachment; filename=\"labels-".concat(id, ".zpl\"")
                    });
                    return [2 /*return*/, new Response(zplOutput, { status: 200, headers: headers })];
            }
        });
    });
}
