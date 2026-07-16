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
exports.notificationPurgeFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var client_1 = require("../../client");
// Drop old notification rows so the table doesn't grow unbounded. We keep
// unread rows forever — only read or already-digested rows are purged.
var PURGE_READ_AFTER_DAYS = 30;
var PURGE_DIGESTED_AFTER_DAYS = 30;
exports.notificationPurgeFunction = client_1.inngest.createFunction({ id: "notification-purge", retries: 2 }, { cron: "0 3 * * *" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var client, purgedRead, purgedDigested;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                client = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("purge-read", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var cutoff, _a, data, error;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    cutoff = new Date(Date.now() - PURGE_READ_AFTER_DAYS * 24 * 60 * 60 * 1000).toISOString();
                                    return [4 /*yield*/, client.from("notification")
                                            .delete()
                                            .lt("createdAt", cutoff)
                                            .not("readAt", "is", null)
                                            .select("id")];
                                case 1:
                                    _a = _c.sent(), data = _a.data, error = _a.error;
                                    if (error) {
                                        console.error("Failed to purge read notifications", error);
                                        throw error;
                                    }
                                    return [2 /*return*/, (_b = data === null || data === void 0 ? void 0 : data.length) !== null && _b !== void 0 ? _b : 0];
                            }
                        });
                    }); })];
            case 1:
                purgedRead = _c.sent();
                return [4 /*yield*/, step.run("purge-digested", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var cutoff, _a, data, error;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    cutoff = new Date(Date.now() - PURGE_DIGESTED_AFTER_DAYS * 24 * 60 * 60 * 1000).toISOString();
                                    return [4 /*yield*/, client.from("notification")
                                            .delete()
                                            .lt("createdAt", cutoff)
                                            .not("digestedInto", "is", null)
                                            .select("id")];
                                case 1:
                                    _a = _c.sent(), data = _a.data, error = _a.error;
                                    if (error) {
                                        console.error("Failed to purge digested notifications", error);
                                        throw error;
                                    }
                                    return [2 /*return*/, (_b = data === null || data === void 0 ? void 0 : data.length) !== null && _b !== void 0 ? _b : 0];
                            }
                        });
                    }); })];
            case 2:
                purgedDigested = _c.sent();
                return [2 /*return*/, { purgedDigested: purgedDigested, purgedRead: purgedRead }];
        }
    });
}); });
