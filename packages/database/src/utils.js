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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllRecords = fetchAllRecords;
exports.fetchAllFromTable = fetchAllFromTable;
exports.fetchRecordsInBatches = fetchRecordsInBatches;
var BATCH_SIZE = 1000;
/**
 * Fetches all records from a table by automatically handling pagination
 * to work around Supabase's 1000 row limit per request
 */
function fetchAllRecords(baseQuery) {
    return __awaiter(this, void 0, void 0, function () {
        var allData, offset, totalCount, hasMore, query, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    allData = [];
                    offset = 0;
                    totalCount = 0;
                    hasMore = true;
                    _b.label = 1;
                case 1:
                    if (!hasMore) return [3 /*break*/, 3];
                    query = baseQuery.range(offset, offset + BATCH_SIZE - 1);
                    return [4 /*yield*/, query];
                case 2:
                    result = _b.sent();
                    if (result.error) {
                        return [2 /*return*/, {
                                data: null,
                                count: null,
                                error: result.error
                            }];
                    }
                    if (result.data) {
                        allData.push.apply(allData, result.data);
                    }
                    // Set total count from first request
                    if (offset === 0) {
                        totalCount = (_a = result.count) !== null && _a !== void 0 ? _a : 0;
                    }
                    // Check if we have more data to fetch
                    hasMore = result.data && result.data.length === BATCH_SIZE;
                    offset += BATCH_SIZE;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, {
                        data: allData,
                        count: totalCount,
                        error: null
                    }];
            }
        });
    });
}
/**
 * Helper function for simple table queries that need all records
 */
function fetchAllFromTable(client_1, tableName_1) {
    return __awaiter(this, arguments, void 0, function (client, tableName, selectColumns, filterFn) {
        var baseQuery;
        if (selectColumns === void 0) { selectColumns = "*"; }
        return __generator(this, function (_a) {
            baseQuery = client
                // @ts-expect-error
                .from(tableName)
                .select(selectColumns, { count: "exact" });
            if (filterFn) {
                baseQuery = filterFn(baseQuery);
            }
            // @ts-expect-error
            return [2 /*return*/, fetchAllRecords(baseQuery)];
        });
    });
}
/**
 * Fetches records with automatic batching for queries that might exceed 1000 rows
 * Used when you need all records but want to process them in batches
 */
function fetchRecordsInBatches(baseQuery_1) {
    return __asyncGenerator(this, arguments, function fetchRecordsInBatches_1(baseQuery, batchSize) {
        var offset, batch, hasMore, query, result;
        if (batchSize === void 0) { batchSize = BATCH_SIZE; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offset = 0;
                    batch = 0;
                    hasMore = true;
                    _a.label = 1;
                case 1:
                    if (!hasMore) return [3 /*break*/, 5];
                    query = baseQuery.range(offset, offset + batchSize - 1);
                    return [4 /*yield*/, __await(query)];
                case 2:
                    result = _a.sent();
                    if (result.error) {
                        throw new Error("Batch query failed: ".concat(result.error.message));
                    }
                    hasMore = result.data && result.data.length === batchSize;
                    batch++;
                    return [4 /*yield*/, __await({
                            data: result.data || [],
                            batch: batch,
                            hasMore: hasMore
                        })];
                case 3: return [4 /*yield*/, _a.sent()];
                case 4:
                    _a.sent();
                    offset += batchSize;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
