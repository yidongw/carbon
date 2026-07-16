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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var items_1 = require("~/modules/items");
var production_1 = require("~/modules/production");
var settings_service_1 = require("~/modules/settings/settings.service");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, serviceRole, formData, validation, jobIds, _d, _e, _f, dueDateOfFirstJob, dueDateOfLastJob, scrapQuantityPerJob, jobCount, quantityPerJob, jobData, configuration, configTableRows, configTablePrimaryKeys, hasConfiguredJobs, jobs, getConfiguredJobQuantity, manufacturing, dueDateDistribution, startDate_1, endDate, daysBetween, jobsPerDay_1, daysPerJob_1, cumulativeJobs_1, storageUnitId, _g, _h, _j, i, nextSequence, _k, _l, jobId, dueDate, configTableRow, configurationForJob, jobQuantity, scrapRatio, createJob, _m, _o, id, _p, _q, upsertMethod, e_1_1, _r, _s;
        var _t, e_1, _u, _v;
        var _w, _x, _y, _z;
        var request = _b.request;
        return __generator(this, function (_0) {
            switch (_0.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "production",
                            bypassRls: true
                        })];
                case 1:
                    _c = _0.sent(), companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _0.sent();
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _0.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.bulkJobValidator).validate(formData)];
                case 4:
                    validation = _0.sent();
                    jobIds = [];
                    if (!!validation.data) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(validation.error, "Invalid form data"))];
                case 5: throw _d.apply(void 0, _e.concat([_0.sent()]));
                case 6:
                    _f = validation.data, dueDateOfFirstJob = _f.dueDateOfFirstJob, dueDateOfLastJob = _f.dueDateOfLastJob, scrapQuantityPerJob = _f.scrapQuantityPerJob, jobCount = _f.jobCount, quantityPerJob = _f.quantityPerJob, jobData = __rest(_f, ["dueDateOfFirstJob", "dueDateOfLastJob", "scrapQuantityPerJob", "jobCount", "quantityPerJob"]);
                    configuration = undefined;
                    if (jobData.configuration) {
                        try {
                            configuration = JSON.parse(jobData.configuration);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    configTableRows = Array.isArray(configuration === null || configuration === void 0 ? void 0 : configuration.configTable)
                        ? configuration.configTable
                        : [];
                    configTablePrimaryKeys = Array.isArray(configuration === null || configuration === void 0 ? void 0 : configuration.configTablePrimaryKeys)
                        ? configuration.configTablePrimaryKeys
                        : ["Quantities"];
                    hasConfiguredJobs = configTableRows.length > 0;
                    jobs = Math.max(1, Math.ceil(jobCount));
                    getConfiguredJobQuantity = function (row) {
                        return configTablePrimaryKeys.reduce(function (sum, key) { return sum + (Number(row[key]) || 0); }, 0);
                    };
                    return [4 /*yield*/, (0, items_1.getItemReplenishment)(serviceRole, jobData.itemId, companyId)];
                case 7:
                    manufacturing = _0.sent();
                    dueDateDistribution = [];
                    if (dueDateOfFirstJob && dueDateOfLastJob) {
                        startDate_1 = (0, date_1.toCalendarDateTime)((0, date_1.parseDateTime)(dueDateOfFirstJob));
                        endDate = (0, date_1.toCalendarDateTime)((0, date_1.parseDateTime)(dueDateOfLastJob));
                        daysBetween = endDate.compare(startDate_1);
                        jobsPerDay_1 = (jobs - 1) / daysBetween;
                        daysPerJob_1 = daysBetween / (jobs - 1);
                        if (jobsPerDay_1 >= 1) {
                            cumulativeJobs_1 = 0;
                            dueDateDistribution = Array.from({ length: jobs }, function (_, i) {
                                if (i === jobs - 1)
                                    return dueDateOfLastJob;
                                cumulativeJobs_1 += 1;
                                var dayOffset = Math.floor(cumulativeJobs_1 / jobsPerDay_1);
                                var jobDate = startDate_1.add({ days: dayOffset });
                                return jobDate.toString();
                            });
                        }
                        else {
                            // Multiple days per job - distribute days evenly across jobs
                            dueDateDistribution = Array.from({ length: jobs }, function (_, i) {
                                if (i === jobs - 1)
                                    return dueDateOfLastJob;
                                var dayOffset = Math.floor(i * daysPerJob_1);
                                var jobDate = startDate_1.add({ days: dayOffset });
                                return jobDate.toString();
                            });
                        }
                    }
                    return [4 /*yield*/, (0, inventory_1.getDefaultStorageUnitForJob)(serviceRole, jobData.itemId, jobData.locationId, companyId)];
                case 8:
                    storageUnitId = _0.sent();
                    _0.label = 9;
                case 9:
                    _0.trys.push([9, 23, 24, 29]);
                    _g = true, _h = __asyncValues(Array.from({ length: jobs }, function (_, i) { return [i]; }));
                    _0.label = 10;
                case 10: return [4 /*yield*/, _h.next()];
                case 11:
                    if (!(_j = _0.sent(), _t = _j.done, !_t)) return [3 /*break*/, 22];
                    _v = _j.value;
                    _g = false;
                    i = _v[0];
                    return [4 /*yield*/, (0, settings_service_1.getNextSequence)(serviceRole, "job", companyId)];
                case 12:
                    nextSequence = _0.sent();
                    if (!nextSequence.error) return [3 /*break*/, 14];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.newJob];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(nextSequence.error, "Failed to get next sequence"))];
                case 13: throw _k.apply(void 0, _l.concat([_0.sent()]));
                case 14:
                    jobId = nextSequence.data;
                    dueDate = (_w = (dueDateDistribution[i] || dueDateOfFirstJob)) === null || _w === void 0 ? void 0 : _w.split("T")[0];
                    configTableRow = hasConfiguredJobs
                        ? configTableRows[i % configTableRows.length]
                        : undefined;
                    configurationForJob = configTableRow
                        ? __assign(__assign({}, configuration), { configTable: [configTableRow] }) : configuration;
                    jobQuantity = configTableRow
                        ? getConfiguredJobQuantity(configTableRow)
                        : quantityPerJob;
                    scrapRatio = quantityPerJob > 0 ? scrapQuantityPerJob / quantityPerJob : 0;
                    return [4 /*yield*/, (0, production_1.upsertJob)(serviceRole, __assign(__assign({ jobId: jobId }, jobData), { quantity: jobQuantity, scrapQuantity: Math.ceil(jobQuantity * scrapRatio), dueDate: dueDate, startDate: dueDate
                                ? (0, date_1.parseDate)(dueDate)
                                    .subtract({ days: (_y = (_x = manufacturing.data) === null || _x === void 0 ? void 0 : _x.leadTime) !== null && _y !== void 0 ? _y : 7 })
                                    .toString()
                                : undefined, storageUnitId: storageUnitId !== null && storageUnitId !== void 0 ? storageUnitId : undefined, configuration: configurationForJob, companyId: companyId, createdBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 15:
                    createJob = _0.sent();
                    if (!createJob.error) return [3 /*break*/, 17];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.newJob];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createJob.error, "Failed to insert job"))];
                case 16: throw _m.apply(void 0, _o.concat([_0.sent()]));
                case 17:
                    id = (_z = createJob.data) === null || _z === void 0 ? void 0 : _z.id;
                    if (!(createJob.error || !jobId)) return [3 /*break*/, 19];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createJob.error, "Failed to insert job"))];
                case 18: throw _p.apply(void 0, _q.concat([_0.sent()]));
                case 19: return [4 /*yield*/, (0, production_1.upsertJobMethod)(serviceRole, "itemToJob", {
                        sourceId: jobData.itemId,
                        targetId: id,
                        companyId: companyId,
                        userId: userId,
                        configuration: configurationForJob
                    })];
                case 20:
                    upsertMethod = _0.sent();
                    if (upsertMethod.error) {
                        console.error("Failed to upsert job method", upsertMethod.error);
                    }
                    jobIds.push(id);
                    _0.label = 21;
                case 21:
                    _g = true;
                    return [3 /*break*/, 10];
                case 22: return [3 /*break*/, 29];
                case 23:
                    e_1_1 = _0.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 29];
                case 24:
                    _0.trys.push([24, , 27, 28]);
                    if (!(!_g && !_t && (_u = _h.return))) return [3 /*break*/, 26];
                    return [4 /*yield*/, _u.call(_h)];
                case 25:
                    _0.sent();
                    _0.label = 26;
                case 26: return [3 /*break*/, 28];
                case 27:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 28: return [7 /*endfinally*/];
                case 29: return [4 /*yield*/, (0, jobs_1.batchTrigger)("recalculate", jobIds.map(function (id) { return ({
                        payload: {
                            type: "jobRequirements",
                            id: id,
                            companyId: companyId,
                            userId: userId
                        }
                    }); }))];
                case 30:
                    _0.sent();
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully created ".concat(jobs, " jobs")))];
                case 31: throw _r.apply(void 0, _s.concat([_0.sent()]));
            }
        });
    });
}
