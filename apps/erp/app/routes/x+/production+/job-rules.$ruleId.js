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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = EditJobRuleRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var people_1 = require("~/modules/people");
var JobRules_1 = require("~/modules/production/ui/JobRules");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, ruleId, _c, rule, groups, _d, _e;
        var _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    ruleId = params.ruleId;
                    if (!ruleId)
                        throw (0, react_router_1.redirect)(path_1.path.to.jobRules);
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.getJobAssignmentRule)(client, ruleId),
                            client.from("group").select("id, name").order("name", { ascending: true })
                        ])];
                case 2:
                    _c = _g.sent(), rule = _c[0], groups = _c[1];
                    if (!(rule.error || !rule.data)) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.jobRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rule.error, "Rule not found"))];
                case 3: throw _d.apply(void 0, _e.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        rule: rule.data,
                        groups: (_f = groups.data) !== null && _f !== void 0 ? _f : []
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, ruleId, formData, active, result_1, validation, result, _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    ruleId = params.ruleId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    if (!(formData.get("_action") === "toggle")) return [3 /*break*/, 4];
                    active = formData.get("active") === "on";
                    return [4 /*yield*/, client
                            .from("jobAssignmentRule")
                            .update({
                            active: active,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", ruleId)];
                case 3:
                    result_1 = _h.sent();
                    if (result_1.error) {
                        return [2 /*return*/, { error: result_1.error }];
                    }
                    return [2 /*return*/, { ok: true }];
                case 4: return [4 /*yield*/, (0, form_1.validator)(people_1.jobAssignmentRuleValidator).validate(formData)];
                case 5:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, people_1.upsertJobAssignmentRule)(client, __assign(__assign({}, validation.data), { id: ruleId, companyId: companyId, userId: userId }))];
                case 6:
                    result = _h.sent();
                    if (!result.error) return [3 /*break*/, 8];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.jobRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update rule"))];
                case 7: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 8:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.jobRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Assignment rule updated"))];
                case 9: throw _f.apply(void 0, _g.concat([_h.sent()]));
            }
        });
    });
}
function EditJobRuleRoute() {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = (0, react_router_1.useLoaderData)(), rule = _h.rule, groups = _h.groups;
    var navigate = (0, react_router_1.useNavigate)();
    return (<JobRules_1.JobRuleForm initialValues={{
            id: (_a = rule.id) !== null && _a !== void 0 ? _a : undefined,
            name: (_b = rule.name) !== null && _b !== void 0 ? _b : "",
            description: (_c = rule.description) !== null && _c !== void 0 ? _c : "",
            conditions: JSON.stringify((_d = rule.conditions) !== null && _d !== void 0 ? _d : []),
            targetGroupId: (_e = rule.targetGroupId) !== null && _e !== void 0 ? _e : "",
            priority: (_f = rule.priority) !== null && _f !== void 0 ? _f : 0,
            active: (_g = rule.active) !== null && _g !== void 0 ? _g : true
        }} groups={groups} onClose={function () { return navigate(path_1.path.to.jobRules); }}/>);
}
