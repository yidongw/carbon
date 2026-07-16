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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var ee_1 = require("@carbon/ee");
var hooks_server_1 = require("@carbon/ee/hooks.server");
var plan_1 = require("@carbon/ee/plan");
var plan_server_1 = require("@carbon/ee/plan.server");
var react_router_1 = require("react-router");
var settings_server_1 = require("~/modules/settings/settings.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, integrationId, integration, update, _d, _e, hooks, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings"
                        })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    integrationId = params.id;
                    if (!integrationId)
                        throw new Error("Integration ID not found");
                    if (!!(0, plan_1.isIntegrationWhitelisted)(integrationId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, plan_server_1.requirePlan)({
                            request: request,
                            client: client,
                            companyId: companyId,
                            feature: "INTEGRATIONS",
                            redirectTo: path_1.path.to.integrations
                        })];
                case 2:
                    _h.sent();
                    _h.label = 3;
                case 3:
                    integration = ee_1.integrations.find(function (i) { return i.id === integrationId; });
                    if (!integration)
                        throw new Error("Integration not found");
                    return [4 /*yield*/, (0, settings_server_1.deactivateIntegration)(client, {
                            id: integrationId,
                            companyId: companyId,
                            updatedBy: userId
                        })];
                case 4:
                    update = _h.sent();
                    if (!update.error) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.integrations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to disconnect integration"))];
                case 5: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 6:
                    hooks = (0, hooks_server_1.getIntegrationServerHooks)(integrationId);
                    if (!(hooks === null || hooks === void 0 ? void 0 : hooks.onUninstall)) return [3 /*break*/, 8];
                    return [4 /*yield*/, hooks.onUninstall(companyId)];
                case 7:
                    _h.sent();
                    _h.label = 8;
                case 8: return [4 /*yield*/, (0, settings_server_1.invalidateIntegrationHealthCache)(integrationId, companyId)];
                case 9:
                    _h.sent();
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.integrations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Disconnected ".concat(integration.name, " integration")))];
                case 10: throw _f.apply(void 0, _g.concat([_h.sent()]));
            }
        });
    });
}
