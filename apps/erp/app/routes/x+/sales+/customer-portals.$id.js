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
exports.default = EditCustomerPortalRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var plan_server_1 = require("@carbon/ee/plan.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var CustomerPortalForm_1 = require("~/modules/sales/ui/CustomerPortals/CustomerPortalForm");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, id, customerPortal, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales",
                        role: "employee"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, (0, shared_1.getCustomerPortal)(client, id)];
                case 2:
                    customerPortal = _e.sent();
                    if (!customerPortal.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.customerPortals];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(customerPortal.error, "Failed to get customer portal"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, {
                        customerPortal: customerPortal.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, validation, _d, id, customerId, updateCustomerPortal, _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, plan_server_1.requirePlan)({
                            request: request,
                            client: client,
                            companyId: companyId,
                            feature: "CUSTOMER_PORTALS",
                            redirectTo: path_1.path.to.customerPortals
                        })];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.customerPortalValidator).validate(formData)];
                case 4:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, customerId = _d.customerId;
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, shared_1.upsertExternalLink)(client, {
                            id: id,
                            documentType: "Customer",
                            documentId: customerId,
                            customerId: customerId
                        })];
                case 5:
                    updateCustomerPortal = _j.sent();
                    if (!updateCustomerPortal.error) return [3 /*break*/, 7];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateCustomerPortal.error, "Failed to update customer portal"))];
                case 6: return [2 /*return*/, _e.apply(void 0, _f.concat([_j.sent()]))];
                case 7:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.customerPortals];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated customer portal"))];
                case 8: throw _g.apply(void 0, _h.concat([_j.sent()]));
            }
        });
    });
}
function EditCustomerPortalRoute() {
    var _a, _b;
    var customerPortal = (0, react_router_1.useLoaderData)().customerPortal;
    var navigate = (0, react_router_1.useNavigate)();
    var initialValues = {
        id: (_a = customerPortal.id) !== null && _a !== void 0 ? _a : undefined,
        customerId: (_b = customerPortal.customerId) !== null && _b !== void 0 ? _b : ""
    };
    return (<CustomerPortalForm_1.default key={initialValues.id} initialValues={initialValues} onClose={function () { return navigate(-1); }}/>);
}
