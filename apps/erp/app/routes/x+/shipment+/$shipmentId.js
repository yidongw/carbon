"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.handle = void 0;
exports.loader = loader;
exports.default = ShipmentRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shipments"], ["Shipments"]))),
    to: path_1.path.to.shipments
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, shipmentId, _d, shipment, shipmentLines, shipmentLineTracking, _e, _f, fixedAssetLines, serviceRole, faLineRecords;
        var _g, _h, _j, _k, _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId;
                    shipmentId = params.shipmentId;
                    if (!shipmentId)
                        throw new Error("Could not find shipmentId");
                    return [4 /*yield*/, Promise.all([
                            (0, inventory_1.getShipment)(client, shipmentId),
                            (0, inventory_1.getShipmentLines)(client, shipmentId),
                            (0, inventory_1.getShipmentTracking)(client, shipmentId, companyId)
                        ])];
                case 2:
                    _d = _m.sent(), shipment = _d[0], shipmentLines = _d[1], shipmentLineTracking = _d[2];
                    if (!shipment.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.shipments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(shipment.error, "Failed to load shipment"))];
                case 3: throw _e.apply(void 0, _f.concat([_m.sent()]));
                case 4:
                    if (shipment.data.companyId !== companyId) {
                        throw (0, react_router_1.redirect)(path_1.path.to.shipments);
                    }
                    fixedAssetLines = [];
                    if (!(shipment.data.sourceDocument === "Sales Order")) return [3 /*break*/, 6];
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("shipmentFixedAssetLine")
                            .select("id, salesOrderLineId, shipped, serialNumber, salesOrderLine:salesOrderLineId(assetId, description, fixedAsset:assetId(name, fixedAssetId, serialNumber))")
                            .eq("shipmentId", shipmentId)];
                case 5:
                    faLineRecords = _m.sent();
                    fixedAssetLines = ((_g = faLineRecords.data) !== null && _g !== void 0 ? _g : [])
                        .filter(function (row) {
                        var sol = row.salesOrderLine;
                        return sol === null || sol === void 0 ? void 0 : sol.assetId;
                    })
                        .map(function (row) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var sol = row.salesOrderLine;
                        return {
                            id: row.id,
                            salesOrderLineId: row.salesOrderLineId,
                            assetId: sol.assetId,
                            assetName: (_b = (_a = sol.fixedAsset) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null,
                            assetReadableId: (_d = (_c = sol.fixedAsset) === null || _c === void 0 ? void 0 : _c.fixedAssetId) !== null && _d !== void 0 ? _d : null,
                            description: sol.description,
                            shipped: row.shipped,
                            serialNumber: (_g = (_e = row.serialNumber) !== null && _e !== void 0 ? _e : (_f = sol.fixedAsset) === null || _f === void 0 ? void 0 : _f.serialNumber) !== null && _g !== void 0 ? _g : null
                        };
                    });
                    _m.label = 6;
                case 6: return [2 /*return*/, {
                        shipment: shipment.data,
                        shipmentLines: (_h = shipmentLines.data) !== null && _h !== void 0 ? _h : [],
                        fixedAssetLines: fixedAssetLines,
                        shipmentLineTracking: (_j = shipmentLineTracking.data) !== null && _j !== void 0 ? _j : [],
                        relatedItems: (0, inventory_1.getShipmentRelatedItems)(client, shipmentId, (_l = (_k = shipment.data) === null || _k === void 0 ? void 0 : _k.sourceDocumentId) !== null && _l !== void 0 ? _l : "")
                    }];
            }
        });
    });
}
function ShipmentRoute() {
    var params = (0, react_router_1.useParams)();
    var shipmentId = params.shipmentId;
    if (!shipmentId)
        throw new Error("Could not find shipmentId");
    return (<div className="flex h-[calc(100dvh-49px)] overflow-y-auto overscroll-contain scrollbar-hide w-full">
      <div className="h-full p-4 w-full max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 pb-16 w-full">
          <react_router_1.Outlet />
        </div>
      </div>
    </div>);
}
var templateObject_1;
