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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var jobs_1 = require("@carbon/jobs");
var production_1 = require("~/modules/production");
var configTableOverlay_server_1 = require("~/modules/production/configTableOverlay.server");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, ids, field, value, jobs, lockedError, serviceRole, _d, _e, item, manufacturing, _f, itemUpdate, makeMethodUpdate, _g, ids_1, ids_1_1, id, upsertMethod, e_1_1, _h, ids_2, ids_2_1, id, currentJob, newDueDate, newDeadlineType, priority, updateResult, e_2_1, quantityUpdate, _j, ids_3, ids_3_1, id, recalculate, e_3_1, configuration, configurationUpdate, _k, ids_4, ids_4_1, id, recalculate, e_4_1;
        var _l, _m, _o;
        var _p, e_1, _q, _r, _s, e_2, _t, _u, _v, e_3, _w, _x, _y, e_4, _z, _0;
        var _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        var request = _b.request;
        return __generator(this, function (_14) {
            switch (_14.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "production"
                    })];
                case 1:
                    _c = _14.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _14.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string") {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    return [4 /*yield*/, client
                            .from("job")
                            .select("id, status")
                            .in("id", ids)];
                case 3:
                    jobs = _14.sent();
                    lockedError = (0, lockedGuard_server_1.requireUnlockedBulk)({
                        statuses: ((_1 = jobs.data) !== null && _1 !== void 0 ? _1 : []).map(function (j) { return j.status; }),
                        checkFn: production_1.isJobLocked,
                        message: "Cannot modify a locked job. Reopen it first."
                    });
                    if (lockedError)
                        return [2 /*return*/, lockedError];
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 4:
                    serviceRole = _14.sent();
                    if (!(field === "delete")) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("job")
                            .delete()
                            .in("id", ids)
                            .eq("companyId", companyId)];
                case 5: return [2 /*return*/, _14.sent()];
                case 6:
                    if (typeof value !== "string" && value !== null) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    _d = field;
                    switch (_d) {
                        case "itemId": return [3 /*break*/, 7];
                        case "deadlineType": return [3 /*break*/, 24];
                        case "dueDate": return [3 /*break*/, 24];
                        case "customerId": return [3 /*break*/, 39];
                        case "jobId": return [3 /*break*/, 39];
                        case "locationId": return [3 /*break*/, 39];
                        case "storageUnitId": return [3 /*break*/, 39];
                        case "startDate": return [3 /*break*/, 39];
                        case "unitOfMeasureCode": return [3 /*break*/, 39];
                        case "quantity": return [3 /*break*/, 41];
                        case "scrapQuantity": return [3 /*break*/, 41];
                        case "configuration": return [3 /*break*/, 56];
                        case "salesOrderId": return [3 /*break*/, 71];
                        case "salesOrderLineId": return [3 /*break*/, 71];
                    }
                    return [3 /*break*/, 74];
                case 7:
                    if (!value) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .select("name, readableIdWithRevision, defaultMethodType, unitOfMeasureCode, modelUploadId")
                                .eq("id", value)
                                .eq("companyId", companyId)
                                .single(),
                            client
                                .from("itemReplenishment")
                                .select("lotSize, scrapPercentage")
                                .eq("itemId", value)
                                .single()
                        ])];
                case 8:
                    _e = _14.sent(), item = _e[0], manufacturing = _e[1];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("job")
                                .update({
                                itemId: value,
                                unitOfMeasureCode: (_3 = (_2 = item.data) === null || _2 === void 0 ? void 0 : _2.unitOfMeasureCode) !== null && _3 !== void 0 ? _3 : "EA",
                                quantity: ((_5 = (_4 = manufacturing === null || manufacturing === void 0 ? void 0 : manufacturing.data) === null || _4 === void 0 ? void 0 : _4.lotSize) !== null && _5 !== void 0 ? _5 : 0) === 0
                                    ? undefined
                                    : ((_7 = (_6 = manufacturing === null || manufacturing === void 0 ? void 0 : manufacturing.data) === null || _6 === void 0 ? void 0 : _6.lotSize) !== null && _7 !== void 0 ? _7 : 0),
                                modelUploadId: (_9 = (_8 = item.data) === null || _8 === void 0 ? void 0 : _8.modelUploadId) !== null && _9 !== void 0 ? _9 : null,
                                scrapQuantity: Math.ceil(((_11 = (_10 = manufacturing === null || manufacturing === void 0 ? void 0 : manufacturing.data) === null || _10 === void 0 ? void 0 : _10.lotSize) !== null && _11 !== void 0 ? _11 : 0) *
                                    ((_13 = (_12 = manufacturing === null || manufacturing === void 0 ? void 0 : manufacturing.data) === null || _12 === void 0 ? void 0 : _12.scrapPercentage) !== null && _13 !== void 0 ? _13 : 0)),
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .in("id", ids)
                                .eq("companyId", companyId),
                            client
                                .from("jobMakeMethod")
                                .update({
                                itemId: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .in("jobId", ids)
                                .is("parentMaterialId", null)
                                .eq("companyId", companyId)
                        ])];
                case 9:
                    _f = _14.sent(), itemUpdate = _f[0], makeMethodUpdate = _f[1];
                    if (itemUpdate.error) {
                        return [2 /*return*/, itemUpdate];
                    }
                    if (makeMethodUpdate.error) {
                        return [2 /*return*/, makeMethodUpdate];
                    }
                    _14.label = 10;
                case 10:
                    _14.trys.push([10, 17, 18, 23]);
                    _g = true, ids_1 = __asyncValues(ids);
                    _14.label = 11;
                case 11: return [4 /*yield*/, ids_1.next()];
                case 12:
                    if (!(ids_1_1 = _14.sent(), _p = ids_1_1.done, !_p)) return [3 /*break*/, 16];
                    _r = ids_1_1.value;
                    _g = false;
                    id = _r;
                    return [4 /*yield*/, (0, production_1.upsertJobMethod)(serviceRole, "itemToJob", {
                            sourceId: value,
                            targetId: id,
                            companyId: companyId,
                            userId: userId
                        })];
                case 13:
                    upsertMethod = _14.sent();
                    if (upsertMethod.error) {
                        upsertMethod.error;
                    }
                    return [4 /*yield*/, (0, jobs_1.trigger)("recalculate", {
                            type: "jobRequirements",
                            id: id,
                            companyId: companyId,
                            userId: userId
                        })];
                case 14:
                    _14.sent();
                    _14.label = 15;
                case 15:
                    _g = true;
                    return [3 /*break*/, 11];
                case 16: return [3 /*break*/, 23];
                case 17:
                    e_1_1 = _14.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 23];
                case 18:
                    _14.trys.push([18, , 21, 22]);
                    if (!(!_g && !_p && (_q = ids_1.return))) return [3 /*break*/, 20];
                    return [4 /*yield*/, _q.call(ids_1)];
                case 19:
                    _14.sent();
                    _14.label = 20;
                case 20: return [3 /*break*/, 22];
                case 21:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 22: return [7 /*endfinally*/];
                case 23: return [2 /*return*/, itemUpdate];
                case 24:
                    _14.trys.push([24, 32, 33, 38]);
                    _h = true, ids_2 = __asyncValues(ids);
                    _14.label = 25;
                case 25: return [4 /*yield*/, ids_2.next()];
                case 26:
                    if (!(ids_2_1 = _14.sent(), _s = ids_2_1.done, !_s)) return [3 /*break*/, 31];
                    _u = ids_2_1.value;
                    _h = false;
                    id = _u;
                    return [4 /*yield*/, client
                            .from("job")
                            .select("dueDate, deadlineType, locationId")
                            .eq("id", id)
                            .eq("companyId", companyId)
                            .single()];
                case 27:
                    currentJob = _14.sent();
                    if (currentJob.error || !currentJob.data) {
                        return [2 /*return*/, currentJob];
                    }
                    newDueDate = field === "dueDate" ? (value !== null && value !== void 0 ? value : null) : currentJob.data.dueDate;
                    newDeadlineType = field === "deadlineType" ? value : currentJob.data.deadlineType;
                    if (!newDeadlineType) {
                        return [2 /*return*/, {
                                error: { message: "Invalid deadline type" },
                                data: null
                            }];
                    }
                    return [4 /*yield*/, (0, production_1.calculateJobPriority)(client, {
                            jobId: id,
                            dueDate: newDueDate,
                            deadlineType: newDeadlineType,
                            companyId: companyId,
                            locationId: currentJob.data.locationId
                        })];
                case 28:
                    priority = _14.sent();
                    return [4 /*yield*/, client
                            .from("job")
                            .update((_l = {},
                            _l[field] = value ? value : null,
                            _l.priority = priority,
                            _l.updatedBy = userId,
                            _l.updatedAt = new Date().toISOString(),
                            _l))
                            .eq("id", id)
                            .eq("companyId", companyId)];
                case 29:
                    updateResult = _14.sent();
                    if (updateResult.error) {
                        return [2 /*return*/, updateResult];
                    }
                    _14.label = 30;
                case 30:
                    _h = true;
                    return [3 /*break*/, 25];
                case 31: return [3 /*break*/, 38];
                case 32:
                    e_2_1 = _14.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 38];
                case 33:
                    _14.trys.push([33, , 36, 37]);
                    if (!(!_h && !_s && (_t = ids_2.return))) return [3 /*break*/, 35];
                    return [4 /*yield*/, _t.call(ids_2)];
                case 34:
                    _14.sent();
                    _14.label = 35;
                case 35: return [3 /*break*/, 37];
                case 36:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 37: return [7 /*endfinally*/];
                case 38: return [2 /*return*/, { error: null, data: null }];
                case 39: return [4 /*yield*/, client
                        .from("job")
                        .update((_m = {},
                        _m[field] = value ? value : null,
                        _m.updatedBy = userId,
                        _m.updatedAt = new Date().toISOString(),
                        _m))
                        .in("id", ids)
                        .eq("companyId", companyId)];
                case 40: return [2 /*return*/, _14.sent()];
                case 41: return [4 /*yield*/, client
                        .from("job")
                        .update((_o = {},
                        _o[field] = value ? value : null,
                        _o.updatedBy = userId,
                        _o.updatedAt = new Date().toISOString(),
                        _o))
                        .in("id", ids)
                        .eq("companyId", companyId)];
                case 42:
                    quantityUpdate = _14.sent();
                    if (quantityUpdate.error) {
                        return [2 /*return*/, quantityUpdate];
                    }
                    _14.label = 43;
                case 43:
                    _14.trys.push([43, 49, 50, 55]);
                    _j = true, ids_3 = __asyncValues(ids);
                    _14.label = 44;
                case 44: return [4 /*yield*/, ids_3.next()];
                case 45:
                    if (!(ids_3_1 = _14.sent(), _v = ids_3_1.done, !_v)) return [3 /*break*/, 48];
                    _x = ids_3_1.value;
                    _j = false;
                    id = _x;
                    return [4 /*yield*/, (0, production_1.recalculateJobRequirements)(serviceRole, {
                            id: id,
                            companyId: companyId,
                            userId: userId
                        })];
                case 46:
                    recalculate = _14.sent();
                    if (recalculate.error) {
                        console.error(recalculate.error);
                        return [2 /*return*/, recalculate];
                    }
                    _14.label = 47;
                case 47:
                    _j = true;
                    return [3 /*break*/, 44];
                case 48: return [3 /*break*/, 55];
                case 49:
                    e_3_1 = _14.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 55];
                case 50:
                    _14.trys.push([50, , 53, 54]);
                    if (!(!_j && !_v && (_w = ids_3.return))) return [3 /*break*/, 52];
                    return [4 /*yield*/, _w.call(ids_3)];
                case 51:
                    _14.sent();
                    _14.label = 52;
                case 52: return [3 /*break*/, 54];
                case 53:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 54: return [7 /*endfinally*/];
                case 55: return [2 /*return*/, quantityUpdate];
                case 56:
                    configuration = value ? JSON.parse(value) : null;
                    return [4 /*yield*/, client
                            .from("job")
                            .update(__assign(__assign({}, (configuration && typeof configuration === "object"
                            ? (0, configTableOverlay_server_1.jobConfigurationUpdateFields)(configuration)
                            : { configuration: null })), { updatedBy: userId, updatedAt: new Date().toISOString() }))
                            .in("id", ids)
                            .eq("companyId", companyId)];
                case 57:
                    configurationUpdate = _14.sent();
                    if (configurationUpdate.error) {
                        return [2 /*return*/, configurationUpdate];
                    }
                    if (!(configuration && typeof configuration === "object")) return [3 /*break*/, 70];
                    _14.label = 58;
                case 58:
                    _14.trys.push([58, 64, 65, 70]);
                    _k = true, ids_4 = __asyncValues(ids);
                    _14.label = 59;
                case 59: return [4 /*yield*/, ids_4.next()];
                case 60:
                    if (!(ids_4_1 = _14.sent(), _y = ids_4_1.done, !_y)) return [3 /*break*/, 63];
                    _0 = ids_4_1.value;
                    _k = false;
                    id = _0;
                    return [4 /*yield*/, (0, production_1.recalculateJobRequirements)(serviceRole, {
                            id: id,
                            companyId: companyId,
                            userId: userId
                        })];
                case 61:
                    recalculate = _14.sent();
                    if (recalculate.error) {
                        console.error(recalculate.error);
                        return [2 /*return*/, recalculate];
                    }
                    _14.label = 62;
                case 62:
                    _k = true;
                    return [3 /*break*/, 59];
                case 63: return [3 /*break*/, 70];
                case 64:
                    e_4_1 = _14.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 70];
                case 65:
                    _14.trys.push([65, , 68, 69]);
                    if (!(!_k && !_y && (_z = ids_4.return))) return [3 /*break*/, 67];
                    return [4 /*yield*/, _z.call(ids_4)];
                case 66:
                    _14.sent();
                    _14.label = 67;
                case 67: return [3 /*break*/, 69];
                case 68:
                    if (e_4) throw e_4.error;
                    return [7 /*endfinally*/];
                case 69: return [7 /*endfinally*/];
                case 70: return [2 /*return*/, configurationUpdate];
                case 71:
                    if (!!value) return [3 /*break*/, 73];
                    return [4 /*yield*/, client
                            .from("job")
                            .update({ salesOrderId: null, salesOrderLineId: null })
                            .in("id", ids)
                            .eq("companyId", companyId)];
                case 72: return [2 /*return*/, _14.sent()];
                case 73: return [2 /*return*/, {
                        error: { message: "Invalid value: ".concat(value, " for field: ").concat(field) },
                        data: null
                    }];
                case 74: return [2 /*return*/, {
                        error: { message: "Invalid field: ".concat(field) },
                        data: null
                    }];
            }
        });
    });
}
