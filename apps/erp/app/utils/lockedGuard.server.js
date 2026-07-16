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
exports.requireUnlocked = requireUnlocked;
exports.requireUnlockedBulk = requireUnlockedBulk;
var auth_1 = require("@carbon/auth");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var DEFAULT_MESSAGE = "Cannot modify a locked document. Reopen it first.";
/**
 * Guard for single-record routes (Pattern A).
 * If `isLocked` is true, throws a redirect with a flash error message.
 *
 * @example
 * ```ts
 * const po = await getPurchaseOrder(client, id);
 * await requireUnlocked({
 *   request,
 *   isLocked: isPurchaseOrderLocked(po.data?.status),
 *   redirectTo: path.to.purchaseOrderDetails(id),
 *   message: "Cannot modify a confirmed purchase order.",
 * });
 * ```
 */
function requireUnlocked(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, _d;
        var request = _b.request, isLocked = _b.isLocked, redirectTo = _b.redirectTo, _e = _b.message, message = _e === void 0 ? DEFAULT_MESSAGE : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!isLocked) return [3 /*break*/, 2];
                    _c = react_router_1.redirect;
                    _d = [redirectTo];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, message))];
                case 1: throw _c.apply(void 0, _d.concat([_f.sent()]));
                case 2: return [2 /*return*/];
            }
        });
    });
}
/**
 * Guard for bulk-update routes (Pattern B).
 * Returns an error response object if any record is locked, or `null` if all are unlocked.
 *
 * @example
 * ```ts
 * const lockedError = requireUnlockedBulk({
 *   statuses,
 *   checkFn: isIssueLocked,
 *   message: "Cannot modify a closed issue. Reopen it first.",
 * });
 * if (lockedError) return lockedError;
 * ```
 */
function requireUnlockedBulk(_a) {
    var statuses = _a.statuses, checkFn = _a.checkFn, _b = _a.message, message = _b === void 0 ? DEFAULT_MESSAGE : _b;
    var hasLocked = statuses.some(function (s) { return checkFn(s); });
    if (hasLocked) {
        return { error: { message: message }, data: null };
    }
    return null;
}
