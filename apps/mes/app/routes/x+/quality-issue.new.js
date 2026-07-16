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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, serviceRole, formData, jobOperationId, trackedEntityId, userDescription, nonConformanceTypeId, priority, quantity, _d, _e, context, _f, _g, nextSequence, _h, _j, name, issue, _k, _l, nonConformanceId, _m, jobOperationAssociation, dispositionAssociation, associationError, _o, _p, tasks, _q, _r;
        var _s, _t, _u, _v, _w, _x, _y, _z, _0;
        var request = _b.request;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "quality"
                        })];
                case 1:
                    _c = _1.sent(), companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _1.sent();
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _1.sent();
                    jobOperationId = getRequiredFormValue(formData, "jobOperationId");
                    trackedEntityId = getOptionalFormValue(formData, "trackedEntityId");
                    userDescription = getOptionalFormValue(formData, "description");
                    nonConformanceTypeId = getOptionalFormValue(formData, "nonConformanceTypeId");
                    priority = getOptionalFormValue(formData, "priority");
                    quantity = normalizeQuantity(getOptionalFormValue(formData, "quantity"));
                    if (!!jobOperationId) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [(_s = (0, path_1.requestReferrer)(request)) !== null && _s !== void 0 ? _s : path_1.path.to.active];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Job operation is required"))];
                case 4: throw _d.apply(void 0, _e.concat([_1.sent()]));
                case 5: return [4 /*yield*/, getIssueContext(serviceRole, {
                        companyId: companyId,
                        userId: userId,
                        jobOperationId: jobOperationId
                    })];
                case 6:
                    context = _1.sent();
                    if (!!context.ok) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [(_t = (0, path_1.requestReferrer)(request)) !== null && _t !== void 0 ? _t : path_1.path.to.active];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(context.error, context.message))];
                case 7: throw _f.apply(void 0, _g.concat([_1.sent()]));
                case 8: return [4 /*yield*/, serviceRole.rpc("get_next_sequence", {
                        sequence_name: "nonConformance",
                        company_id: companyId
                    })];
                case 9:
                    nextSequence = _1.sent();
                    if (!(nextSequence.error || !nextSequence.data)) return [3 /*break*/, 11];
                    _h = react_router_1.redirect;
                    _j = [(_u = (0, path_1.requestReferrer)(request)) !== null && _u !== void 0 ? _u : path_1.path.to.active];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(nextSequence.error, "Failed to get quality issue sequence"))];
                case 10: throw _h.apply(void 0, _j.concat([_1.sent()]));
                case 11:
                    name = userDescription !== null && userDescription !== void 0 ? userDescription : "MES quality issue: ".concat((_v = context.itemReadableId) !== null && _v !== void 0 ? _v : context.jobReadableId);
                    return [4 /*yield*/, serviceRole
                            .from("nonConformance")
                            .insert({
                            nonConformanceId: nextSequence.data,
                            name: name,
                            description: "",
                            priority: priority !== null && priority !== void 0 ? priority : "Medium",
                            source: "Internal",
                            locationId: context.locationId,
                            nonConformanceTypeId: nonConformanceTypeId !== null && nonConformanceTypeId !== void 0 ? nonConformanceTypeId : context.issueTypeId,
                            nonConformanceWorkflowId: null,
                            openDate: new Date().toISOString().slice(0, 10),
                            quantity: quantity,
                            assignee: context.assignee,
                            requiredActionIds: [],
                            approvalRequirements: [],
                            companyId: companyId,
                            createdBy: userId
                        })
                            .select("id")
                            .single()];
                case 12:
                    issue = _1.sent();
                    if (!(issue.error || !((_w = issue.data) === null || _w === void 0 ? void 0 : _w.id))) return [3 /*break*/, 14];
                    _k = react_router_1.redirect;
                    _l = [(_x = (0, path_1.requestReferrer)(request)) !== null && _x !== void 0 ? _x : path_1.path.to.active];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(issue.error, "Failed to create quality issue"))];
                case 13: throw _k.apply(void 0, _l.concat([_1.sent()]));
                case 14:
                    nonConformanceId = issue.data.id;
                    return [4 /*yield*/, Promise.all([
                            serviceRole.from("nonConformanceJobOperation").insert({
                                nonConformanceId: nonConformanceId,
                                jobOperationId: context.jobOperationId,
                                jobId: context.jobId,
                                jobReadableId: context.jobReadableId,
                                companyId: companyId,
                                createdBy: userId
                            }),
                            linkIssueDispositionContext(serviceRole, {
                                nonConformanceId: nonConformanceId,
                                companyId: companyId,
                                userId: userId,
                                itemId: context.itemId,
                                jobMakeMethodId: context.jobMakeMethodId,
                                trackedEntityId: trackedEntityId,
                                quantity: quantity
                            })
                        ])];
                case 15:
                    _m = _1.sent(), jobOperationAssociation = _m[0], dispositionAssociation = _m[1];
                    associationError = (_y = jobOperationAssociation.error) !== null && _y !== void 0 ? _y : dispositionAssociation.error;
                    if (!associationError) return [3 /*break*/, 18];
                    return [4 /*yield*/, serviceRole
                            .from("nonConformance")
                            .delete()
                            .eq("id", nonConformanceId)];
                case 16:
                    _1.sent();
                    _o = react_router_1.redirect;
                    _p = [(_z = (0, path_1.requestReferrer)(request)) !== null && _z !== void 0 ? _z : path_1.path.to.active];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(associationError, "Failed to link quality issue to MES context"))];
                case 17: throw _o.apply(void 0, _p.concat([_1.sent()]));
                case 18: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "nonConformanceTasks",
                            id: nonConformanceId,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 19:
                    tasks = _1.sent();
                    if (!tasks.error) return [3 /*break*/, 22];
                    return [4 /*yield*/, serviceRole
                            .from("nonConformance")
                            .delete()
                            .eq("id", nonConformanceId)];
                case 20:
                    _1.sent();
                    _q = react_router_1.redirect;
                    _r = [(_0 = (0, path_1.requestReferrer)(request)) !== null && _0 !== void 0 ? _0 : path_1.path.to.active];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(tasks.error, "Failed to create quality issue tasks"))];
                case 21: throw _q.apply(void 0, _r.concat([_1.sent()]));
                case 22: return [2 /*return*/, (0, auth_1.success)("Quality issue created")];
            }
        });
    });
}
function getRequiredFormValue(formData, key) {
    var _a, _b;
    return (_b = (_a = formData.get(key)) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
}
function getOptionalFormValue(formData, key) {
    var _a;
    return ((_a = formData.get(key)) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
}
function normalizeQuantity(value) {
    var quantity = Number(value !== null && value !== void 0 ? value : "1");
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}
function getIssueContext(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var operation, _a, job, defaults, issueType, locationId, item, _b;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("id, companyId, jobId, jobMakeMethodId, operationOrder")
                        .eq("id", args.jobOperationId)
                        .maybeSingle()];
                case 1:
                    operation = _l.sent();
                    if (operation.error || !operation.data) {
                        return [2 /*return*/, {
                                ok: false,
                                error: operation.error,
                                message: "Failed to load job operation"
                            }];
                    }
                    if (operation.data.companyId !== args.companyId) {
                        return [2 /*return*/, {
                                ok: false,
                                error: null,
                                message: "Job operation is not in this company"
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("job")
                                .select("id, jobId, itemId, locationId, assignee")
                                .eq("id", operation.data.jobId)
                                .maybeSingle(),
                            client
                                .from("userDefaults")
                                .select("locationId")
                                .eq("userId", args.userId)
                                .eq("companyId", args.companyId)
                                .maybeSingle(),
                            client
                                .from("nonConformanceType")
                                .select("id")
                                .eq("companyId", args.companyId)
                                .order("name", { ascending: true })
                                .limit(1)
                                .maybeSingle()
                        ])];
                case 2:
                    _a = _l.sent(), job = _a[0], defaults = _a[1], issueType = _a[2];
                    if (job.error || !job.data) {
                        return [2 /*return*/, {
                                ok: false,
                                error: job.error,
                                message: "Failed to load job context"
                            }];
                    }
                    if (issueType.error || !((_c = issueType.data) === null || _c === void 0 ? void 0 : _c.id)) {
                        return [2 /*return*/, {
                                ok: false,
                                error: issueType.error,
                                message: "Configure at least one quality issue type before creating MES issues"
                            }];
                    }
                    locationId = (_e = (_d = defaults.data) === null || _d === void 0 ? void 0 : _d.locationId) !== null && _e !== void 0 ? _e : job.data.locationId;
                    if (!locationId) {
                        return [2 /*return*/, {
                                ok: false,
                                error: defaults.error,
                                message: "A location is required to create a quality issue"
                            }];
                    }
                    if (!job.data.itemId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("readableId, name")
                            .eq("id", job.data.itemId)
                            .maybeSingle()];
                case 3:
                    _b = _l.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = null;
                    _l.label = 5;
                case 5:
                    item = _b;
                    return [2 /*return*/, {
                            ok: true,
                            jobOperationId: operation.data.id,
                            operationOrder: operation.data.operationOrder,
                            jobId: job.data.id,
                            jobReadableId: job.data.jobId,
                            jobMakeMethodId: operation.data.jobMakeMethodId,
                            itemId: job.data.itemId,
                            itemReadableId: (_k = (_j = (_g = (_f = item === null || item === void 0 ? void 0 : item.data) === null || _f === void 0 ? void 0 : _f.readableId) !== null && _g !== void 0 ? _g : (_h = item === null || item === void 0 ? void 0 : item.data) === null || _h === void 0 ? void 0 : _h.name) !== null && _j !== void 0 ? _j : job.data.itemId) !== null && _k !== void 0 ? _k : null,
                            locationId: locationId,
                            issueTypeId: issueType.data.id,
                            assignee: job.data.assignee
                        }];
            }
        });
    });
}
function linkIssueDispositionContext(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, companyId, userId, itemId, jobMakeMethodId, trackedEntityId, quantity, trackedEntities, itemQuantity, item, trackedEntityLinks, dispositionLinks;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    nonConformanceId = args.nonConformanceId, companyId = args.companyId, userId = args.userId, itemId = args.itemId, jobMakeMethodId = args.jobMakeMethodId, trackedEntityId = args.trackedEntityId, quantity = args.quantity;
                    if (!itemId)
                        return [2 /*return*/, { error: null }];
                    return [4 /*yield*/, getTrackedEntitiesForIssue(client, {
                            companyId: companyId,
                            jobMakeMethodId: jobMakeMethodId,
                            trackedEntityId: trackedEntityId
                        })];
                case 1:
                    trackedEntities = _c.sent();
                    if (trackedEntities.error) {
                        return [2 /*return*/, { error: trackedEntities.error }];
                    }
                    itemQuantity = trackedEntities.data.length > 0
                        ? trackedEntities.data.reduce(function (total, entity) { var _a; return total + Number((_a = entity.quantity) !== null && _a !== void 0 ? _a : quantity); }, 0)
                        : quantity;
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .insert({
                            nonConformanceId: nonConformanceId,
                            itemId: itemId,
                            quantity: itemQuantity,
                            disposition: "Pending",
                            companyId: companyId,
                            createdBy: userId
                        })
                            .select("id")
                            .single()];
                case 2:
                    item = _c.sent();
                    if (item.error || !((_a = item.data) === null || _a === void 0 ? void 0 : _a.id)) {
                        return [2 /*return*/, { error: (_b = item.error) !== null && _b !== void 0 ? _b : new Error("Failed to create issue item") }];
                    }
                    if (trackedEntities.data.length === 0) {
                        return [2 /*return*/, { error: null }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceTrackedEntity")
                            .insert(trackedEntities.data.map(function (entity) { return ({
                            nonConformanceId: nonConformanceId,
                            trackedEntityId: entity.id,
                            companyId: companyId,
                            createdBy: userId
                        }); }))];
                case 3:
                    trackedEntityLinks = _c.sent();
                    if (trackedEntityLinks.error) {
                        return [2 /*return*/, { error: trackedEntityLinks.error }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceItemTrackedEntity")
                            .insert(trackedEntities.data.map(function (entity) {
                            var _a;
                            return ({
                                nonConformanceItemId: item.data.id,
                                nonConformanceId: nonConformanceId,
                                trackedEntityId: entity.id,
                                quantity: Number((_a = entity.quantity) !== null && _a !== void 0 ? _a : quantity),
                                companyId: companyId,
                                createdBy: userId
                            });
                        }))];
                case 4:
                    dispositionLinks = _c.sent();
                    return [2 /*return*/, { error: dispositionLinks.error }];
            }
        });
    });
}
function getTrackedEntitiesForIssue(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var entity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args.trackedEntityId) {
                        return [2 /*return*/, { data: [], error: null }];
                    }
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id, quantity")
                            .eq("id", args.trackedEntityId)
                            .eq("companyId", args.companyId)
                            .maybeSingle()];
                case 1:
                    entity = _a.sent();
                    if (entity.error) {
                        return [2 /*return*/, { data: [], error: entity.error }];
                    }
                    if (!entity.data) {
                        return [2 /*return*/, {
                                data: [],
                                error: new Error("Tracked entity is not in this company")
                            }];
                    }
                    return [2 /*return*/, { data: [entity.data], error: null }];
            }
        });
    });
}
