"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.eventQueueFunction = void 0;
var client_1 = require("@carbon/database/client");
var kysely_1 = require("kysely");
var client_2 = require("../../client");
var QUEUE_NAME = "event_system"; // Name of the PGMQ queue
var BATCH_SIZE = 100; // Number of messages to process per run
var VISIBILITY_TIMEOUT = 30; // Seconds a message is hidden after being read
var CHUNK_SIZE = 10; // Max events per sendEvent call (keeps under 256KB limit)
function chunk(arr, size) {
    var chunks = [];
    for (var i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}
var getDatabaseClient = function (size) {
    var pool = (0, client_1.getPostgresConnectionPool)(size);
    return (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
};
/**
 * Event queue cron function - polls PGMQ every minute and routes events to handlers.
 * This is the critical bridge between PostgreSQL events and inngest handlers.
 */
exports.eventQueueFunction = client_2.inngest.createFunction({
    id: "event-queue",
    retries: 2
}, { cron: "* * * * *" }, // Every minute
function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, grouped, allIds, events, chunks, i, events, chunks, i, records, chunks, i, records, chunks, i, records, chunks, i, records, chunks, i;
    var step = _b.step;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                return [4 /*yield*/, step.run("read-queue", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var pg, jobs, grouped, _i, jobs_1, job;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pg = getDatabaseClient(1);
                                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM pgmq.read(", ", ", ", ", ")"], ["SELECT * FROM pgmq.read(", ", ", ", ", ")"])), QUEUE_NAME, VISIBILITY_TIMEOUT, BATCH_SIZE).execute(pg)];
                                case 1:
                                    jobs = (_a.sent()).rows;
                                    grouped = {
                                        WEBHOOK: [],
                                        WORKFLOW: [],
                                        SYNC: [],
                                        SEARCH: [],
                                        AUDIT: [],
                                        EMBEDDING: []
                                    };
                                    for (_i = 0, jobs_1 = jobs; _i < jobs_1.length; _i++) {
                                        job = jobs_1[_i];
                                        grouped[job.message.handlerType].push(job);
                                    }
                                    return [2 /*return*/, {
                                            grouped: grouped,
                                            allIds: jobs.map(function (j) { return j.msg_id; })
                                        }];
                            }
                        });
                    }); })];
            case 1:
                _c = (_d.sent()), grouped = _c.grouped, allIds = _c.allIds;
                if (allIds.length === 0) {
                    return [2 /*return*/, { processed: 0 }];
                }
                if (!(grouped.WEBHOOK.length > 0)) return [3 /*break*/, 5];
                events = grouped.WEBHOOK.map(function (job) { return ({
                    name: "carbon/event-webhook",
                    data: {
                        msgId: job.msg_id,
                        url: job.message.handlerConfig.url,
                        config: job.message.handlerConfig,
                        data: job.message.event
                    }
                }); });
                chunks = chunk(events, CHUNK_SIZE);
                i = 0;
                _d.label = 2;
            case 2:
                if (!(i < chunks.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, step.sendEvent("dispatch-webhooks-".concat(i), chunks[i])];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                if (!(grouped.WORKFLOW.length > 0)) return [3 /*break*/, 9];
                events = grouped.WORKFLOW.map(function (job) { return ({
                    name: "carbon/event-workflow",
                    data: {
                        msgId: job.msg_id,
                        workflowId: job.message.handlerConfig.workflowId,
                        data: job.message.event
                    }
                }); });
                chunks = chunk(events, CHUNK_SIZE);
                i = 0;
                _d.label = 6;
            case 6:
                if (!(i < chunks.length)) return [3 /*break*/, 9];
                return [4 /*yield*/, step.sendEvent("dispatch-workflows-".concat(i), chunks[i])];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 6];
            case 9:
                if (!(grouped.SYNC.length > 0)) return [3 /*break*/, 13];
                records = grouped.SYNC.map(function (job) { return ({
                    event: job.message.event,
                    companyId: job.message.companyId,
                    handlerConfig: job.message.handlerConfig
                }); });
                chunks = chunk(records, CHUNK_SIZE);
                i = 0;
                _d.label = 10;
            case 10:
                if (!(i < chunks.length)) return [3 /*break*/, 13];
                return [4 /*yield*/, step.sendEvent("dispatch-syncs-".concat(i), {
                        name: "carbon/event-sync",
                        data: { records: chunks[i] }
                    })];
            case 11:
                _d.sent();
                _d.label = 12;
            case 12:
                i++;
                return [3 /*break*/, 10];
            case 13:
                if (!(grouped.SEARCH.length > 0)) return [3 /*break*/, 17];
                records = grouped.SEARCH.map(function (job) { return ({
                    event: job.message.event,
                    companyId: job.message.companyId
                }); });
                chunks = chunk(records, CHUNK_SIZE);
                i = 0;
                _d.label = 14;
            case 14:
                if (!(i < chunks.length)) return [3 /*break*/, 17];
                return [4 /*yield*/, step.sendEvent("dispatch-searches-".concat(i), {
                        name: "carbon/event-search",
                        data: { records: chunks[i] }
                    })];
            case 15:
                _d.sent();
                _d.label = 16;
            case 16:
                i++;
                return [3 /*break*/, 14];
            case 17:
                if (!(grouped.AUDIT.length > 0)) return [3 /*break*/, 21];
                records = grouped.AUDIT.map(function (job) { return ({
                    event: job.message.event,
                    companyId: job.message.companyId,
                    actorId: job.message.actorId,
                    handlerConfig: job.message.handlerConfig
                }); });
                chunks = chunk(records, CHUNK_SIZE);
                i = 0;
                _d.label = 18;
            case 18:
                if (!(i < chunks.length)) return [3 /*break*/, 21];
                return [4 /*yield*/, step.sendEvent("dispatch-audits-".concat(i), {
                        name: "carbon/event-audit",
                        data: { records: chunks[i] }
                    })];
            case 19:
                _d.sent();
                _d.label = 20;
            case 20:
                i++;
                return [3 /*break*/, 18];
            case 21:
                if (!(grouped.EMBEDDING.length > 0)) return [3 /*break*/, 25];
                records = grouped.EMBEDDING.map(function (job) { return ({
                    event: job.message.event,
                    companyId: job.message.companyId
                }); });
                chunks = chunk(records, CHUNK_SIZE);
                i = 0;
                _d.label = 22;
            case 22:
                if (!(i < chunks.length)) return [3 /*break*/, 25];
                return [4 /*yield*/, step.sendEvent("dispatch-embeddings-".concat(i), {
                        name: "carbon/event-embedding",
                        data: { records: chunks[i] }
                    })];
            case 23:
                _d.sent();
                _d.label = 24;
            case 24:
                i++;
                return [3 /*break*/, 22];
            case 25: 
            // 9. Delete processed messages from PGMQ
            return [4 /*yield*/, step.run("delete-processed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var pg;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pg = getDatabaseClient(1);
                                return [4 /*yield*/, (0, kysely_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT pgmq.delete(", ", id::bigint) FROM unnest(", "::bigint[]) AS id"], ["SELECT pgmq.delete(", ", id::bigint) FROM unnest(", "::bigint[]) AS id"])), QUEUE_NAME, allIds).execute(pg)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 26:
                // 9. Delete processed messages from PGMQ
                _d.sent();
                return [2 /*return*/, { routed: allIds.length }];
        }
    });
}); });
var templateObject_1, templateObject_2;
