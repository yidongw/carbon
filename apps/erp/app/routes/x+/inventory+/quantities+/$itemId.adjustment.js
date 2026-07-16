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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var storage_rules_server_1 = require("@carbon/ee/storage-rules.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, itemId, formData, validation, d, acknowledged, serviceRole, qty, evalLine, itemPass, allViolations, allRuleNames, isNegative, binSurface, binPass, deduped, itemLedger, flashMessage, _d, _e;
        var _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "inventory"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(inventory_1.inventoryAdjustmentValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    d = __rest(validation.data, []);
                    acknowledged = formData.get("acknowledged") === "true";
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    qty = Number((_f = d.quantity) !== null && _f !== void 0 ? _f : 0);
                    evalLine = [
                        {
                            lineId: itemId,
                            itemId: itemId,
                            storageUnitId: (_g = d.storageUnitId) !== null && _g !== void 0 ? _g : null,
                            quantity: qty,
                            locationId: d.locationId
                        }
                    ];
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "item",
                            surface: "inventoryAdjustment",
                            lines: evalLine
                        })];
                case 4:
                    itemPass = _j.sent();
                    allViolations = __spreadArray([], itemPass.violations, true);
                    allRuleNames = __assign({}, itemPass.ruleNames);
                    if (!d.storageUnitId) return [3 /*break*/, 6];
                    isNegative = d.adjustmentType === "Negative Adjmt.";
                    binSurface = isNegative ? "pick" : "place";
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "item",
                            surface: binSurface,
                            lines: evalLine
                        })];
                case 5:
                    binPass = _j.sent();
                    allViolations.push.apply(allViolations, binPass.violations);
                    Object.assign(allRuleNames, binPass.ruleNames);
                    _j.label = 6;
                case 6:
                    deduped = (0, storage_rules_server_1.dedupeViolations)(allViolations);
                    if (deduped.length > 0 && (0, storage_rules_server_1.isBlocked)(deduped, acknowledged)) {
                        return [2 /*return*/, {
                                error: null,
                                data: null,
                                violations: deduped,
                                ruleNames: allRuleNames
                            }];
                    }
                    return [4 /*yield*/, (0, inventory_1.insertManualInventoryAdjustment)(client, __assign(__assign({}, d), { companyId: companyId, createdBy: userId }))];
                case 7:
                    itemLedger = _j.sent();
                    if (!itemLedger.error) return [3 /*break*/, 9];
                    flashMessage = itemLedger.error === "Insufficient quantity for negative adjustment"
                        ? "Insufficient quantity for negative adjustment"
                        : itemLedger.error === "Serial number not found"
                            ? "Serial number not found"
                            : "Failed to create manual inventory adjustment";
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.inventoryItem(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(itemLedger.error, flashMessage))];
                case 8: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 9: throw (0, react_router_1.redirect)((_h = (0, path_1.requestReferrer)(request)) !== null && _h !== void 0 ? _h : path_1.path.to.inventoryItem(itemId));
            }
        });
    });
}
