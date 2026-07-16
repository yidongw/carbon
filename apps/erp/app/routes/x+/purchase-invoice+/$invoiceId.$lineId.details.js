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
exports.default = EditPurchaseInvoiceLineRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var invoicing_1 = require("~/modules/invoicing");
var purchasing_1 = require("~/modules/purchasing");
var SupplierInteraction_1 = require("~/modules/purchasing/ui/SupplierInteraction");
var stores_1 = require("~/stores");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, lineId, _d, purchaseInvoiceLine, files;
        var _e;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "invoicing",
                        role: "employee"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, companyId = _c.companyId;
                    lineId = params.lineId;
                    if (!lineId)
                        throw (0, auth_1.notFound)("lineId not found");
                    return [4 /*yield*/, Promise.all([
                            (0, invoicing_1.getPurchaseInvoiceLine)(client, lineId),
                            (0, purchasing_1.getSupplierInteractionLineDocuments)(client, companyId, lineId)
                        ])];
                case 2:
                    _d = _f.sent(), purchaseInvoiceLine = _d[0], files = _d[1];
                    return [2 /*return*/, {
                            purchaseInvoiceLine: (_e = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.data) !== null && _e !== void 0 ? _e : null,
                            files: files
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var invoiceId, lineId, viewClient, purchaseInvoice, _c, _d, _e, client, userId, formData, validation, _f, id, d, updatePurchaseInvoiceLine, _g, _h;
        var _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    invoiceId = params.invoiceId, lineId = params.lineId;
                    if (!invoiceId)
                        throw new Error("Could not find invoiceId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "invoicing"
                        })];
                case 1:
                    viewClient = (_k.sent()).client;
                    return [4 /*yield*/, (0, invoicing_1.getPurchaseInvoice)(viewClient, invoiceId)];
                case 2:
                    purchaseInvoice = _k.sent();
                    if (!purchaseInvoice.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.purchaseInvoiceLine(invoiceId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseInvoice.error, "Failed to load purchase invoice"))];
                case 3: throw _c.apply(void 0, _d.concat([_k.sent()]));
                case 4: return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                        request: request,
                        isLocked: (0, invoicing_1.isPurchaseInvoiceLocked)((_j = purchaseInvoice.data) === null || _j === void 0 ? void 0 : _j.status),
                        redirectTo: path_1.path.to.purchaseInvoiceLine(invoiceId, lineId),
                        message: "Cannot modify a confirmed purchase invoice."
                    })];
                case 5:
                    _k.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "invoicing"
                        })];
                case 6:
                    _e = _k.sent(), client = _e.client, userId = _e.userId;
                    return [4 /*yield*/, request.formData()];
                case 7:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(invoicing_1.purchaseInvoiceLineValidator).validate(formData)];
                case 8:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, id = _f.id, d = __rest(_f, ["id"]);
                    return [4 /*yield*/, (0, invoicing_1.upsertPurchaseInvoiceLine)(client, __assign(__assign({ id: lineId }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 9:
                    updatePurchaseInvoiceLine = _k.sent();
                    if (!updatePurchaseInvoiceLine.error) return [3 /*break*/, 11];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.purchaseInvoiceLine(invoiceId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updatePurchaseInvoiceLine.error, "Failed to update purchase invoice line"))];
                case 10: throw _g.apply(void 0, _h.concat([_k.sent()]));
                case 11: throw (0, react_router_1.redirect)(path_1.path.to.purchaseInvoiceLine(invoiceId, lineId));
            }
        });
    });
}
function EditPurchaseInvoiceLineRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    var t = (0, macro_1.useLingui)().t;
    var _1 = (0, react_router_1.useParams)(), invoiceId = _1.invoiceId, lineId = _1.lineId;
    if (!invoiceId)
        throw (0, auth_1.notFound)("invoiceId not found");
    if (!lineId)
        throw (0, auth_1.notFound)("lineId not found");
    var items = (0, stores_1.useItems)()[0];
    var _2 = (0, react_router_1.useLoaderData)(), purchaseInvoiceLine = _2.purchaseInvoiceLine, files = _2.files;
    var initialValues = __assign({ id: (_a = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.id) !== null && _a !== void 0 ? _a : undefined, invoiceId: (_b = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.invoiceId) !== null && _b !== void 0 ? _b : "", invoiceLineType: (purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.invoiceLineType) === "Comment"
            ? "Part"
            : ((_c = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.invoiceLineType) !== null && _c !== void 0 ? _c : "Part"), itemId: (_d = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.itemId) !== null && _d !== void 0 ? _d : "", accountId: (_e = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.accountId) !== null && _e !== void 0 ? _e : "", assetId: (_f = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.assetId) !== null && _f !== void 0 ? _f : "", description: (_g = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.description) !== null && _g !== void 0 ? _g : "", quantity: (_h = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.quantity) !== null && _h !== void 0 ? _h : 1, supplierUnitPrice: (_j = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.supplierUnitPrice) !== null && _j !== void 0 ? _j : 0, supplierShippingCost: (_k = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.supplierShippingCost) !== null && _k !== void 0 ? _k : 0, supplierTaxAmount: (_l = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.supplierTaxAmount) !== null && _l !== void 0 ? _l : 0, exchangeRate: (_m = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.exchangeRate) !== null && _m !== void 0 ? _m : 1, purchaseUnitOfMeasureCode: (_o = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.purchaseUnitOfMeasureCode) !== null && _o !== void 0 ? _o : "", inventoryUnitOfMeasureCode: (_p = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.inventoryUnitOfMeasureCode) !== null && _p !== void 0 ? _p : "", conversionFactor: (_q = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.conversionFactor) !== null && _q !== void 0 ? _q : 1, storageUnitId: (_r = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.storageUnitId) !== null && _r !== void 0 ? _r : "", costCenterId: (_s = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.costCenterId) !== null && _s !== void 0 ? _s : "", taxPercent: (_t = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.taxPercent) !== null && _t !== void 0 ? _t : 0, assetReadableId: (_u = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.assetReadableId) !== null && _u !== void 0 ? _u : "", assetName: (_v = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.assetName) !== null && _v !== void 0 ? _v : "" }, (0, form_2.getCustomFields)(purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.customFields));
    return (<jsx_runtime_1.Fragment key={purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.id}>
      <invoicing_1.PurchaseInvoiceLineForm key={initialValues.id} initialValues={initialValues}/>
      <SupplierInteraction_1.SupplierInteractionLineNotes id={(_w = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.id) !== null && _w !== void 0 ? _w : ""} table="purchaseInvoiceLine" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} subTitle={(purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.invoiceLineType) === "Fixed Asset"
            ? ((_y = (_x = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.assetName) !== null && _x !== void 0 ? _x : purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.description) !== null && _y !== void 0 ? _y : "")
            : (purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.invoiceLineType) === "G/L Account"
                ? ((_z = purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.description) !== null && _z !== void 0 ? _z : "")
                : ((_0 = (0, utils_1.getItemReadableId)(items, purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.itemId)) !== null && _0 !== void 0 ? _0 : "")} internalNotes={purchaseInvoiceLine === null || purchaseInvoiceLine === void 0 ? void 0 : purchaseInvoiceLine.internalNotes}/>

      <components_1.DeferredFiles resolve={files}>
        {function (resolvedFiles) { return (<SupplierInteraction_1.SupplierInteractionLineDocuments files={resolvedFiles !== null && resolvedFiles !== void 0 ? resolvedFiles : []} id={invoiceId} lineId={lineId} type="Purchase Invoice"/>); }}
      </components_1.DeferredFiles>

      <react_router_1.Outlet />
    </jsx_runtime_1.Fragment>);
}
var templateObject_1;
