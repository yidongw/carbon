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
exports.handle = void 0;
exports.loader = loader;
exports.default = JobRulesSimulateRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var people_1 = require("~/modules/people");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Simulate"], ["Simulate"]))),
    to: path_1.path.to.jobRulesSimulate
};
/** Evaluates a single condition against a job. */
function evaluateCondition(condition, job) {
    var _a, _b;
    var field = condition.field, operator = condition.operator, value = condition.value;
    var jobValue;
    if (field === "tags") {
        jobValue = (_a = job.tags) !== null && _a !== void 0 ? _a : [];
    }
    else if (field === "processId" || field === "workCenterId") {
        // Gather all unique values across operations
        var ops = ((_b = job.jobMakeMethod) !== null && _b !== void 0 ? _b : []).flatMap(function (mm) { var _a; return (_a = mm.jobOperation) !== null && _a !== void 0 ? _a : []; });
        jobValue = ops.map(function (op) { return op[field]; }).filter(Boolean);
    }
    else {
        jobValue = job[field];
    }
    switch (operator) {
        case "eq":
            return String(jobValue) === String(value);
        case "neq":
            return String(jobValue) !== String(value);
        case "in": {
            var vals = Array.isArray(value)
                ? value
                : String(value)
                    .split(",")
                    .map(function (v) { return v.trim(); });
            return vals.some(function (v) {
                return Array.isArray(jobValue) ? jobValue.includes(v) : String(jobValue) === v;
            });
        }
        case "contains":
            if (Array.isArray(jobValue)) {
                return jobValue.some(function (jv) {
                    return String(jv).toLowerCase().includes(String(value).toLowerCase());
                });
            }
            return String(jobValue !== null && jobValue !== void 0 ? jobValue : "")
                .toLowerCase()
                .includes(String(value).toLowerCase());
        default:
            return false;
    }
}
/** Returns the first matching rule for a job (sorted by priority). */
function matchJobToRules(job, rules) {
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        var conditions = Array.isArray(rule.conditions)
            ? rule.conditions
            : [];
        // No conditions = matches all
        if (conditions.length === 0) {
            return { rule: rule, matched: true };
        }
        var allMatch = conditions.every(function (cond) { return evaluateCondition(cond, job); });
        if (allMatch) {
            return { rule: rule, matched: true };
        }
    }
    return { rule: null, matched: false };
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, rulesResult, jobsResult, activeRules, jobs, results, matchedCount, unmatchedCount;
        var _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.getJobAssignmentRules)(client, companyId),
                            (0, people_1.getJobsForSimulation)(client, companyId)
                        ])];
                case 2:
                    _d = _g.sent(), rulesResult = _d[0], jobsResult = _d[1];
                    activeRules = ((_e = rulesResult.data) !== null && _e !== void 0 ? _e : []).filter(function (r) { return r.active; });
                    jobs = (_f = jobsResult.data) !== null && _f !== void 0 ? _f : [];
                    results = jobs.map(function (job) {
                        var _a = matchJobToRules(job, activeRules), rule = _a.rule, matched = _a.matched;
                        return {
                            jobId: job.id,
                            jobReadableId: job.jobId,
                            status: job.status,
                            customerId: job.customerId,
                            matchedRule: matched ? rule : null,
                            matched: matched
                        };
                    });
                    matchedCount = results.filter(function (r) { return r.matched; }).length;
                    unmatchedCount = results.filter(function (r) { return !r.matched; }).length;
                    return [2 /*return*/, {
                            results: results,
                            activeRules: activeRules,
                            totalJobs: jobs.length,
                            matchedCount: matchedCount,
                            unmatchedCount: unmatchedCount
                        }];
            }
        });
    });
}
function JobRulesSimulateRoute() {
    var _a = (0, react_router_1.useLoaderData)(), results = _a.results, activeRules = _a.activeRules, totalJobs = _a.totalJobs, matchedCount = _a.matchedCount, unmatchedCount = _a.unmatchedCount;
    var t = (0, macro_2.useLingui)().t;
    return (<react_1.VStack spacing={0} className="h-full overflow-auto">
      <div className="flex flex-shrink-0 items-center justify-between gap-3 px-4 py-2 bg-card border-b border-border h-[50px]">
        <react_1.HStack spacing={2}>
          <lu_1.LuFlaskConical className="size-5 text-muted-foreground"/>
          <react_1.Heading size="h4">
            <macro_2.Trans>Assignment Rule Simulation</macro_2.Trans>
          </react_1.Heading>
        </react_1.HStack>
      </div>

      <div className="flex flex-col gap-4 w-full p-4 flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground">
        <div className="grid w-full gap-4 grid-cols-2 lg:grid-cols-4">
          <react_1.Card>
            <react_1.CardHeader className="flex-row gap-2">
              <lu_1.LuShieldCheck className="text-muted-foreground"/>
              <react_1.CardTitle>
                <macro_2.Trans>Active Rules</macro_2.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums">
                {activeRules.length}
              </p>
            </react_1.CardContent>
          </react_1.Card>
          <react_1.Card>
            <react_1.CardHeader className="flex-row gap-2">
              <lu_1.LuFlaskConical className="text-muted-foreground"/>
              <react_1.CardTitle>
                <macro_2.Trans>Jobs Checked</macro_2.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums">
                {totalJobs}
              </p>
            </react_1.CardContent>
          </react_1.Card>
          <react_1.Card>
            <react_1.CardHeader className="flex-row gap-2">
              <lu_1.LuCircleCheck className="text-muted-foreground"/>
              <react_1.CardTitle>
                <macro_2.Trans>Would Match</macro_2.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums text-green-600 dark:text-green-400">
                {matchedCount}
              </p>
            </react_1.CardContent>
          </react_1.Card>
          <react_1.Card>
            <react_1.CardHeader className="flex-row gap-2">
              <lu_1.LuCircle className="text-muted-foreground"/>
              <react_1.CardTitle>
                <macro_2.Trans>No Match</macro_2.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums text-amber-600 dark:text-amber-400">
                {unmatchedCount}
              </p>
            </react_1.CardContent>
          </react_1.Card>
        </div>

        {activeRules.length > 0 && (<react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Active Rules (in priority order)</macro_2.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-wrap gap-2">
                {activeRules.map(function (rule) { return (<div key={rule.id} className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs">
                    <lu_1.LuShieldCheck className="size-3.5 text-primary"/>
                    <span className="font-medium">#{rule.priority}</span>
                    <span>{rule.name}</span>
                    <span className="text-muted-foreground">→</span>
                    <lu_1.LuUsers className="size-3"/>
                    <span className="text-muted-foreground">
                      {rule.targetGroupName}
                    </span>
                  </div>); })}
              </div>
            </react_1.CardContent>
          </react_1.Card>)}

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_2.Trans>Job Matching Results</macro_2.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent className="p-0">
            <react_1.Table>
              <react_1.Thead>
                <react_1.Tr>
                  <react_1.Th>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Job"], ["Job"])))}</react_1.Th>
                  <react_1.Th>{t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"])))}</react_1.Th>
                  <react_1.Th>{t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Match"], ["Match"])))}</react_1.Th>
                  <react_1.Th>{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Matched Rule"], ["Matched Rule"])))}</react_1.Th>
                  <react_1.Th>{t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Would Assign To"], ["Would Assign To"])))}</react_1.Th>
                </react_1.Tr>
              </react_1.Thead>
              <react_1.Tbody>
                {results.length === 0 ? (<react_1.Tr>
                    <react_1.Td colSpan={5} className="text-center py-8 text-muted-foreground">
                      <macro_2.Trans>No active jobs to simulate against</macro_2.Trans>
                    </react_1.Td>
                  </react_1.Tr>) : (results.map(function (r) {
            var _a;
            return (<react_1.Tr key={r.jobId}>
                      <react_1.Td className="font-mono font-medium text-sm">
                        {r.jobReadableId}
                      </react_1.Td>
                      <react_1.Td>
                        <react_1.Badge variant="outline">{r.status}</react_1.Badge>
                      </react_1.Td>
                      <react_1.Td>
                        {r.matched ? (<react_1.HStack spacing={1} className="text-green-600 dark:text-green-400 text-sm">
                            <lu_1.LuCircleCheck className="size-4"/>
                            <macro_2.Trans>Matched</macro_2.Trans>
                          </react_1.HStack>) : (<react_1.HStack spacing={1} className="text-muted-foreground text-sm">
                            <lu_1.LuCircle className="size-4"/>
                            <macro_2.Trans>No match</macro_2.Trans>
                          </react_1.HStack>)}
                      </react_1.Td>
                      <react_1.Td className="text-sm">
                        {r.matchedRule ? (<span className="font-medium">
                            {r.matchedRule.name}
                          </span>) : (<span className="text-muted-foreground">—</span>)}
                      </react_1.Td>
                      <react_1.Td>
                        {r.matchedRule ? (<react_1.HStack spacing={1} className="text-sm">
                            <lu_1.LuUsers className="size-3.5 text-muted-foreground"/>
                            <span>{(_a = r.matchedRule.targetGroupName) !== null && _a !== void 0 ? _a : "—"}</span>
                          </react_1.HStack>) : (<span className="text-muted-foreground text-sm">
                            —
                          </span>)}
                      </react_1.Td>
                    </react_1.Tr>);
        }))}
              </react_1.Tbody>
            </react_1.Table>
          </react_1.CardContent>
        </react_1.Card>
      </div>
    </react_1.VStack>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
