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
exports.getJobAssignmentRules = getJobAssignmentRules;
exports.getJobAssignmentRule = getJobAssignmentRule;
exports.upsertJobAssignmentRule = upsertJobAssignmentRule;
exports.deleteJobAssignmentRule = deleteJobAssignmentRule;
exports.getJobGroupAssignments = getJobGroupAssignments;
exports.createJobGroupAssignment = createJobGroupAssignment;
exports.deleteJobGroupAssignment = deleteJobGroupAssignment;
exports.getJobsForSimulation = getJobsForSimulation;
var zod_1 = require("zod");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var people_models_1 = require("./people.models");
function getJobAssignmentRules(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("jobAssignmentRules")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "priority", ascending: true },
                    { column: "name", ascending: true }
                ]);
            }
            else {
                query = query.order("priority", { ascending: true }).order("name", {
                    ascending: true
                });
            }
            return [2 /*return*/, query];
        });
    });
}
function getJobAssignmentRule(client, ruleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobAssignmentRules")
                    .select("*")
                    .eq("id", ruleId)
                    .single()];
        });
    });
}
function upsertJobAssignmentRule(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var conditionsResult, record;
        var _a;
        return __generator(this, function (_b) {
            conditionsResult = zod_1.z
                .array(people_models_1.jobAssignmentRuleConditionValidator)
                .safeParse(data.conditions);
            if (!conditionsResult.success) {
                return [2 /*return*/, {
                        data: null,
                        error: { message: "Conditions failed validation" }
                    }];
            }
            record = (0, supabase_1.sanitize)({
                id: data.id,
                name: data.name,
                description: (_a = data.description) !== null && _a !== void 0 ? _a : null,
                conditions: conditionsResult.data,
                targetGroupId: data.targetGroupId,
                priority: data.priority,
                active: data.active,
                companyId: data.companyId,
                createdBy: data.userId,
                updatedBy: data.id ? data.userId : undefined,
                updatedAt: data.id ? new Date().toISOString() : undefined
            });
            return [2 /*return*/, client.from("jobAssignmentRule").upsert(record).select("id").single()];
        });
    });
}
function deleteJobAssignmentRule(client, ruleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobAssignmentRule").delete().eq("id", ruleId)];
        });
    });
}
function getJobGroupAssignments(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobGroupAssignment")
                    .select("*, group:group(id, name), rule:jobAssignmentRule(id, name)")
                    .eq("jobId", jobId)];
        });
    });
}
function createJobGroupAssignment(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, client
                    .from("jobGroupAssignment")
                    .upsert({
                    jobId: data.jobId,
                    groupId: data.groupId,
                    companyId: data.companyId,
                    ruleId: (_a = data.ruleId) !== null && _a !== void 0 ? _a : null,
                    assignedBy: data.assignedBy,
                    assignedAt: new Date().toISOString()
                })
                    .select("id")
                    .single()];
        });
    });
}
function deleteJobGroupAssignment(client, jobId, groupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobGroupAssignment")
                    .delete()
                    .eq("jobId", jobId)
                    .eq("groupId", groupId)];
        });
    });
}
// Returns currently open/in-progress jobs with enough context to evaluate rules
function getJobsForSimulation(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("job")
                    .select("\n      id, jobId, status, customerId, locationId, tags,\n      jobMakeMethod:jobMakeMethod(\n        jobOperation:jobOperation(processId, workCenterId)\n      )\n    ")
                    .eq("companyId", companyId)
                    .in("status", ["Draft", "In Progress"])
                    .order("jobId", { ascending: true })];
        });
    });
}
