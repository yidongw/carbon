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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = AuditLogRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var audit_1 = require("@carbon/database/audit");
var plan_server_1 = require("@carbon/ee/plan.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var usePlanGate_1 = require("~/hooks/usePlanGate");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Audit Log"], ["Audit Log"]))),
    to: path_1.path.to.auditLog
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, enabled, _d, _e, archives, serviceRole, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    enabled = false;
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, audit_1.isAuditLogEnabled)(client, companyId)];
                case 3:
                    enabled = _g.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _d = _g.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (!enabled) return [3 /*break*/, 9];
                    _g.label = 6;
                case 6:
                    _g.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, audit_1.syncAuditSubscriptions)(client, companyId)];
                case 7:
                    _g.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _e = _g.sent();
                    return [3 /*break*/, 9];
                case 9:
                    archives = [];
                    if (!enabled) return [3 /*break*/, 13];
                    _g.label = 10;
                case 10:
                    _g.trys.push([10, 12, , 13]);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, audit_1.getAuditLogArchives)(serviceRole, companyId)];
                case 11:
                    archives = _g.sent();
                    return [3 /*break*/, 13];
                case 12:
                    _f = _g.sent();
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, {
                        enabled: enabled,
                        archives: archives
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, actionType, _d, _e, _f, err_1, _g, _h, _j, _k, err_2, _l, _m, archiveId, _o, _p, serviceRole, downloadUrl, err_3, _q, _r, _s, _t;
        var request = _b.request;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _u.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _u.sent();
                    actionType = formData.get("action");
                    _d = actionType;
                    switch (_d) {
                        case "enable": return [3 /*break*/, 3];
                        case "disable": return [3 /*break*/, 10];
                        case "download": return [3 /*break*/, 15];
                    }
                    return [3 /*break*/, 21];
                case 3: return [4 /*yield*/, (0, plan_server_1.requirePlan)({
                        request: request,
                        client: client,
                        companyId: companyId,
                        feature: "AUDIT_LOG",
                        redirectTo: path_1.path.to.auditLog,
                        message: "Upgrade to Business to enable audit logging"
                    })];
                case 4:
                    _u.sent();
                    _u.label = 5;
                case 5:
                    _u.trys.push([5, 8, , 10]);
                    return [4 /*yield*/, (0, audit_1.enableAuditLog)(client, companyId)];
                case 6:
                    _u.sent();
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.auditLog];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Audit logging enabled"))];
                case 7: throw _e.apply(void 0, _f.concat([_u.sent()]));
                case 8:
                    err_1 = _u.sent();
                    if (err_1 instanceof Response)
                        throw err_1;
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.auditLog];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to enable audit logging"))];
                case 9: throw _g.apply(void 0, _h.concat([_u.sent()]));
                case 10:
                    _u.trys.push([10, 13, , 15]);
                    return [4 /*yield*/, (0, audit_1.disableAuditLog)(client, companyId)];
                case 11:
                    _u.sent();
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.auditLog];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Audit logging disabled"))];
                case 12: throw _j.apply(void 0, _k.concat([_u.sent()]));
                case 13:
                    err_2 = _u.sent();
                    if (err_2 instanceof Response)
                        throw err_2;
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.auditLog];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_2, "Failed to disable audit logging"))];
                case 14: throw _l.apply(void 0, _m.concat([_u.sent()]));
                case 15:
                    archiveId = formData.get("archiveId");
                    if (!!archiveId) return [3 /*break*/, 17];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.auditLog];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Archive ID is required"))];
                case 16: throw _o.apply(void 0, _p.concat([_u.sent()]));
                case 17:
                    _u.trys.push([17, 19, , 21]);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, audit_1.getArchiveDownloadUrl)(serviceRole, archiveId)];
                case 18:
                    downloadUrl = _u.sent();
                    // Redirect to the signed URL for download
                    return [2 /*return*/, (0, react_router_1.redirect)(downloadUrl)];
                case 19:
                    err_3 = _u.sent();
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.auditLog];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_3, "Failed to generate download URL"))];
                case 20: throw _q.apply(void 0, _r.concat([_u.sent()]));
                case 21:
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.auditLog];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid action"))];
                case 22: throw _s.apply(void 0, _t.concat([_u.sent()]));
            }
        });
    });
}
function AuditLogRoute() {
    var _a = (0, react_router_1.useLoaderData)(), enabled = _a.enabled, archives = _a.archives;
    var isGated = (0, usePlanGate_1.usePlanGate)({ feature: "AUDIT_LOG" }).isGated;
    if (isGated) {
        return <settings_1.AuditLogUpgradeOverlay />;
    }
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <div className="flex items-center justify-between w-full">
          <react_1.Heading size="h3">
            <macro_2.Trans>Audit Logs</macro_2.Trans>
          </react_1.Heading>
          {enabled && (<react_1.Button variant="secondary" leftIcon={<lu_1.LuHistory />} asChild>
              <react_router_1.Link to={path_1.path.to.auditLogDetails}>
                <macro_2.Trans>View All</macro_2.Trans>
              </react_router_1.Link>
            </react_1.Button>)}
        </div>
        <settings_1.AuditLogSettings enabled={enabled} archives={archives}/>
        {enabled && <react_router_1.Outlet />}
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1;
