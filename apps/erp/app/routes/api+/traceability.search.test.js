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
var auth_server_1 = require("@carbon/auth/auth.server");
var vitest_1 = require("vitest");
var traceability_search_1 = require("./traceability.search");
vitest_1.vi.mock("@carbon/auth/auth.server", function () { return ({
    requirePermissions: vitest_1.vi.fn()
}); });
(0, vitest_1.describe)("traceability search loader", function () {
    (0, vitest_1.it)("returns tracked entity readableId without querying job readable ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var entityQuery, activityQuery, from, response, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entityQuery = createQuery([
                        {
                            id: "tracked-entity-1",
                            readableId: "TRK-0001",
                            attributes: { Job: "job-uuid-1" }
                        }
                    ]);
                    activityQuery = createQuery([]);
                    from = vitest_1.vi.fn(function (table) {
                        if (table === "trackedEntity")
                            return entityQuery;
                        if (table === "trackedActivity")
                            return activityQuery;
                        throw new Error("Unexpected table query: ".concat(table));
                    });
                    vitest_1.vi.mocked(auth_server_1.requirePermissions).mockResolvedValue({
                        client: { from: from },
                        companyId: "company-1"
                    });
                    return [4 /*yield*/, (0, traceability_search_1.loader)({
                            request: new Request("http://localhost/api/traceability.search?q=TRK&kind=entity")
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    body = _a.sent();
                    (0, vitest_1.expect)(body.entities).toEqual([
                        {
                            id: "tracked-entity-1",
                            readableId: "TRK-0001",
                            attributes: { Job: "job-uuid-1" }
                        }
                    ]);
                    (0, vitest_1.expect)(body.entities[0]).not.toHaveProperty("jobId");
                    (0, vitest_1.expect)(body.entities[0]).not.toHaveProperty("jobReadableId");
                    (0, vitest_1.expect)(from).not.toHaveBeenCalledWith("job");
                    (0, vitest_1.expect)(entityQuery.or).toHaveBeenCalledWith("id.ilike.%TRK%,sourceDocumentReadableId.ilike.%TRK%,readableId.ilike.%TRK%");
                    return [2 /*return*/];
            }
        });
    }); });
});
function createQuery(data) {
    var result = Promise.resolve({ data: data });
    var query = {
        select: vitest_1.vi.fn(function () { return query; }),
        eq: vitest_1.vi.fn(function () { return query; }),
        order: vitest_1.vi.fn(function () { return query; }),
        limit: vitest_1.vi.fn(function () { return query; }),
        or: vitest_1.vi.fn(function () { return result; }),
        then: result.then.bind(result)
    };
    return query;
}
