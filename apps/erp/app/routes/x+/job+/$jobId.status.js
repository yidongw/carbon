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
var production_1 = require("~/modules/production");
var production_server_1 = require("~/modules/production/production.server");
var path_1 = require("~/utils/path");
function respondWithFlash(request_1, _a) {
    return __awaiter(this, arguments, void 0, function (request, _b) {
        var init;
        var _c;
        var stay = _b.stay, jobId = _b.jobId, result = _b.result, payload = _b.payload;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, session_server_1.flash)(request, result)];
                case 1:
                    init = _d.sent();
                    if (stay) {
                        return [2 /*return*/, (0, react_router_1.data)(payload !== null && payload !== void 0 ? payload : { success: result.success === true }, init)];
                    }
                    throw (0, react_router_1.redirect)((_c = (0, path_1.requestReferrer)(request)) !== null && _c !== void 0 ? _c : path_1.path.to.job(jobId), init);
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, url, shouldSchedule, stay, formData, status, selectedPurchaseOrdersBySupplierId, _d, _e, jobData, _f, _g, _h, _j, serviceRole, purchaseOrdersBySupplierId, _k, company, companyError, purchaseOrderCreate, message, statusUpdate, releasedDateError, releaseTriggerError_1, releasedMessage, err_1, update, _l, _m, _o, _p, serviceRole, _q, _r, _s, _t, _u, _v;
        var _w, _x, _y, _z;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_0) {
            switch (_0.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _0.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.jobId;
                    if (!id)
                        throw new Error("Could not find id");
                    url = new URL(request.url);
                    shouldSchedule = url.searchParams.get("schedule") === "1";
                    stay = url.searchParams.get("stay") === "1";
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _0.sent();
                    status = formData.get("status");
                    selectedPurchaseOrdersBySupplierId = formData.get("selectedPurchaseOrdersBySupplierId");
                    if (!(!status || !production_1.jobStatus.includes(status))) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.job(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid status"))];
                case 3: throw _d.apply(void 0, _e.concat([_0.sent()]));
                case 4:
                    if (!(status === "Ready")) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("item(itemReplenishment(manufacturingBlocked))")
                            .eq("id", id)
                            .single()];
                case 5:
                    jobData = (_0.sent()).data;
                    if (!((_x = (_w = jobData === null || jobData === void 0 ? void 0 : jobData.item) === null || _w === void 0 ? void 0 : _w.itemReplenishment) === null || _x === void 0 ? void 0 : _x.manufacturingBlocked)) return [3 /*break*/, 9];
                    if (!stay) return [3 /*break*/, 7];
                    _f = react_router_1.data;
                    _g = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Manufacturing is blocked"))];
                case 6: return [2 /*return*/, _f.apply(void 0, _g.concat([_0.sent()]))];
                case 7:
                    _h = react_router_1.redirect;
                    _j = [(_y = (0, path_1.requestReferrer)(request)) !== null && _y !== void 0 ? _y : path_1.path.to.job(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Manufacturing is blocked"))];
                case 8: throw _h.apply(void 0, _j.concat([_0.sent()]));
                case 9:
                    if (!(["Planned", "Ready"].includes(status) && !shouldSchedule)) return [3 /*break*/, 12];
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, production_1.recalculateJobRequirements)(serviceRole, {
                            id: id,
                            companyId: companyId,
                            userId: userId
                        })];
                case 10:
                    _0.sent();
                    return [4 /*yield*/, (0, production_1.runMRP)((0, client_server_1.getCarbonServiceRole)(), {
                            type: "job",
                            id: id,
                            companyId: companyId,
                            userId: userId
                        })];
                case 11:
                    _0.sent();
                    _0.label = 12;
                case 12:
                    if (!(["Ready", "Planned"].includes(status) && shouldSchedule)) return [3 /*break*/, 23];
                    _0.label = 13;
                case 13:
                    _0.trys.push([13, 22, , 23]);
                    purchaseOrdersBySupplierId = JSON.parse(selectedPurchaseOrdersBySupplierId !== null && selectedPurchaseOrdersBySupplierId !== void 0 ? selectedPurchaseOrdersBySupplierId : "{}");
                    return [4 /*yield*/, client
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", companyId)
                            .single()];
                case 14:
                    _k = _0.sent(), company = _k.data, companyError = _k.error;
                    if (companyError || !(company === null || company === void 0 ? void 0 : company.companyGroupId)) {
                        return [2 /*return*/, respondWithFlash(request, {
                                stay: stay,
                                jobId: id,
                                result: (0, auth_1.error)(companyError, "Failed to load company for purchase orders"),
                                payload: { success: false }
                            })];
                    }
                    return [4 /*yield*/, (0, production_1.createPurchaseOrdersFromJob)(client, {
                            jobId: id,
                            purchaseOrdersBySupplierId: purchaseOrdersBySupplierId,
                            companyId: companyId,
                            companyGroupId: company.companyGroupId,
                            userId: userId
                        })];
                case 15:
                    purchaseOrderCreate = _0.sent();
                    if (purchaseOrderCreate.error) {
                        message = purchaseOrderCreate.error instanceof Error
                            ? purchaseOrderCreate.error.message
                            : "Failed to create purchase orders for outside operations";
                        return [2 /*return*/, respondWithFlash(request, {
                                stay: stay,
                                jobId: id,
                                result: (0, auth_1.error)(purchaseOrderCreate.error, message),
                                payload: { success: false }
                            })];
                    }
                    return [4 /*yield*/, (0, production_1.updateJobStatus)(client, {
                            id: id,
                            status: status,
                            updatedBy: userId
                        })];
                case 16:
                    statusUpdate = _0.sent();
                    if (statusUpdate.error) {
                        return [2 /*return*/, respondWithFlash(request, {
                                stay: stay,
                                jobId: id,
                                result: (0, auth_1.error)(statusUpdate.error, "Failed to update job status"),
                                payload: { success: false }
                            })];
                    }
                    if (!(status === "Ready")) return [3 /*break*/, 18];
                    return [4 /*yield*/, client
                            .from("job")
                            .update({
                            releasedDate: new Date().toISOString()
                        })
                            .eq("id", id)];
                case 17:
                    releasedDateError = (_0.sent()).error;
                    if (releasedDateError) {
                        return [2 /*return*/, respondWithFlash(request, {
                                stay: stay,
                                jobId: id,
                                result: (0, auth_1.error)(releasedDateError, "Failed to set job release date"),
                                payload: { success: false }
                            })];
                    }
                    _0.label = 18;
                case 18:
                    _0.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, (0, production_server_1.triggerJobRelease)(id, companyId, userId)];
                case 19:
                    _0.sent();
                    return [3 /*break*/, 21];
                case 20:
                    releaseTriggerError_1 = _0.sent();
                    // Status is already committed; background scheduling can be retried.
                    console.error("Background release scheduling failed:", releaseTriggerError_1);
                    return [3 /*break*/, 21];
                case 21:
                    releasedMessage = "Job released. Material requirements, MRP, and scheduling are updating in the background.";
                    return [2 /*return*/, respondWithFlash(request, {
                            stay: stay,
                            jobId: id,
                            result: (0, auth_1.success)(releasedMessage),
                            payload: { success: true, status: status }
                        })];
                case 22:
                    err_1 = _0.sent();
                    console.error(err_1);
                    return [2 /*return*/, respondWithFlash(request, {
                            stay: stay,
                            jobId: id,
                            result: (0, auth_1.error)(err_1, "Failed to release job"),
                            payload: { success: false }
                        })];
                case 23: return [4 /*yield*/, (0, production_1.updateJobStatus)(client, {
                        id: id,
                        status: status,
                        assignee: ["Cancelled"].includes(status) ? null : undefined,
                        updatedBy: userId
                    })];
                case 24:
                    update = _0.sent();
                    if (!update.error) return [3 /*break*/, 28];
                    if (!stay) return [3 /*break*/, 26];
                    _l = react_router_1.data;
                    _m = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update job status"))];
                case 25: return [2 /*return*/, _l.apply(void 0, _m.concat([_0.sent()]))];
                case 26:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.job(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update job status"))];
                case 27: throw _o.apply(void 0, _p.concat([_0.sent()]));
                case 28:
                    if (!(status === "Closed")) return [3 /*break*/, 31];
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 29:
                    serviceRole = _0.sent();
                    return [4 /*yield*/, serviceRole.functions.invoke("close-job", {
                            body: { jobId: id, userId: userId, companyId: companyId }
                        })];
                case 30:
                    _0.sent();
                    _0.label = 31;
                case 31:
                    if (!(status === "Planned" && !stay)) return [3 /*break*/, 33];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.jobMaterials(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Job marked as planned"))];
                case 32: throw _q.apply(void 0, _r.concat([_0.sent()]));
                case 33:
                    if (!stay) return [3 /*break*/, 35];
                    _s = react_router_1.data;
                    _t = [{ success: true, status: status }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated job status"))];
                case 34: 
                // Echo the new status so the inline menu can show it immediately, without
                // waiting on the (laggy) row read-back.
                return [2 /*return*/, _s.apply(void 0, _t.concat([_0.sent()]))];
                case 35:
                    _u = react_router_1.redirect;
                    _v = [(_z = (0, path_1.requestReferrer)(request)) !== null && _z !== void 0 ? _z : path_1.path.to.job(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated job status"))];
                case 36: throw _u.apply(void 0, _v.concat([_0.sent()]));
            }
        });
    });
}
