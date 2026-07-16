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
// Bulk / inline update for gauge list-table cells. gaugeStatus and the
// calibration fields are intentionally NOT inline-edited (they have their own
// activate/deactivate + calibration flows), but the action handles gaugeStatus.
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, ids, field, value, stamp, run, _d;
        var _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "quality"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string" ||
                        (typeof value !== "string" && value !== null)) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    stamp = { updatedBy: userId, updatedAt: new Date().toISOString() };
                    run = function (patch) {
                        return client
                            .from("gauge")
                            .update(__assign(__assign({}, patch), stamp))
                            .in("id", ids);
                    };
                    _d = field;
                    switch (_d) {
                        case "gaugeTypeId": return [3 /*break*/, 3];
                        case "gaugeRole": return [3 /*break*/, 3];
                        case "gaugeStatus": return [3 /*break*/, 3];
                        case "locationId": return [3 /*break*/, 5];
                        case "supplierId": return [3 /*break*/, 5];
                        case "modelNumber": return [3 /*break*/, 5];
                        case "serialNumber": return [3 /*break*/, 5];
                        case "description": return [3 /*break*/, 5];
                        case "dateAcquired": return [3 /*break*/, 5];
                        case "calibrationIntervalInMonths": return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 3:
                    // required enums / FK — never clear.
                    if (!value) {
                        return [2 /*return*/, { error: { message: "Value is required" }, data: null }];
                    }
                    return [4 /*yield*/, run((_e = {}, _e[field] = value, _e))];
                case 4: return [2 /*return*/, _h.sent()];
                case 5: return [4 /*yield*/, run((_f = {}, _f[field] = value ? value : null, _f))];
                case 6: return [2 /*return*/, _h.sent()];
                case 7: return [4 /*yield*/, run((_g = {}, _g[field] = value ? Number(value) : null, _g))];
                case 8: return [2 /*return*/, _h.sent()];
                case 9: return [2 /*return*/, { error: { message: "Invalid field" }, data: null }];
            }
        });
    });
}
