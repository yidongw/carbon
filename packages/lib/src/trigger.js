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
exports.trigger = trigger;
exports.batchTrigger = batchTrigger;
var client_ts_1 = require("./inngest/client.ts");
/**
 * Map trigger.dev task IDs → inngest event names.
 * This allows callers to migrate from `tasks.trigger("notify", payload)`
 * to `trigger("notify", payload)` with minimal changes.
 */
var taskToEvent = {
    "accounting-backfill": "carbon/accounting-backfill",
    "model-thumbnail": "carbon/model-thumbnail",
    notify: "carbon/notify",
    onboard: "carbon/onboard",
    "paperless-parts": "carbon/paperless-parts",
    "post-transactions": "carbon/post-transaction",
    "print-job-deliver": "carbon/print-job-deliver",
    "print-job": "carbon/print-job",
    recalculate: "carbon/recalculate",
    "release-job": "carbon/release-job",
    "schedule-job": "carbon/reschedule-job",
    "send-email": "carbon/send-email",
    "send-slack": "carbon/send-slack",
    "slack-document-assignment-update": "carbon/slack-document-assignment-update",
    "slack-document-created": "carbon/slack-document-created",
    "slack-document-status-update": "carbon/slack-document-status-update",
    "slack-document-task-update": "carbon/slack-document-task-update",
    "sync-external-accounting": "carbon/sync-external-accounting",
    "sync-issue-from-jira": "carbon/jira-sync",
    "sync-issue-from-linear": "carbon/linear-sync",
    "update-permissions": "carbon/update-permissions",
    "user-admin": "carbon/user-admin"
};
/**
 * Typed trigger helper — drop-in replacement for `tasks.trigger(taskId, payload)`.
 *
 * @example
 * ```ts
 * import { trigger } from "@carbon/jobs";
 * await trigger("notify", { event, companyId, documentId, recipient });
 * ```
 */
function trigger(taskId, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var eventName;
        return __generator(this, function (_a) {
            eventName = taskToEvent[taskId];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return [2 /*return*/, client_ts_1.inngest.send({ data: payload, name: eventName })];
        });
    });
}
/**
 * Typed batch trigger helper — drop-in replacement for `tasks.batchTrigger(taskId, items)`.
 *
 * @example
 * ```ts
 * import { batchTrigger } from "@carbon/jobs";
 * await batchTrigger("recalculate", items.map(i => ({ payload: i })));
 * ```
 */
function batchTrigger(taskId, items) {
    return __awaiter(this, void 0, void 0, function () {
        var eventName;
        return __generator(this, function (_a) {
            eventName = taskToEvent[taskId];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return [2 /*return*/, client_ts_1.inngest.send(items.map(function (i) { return ({ data: i.payload, name: eventName }); }))];
        });
    });
}
