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
exports.expireAnnualPlansFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var client_1 = require("../../client");
// One-time annual plans (paymentMode='one_time') stay Active until termEndsAt.
// Once the term passes, mark the plan Inactive so gating/banners can react and
// the customer is prompted to renew.
exports.expireAnnualPlansFunction = client_1.inngest.createFunction({ id: "expire-annual-plans", retries: 2 }, { cron: "0 3 * * *" }, // daily at 03:00 UTC
function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("mark-expired-one-time-plans-inactive", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var now, expired, ids, error;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    now = new Date().toISOString();
                                    return [4 /*yield*/, serviceRole
                                            .from("companyPlan")
                                            .select("id")
                                            .eq("paymentMode", "one_time")
                                            .neq("stripeSubscriptionStatus", "Inactive")
                                            .not("termEndsAt", "is", null)
                                            .lt("termEndsAt", now)];
                                case 1:
                                    expired = _b.sent();
                                    if (expired.error) {
                                        console.error("Error fetching expired annual plans: ".concat(JSON.stringify(expired.error)));
                                        return [2 /*return*/];
                                    }
                                    if (!((_a = expired.data) === null || _a === void 0 ? void 0 : _a.length)) {
                                        console.log("No expired annual plans to deactivate");
                                        return [2 /*return*/];
                                    }
                                    ids = expired.data.map(function (p) { return p.id; });
                                    return [4 /*yield*/, serviceRole
                                            .from("companyPlan")
                                            .update({ stripeSubscriptionStatus: "Inactive" })
                                            .in("id", ids)];
                                case 2:
                                    error = (_b.sent()).error;
                                    if (error) {
                                        console.error("Failed to deactivate expired annual plans: ".concat(JSON.stringify(error)));
                                        return [2 /*return*/];
                                    }
                                    console.log("Deactivated ".concat(ids.length, " expired annual plan(s)"));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
