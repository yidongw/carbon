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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
    to: path_1.path.to.jobs,
    module: "production"
};
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, validation, jobId, _d, quantityComplete, salesOrderId, salesOrderLineId, locationId, storageUnitId, leftoverAction, leftoverShipQuantity, makeToOrder, job, _e, _f, originalQuantity, leftoverQuantity, hasLeftover, quantityToShip, rpc, _g, _h, quantityShippedUpdate, _j, _k, _l, _m, _o, _p;
        var _q, _r, _s, _t, _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _w.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _w.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.jobCompleteValidator).validate(formData)];
                case 3:
                    validation = _w.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    _d = validation.data, quantityComplete = _d.quantityComplete, salesOrderId = _d.salesOrderId, salesOrderLineId = _d.salesOrderLineId, locationId = _d.locationId, storageUnitId = _d.storageUnitId, leftoverAction = _d.leftoverAction, leftoverShipQuantity = _d.leftoverShipQuantity;
                    makeToOrder = !!salesOrderId || !!salesOrderLineId;
                    return [4 /*yield*/, client
                            .from("job")
                            .select("quantity")
                            .eq("id", jobId)
                            .single()];
                case 4:
                    job = _w.sent();
                    if (!job.error) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [(_q = (0, path_1.requestReferrer)(request)) !== null && _q !== void 0 ? _q : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(job.error, "Failed to get job data"))];
                case 5: throw _e.apply(void 0, _f.concat([_w.sent()]));
                case 6:
                    originalQuantity = (_s = (_r = job.data) === null || _r === void 0 ? void 0 : _r.quantity) !== null && _s !== void 0 ? _s : 0;
                    leftoverQuantity = Math.max(0, quantityComplete - originalQuantity);
                    hasLeftover = leftoverQuantity > 0;
                    quantityToShip = originalQuantity;
                    if (hasLeftover && leftoverAction) {
                        switch (leftoverAction) {
                            case "ship":
                                quantityToShip = quantityComplete;
                                break;
                            case "split":
                                quantityToShip = originalQuantity + (leftoverShipQuantity !== null && leftoverShipQuantity !== void 0 ? leftoverShipQuantity : 0);
                                break;
                        }
                    }
                    return [4 /*yield*/, client.rpc("complete_job_to_inventory", {
                            p_job_id: jobId,
                            p_quantity_complete: quantityComplete,
                            p_storage_unit_id: storageUnitId !== null && storageUnitId !== void 0 ? storageUnitId : undefined,
                            p_location_id: locationId !== null && locationId !== void 0 ? locationId : undefined,
                            p_company_id: companyId,
                            p_user_id: userId
                        })];
                case 7:
                    rpc = _w.sent();
                    if (!rpc.error) return [3 /*break*/, 9];
                    _g = react_router_1.redirect;
                    _h = [(_t = (0, path_1.requestReferrer)(request)) !== null && _t !== void 0 ? _t : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rpc.error, "Failed to complete job"))];
                case 8: throw _g.apply(void 0, _h.concat([_w.sent()]));
                case 9:
                    if (!makeToOrder) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from("job")
                            .update({
                            quantityShipped: quantityToShip,
                            updatedAt: new Date().toISOString(),
                            updatedBy: userId
                        })
                            .eq("id", jobId)];
                case 10:
                    quantityShippedUpdate = _w.sent();
                    if (!quantityShippedUpdate.error) return [3 /*break*/, 12];
                    _j = react_router_1.redirect;
                    _k = [(_u = (0, path_1.requestReferrer)(request)) !== null && _u !== void 0 ? _u : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quantityShippedUpdate.error, "Failed to update job"))];
                case 11: throw _j.apply(void 0, _k.concat([_w.sent()]));
                case 12:
                    if (!(new URL(request.url).searchParams.get("stay") === "1")) return [3 /*break*/, 14];
                    _l = react_router_1.data;
                    _m = [{ success: true, status: "Completed" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Job completed successfully"))];
                case 13: return [2 /*return*/, _l.apply(void 0, _m.concat([_w.sent()]))];
                case 14:
                    _o = react_router_1.redirect;
                    _p = [(_v = (0, path_1.requestReferrer)(request)) !== null && _v !== void 0 ? _v : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Job completed successfully"))];
                case 15: throw _o.apply(void 0, _p.concat([_w.sent()]));
            }
        });
    });
}
var templateObject_1;
