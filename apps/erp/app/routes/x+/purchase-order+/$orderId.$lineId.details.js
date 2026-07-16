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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = EditPurchaseOrderLineRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var purchasing_1 = require("~/modules/purchasing");
var PurchaseOrder_1 = require("~/modules/purchasing/ui/PurchaseOrder");
var SupplierInteraction_1 = require("~/modules/purchasing/ui/SupplierInteraction");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, orderId, lineId, line, _d, _e;
        var _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    orderId = params.orderId, lineId = params.lineId;
                    if (!orderId)
                        throw (0, auth_1.notFound)("orderId not found");
                    if (!lineId)
                        throw (0, auth_1.notFound)("lineId not found");
                    return [4 /*yield*/, (0, purchasing_1.getPurchaseOrderLine)(client, lineId)];
                case 2:
                    line = _g.sent();
                    if (!line.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.purchaseOrderDetails(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(line.error, "Failed to load sales order line"))];
                case 3: throw _d.apply(void 0, _e.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        line: (_f = line === null || line === void 0 ? void 0 : line.data) !== null && _f !== void 0 ? _f : null,
                        files: (0, purchasing_1.getSupplierInteractionLineDocuments)(client, companyId, lineId)
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var orderId, lineId, viewClient, _c, purchaseOrder, currentLine, _d, _e, _f, _g, _h, client, userId, formData, validation, _j, id, d, updatePurchaseOrderLine, _k, _l;
        var _m;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    orderId = params.orderId, lineId = params.lineId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "purchasing"
                        })];
                case 1:
                    viewClient = (_o.sent()).client;
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.getPurchaseOrder)(viewClient, orderId),
                            (0, purchasing_1.getPurchaseOrderLine)(viewClient, lineId)
                        ])];
                case 2:
                    _c = _o.sent(), purchaseOrder = _c[0], currentLine = _c[1];
                    if (!purchaseOrder.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.purchaseOrderLine(orderId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseOrder.error, "Failed to load purchase order"))];
                case 3: throw _d.apply(void 0, _e.concat([_o.sent()]));
                case 4:
                    if (!(currentLine.error || !currentLine.data)) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.purchaseOrderLine(orderId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(currentLine.error, "Failed to load purchase order line"))];
                case 5: throw _f.apply(void 0, _g.concat([_o.sent()]));
                case 6: return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                        request: request,
                        isLocked: (0, purchasing_1.isPurchaseOrderLocked)((_m = purchaseOrder.data) === null || _m === void 0 ? void 0 : _m.status),
                        redirectTo: path_1.path.to.purchaseOrderLine(orderId, lineId),
                        message: "Cannot modify a confirmed purchase order."
                    })];
                case 7:
                    _o.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "purchasing"
                        })];
                case 8:
                    _h = _o.sent(), client = _h.client, userId = _h.userId;
                    return [4 /*yield*/, request.formData()];
                case 9:
                    formData = _o.sent();
                    return [4 /*yield*/, (0, form_1.validator)(purchasing_1.purchaseOrderLineValidator).validate(formData)];
                case 10:
                    validation = _o.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _j = validation.data, id = _j.id, d = __rest(_j, ["id"]);
                    return [4 /*yield*/, (0, purchasing_1.upsertPurchaseOrderLine)(client, __assign(__assign({ id: lineId }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 11:
                    updatePurchaseOrderLine = _o.sent();
                    if (!updatePurchaseOrderLine.error) return [3 /*break*/, 13];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.purchaseOrderLine(orderId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updatePurchaseOrderLine.error, "Failed to update purchase order line"))];
                case 12: throw _k.apply(void 0, _l.concat([_o.sent()]));
                case 13: throw (0, react_router_1.redirect)(path_1.path.to.purchaseOrderLine(orderId, lineId));
            }
        });
    });
}
function EditPurchaseOrderLineRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
    var t = (0, macro_1.useLingui)().t;
    var _9 = (0, react_router_1.useParams)(), orderId = _9.orderId, lineId = _9.lineId;
    if (!orderId)
        throw new Error("orderId not found");
    if (!lineId)
        throw new Error("lineId not found");
    var permissions = (0, hooks_1.usePermissions)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
    var isReadOnly = (0, purchasing_1.isPurchaseOrderLocked)((_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.status);
    var _10 = (0, react_router_1.useLoaderData)(), line = _10.line, files = _10.files;
    var initialValues = __assign({ id: (_b = line === null || line === void 0 ? void 0 : line.id) !== null && _b !== void 0 ? _b : undefined, purchaseOrderId: (_c = line === null || line === void 0 ? void 0 : line.purchaseOrderId) !== null && _c !== void 0 ? _c : "", purchaseOrderLineType: (line === null || line === void 0 ? void 0 : line.purchaseOrderLineType) === "Comment"
            ? "Part"
            : ((_d = line === null || line === void 0 ? void 0 : line.purchaseOrderLineType) !== null && _d !== void 0 ? _d : "Part"), itemId: (_e = line === null || line === void 0 ? void 0 : line.itemId) !== null && _e !== void 0 ? _e : "", accountId: (_f = line === null || line === void 0 ? void 0 : line.accountId) !== null && _f !== void 0 ? _f : "", assetId: (_g = line === null || line === void 0 ? void 0 : line.assetId) !== null && _g !== void 0 ? _g : "", conversionFactor: (_h = line === null || line === void 0 ? void 0 : line.conversionFactor) !== null && _h !== void 0 ? _h : 1, description: (_j = line === null || line === void 0 ? void 0 : line.description) !== null && _j !== void 0 ? _j : "", exchangeRate: (_k = line === null || line === void 0 ? void 0 : line.exchangeRate) !== null && _k !== void 0 ? _k : 1, inventoryUnitOfMeasureCode: (_l = line === null || line === void 0 ? void 0 : line.inventoryUnitOfMeasureCode) !== null && _l !== void 0 ? _l : "", jobId: (_m = line === null || line === void 0 ? void 0 : line.jobId) !== null && _m !== void 0 ? _m : "", jobOperationId: (_o = line === null || line === void 0 ? void 0 : line.jobOperationId) !== null && _o !== void 0 ? _o : "", locationId: (_p = line === null || line === void 0 ? void 0 : line.locationId) !== null && _p !== void 0 ? _p : "", purchaseQuantity: (_q = line === null || line === void 0 ? void 0 : line.purchaseQuantity) !== null && _q !== void 0 ? _q : 1, purchaseUnitOfMeasureCode: (_r = line === null || line === void 0 ? void 0 : line.purchaseUnitOfMeasureCode) !== null && _r !== void 0 ? _r : "", requiredDate: (_s = line === null || line === void 0 ? void 0 : line.requiredDate) !== null && _s !== void 0 ? _s : undefined, storageUnitId: (_t = line === null || line === void 0 ? void 0 : line.storageUnitId) !== null && _t !== void 0 ? _t : "", supplierPartId: (_u = line === null || line === void 0 ? void 0 : line.supplierPartId) !== null && _u !== void 0 ? _u : "", supplierShippingCost: (_v = line === null || line === void 0 ? void 0 : line.supplierShippingCost) !== null && _v !== void 0 ? _v : 0, supplierTaxAmount: (_w = line === null || line === void 0 ? void 0 : line.supplierTaxAmount) !== null && _w !== void 0 ? _w : 0, supplierUnitPrice: (_x = line === null || line === void 0 ? void 0 : line.supplierUnitPrice) !== null && _x !== void 0 ? _x : 0, costCenterId: (_y = line === null || line === void 0 ? void 0 : line.costCenterId) !== null && _y !== void 0 ? _y : "", taxPercent: (_z = line === null || line === void 0 ? void 0 : line.taxPercent) !== null && _z !== void 0 ? _z : 0, assetReadableId: (_0 = line === null || line === void 0 ? void 0 : line.assetReadableId) !== null && _0 !== void 0 ? _0 : "", assetName: (_1 = line === null || line === void 0 ? void 0 : line.assetName) !== null && _1 !== void 0 ? _1 : "" }, (0, form_2.getCustomFields)(line === null || line === void 0 ? void 0 : line.customFields));
    return (<jsx_runtime_1.Fragment key={lineId}>
      <PurchaseOrder_1.PurchaseOrderLineForm key={initialValues.id} initialValues={initialValues}/>
      <SupplierInteraction_1.SupplierInteractionLineNotes id={(_2 = line === null || line === void 0 ? void 0 : line.id) !== null && _2 !== void 0 ? _2 : ""} table="purchaseOrderLine" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} subTitle={line.purchaseOrderLineType === "Fixed Asset"
            ? ((_4 = (_3 = line.assetName) !== null && _3 !== void 0 ? _3 : line.description) !== null && _4 !== void 0 ? _4 : "")
            : line.purchaseOrderLineType === "G/L Account"
                ? ((_5 = line.description) !== null && _5 !== void 0 ? _5 : "")
                : ((_6 = line.itemReadableId) !== null && _6 !== void 0 ? _6 : "")} internalNotes={line.internalNotes} externalNotes={line.externalNotes}/>

      <components_1.DeferredFiles resolve={files}>
        {function (resolvedFiles) { return (<SupplierInteraction_1.SupplierInteractionLineDocuments files={resolvedFiles !== null && resolvedFiles !== void 0 ? resolvedFiles : []} id={orderId} lineId={lineId} type="Purchase Order"/>); }}
      </components_1.DeferredFiles>
      <components_1.CadModel isReadOnly={isReadOnly || !permissions.can("update", "purchasing")} metadata={{
            itemId: (_7 = line === null || line === void 0 ? void 0 : line.itemId) !== null && _7 !== void 0 ? _7 : undefined
        }} modelPath={(_8 = line === null || line === void 0 ? void 0 : line.modelPath) !== null && _8 !== void 0 ? _8 : null} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>

      <react_router_1.Outlet />
    </jsx_runtime_1.Fragment>);
}
var templateObject_1, templateObject_2;
