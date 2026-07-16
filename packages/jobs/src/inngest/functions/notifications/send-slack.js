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
exports.sendSlackFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var slack_server_1 = require("@carbon/lib/slack.server");
var client_1 = require("../../client");
exports.sendSlackFunction = client_1.inngest.createFunction({
    id: "send-slack",
    retries: 3
}, { event: "carbon/send-slack" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, channel, text, blocks, companyId, accessToken;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _c = event.data, channel = _c.channel, text = _c.text, blocks = _c.blocks, companyId = _c.companyId;
                return [4 /*yield*/, step.run("resolve-slack-token", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var client, _a, data, error, metadata;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    client = (0, client_server_1.getCarbonServiceRole)();
                                    return [4 /*yield*/, client
                                            .from("companyIntegration")
                                            .select("active, metadata")
                                            .eq("companyId", companyId)
                                            .eq("id", "slack")
                                            .maybeSingle()];
                                case 1:
                                    _a = _c.sent(), data = _a.data, error = _a.error;
                                    if (error || !(data === null || data === void 0 ? void 0 : data.active))
                                        return [2 /*return*/, null];
                                    metadata = data.metadata;
                                    return [2 /*return*/, (_b = metadata === null || metadata === void 0 ? void 0 : metadata.access_token) !== null && _b !== void 0 ? _b : null];
                            }
                        });
                    }); })];
            case 1:
                accessToken = _d.sent();
                return [4 /*yield*/, step.run("post-message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var slack;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    slack = (0, slack_server_1.getSlackClient)(accessToken !== null && accessToken !== void 0 ? accessToken : undefined);
                                    return [4 /*yield*/, slack.sendMessage({ blocks: blocks, channel: channel, text: text })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _d.sent();
                return [2 /*return*/, { success: true }];
        }
    });
}); });
