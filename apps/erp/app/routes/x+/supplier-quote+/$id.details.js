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
exports.loader = loader;
exports.action = action;
exports.default = SupplierQuoteDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var purchasing_1 = require("~/modules/purchasing");
var SupplierInteraction_1 = require("~/modules/purchasing/ui/SupplierInteraction");
var SupplierInteractionState_1 = require("~/modules/purchasing/ui/SupplierInteraction/SupplierInteractionState");
var SupplierQuoteSummary_1 = require("~/modules/purchasing/ui/SupplierQuote/SupplierQuoteSummary");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, id, quote, _c, _d;
        var _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing"
                    })];
                case 1:
                    client = (_j.sent()).client;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, purchasing_1.getSupplierQuote)(client, id)];
                case 2:
                    quote = _j.sent();
                    if (!quote.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.supplierQuotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to load supplier quote"))];
                case 3: throw _c.apply(void 0, _d.concat([_j.sent()]));
                case 4: return [2 /*return*/, {
                        internalNotes: ((_f = (_e = quote.data) === null || _e === void 0 ? void 0 : _e.internalNotes) !== null && _f !== void 0 ? _f : {}),
                        externalNotes: ((_h = (_g = quote.data) === null || _g === void 0 ? void 0 : _g.externalNotes) !== null && _h !== void 0 ? _h : {})
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyGroupId, userId, id, viewClient, quote, formData, validation, result, _d, _e, _f, _g;
        var _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "purchasing"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "purchasing"
                        })];
                case 2:
                    viewClient = (_j.sent()).client;
                    return [4 /*yield*/, (0, purchasing_1.getSupplierQuote)(viewClient, id)];
                case 3:
                    quote = _j.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, purchasing_1.isSupplierQuoteLocked)((_h = quote.data) === null || _h === void 0 ? void 0 : _h.status),
                            redirectTo: path_1.path.to.supplierQuote(id),
                            message: "Cannot modify a locked supplier quote. Reopen it first."
                        })];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(purchasing_1.supplierQuoteValidator).validate(formData)];
                case 6:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, purchasing_1.updateSupplierQuote)(client, {
                            id: id,
                            status: validation.data.status,
                            currencyCode: validation.data.currencyCode,
                            expirationDate: validation.data.expirationDate || null,
                            supplierContactId: validation.data.supplierContactId || null,
                            supplierLocationId: validation.data.supplierLocationId || null,
                            notes: validation.data.notes,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        }, companyGroupId)];
                case 7:
                    result = _j.sent();
                    if (!result.error) return [3 /*break*/, 9];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update quote"))];
                case 8: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 9:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated quote"))];
                case 10: throw _f.apply(void 0, _g.concat([_j.sent()]));
            }
        });
    });
}
function SupplierQuoteDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    var t = (0, macro_1.useLingui)().t;
    var _1 = (0, react_router_1.useLoaderData)(), internalNotes = _1.internalNotes, externalNotes = _1.externalNotes;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplierQuote(id));
    if (!routeData)
        throw new Error("Could not find quote data");
    var initialValues = {
        id: (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "",
        supplierId: (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.supplierId) !== null && _d !== void 0 ? _d : "",
        supplierLocationId: (_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _e === void 0 ? void 0 : _e.supplierLocationId) !== null && _f !== void 0 ? _f : "",
        supplierContactId: (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _g === void 0 ? void 0 : _g.supplierContactId) !== null && _h !== void 0 ? _h : "",
        supplierReference: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _j === void 0 ? void 0 : _j.supplierReference) !== null && _k !== void 0 ? _k : "",
        quotedDate: (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _l === void 0 ? void 0 : _l.quotedDate) !== null && _m !== void 0 ? _m : "",
        expirationDate: (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _o === void 0 ? void 0 : _o.expirationDate) !== null && _p !== void 0 ? _p : "",
        supplierQuoteId: (_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _q === void 0 ? void 0 : _q.supplierQuoteId) !== null && _r !== void 0 ? _r : "",
        status: (_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _s === void 0 ? void 0 : _s.status) !== null && _t !== void 0 ? _t : "Active",
        currencyCode: (_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _u === void 0 ? void 0 : _u.currencyCode) !== null && _v !== void 0 ? _v : undefined,
        exchangeRate: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _w === void 0 ? void 0 : _w.exchangeRate) !== null && _x !== void 0 ? _x : undefined,
        exchangeRateUpdatedAt: (_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _y === void 0 ? void 0 : _y.exchangeRateUpdatedAt) !== null && _z !== void 0 ? _z : ""
    };
    return (<>
      <SupplierInteractionState_1.default interaction={routeData.interaction} siblingQuotes={(_0 = routeData.siblingQuotes) !== null && _0 !== void 0 ? _0 : []}/>
      <SupplierQuoteSummary_1.default />
      <SupplierInteraction_1.SupplierInteractionNotes key={"notes-".concat(initialValues.id)} id={routeData.quote.id} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} table="supplierQuote" internalNotes={internalNotes} externalNotes={externalNotes}/>
      <components_1.DeferredFiles key={"documents-".concat(id)} resolve={routeData.files}>
        {function (resolvedFiles) { return (<SupplierInteraction_1.SupplierInteractionDocuments interactionId={routeData.interaction.id} attachments={resolvedFiles} id={id} type="Supplier Quote"/>); }}
      </components_1.DeferredFiles>
    </>);
}
var templateObject_1;
