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
exports.default = EditApprovalRuleRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, rule, _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings",
                        role: "employee"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Rule ID is required");
                    return [4 /*yield*/, (0, shared_1.getApprovalRuleById)(client, id, companyId)];
                case 2:
                    rule = _h.sent();
                    if (!rule.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.approvalRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rule.error, "Failed to load approval rule"))];
                case 3: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 4:
                    if (!!rule.data) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.approvalRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Approval rule not found"))];
                case 5: throw _f.apply(void 0, _g.concat([_h.sent()]));
                case 6: return [2 /*return*/, {
                        rule: rule.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, serviceRole, id, formData, validation, rules, existingRule, _d, _e, result, _f, _g, _h, _j;
        var _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings",
                            role: "employee"
                        })];
                case 1:
                    _c = _p.sent(), companyId = _c.companyId, userId = _c.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    id = params.id;
                    if (!id)
                        throw new Error("Rule ID is required");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _p.sent();
                    return [4 /*yield*/, (0, form_1.validator)(shared_1.approvalRuleValidator).validate(formData)];
                case 3:
                    validation = _p.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, shared_1.getApprovalRules)(serviceRole, companyId)];
                case 4:
                    rules = _p.sent();
                    existingRule = (_k = rules.data) === null || _k === void 0 ? void 0 : _k.find(function (r) { return r.id === id; });
                    if (!!existingRule) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.approvalRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Approval rule not found"))];
                case 5: throw _d.apply(void 0, _e.concat([_p.sent()]));
                case 6: return [4 /*yield*/, (0, shared_1.upsertApprovalRule)(serviceRole, {
                        id: id,
                        updatedBy: userId,
                        documentType: validation.data.documentType,
                        enabled: validation.data.enabled,
                        approverGroupIds: validation.data.approverGroupIds || [],
                        defaultApproverId: validation.data.defaultApproverId,
                        lowerBoundAmount: (_l = validation.data.lowerBoundAmount) !== null && _l !== void 0 ? _l : 0
                    })];
                case 7:
                    result = _p.sent();
                    if (!result.error) return [3 /*break*/, 9];
                    _f = react_router_1.redirect;
                    _g = ["".concat(path_1.path.to.approvalRule(id), "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, (_o = (_m = result.error) === null || _m === void 0 ? void 0 : _m.message) !== null && _o !== void 0 ? _o : "Failed to update approval rule."))];
                case 8: throw _f.apply(void 0, _g.concat([_p.sent()]));
                case 9:
                    _h = react_router_1.redirect;
                    _j = ["".concat(path_1.path.to.approvalRules, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Approval rule updated"))];
                case 10: throw _h.apply(void 0, _j.concat([_p.sent()]));
            }
        });
    });
}
function EditApprovalRuleRoute() {
    var rule = (0, react_router_1.useLoaderData)().rule;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var onClose = function () {
        return navigate("".concat(path_1.path.to.approvalRules, "?").concat(params.toString()));
    };
    return (<settings_1.ApprovalRuleForm rule={rule} documentType={rule.documentType} onClose={onClose}/>);
}
