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
exports.loader = loader;
exports.action = action;
exports.clientAction = clientAction;
exports.default = EditCustomerTypesRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var CustomerTypes_1 = require("~/modules/sales/ui/CustomerTypes");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, customerTypeId, customerType, _c, _d;
        var _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales",
                        role: "employee"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    customerTypeId = params.customerTypeId;
                    if (!customerTypeId)
                        throw (0, auth_1.notFound)("customerTypeId not found");
                    return [4 /*yield*/, (0, sales_1.getCustomerType)(client, customerTypeId)];
                case 2:
                    customerType = _g.sent();
                    if (!((_e = customerType === null || customerType === void 0 ? void 0 : customerType.data) === null || _e === void 0 ? void 0 : _e.protected)) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = ["".concat(path_1.path.to.customerTypes, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Cannot edit a protected customer type"))];
                case 3: throw _c.apply(void 0, _d.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        customerType: (_f = customerType === null || customerType === void 0 ? void 0 : customerType.data) !== null && _f !== void 0 ? _f : null
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, validation, _d, id, d, updateCustomerType, _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.customerTypeValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, sales_1.upsertCustomerType)(client, __assign(__assign({ id: id }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 4:
                    updateCustomerType = _j.sent();
                    if (!updateCustomerType.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateCustomerType.error, "Failed to update customer type"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_j.sent()]))];
                case 6:
                    _g = react_router_1.redirect;
                    _h = ["".concat(path_1.path.to.customerTypes, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated customer type"))];
                case 7: throw _g.apply(void 0, _h.concat([_j.sent()]));
            }
        });
    });
}
function clientAction(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c;
        var serverAction = _b.serverAction;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (_c = window.clientCache) === null || _c === void 0 ? void 0 : _c.setQueryData((0, react_query_1.customerTypesQuery)((0, react_query_1.getCompanyId)()).queryKey, null);
                    return [4 /*yield*/, serverAction()];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function EditCustomerTypesRoute() {
    var _a, _b;
    var customerType = (0, react_router_1.useLoaderData)().customerType;
    var navigate = (0, react_router_1.useNavigate)();
    var initialValues = __assign({ id: (_a = customerType === null || customerType === void 0 ? void 0 : customerType.id) !== null && _a !== void 0 ? _a : undefined, name: (_b = customerType === null || customerType === void 0 ? void 0 : customerType.name) !== null && _b !== void 0 ? _b : "" }, (0, form_2.getCustomFields)(customerType === null || customerType === void 0 ? void 0 : customerType.customFields));
    return (<CustomerTypes_1.CustomerTypeForm key={initialValues.id} initialValues={initialValues} onClose={function () { return navigate(-1); }}/>);
}
