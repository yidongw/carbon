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
exports.embeddingFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var zod_1 = require("zod");
var client_js_1 = require("../../client.js");
// Fields that affect embeddings for each table
var EMBEDDING_FIELDS = {
    item: ["name", "description"],
    customer: ["name"],
    supplier: ["name"]
};
var EmbeddingRecordSchema = zod_1.z.object({
    event: zod_1.z.object({
        table: zod_1.z.string(),
        operation: zod_1.z.enum(["INSERT", "UPDATE", "DELETE", "TRUNCATE"]),
        recordId: zod_1.z.string(),
        new: zod_1.z.record(zod_1.z.any()).nullable(),
        old: zod_1.z.record(zod_1.z.any()).nullable(),
        timestamp: zod_1.z.string()
    }),
    companyId: zod_1.z.string()
});
var EmbeddingPayloadSchema = zod_1.z.object({
    records: zod_1.z.array(EmbeddingRecordSchema)
});
exports.embeddingFunction = client_js_1.inngest.createFunction({
    id: "event-handler-embedding",
    retries: 3
}, { event: "carbon/event-embedding" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var event = _b.event, step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, step.run("process-embeddings", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var payload, results, client, jobs, _loop_1, _i, _a, record, batch, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                payload = EmbeddingPayloadSchema.parse(event.data);
                                results = { processed: 0, skipped: 0, failed: 0 };
                                client = (0, client_server_1.getCarbonServiceRole)();
                                jobs = [];
                                _loop_1 = function (record) {
                                    var event_1 = record.event;
                                    var fields = EMBEDDING_FIELDS[event_1.table];
                                    if (!fields) {
                                        results.skipped++;
                                        return "continue";
                                    }
                                    if (event_1.operation === "DELETE" || event_1.operation === "TRUNCATE") {
                                        results.skipped++;
                                        return "continue";
                                    }
                                    if (event_1.operation === "UPDATE" && event_1.old && event_1.new) {
                                        var changed = fields.some(function (f) { return event_1.old[f] !== event_1.new[f]; });
                                        if (!changed) {
                                            results.skipped++;
                                            return "continue";
                                        }
                                    }
                                    jobs.push({ id: event_1.recordId, table: event_1.table });
                                };
                                for (_i = 0, _a = payload.records; _i < _a.length; _i++) {
                                    record = _a[_i];
                                    _loop_1(record);
                                }
                                if (jobs.length === 0) {
                                    console.info("Embedding handler: nothing to process, skipped=".concat(results.skipped));
                                    return [2 /*return*/, results];
                                }
                                batch = jobs.map(function (job, i) { return (__assign({ jobId: -(i + 1) }, job)); });
                                return [4 /*yield*/, client.functions.invoke("embed", {
                                        body: batch
                                    })];
                            case 1:
                                error = (_b.sent()).error;
                                if (error) {
                                    console.error("Embed edge function failed: ".concat(error.message));
                                    results.failed = jobs.length;
                                }
                                else {
                                    results.processed = jobs.length;
                                }
                                console.info("Embedding handler: processed=".concat(results.processed, ", skipped=").concat(results.skipped, ", failed=").concat(results.failed));
                                return [2 /*return*/, results];
                        }
                    });
                }); })];
            case 1: return [2 /*return*/, _c.sent()];
        }
    });
}); });
