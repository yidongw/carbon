"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.loader = loader;
exports.default = StorageRulesRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var usePlanGate_1 = require("~/hooks/usePlanGate");
var storageRules_1 = require("~/modules/storageRules");
var StorageRulesGroups_1 = require("~/modules/storageRules/ui/StorageRulesGroups");
var StorageRulesUpgradeOverlay_1 = require("~/modules/storageRules/ui/StorageRulesUpgradeOverlay");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Storage Rules"], ["Storage Rules"]))),
    to: path_1.path.to.storageRules
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, rules, _d, _e, ids, counts, countsData, rows;
        var _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory",
                        role: "employee"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, storageRules_1.getStorageRules)(client, companyId, {
                            search: null,
                            limit: 1000,
                            offset: 0,
                            sorts: []
                        })];
                case 2:
                    rules = _j.sent();
                    if (!rules.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.storageUnits];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rules.error, "Failed to load storage rules"))];
                case 3: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 4:
                    ids = ((_f = rules.data) !== null && _f !== void 0 ? _f : []).map(function (r) { return r.id; });
                    return [4 /*yield*/, (0, storageRules_1.getRuleAssignmentCounts)(client, ids)];
                case 5:
                    counts = _j.sent();
                    countsData = ((_g = counts.data) !== null && _g !== void 0 ? _g : {});
                    rows = ((_h = rules.data) !== null && _h !== void 0 ? _h : []).map(function (r) {
                        var _a;
                        return (__assign(__assign({}, r), { assignmentCount: (_a = countsData[r.id]) !== null && _a !== void 0 ? _a : 0 }));
                    });
                    return [2 /*return*/, { rows: rows }];
            }
        });
    });
}
function StorageRulesRoute() {
    var rows = (0, react_router_1.useLoaderData)().rows;
    var isGated = (0, usePlanGate_1.usePlanGate)({ feature: "STORAGE_RULES" }).isGated;
    if (isGated) {
        return <StorageRulesUpgradeOverlay_1.default />;
    }
    return (<>
      <StorageRulesGroups_1.default rules={rows}/>
      <react_router_1.Outlet />
    </>);
}
var templateObject_1;
