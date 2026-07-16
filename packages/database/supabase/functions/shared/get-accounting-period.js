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
exports.getCurrentAccountingPeriod = getCurrentAccountingPeriod;
var mod_ts_1 = require("https://deno.land/std@0.160.0/datetime/mod.ts");
// TODO: refactor to use @internationalized/date when npm:<package>@<version> is supported
var isLeapYear = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
var daysInMonths = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
};
// tries to get the current accounting period
// and if not found, creates a fiscal year and accounting periods
// and updates the active accounting period/fiscal year
function getCurrentAccountingPeriod(client, companyId, db) {
    return __awaiter(this, void 0, void 0, function () {
        var d, currentAccountingPeriod, year, month, startDate, endDate, newPeriod;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    d = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                    return [4 /*yield*/, client
                            .from("accountingPeriod")
                            .select("*")
                            // .gte("endDate", d.toString())
                            // .lte("startDate", d.toString())
                            .eq("companyId", companyId)
                            .gte("endDate", d)
                            .lte("startDate", d)
                            .single()];
                case 1:
                    currentAccountingPeriod = _a.sent();
                    if (currentAccountingPeriod.data &&
                        currentAccountingPeriod.data.status === "Active") {
                        return [2 /*return*/, currentAccountingPeriod.data.id];
                    }
                    if (!(currentAccountingPeriod.data &&
                        currentAccountingPeriod.data.status === "Inactive")) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .updateTable("accountingPeriod")
                                            .set({ status: "Inactive" })
                                            .where("status", "=", "Active")
                                            .where("companyId", "=", companyId)
                                            .execute()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, trx
                                                .updateTable("accountingPeriod")
                                                .set({ status: "Active" })
                                                .where("id", "=", currentAccountingPeriod.data.id)
                                                .where("companyId", "=", companyId)
                                                .execute()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, currentAccountingPeriod.data.id];
                case 3:
                    year = new Date().getFullYear();
                    month = new Date().getMonth() + 1;
                    startDate = "".concat(year, "-").concat(month.toString().padStart(2, "0"), "-01");
                    endDate = "".concat(year, "-").concat(month.toString().padStart(2, "0"), "-").concat(daysInMonths[month]);
                    if (month === 2 && isLeapYear(year)) {
                        endDate = "".concat(year, "-").concat(month.toString().padStart(2, "0"), "-29");
                    }
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .updateTable("accountingPeriod")
                                            .set({ status: "Inactive" })
                                            .where("status", "=", "Active")
                                            .where("companyId", "=", companyId)
                                            .execute()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, trx
                                                .insertInto("accountingPeriod")
                                                .values({
                                                startDate: startDate,
                                                endDate: endDate,
                                                companyId: companyId,
                                                status: "Active",
                                                createdBy: "system",
                                            })
                                                .returning("id")
                                                .executeTakeFirstOrThrow()];
                                    case 2:
                                        result = _a.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                case 4:
                    newPeriod = _a.sent();
                    return [2 /*return*/, newPeriod.id];
            }
        });
    });
}
