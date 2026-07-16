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
exports.loader = void 0;
exports.action = action;
exports.default = SupplierQuoteLine;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var purchasing_1 = require("~/modules/purchasing");
var SupplierInteraction_1 = require("~/modules/purchasing/ui/SupplierInteraction");
var SupplierQuote_1 = require("~/modules/purchasing/ui/SupplierQuote");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var companyId, id, lineId, serviceRole, _c, line, prices, _d, _e;
    var _f;
    var request = _b.request, params = _b.params;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                    view: "purchasing"
                })];
            case 1:
                companyId = (_g.sent()).companyId;
                id = params.id, lineId = params.lineId;
                if (!id)
                    throw new Error("Could not find id");
                if (!lineId)
                    throw new Error("Could not find lineId");
                return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
            case 2:
                serviceRole = _g.sent();
                return [4 /*yield*/, Promise.all([
                        (0, purchasing_1.getSupplierQuoteLine)(serviceRole, lineId),
                        (0, purchasing_1.getSupplierQuoteLinePrices)(serviceRole, lineId)
                    ])];
            case 3:
                _c = _g.sent(), line = _c[0], prices = _c[1];
                if (!line.error) return [3 /*break*/, 5];
                _d = react_router_1.redirect;
                _e = [path_1.path.to.supplierQuote(id)];
                return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(line.error, "Failed to load line"))];
            case 4: throw _d.apply(void 0, _e.concat([_g.sent()]));
            case 5: return [2 /*return*/, {
                    line: line.data,
                    files: (0, purchasing_1.getSupplierInteractionLineDocuments)(serviceRole, companyId, lineId),
                    pricesByQuantity: ((_f = prices === null || prices === void 0 ? void 0 : prices.data) !== null && _f !== void 0 ? _f : []).reduce(function (acc, price) {
                        acc[price.quantity] = price;
                        return acc;
                    }, {})
                }];
        }
    });
}); };
exports.loader = loader;
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, id, lineId, viewClient, quote, formData, validation, _d, _id, d, updateSupplierQuoteLine, _e, _f;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing"
                        })];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    id = params.id, lineId = params.lineId;
                    if (!id)
                        throw new Error("Could not find id");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "purchasing"
                        })];
                case 2:
                    viewClient = (_h.sent()).client;
                    return [4 /*yield*/, (0, purchasing_1.getSupplierQuote)(viewClient, id)];
                case 3:
                    quote = _h.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, purchasing_1.isSupplierQuoteLocked)((_g = quote.data) === null || _g === void 0 ? void 0 : _g.status),
                            redirectTo: path_1.path.to.supplierQuote(id),
                            message: "Cannot modify a locked supplier quote. Reopen it first."
                        })];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(purchasing_1.supplierQuoteLineValidator).validate(formData)];
                case 6:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, _id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, purchasing_1.upsertSupplierQuoteLine)(client, __assign(__assign({ id: lineId }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 7:
                    updateSupplierQuoteLine = _h.sent();
                    if (!updateSupplierQuoteLine.error) return [3 /*break*/, 9];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.supplierQuoteLine(id, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateSupplierQuoteLine.error, "Failed to update supplierQuote line"))];
                case 8: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 9: throw (0, react_router_1.redirect)(path_1.path.to.supplierQuoteLine(id, lineId));
            }
        });
    });
}
function SupplierQuoteLine() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var t = (0, macro_1.useLingui)().t;
    var _u = (0, react_router_1.useLoaderData)(), line = _u.line, files = _u.files, pricesByQuantity = _u.pricesByQuantity;
    var _v = (0, react_router_1.useParams)(), id = _v.id, lineId = _v.lineId;
    if (!id)
        throw new Error("Could not find id");
    if (!lineId)
        throw new Error("Could not find lineId");
    var routeData = (0, react_1.useRouteData)(path_1.path.to.supplierQuote(id));
    var exchangeRate = (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.exchangeRate) !== null && _b !== void 0 ? _b : 1;
    var initialValues = __assign(__assign({}, line), { id: (_c = line.id) !== null && _c !== void 0 ? _c : undefined, supplierQuoteId: (_d = line.supplierQuoteId) !== null && _d !== void 0 ? _d : "", supplierQuoteLineType: ((_e = line.supplierQuoteLineType) !== null && _e !== void 0 ? _e : "Part"), supplierPartId: (_f = line.supplierPartId) !== null && _f !== void 0 ? _f : "", supplierPartRevision: (_g = line.supplierPartRevision) !== null && _g !== void 0 ? _g : "", description: (_h = line.description) !== null && _h !== void 0 ? _h : "", itemId: (_j = line.itemId) !== null && _j !== void 0 ? _j : "", accountId: (_k = line.accountId) !== null && _k !== void 0 ? _k : undefined, costCenterId: (_l = line.costCenterId) !== null && _l !== void 0 ? _l : undefined, requiredDate: (_m = line.requiredDate) !== null && _m !== void 0 ? _m : undefined, quantity: (_o = line.quantity) !== null && _o !== void 0 ? _o : [1], inventoryUnitOfMeasureCode: (_p = line.inventoryUnitOfMeasureCode) !== null && _p !== void 0 ? _p : "", purchaseUnitOfMeasureCode: (_q = line.purchaseUnitOfMeasureCode) !== null && _q !== void 0 ? _q : "", conversionFactor: (_r = line.conversionFactor) !== null && _r !== void 0 ? _r : undefined, itemType: ((_s = line.itemType) !== null && _s !== void 0 ? _s : "Part") });
    return (<react_2.Fragment key={lineId}>
      <SupplierQuote_1.SupplierQuoteLineForm key={lineId} initialValues={initialValues}/>
      <SupplierInteraction_1.SupplierInteractionLineNotes id={line.id} table="supplierQuoteLine" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} subTitle={(_t = line.itemReadableId) !== null && _t !== void 0 ? _t : ""} internalNotes={line.internalNotes} externalNotes={line.externalNotes}/>
      <SupplierQuote_1.SupplierQuoteLinePricing line={line} pricesByQuantity={pricesByQuantity} exchangeRate={exchangeRate}/>

      <components_1.DeferredFiles resolve={files}>
        {function (resolvedFiles) { return (<SupplierInteraction_1.SupplierInteractionLineDocuments files={resolvedFiles !== null && resolvedFiles !== void 0 ? resolvedFiles : []} id={id} lineId={lineId} type="Supplier Quote"/>); }}
      </components_1.DeferredFiles>

      <react_router_1.Outlet />
    </react_2.Fragment>);
}
var templateObject_1;
