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
exports.SlackNotificationService = void 0;
var service_1 = require("../../slack/lib/service");
var SlackNotificationService = /** @class */ (function () {
    function SlackNotificationService() {
        this.id = "slack";
        this.name = "Slack";
    }
    SlackNotificationService.prototype.send = function (event, context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = event.type;
                        switch (_a) {
                            case "issue.created": return [3 /*break*/, 1];
                            case "issue.status.changed": return [3 /*break*/, 3];
                            case "task.status.changed": return [3 /*break*/, 5];
                            case "task.assigned": return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, (0, service_1.createIssueSlackThread)(context.serviceRole, {
                            carbonUrl: event.carbonUrl,
                            companyId: event.companyId,
                            description: event.data.description,
                            id: event.data.id,
                            nonConformanceId: event.data.nonConformanceId,
                            severity: event.data.severity,
                            title: event.data.title,
                            userId: event.userId
                        })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 3: return [4 /*yield*/, (0, service_1.syncIssueStatusToSlack)(context.serviceRole, {
                            companyId: event.companyId,
                            nonConformanceId: event.data.nonConformanceId,
                            newStatus: event.data.status,
                            previousStatus: "", // We'll need to get this from the event data if needed
                            userId: event.userId
                        })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, (0, service_1.syncIssueTaskToSlack)(context.serviceRole, {
                            companyId: event.companyId,
                            id: event.data.id,
                            status: event.data.status,
                            // @ts-expect-error - it's cool
                            taskType: event.data.type,
                            userId: event.userId
                        })];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, (0, service_1.syncIssueAssignmentToSlack)(context.serviceRole, {
                            nonConformanceId: event.data.id,
                            companyId: event.companyId,
                            userId: event.userId,
                            newAssignee: event.data.assignee
                        })];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9: 
                    // Unknown event type, skip
                    return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return SlackNotificationService;
}());
exports.SlackNotificationService = SlackNotificationService;
