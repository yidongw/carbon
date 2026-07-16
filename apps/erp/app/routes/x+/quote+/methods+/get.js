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
exports.action = action;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, formData, type, configurationStr, configuration, serviceRole, validation, _d, quoteId, quoteLineId, itemId, lineMethodPayload, lineMethod, validation, copyLine, validation, makeMethodPayload, makeMethod;
        var _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "sales"
                    })];
                case 1:
                    _c = _f.sent(), companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _f.sent();
                    type = formData.get("type");
                    configurationStr = formData.get("configuration");
                    configuration = configurationStr
                        ? JSON.parse(configurationStr)
                        : undefined;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    if (!(type === "item")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.getMethodValidator).validate(formData)];
                case 3:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data.targetId.split(":"), quoteId = _d[0], quoteLineId = _d[1];
                    itemId = validation.data.sourceId;
                    lineMethodPayload = {
                        itemId: itemId,
                        quoteId: quoteId,
                        quoteLineId: quoteLineId,
                        companyId: companyId,
                        userId: userId,
                        parts: {
                            billOfMaterial: validation.data.billOfMaterial,
                            billOfProcess: validation.data.billOfProcess,
                            parameters: validation.data.parameters,
                            tools: validation.data.tools,
                            steps: validation.data.steps,
                            workInstructions: validation.data.workInstructions
                        }
                    };
                    // Only add configuration if it exists
                    if (configuration !== undefined) {
                        lineMethodPayload.configuration = configuration;
                    }
                    return [4 /*yield*/, (0, sales_1.upsertQuoteLineMethod)(serviceRole, lineMethodPayload)];
                case 4:
                    lineMethod = _f.sent();
                    return [2 /*return*/, {
                            error: lineMethod.error ? "Failed to get quote line method" : null
                        }];
                case 5:
                    if (!(type === "quoteLine")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.getMethodValidator).validate(formData)];
                case 6:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, sales_1.copyQuoteLine)(serviceRole, __assign(__assign({}, validation.data), { companyId: companyId, userId: userId }))];
                case 7:
                    copyLine = _f.sent();
                    return [2 /*return*/, {
                            error: copyLine.error ? "Failed to copy quote line" : null
                        }];
                case 8:
                    if (!(type === "method")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.getMethodValidator).validate(formData)];
                case 9:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    makeMethodPayload = __assign(__assign({}, validation.data), { companyId: companyId, userId: userId, parts: {
                            billOfMaterial: validation.data.billOfMaterial,
                            billOfProcess: validation.data.billOfProcess,
                            parameters: validation.data.parameters,
                            tools: validation.data.tools,
                            steps: validation.data.steps,
                            workInstructions: validation.data.workInstructions
                        } });
                    // Only add configuration if it exists
                    if (configuration !== undefined) {
                        makeMethodPayload.configuration = configuration;
                    }
                    return [4 /*yield*/, (0, sales_1.upsertQuoteMaterialMakeMethod)(serviceRole, makeMethodPayload)];
                case 10:
                    makeMethod = _f.sent();
                    if (makeMethod.error) {
                        return [2 /*return*/, {
                                error: makeMethod.error
                                    ? "Failed to insert quote material make method"
                                    : null
                            }];
                    }
                    throw (0, react_router_1.redirect)((_e = (0, path_1.requestReferrer)(request)) !== null && _e !== void 0 ? _e : path_1.path.to.quotes);
                case 11: return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid type" }, { status: 400 })];
            }
        });
    });
}
