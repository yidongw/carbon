"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
require("jsr:@supabase/functions-js/edge-runtime.d.ts");
var kysely_1 = require("kysely");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var embedding_ts_1 = require("../lib/ai/embedding.ts");
var database_ts_1 = require("../lib/database.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var jobSchema = npm_zod__3_24_1_1.default.object({
    jobId: npm_zod__3_24_1_1.default.number(),
    id: npm_zod__3_24_1_1.default.string(),
    table: npm_zod__3_24_1_1.default.string(),
});
var failedJobSchema = jobSchema.extend({
    error: npm_zod__3_24_1_1.default.string(),
});
var QUEUE_NAME = "embedding_jobs";
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    function processJobs() {
        return __awaiter(this, void 0, void 0, function () {
            var currentJob, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((currentJob = pendingJobs.shift()) !== undefined)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, processJob(db, currentJob)];
                    case 2:
                        _a.sent();
                        completedJobs.push(currentJob);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        failedJobs.push(__assign(__assign({}, currentJob), { error: error_2 instanceof Error ? error_2.message : JSON.stringify(error_2) }));
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    var parseResult, _a, _b, pendingJobs, completedJobs, failedJobs, error_1, responseBody;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (req.method !== "POST") {
                    return [2 /*return*/, new Response("expected POST request", { status: 405 })];
                }
                if (req.headers.get("content-type") !== "application/json") {
                    return [2 /*return*/, new Response("expected json body", { status: 400 })];
                }
                _b = (_a = npm_zod__3_24_1_1.default.array(jobSchema)).safeParse;
                return [4 /*yield*/, req.json()];
            case 1:
                parseResult = _b.apply(_a, [_c.sent()]);
                console.log(__assign({ function: "embed" }, parseResult));
                if (parseResult.error) {
                    return [2 /*return*/, new Response("invalid request body: ".concat(parseResult.error.message), {
                            status: 400,
                        })];
                }
                pendingJobs = parseResult.data;
                completedJobs = [];
                failedJobs = [];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                // Process jobs while listening for worker termination
                return [4 /*yield*/, Promise.race([processJobs(), catchUnload()])];
            case 3:
                // Process jobs while listening for worker termination
                _c.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                // If the worker is terminating (e.g. wall clock limit reached),
                // add pending jobs to fail list with termination reason
                console.error(error_1);
                failedJobs.push.apply(failedJobs, pendingJobs.map(function (job) { return (__assign(__assign({}, job), { error: error_1 instanceof Error ? error_1.message : JSON.stringify(error_1) })); }));
                return [3 /*break*/, 5];
            case 5:
                // Log completed and failed jobs for traceability
                console.log("finished processing jobs:", {
                    completedJobs: completedJobs.length,
                    failedJobs: failedJobs.length,
                });
                responseBody = JSON.stringify({
                    completedJobs: completedJobs,
                    failedJobs: failedJobs,
                });
                return [2 /*return*/, new Response(responseBody, {
                        // 200 OK response
                        status: 200,
                        // Custom headers to report job status
                        headers: {
                            "content-type": "application/json",
                            "content-length": new TextEncoder()
                                .encode(responseBody)
                                .length.toString(),
                            "x-completed-jobs": completedJobs.length.toString(),
                            "x-failed-jobs": failedJobs.length.toString(),
                        },
                    })];
        }
    });
}); });
/**
 * Processes an embedding job.
 */
function processJob(db, job) {
    return __awaiter(this, void 0, void 0, function () {
        var jobId, id, table, item, textParts, textToEmbed, embedding, embeddingString, result, supplier, textToEmbed, embedding, embeddingString, result, customer, textToEmbed, embedding, embeddingString, result, deleteResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jobId = job.jobId, id = job.id, table = job.table;
                    console.log("Processing job ".concat(jobId, " for ").concat(table, " with id ").concat(id));
                    if (!(table === "item")) return [3 /*break*/, 4];
                    console.log("Fetching item from database...");
                    return [4 /*yield*/, db
                            .selectFrom("item")
                            .selectAll()
                            .where("id", "=", id)
                            .executeTakeFirst()];
                case 1:
                    item = _a.sent();
                    console.log("Item fetched:", {
                        id: item === null || item === void 0 ? void 0 : item.id,
                        name: item === null || item === void 0 ? void 0 : item.name,
                        description: item === null || item === void 0 ? void 0 : item.description,
                    });
                    textParts = [item === null || item === void 0 ? void 0 : item.name, item === null || item === void 0 ? void 0 : item.description].filter(function (part) { return typeof part === "string" && part.length > 0; });
                    textToEmbed = textParts.join(" ");
                    console.log("Text to embed:", textToEmbed);
                    return [4 /*yield*/, (0, embedding_ts_1.generateEmbedding)(textToEmbed)];
                case 2:
                    embedding = _a.sent();
                    embeddingString = JSON.stringify(embedding);
                    console.log("Updating item with embedding...", {
                        embeddingLength: embedding.length,
                        embeddingStringLength: embeddingString.length,
                    });
                    return [4 /*yield*/, db
                            .updateTable("item")
                            .set({
                            embedding: embeddingString,
                        })
                            .where("id", "=", id)
                            .execute()];
                case 3:
                    result = _a.sent();
                    console.log("Item update result:", result);
                    _a.label = 4;
                case 4:
                    if (!(table === "supplier")) return [3 /*break*/, 8];
                    console.log("Fetching supplier from database...");
                    return [4 /*yield*/, db
                            .selectFrom("supplier")
                            .selectAll()
                            .where("id", "=", id)
                            .executeTakeFirst()];
                case 5:
                    supplier = _a.sent();
                    console.log("Supplier fetched:", {
                        id: supplier === null || supplier === void 0 ? void 0 : supplier.id,
                        name: supplier === null || supplier === void 0 ? void 0 : supplier.name,
                    });
                    textToEmbed = (supplier === null || supplier === void 0 ? void 0 : supplier.name) || "";
                    if (!textToEmbed) {
                        throw new Error("Supplier ".concat(id, " has no name to embed"));
                    }
                    console.log("Text to embed:", textToEmbed);
                    return [4 /*yield*/, (0, embedding_ts_1.generateEmbedding)(textToEmbed)];
                case 6:
                    embedding = _a.sent();
                    embeddingString = JSON.stringify(embedding);
                    console.log("Updating supplier with embedding...", {
                        embeddingLength: embedding.length,
                        embeddingStringLength: embeddingString.length,
                    });
                    return [4 /*yield*/, db
                            .updateTable("supplier")
                            .set({
                            embedding: embeddingString,
                        })
                            .where("id", "=", id)
                            .execute()];
                case 7:
                    result = _a.sent();
                    console.log("Supplier update result:", result);
                    _a.label = 8;
                case 8:
                    if (!(table === "customer")) return [3 /*break*/, 12];
                    console.log("Fetching customer from database...");
                    return [4 /*yield*/, db
                            .selectFrom("customer")
                            .selectAll()
                            .where("id", "=", id)
                            .executeTakeFirst()];
                case 9:
                    customer = _a.sent();
                    console.log("Customer fetched:", {
                        id: customer === null || customer === void 0 ? void 0 : customer.id,
                        name: customer === null || customer === void 0 ? void 0 : customer.name,
                    });
                    textToEmbed = (customer === null || customer === void 0 ? void 0 : customer.name) || "";
                    if (!textToEmbed) {
                        throw new Error("Customer ".concat(id, " has no name to embed"));
                    }
                    console.log("Text to embed:", textToEmbed);
                    return [4 /*yield*/, (0, embedding_ts_1.generateEmbedding)(textToEmbed)];
                case 10:
                    embedding = _a.sent();
                    embeddingString = JSON.stringify(embedding);
                    console.log("Updating customer with embedding...", {
                        embeddingLength: embedding.length,
                        embeddingStringLength: embeddingString.length,
                    });
                    return [4 /*yield*/, db
                            .updateTable("customer")
                            .set({
                            embedding: embeddingString,
                        })
                            .where("id", "=", id)
                            .execute()];
                case 11:
                    result = _a.sent();
                    console.log("Customer update result:", result);
                    _a.label = 12;
                case 12:
                    console.log("Deleting job ".concat(jobId, " from queue..."));
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["select pgmq.delete(", ", ", "::bigint)"], ["select pgmq.delete(", ", ", "::bigint)"])), QUEUE_NAME, jobId).execute(db)];
                case 13:
                    deleteResult = _a.sent();
                    console.log("Queue delete result:", deleteResult);
                    console.log("Job ".concat(jobId, " processing completed successfully"));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Returns a promise that rejects if the worker is terminating.
 */
function catchUnload() {
    return new Promise(function (reject) {
        // deno-lint-ignore no-explicit-any
        addEventListener("beforeunload", function (ev) {
            var _a;
            reject(new Error((_a = ev.detail) === null || _a === void 0 ? void 0 : _a.reason));
        });
    });
}
var templateObject_1;
