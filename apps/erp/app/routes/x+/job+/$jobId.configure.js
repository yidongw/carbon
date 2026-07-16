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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var jobs_1 = require("@carbon/jobs");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var configTableOverlay_server_1 = require("~/modules/production/configTableOverlay.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, jobId, configuration, _d, result, job, _e, _f, _g, _h, serviceRole, upsertMethod, _j, _k, _l, _m;
        var _o, _p, _q, _r;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _s.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    return [4 /*yield*/, request.json()];
                case 2:
                    configuration = _s.sent();
                    if (!configuration) return [3 /*break*/, 13];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("job")
                                .update(__assign(__assign({}, (0, configTableOverlay_server_1.jobConfigurationUpdateFields)(configuration)), { updatedAt: new Date().toISOString(), updatedBy: userId }))
                                .eq("id", jobId),
                            client.from("job").select("itemId").eq("id", jobId).single()
                        ])];
                case 3:
                    _d = _s.sent(), result = _d[0], job = _d[1];
                    if (!result.error) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [(_o = (0, path_1.requestReferrer)(request)) !== null && _o !== void 0 ? _o : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to update job"))];
                case 4: throw _e.apply(void 0, _f.concat([_s.sent()]));
                case 5:
                    if (!job.error) return [3 /*break*/, 7];
                    _g = react_router_1.redirect;
                    _h = [(_p = (0, path_1.requestReferrer)(request)) !== null && _p !== void 0 ? _p : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to get job"))];
                case 6: throw _g.apply(void 0, _h.concat([_s.sent()]));
                case 7: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 8:
                    serviceRole = _s.sent();
                    return [4 /*yield*/, (0, production_1.upsertJobMethod)(serviceRole, "itemToJob", {
                            sourceId: job.data.itemId,
                            targetId: jobId,
                            companyId: companyId,
                            userId: userId,
                            configuration: configuration
                        })];
                case 9:
                    upsertMethod = _s.sent();
                    if (!upsertMethod.error) return [3 /*break*/, 11];
                    _j = react_router_1.redirect;
                    _k = [(_q = (0, path_1.requestReferrer)(request)) !== null && _q !== void 0 ? _q : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to update job method"))];
                case 10: throw _j.apply(void 0, _k.concat([_s.sent()]));
                case 11: return [4 /*yield*/, (0, jobs_1.trigger)("recalculate", {
                        type: "jobRequirements",
                        id: jobId,
                        companyId: companyId,
                        userId: userId
                    })];
                case 12:
                    _s.sent();
                    return [3 /*break*/, 14];
                case 13: throw new Error("No configuration provided");
                case 14:
                    _l = react_router_1.redirect;
                    _m = [(_r = (0, path_1.requestReferrer)(request)) !== null && _r !== void 0 ? _r : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated job"))];
                case 15: throw _l.apply(void 0, _m.concat([_s.sent()]));
            }
        });
    });
}
