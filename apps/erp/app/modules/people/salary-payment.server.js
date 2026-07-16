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
exports.processRecordSalaryPayment = processRecordSalaryPayment;
exports.handleRecordSalaryPaymentAction = handleRecordSalaryPaymentAction;
var auth_1 = require("@carbon/auth");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var people_models_1 = require("./people.models");
var people_service_1 = require("./people.service");
function processRecordSalaryPayment(client, companyId, paidBy, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var validation, record, amountOwed, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, form_1.validator)(people_models_1.salaryPaymentValidator).validate(formData)];
                case 1:
                    validation = _a.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error, validation.submittedData)];
                    }
                    return [4 /*yield*/, (0, people_service_1.getSalaryRecordBalances)(client, validation.data.salaryRecordId, companyId)];
                case 2:
                    record = _a.sent();
                    if (record.error || !record.data) {
                        return [2 /*return*/, { error: "Salary record not found" }];
                    }
                    amountOwed = (0, people_service_1.getAmountOwed)(record.data);
                    if (amountOwed <= 0) {
                        return [2 /*return*/, { error: "Nothing outstanding to pay" }];
                    }
                    if (validation.data.amount > amountOwed) {
                        return [2 /*return*/, (0, form_1.validationError)({
                                fieldErrors: {
                                    amount: "Amount cannot exceed outstanding balance (".concat(amountOwed, ")")
                                },
                                formId: validation.formId
                            }, validation.submittedData)];
                    }
                    return [4 /*yield*/, (0, people_service_1.recordSalaryPayment)(client, __assign(__assign({}, validation.data), { companyId: companyId, paidBy: paidBy }))];
                case 3:
                    result = _a.sent();
                    if (result.error) {
                        return [2 /*return*/, { error: result.error.message }];
                    }
                    return [2 /*return*/, { ok: true }];
            }
        });
    });
}
/** Document navigation: redirect back with flash on success or business error. */
function handleRecordSalaryPaymentAction(request, client, companyId, paidBy, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var returnTo, result, _a, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    returnTo = (_e = formData.get("returnTo")) !== null && _e !== void 0 ? _e : path_1.path.to.accountingSalary;
                    return [4 /*yield*/, processRecordSalaryPayment(client, companyId, paidBy, formData)];
                case 1:
                    result = _f.sent();
                    if (!("ok" in result && result.ok)) return [3 /*break*/, 3];
                    _a = react_router_1.redirect;
                    _b = [returnTo];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Payment recorded successfully"))];
                case 2: throw _a.apply(void 0, _b.concat([_f.sent()]));
                case 3:
                    if (!("error" in result && result.error)) return [3 /*break*/, 5];
                    _c = react_router_1.redirect;
                    _d = [returnTo];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, result.error))];
                case 4: throw _c.apply(void 0, _d.concat([_f.sent()]));
                case 5: return [2 /*return*/, result];
            }
        });
    });
}
