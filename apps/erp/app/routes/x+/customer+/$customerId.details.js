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
exports.action = action;
exports.default = CustomerEditRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var sales_1 = require("~/modules/sales");
var Customer_1 = require("~/modules/sales/ui/Customer");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, validation, _d, id, d, _e, _f, update, _g, _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _l.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.customerValidator).validate(formData)];
                case 3:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    if (!!id) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.customers];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to update customer"))];
                case 4: throw _e.apply(void 0, _f.concat([_l.sent()]));
                case 5: return [4 /*yield*/, (0, sales_1.upsertCustomer)(client, __assign(__assign({ id: id }, d), { customFields: (0, form_2.setCustomFields)(formData), updatedBy: userId }))];
                case 6:
                    update = _l.sent();
                    if (!update.error) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.customers];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update customer"))];
                case 7: throw _g.apply(void 0, _h.concat([_l.sent()]));
                case 8:
                    _j = react_router_1.data;
                    _k = [null];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated customer"))];
                case 9: return [2 /*return*/, _j.apply(void 0, _k.concat([_l.sent()]))];
            }
        });
    });
}
function CustomerEditRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    var customerId = (0, react_router_1.useParams)().customerId;
    if (!customerId)
        throw new Error("Could not find customerId");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.customer(customerId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.customer))
        return null;
    var initialValues = __assign(__assign(__assign({}, routeData.customer), { id: (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : undefined, readableId: (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _c === void 0 ? void 0 : _c.readableId) !== null && _d !== void 0 ? _d : undefined, name: (_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "", customerTypeId: (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _g === void 0 ? void 0 : _g.customerTypeId) !== null && _h !== void 0 ? _h : undefined, customerStatusId: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _j === void 0 ? void 0 : _j.customerStatusId) !== null && _k !== void 0 ? _k : undefined, accountManagerId: (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _l === void 0 ? void 0 : _l.accountManagerId) !== null && _m !== void 0 ? _m : undefined, currencyCode: (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _o === void 0 ? void 0 : _o.currencyCode) !== null && _p !== void 0 ? _p : undefined, taxPercent: (_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _q === void 0 ? void 0 : _q.taxPercent) !== null && _r !== void 0 ? _r : 0, website: (_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _s === void 0 ? void 0 : _s.website) !== null && _t !== void 0 ? _t : "", salesContactId: (_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _u === void 0 ? void 0 : _u.salesContactId) !== null && _v !== void 0 ? _v : undefined, defaultCc: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _w === void 0 ? void 0 : _w.defaultCc) !== null && _x !== void 0 ? _x : [] }), (0, form_2.getCustomFields)((_y = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _y === void 0 ? void 0 : _y.customFields));
    return <Customer_1.CustomerForm key={initialValues.id} initialValues={initialValues}/>;
}
