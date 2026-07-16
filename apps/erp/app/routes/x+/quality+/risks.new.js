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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
exports.default = NewRiskRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var quality_models_1 = require("~/modules/quality/quality.models");
var quality_service_1 = require("~/modules/quality/quality.service");
var RiskRegisterForm_1 = require("~/modules/quality/ui/RiskRegister/RiskRegisterForm");
var path_1 = require("~/utils/path");
var action = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, client, userId, companyId, formData, validation, _d, _, d, severity, likelihood, result, _e, _f, err_1, _g, _h;
    var _j, _k, _l, _m;
    var request = _b.request;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                    role: "employee"
                })];
            case 1:
                _c = _o.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                return [4 /*yield*/, request.formData()];
            case 2:
                formData = _o.sent();
                return [4 /*yield*/, (0, form_1.validator)(quality_models_1.riskRegisterValidator).validate(formData)];
            case 3:
                validation = _o.sent();
                if (validation.error) {
                    return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                }
                _d = validation.data, _ = _d.id, d = __rest(_d, ["id"]);
                severity = parseInt((_j = d.severity) !== null && _j !== void 0 ? _j : "1", 10);
                likelihood = parseInt((_k = d.likelihood) !== null && _k !== void 0 ? _k : "1", 10);
                return [4 /*yield*/, (0, quality_service_1.upsertRisk)(client, __assign(__assign({}, d), { assignee: (_l = d.assignee) !== null && _l !== void 0 ? _l : userId, severity: severity, likelihood: likelihood, companyId: companyId, createdBy: userId }))];
            case 4:
                result = _o.sent();
                if (!result.error) return [3 /*break*/, 6];
                _e = react_router_1.redirect;
                _f = [path_1.path.to.risks];
                return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to create risk"))];
            case 5: throw _e.apply(void 0, _f.concat([_o.sent()]));
            case 6:
                if (!(d.assignee && ((_m = result.data) === null || _m === void 0 ? void 0 : _m.id))) return [3 /*break*/, 10];
                _o.label = 7;
            case 7:
                _o.trys.push([7, 9, , 10]);
                return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                        companyId: companyId,
                        documentId: result.data.id,
                        event: notifications_1.NotificationEvent.RiskAssignment,
                        recipient: {
                            type: "user",
                            userId: d.assignee
                        },
                        from: userId
                    })];
            case 8:
                _o.sent();
                return [3 /*break*/, 10];
            case 9:
                err_1 = _o.sent();
                console.error("Failed to notify assignee", err_1);
                return [3 /*break*/, 10];
            case 10:
                _g = react_router_1.redirect;
                _h = ["".concat(path_1.path.to.risks, "?").concat((0, path_1.getParams)(request))];
                return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Risk created successfully"))];
            case 11: throw _g.apply(void 0, _h.concat([_o.sent()]));
        }
    });
}); };
exports.action = action;
function NewRiskRoute() {
    var formDisclosure = (0, react_1.useDisclosure)({
        defaultIsOpen: true
    });
    var onClose = function () {
        formDisclosure.onClose();
    };
    return (<RiskRegisterForm_1.default open={formDisclosure.isOpen} initialValues={{
            title: "",
            description: "",
            source: "General",
            status: "Open",
            severity: "1",
            likelihood: "1",
            type: "Risk"
        }} onClose={onClose}/>);
}
