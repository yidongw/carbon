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
exports.clientAction = clientAction;
exports.default = DeletePaymentTermRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var accounting_1 = require("~/modules/accounting");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, paymentTermId, paymentTerm, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    paymentTermId = params.paymentTermId;
                    if (!paymentTermId)
                        throw (0, auth_1.notFound)("paymentTermId not found");
                    return [4 /*yield*/, (0, accounting_1.getPaymentTerm)(client, paymentTermId)];
                case 2:
                    paymentTerm = _e.sent();
                    if (!paymentTerm.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = ["".concat(path_1.path.to.paymentTerms, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(paymentTerm.error, "Failed to get payment term"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, { paymentTerm: paymentTerm.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, paymentTermId, _c, _d, deleteTypeError, _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        delete: "accounting"
                    })];
                case 1:
                    client = (_j.sent()).client;
                    paymentTermId = params.paymentTermId;
                    if (!!paymentTermId) return [3 /*break*/, 3];
                    _c = react_router_1.redirect;
                    _d = ["".concat(path_1.path.to.paymentTerms, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(params, "Failed to get an payment term id"))];
                case 2: throw _c.apply(void 0, _d.concat([_j.sent()]));
                case 3: return [4 /*yield*/, (0, accounting_1.deletePaymentTerm)(client, paymentTermId)];
                case 4:
                    deleteTypeError = (_j.sent()).error;
                    if (!deleteTypeError) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = ["".concat(path_1.path.to.paymentTerms, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(deleteTypeError, "Failed to delete payment term"))];
                case 5: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 6:
                    _g = react_router_1.redirect;
                    _h = ["".concat(path_1.path.to.paymentTerms, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully deleted payment term"))];
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
                    (_c = window.clientCache) === null || _c === void 0 ? void 0 : _c.setQueryData((0, react_query_1.paymentTermsQuery)((0, react_query_1.getCompanyId)()).queryKey, null);
                    return [4 /*yield*/, serverAction()];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function DeletePaymentTermRoute() {
    var paymentTermId = (0, react_router_1.useParams)().paymentTermId;
    var paymentTerm = (0, react_router_1.useLoaderData)().paymentTerm;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    if (!paymentTermId || !paymentTerm)
        return null; // TODO - handle this better (404?)
    var onCancel = function () { return navigate(path_1.path.to.paymentTerms); };
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deletePaymentTerm(paymentTermId)} name={paymentTerm.name} text={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Are you sure you want to delete the payment term: ", "? This cannot be undone."], ["Are you sure you want to delete the payment term: ", "? This cannot be undone."])), paymentTerm.name)} onCancel={onCancel}/>);
}
var templateObject_1;
