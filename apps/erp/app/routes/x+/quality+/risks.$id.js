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
exports.action = exports.loader = void 0;
exports.default = EditRiskRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var react_router_1 = require("react-router");
var tiny_invariant_1 = require("tiny-invariant");
var quality_models_1 = require("~/modules/quality/quality.models");
var quality_service_1 = require("~/modules/quality/quality.service");
var RiskRegisterForm_1 = require("~/modules/quality/ui/RiskRegister/RiskRegisterForm");
var path_1 = require("~/utils/path");
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var client, id, risk;
    var request = _b.request, params = _b.params;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                    view: "quality",
                    role: "employee"
                })];
            case 1:
                client = (_c.sent()).client;
                id = params.id;
                (0, tiny_invariant_1.default)(id, "id is required");
                return [4 /*yield*/, (0, quality_service_1.getRisk)(client, id)];
            case 2:
                risk = _c.sent();
                if (risk.error || !risk.data) {
                    throw new Response("Not Found", { status: 404 });
                }
                return [2 /*return*/, (0, react_router_1.data)({ risk: risk.data })];
        }
    });
}); };
exports.loader = loader;
var action = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, client, userId, companyId, formData, validation, riskId, existingRisk, previousAssignee, severity, likelihood, result, _d, _e, newAssignee, err_1, _f, _g;
    var _h, _j, _k;
    var request = _b.request;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                    update: "quality",
                    role: "employee"
                })];
            case 1:
                _c = _l.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                return [4 /*yield*/, request.formData()];
            case 2:
                formData = _l.sent();
                return [4 /*yield*/, (0, form_1.validator)(quality_models_1.riskRegisterValidator).validate(formData)];
            case 3:
                validation = _l.sent();
                if (validation.error) {
                    return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                }
                riskId = validation.data.id;
                return [4 /*yield*/, (0, quality_service_1.getRisk)(client, riskId)];
            case 4:
                existingRisk = _l.sent();
                previousAssignee = (_h = existingRisk.data) === null || _h === void 0 ? void 0 : _h.assignee;
                severity = parseInt((_j = validation.data.severity) !== null && _j !== void 0 ? _j : "1", 10);
                likelihood = parseInt((_k = validation.data.likelihood) !== null && _k !== void 0 ? _k : "1", 10);
                return [4 /*yield*/, (0, quality_service_1.upsertRisk)(client, __assign(__assign({}, validation.data), { id: riskId, assignee: validation.data.assignee || undefined, severity: severity, likelihood: likelihood, companyId: companyId, updatedBy: userId }))];
            case 5:
                result = _l.sent();
                if (!result.error) return [3 /*break*/, 7];
                _d = react_router_1.redirect;
                _e = [path_1.path.to.risks];
                return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update risk"))];
            case 6: throw _d.apply(void 0, _e.concat([_l.sent()]));
            case 7:
                newAssignee = validation.data.assignee;
                if (!(newAssignee && newAssignee !== previousAssignee)) return [3 /*break*/, 11];
                _l.label = 8;
            case 8:
                _l.trys.push([8, 10, , 11]);
                return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                        companyId: companyId,
                        documentId: riskId,
                        event: notifications_1.NotificationEvent.RiskAssignment,
                        recipient: {
                            type: "user",
                            userId: newAssignee
                        },
                        from: userId
                    })];
            case 9:
                _l.sent();
                return [3 /*break*/, 11];
            case 10:
                err_1 = _l.sent();
                console.error("Failed to notify assignee", err_1);
                return [3 /*break*/, 11];
            case 11:
                _f = react_router_1.redirect;
                _g = ["".concat(path_1.path.to.risks, "?").concat((0, path_1.getParams)(request))];
                return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Risk updated successfully"))];
            case 12: throw _f.apply(void 0, _g.concat([_l.sent()]));
        }
    });
}); };
exports.action = action;
function EditRiskRoute() {
    var _a, _b, _c, _d, _e;
    var risk = (0, react_router_1.useLoaderData)().risk;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () {
        navigate(-1);
    };
    return (<RiskRegisterForm_1.default open 
    // @ts-expect-error TS2322 - TODO: fix type
    initialValues={__assign(__assign({}, risk), { id: risk.id, title: risk.title || "", description: (_a = risk.description) !== null && _a !== void 0 ? _a : undefined, itemId: (_b = risk.itemId) !== null && _b !== void 0 ? _b : undefined, source: risk.source, status: risk.status || "Open", severity: risk.severity ? risk.severity.toString() : "1", likelihood: risk.likelihood ? risk.likelihood.toString() : "1", assignee: (_c = risk.assignee) !== null && _c !== void 0 ? _c : undefined, sourceId: (_d = risk.sourceId) !== null && _d !== void 0 ? _d : undefined, type: (_e = risk.type) !== null && _e !== void 0 ? _e : "Risk" })} onClose={onClose}/>);
}
