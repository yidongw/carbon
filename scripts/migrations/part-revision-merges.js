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
var supabase_js_1 = require("@supabase/supabase-js");
var csv_parse_1 = require("csv-parse");
var dotenv = require("dotenv");
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
dotenv.config();
var COMPANY_ID = "*****************";
var PROD = true;
var READ_ONLY = false;
var sourceFile = (0, path_1.resolve)((0, os_1.homedir)(), "Downloads/******.csv");
var columns = ["ID", "OLD", "NEW", "REVISION"];
var parser = (0, csv_parse_1.parse)({
    delimiter: ",",
    columns: columns,
    fromLine: 2, // Skip header row
});
var supabaseUrl = PROD
    ? process.env.PROD_SUPABASE_URL
    : process.env.SUPABASE_URL;
var supabaseServiceRoleKey = PROD
    ? process.env.PROD_SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_SERVICE_ROLE_KEY;
var readStream = (0, fs_1.createReadStream)(sourceFile);
var client = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var company, rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client
                    .from("company")
                    .select("name")
                    .eq("id", COMPANY_ID)
                    .single()];
            case 1:
                company = _a.sent();
                if (company === null || company === void 0 ? void 0 : company.error) {
                    console.error("Error fetching company:", company.error);
                }
                rows = [];
                readStream
                    .pipe(parser)
                    .on("data", function (row) {
                    rows.push(row);
                })
                    .on("end", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var fetchErrors, updateErrors, _i, rows_1, row, _a, item, oldPart, newPart, itemUpdate, oldPartDelete, oldPartUpdate;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                fetchErrors = [];
                                updateErrors = [];
                                _i = 0, rows_1 = rows;
                                _b.label = 1;
                            case 1:
                                if (!(_i < rows_1.length)) return [3 /*break*/, 8];
                                row = rows_1[_i];
                                console.log("Fetching ".concat(row.OLD.trim()));
                                return [4 /*yield*/, Promise.all([
                                        client
                                            .from("item")
                                            .select("*")
                                            .eq("id", row.ID.trim())
                                            .eq("companyId", COMPANY_ID)
                                            .single(),
                                        client
                                            .from("part")
                                            .select("*")
                                            .eq("id", row.OLD.trim())
                                            .eq("companyId", COMPANY_ID)
                                            .single(),
                                        client
                                            .from("part")
                                            .select("*")
                                            .eq("id", row.NEW.trim())
                                            .eq("companyId", COMPANY_ID)
                                            .maybeSingle(),
                                    ])];
                            case 2:
                                _a = _b.sent(), item = _a[0], oldPart = _a[1], newPart = _a[2];
                                if (item.error || oldPart.error) {
                                    console.log("Failed to fetch ".concat(row.OLD.trim()));
                                    fetchErrors.push(row.OLD.trim());
                                    return [3 /*break*/, 7];
                                }
                                if (!(READ_ONLY === false)) return [3 /*break*/, 7];
                                console.log("Updating ".concat(row.OLD.trim()));
                                return [4 /*yield*/, client
                                        .from("item")
                                        .update({
                                        readableId: row.NEW.trim(),
                                        revision: row.REVISION.trim(),
                                    })
                                        .eq("id", item.data.id)
                                        .eq("companyId", COMPANY_ID)];
                            case 3:
                                itemUpdate = _b.sent();
                                if (itemUpdate.error) {
                                    console.log("Failed to update item ".concat(row.OLD.trim()));
                                    console.log(itemUpdate);
                                    updateErrors.push(row.OLD.trim());
                                }
                                if (!newPart.data) return [3 /*break*/, 5];
                                return [4 /*yield*/, client
                                        .from("part")
                                        .delete()
                                        .eq("id", oldPart.data.id)
                                        .eq("companyId", COMPANY_ID)];
                            case 4:
                                oldPartDelete = _b.sent();
                                if (itemUpdate.error || oldPartDelete.error) {
                                    console.log("Failed to update ".concat(row.OLD.trim()));
                                    console.log(itemUpdate, oldPartDelete);
                                    updateErrors.push(row.OLD.trim());
                                }
                                return [3 /*break*/, 7];
                            case 5: return [4 /*yield*/, client
                                    .from("part")
                                    .update({ id: row.NEW.trim() })
                                    .eq("id", oldPart.data.id)
                                    .eq("companyId", COMPANY_ID)];
                            case 6:
                                oldPartUpdate = _b.sent();
                                if (itemUpdate.error || oldPartUpdate.error) {
                                    console.log("Failed to update ".concat(row.OLD.trim()));
                                    console.log(itemUpdate, oldPartUpdate);
                                    updateErrors.push(row.OLD.trim());
                                }
                                _b.label = 7;
                            case 7:
                                _i++;
                                return [3 /*break*/, 1];
                            case 8:
                                if (fetchErrors.length > 0) {
                                    console.error("Failed to fetch the following items:");
                                    console.log(fetchErrors);
                                }
                                if (updateErrors.length > 0) {
                                    console.error("Failed to update the following items:");
                                    console.log(updateErrors);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .on("error", function (error) {
                    console.error("Error processing CSV:", error);
                });
                return [2 /*return*/];
        }
    });
}); })();
