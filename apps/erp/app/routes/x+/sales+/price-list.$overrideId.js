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
exports.action = action;
exports.default = EditPriceOverrideRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var PriceOverrideForm_1 = require("~/modules/sales/ui/Pricing/PriceOverrideForm");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, overrideId, override;
        var _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales",
                        role: "employee"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, companyId = _c.companyId;
                    overrideId = params.overrideId;
                    if (!overrideId)
                        throw (0, auth_1.notFound)("overrideId not found");
                    return [4 /*yield*/, (0, sales_1.getCustomerItemPriceOverrideById)(client, overrideId, companyId)];
                case 2:
                    override = _e.sent();
                    return [2 /*return*/, { override: (_d = override === null || override === void 0 ? void 0 : override.data) !== null && _d !== void 0 ? _d : null }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, overrideId, formData, validation, breaksRaw, breaksParsed, breaksResult, breaks, _d, customerId, customerTypeId, itemId, active, applyRulesOnTop, notes, validFrom, validTo, result, _e, _f, _g, _h;
        var _j, _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    overrideId = params.overrideId;
                    if (!overrideId)
                        throw (0, auth_1.notFound)("overrideId not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _l.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.priceOverrideValidator).validate(formData)];
                case 3:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    breaksRaw = formData.get("breaks");
                    try {
                        breaksParsed = breaksRaw ? JSON.parse(String(breaksRaw)) : [];
                    }
                    catch (_m) {
                        return [2 /*return*/, (0, form_1.validationError)({
                                fieldErrors: { breaks: "Breaks must be valid JSON" }
                            })];
                    }
                    breaksResult = sales_1.priceOverrideBreaksValidator.safeParse(breaksParsed);
                    if (!breaksResult.success) {
                        return [2 /*return*/, (0, form_1.validationError)({
                                fieldErrors: {
                                    breaks: (_k = (_j = breaksResult.error.issues[0]) === null || _j === void 0 ? void 0 : _j.message) !== null && _k !== void 0 ? _k : "Invalid breaks payload"
                                }
                            })];
                    }
                    breaks = breaksResult.data;
                    _d = validation.data, customerId = _d.customerId, customerTypeId = _d.customerTypeId, itemId = _d.itemId, active = _d.active, applyRulesOnTop = _d.applyRulesOnTop, notes = _d.notes, validFrom = _d.validFrom, validTo = _d.validTo;
                    return [4 /*yield*/, (0, sales_1.upsertCustomerItemPriceOverride)(client, companyId, userId, {
                            id: overrideId,
                            customerId: customerId || undefined,
                            customerTypeId: customerTypeId || undefined,
                            itemId: itemId,
                            breaks: breaks,
                            active: active,
                            applyRulesOnTop: applyRulesOnTop,
                            notes: notes,
                            validFrom: validFrom,
                            validTo: validTo
                        })];
                case 4:
                    result = _l.sent();
                    if (!result.error) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = ["".concat(path_1.path.to.salesPriceList, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update price override"))];
                case 5: throw _e.apply(void 0, _f.concat([_l.sent()]));
                case 6:
                    _g = react_router_1.redirect;
                    _h = ["".concat(path_1.path.to.salesPriceList, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Price override updated"))];
                case 7: throw _g.apply(void 0, _h.concat([_l.sent()]));
            }
        });
    });
}
function EditPriceOverrideRoute() {
    var _a, _b, _c, _d, _e, _f;
    var override = (0, react_router_1.useLoaderData)().override;
    var navigate = (0, react_router_1.useNavigate)();
    if (!override)
        return null;
    return (<PriceOverrideForm_1.default key={override.id} initialValues={{
            id: override.id,
            itemId: override.itemId,
            customerId: (_a = override.customerId) !== null && _a !== void 0 ? _a : undefined,
            customerTypeId: (_b = override.customerTypeId) !== null && _b !== void 0 ? _b : undefined,
            active: override.active,
            applyRulesOnTop: (_c = override.applyRulesOnTop) !== null && _c !== void 0 ? _c : true,
            validFrom: (_d = override.validFrom) !== null && _d !== void 0 ? _d : undefined,
            validTo: (_e = override.validTo) !== null && _e !== void 0 ? _e : undefined,
            notes: (_f = override.notes) !== null && _f !== void 0 ? _f : undefined
        }} initialBreaks={Array.isArray(override.breaks)
            ? override.breaks
            : []} onClose={function () { return navigate(-1); }}/>);
}
