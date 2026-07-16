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
exports.action = action;
exports.default = DeleteApiKeyRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var plan_server_1 = require("@carbon/ee/plan.server");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, _e, deleteApiKeyError, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "users"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, plan_server_1.requirePlan)({
                            request: request,
                            client: client,
                            companyId: companyId,
                            feature: "API_KEYS",
                            redirectTo: path_1.path.to.apiKeys
                        })];
                case 2:
                    _k.sent();
                    id = params.id;
                    if (!!id) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.itemPostingGroups];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(params, "Failed to get an id"))];
                case 3: throw _d.apply(void 0, _e.concat([_k.sent()]));
                case 4: return [4 /*yield*/, (0, settings_1.deleteApiKey)(client, id)];
                case 5:
                    deleteApiKeyError = (_k.sent()).error;
                    if (!deleteApiKeyError) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = ["".concat(path_1.path.to.apiKeys, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(deleteApiKeyError, "Failed to delete API key"))];
                case 6: throw _f.apply(void 0, _g.concat([_k.sent()]));
                case 7:
                    _h = react_router_1.redirect;
                    _j = ["".concat(path_1.path.to.apiKeys, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully deleted API key"))];
                case 8: throw _h.apply(void 0, _j.concat([_k.sent()]));
            }
        });
    });
}
function DeleteApiKeyRoute() {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.apiKeys);
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var apiKey = routeData === null || routeData === void 0 ? void 0 : routeData.apiKeys.find(function (apiKey) { return apiKey.id === id; });
    if (!apiKey)
        return null;
    var onCancel = function () { return navigate(-1); };
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteApiKey(id)} name={apiKey.name} text={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Are you sure you want to delete the API key: ", "? This cannot be undone."], ["Are you sure you want to delete the API key: ", "? This cannot be undone."])), apiKey.name)} onCancel={onCancel}/>);
}
var templateObject_1;
