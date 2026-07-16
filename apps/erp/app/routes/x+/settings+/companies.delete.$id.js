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
exports.default = DeleteSubsidiaryRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, id, subsidiary, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("Subsidiary not found");
                    return [4 /*yield*/, (0, settings_1.getSubsidiary)(client, id)];
                case 2:
                    subsidiary = _e.sent();
                    if (!subsidiary.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(subsidiary.error, "Failed to get subsidiary"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, { subsidiary: subsidiary.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, _c, _d, deleteError, _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        delete: "settings"
                    })];
                case 1:
                    _j.sent();
                    id = params.id;
                    if (!!id) return [3 /*break*/, 3];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(params, "Failed to get subsidiary id"))];
                case 2: throw _c.apply(void 0, _d.concat([_j.sent()]));
                case 3: return [4 /*yield*/, (0, settings_1.deleteSubsidiary)((0, client_server_1.getCarbonServiceRole)(), id)];
                case 4:
                    deleteError = (_j.sent()).error;
                    if (!deleteError) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(deleteError, "Failed to delete subsidiary"))];
                case 5: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 6:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully deleted subsidiary"))];
                case 7: throw _g.apply(void 0, _h.concat([_j.sent()]));
            }
        });
    });
}
function DeleteSubsidiaryRoute() {
    var id = (0, react_router_1.useParams)().id;
    var subsidiary = (0, react_router_1.useLoaderData)().subsidiary;
    var navigate = (0, react_router_1.useNavigate)();
    if (!id || !subsidiary)
        return null;
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteCompany(id)} name={subsidiary.name} text={"Are you sure you want to delete ".concat(subsidiary.name, "? Any child companies will be promoted to this company's parent level. This cannot be undone.")} onCancel={function () { return navigate(path_1.path.to.companies); }}/>);
}
