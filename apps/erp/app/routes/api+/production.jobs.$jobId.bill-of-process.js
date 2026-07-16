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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var production_1 = require("~/modules/production");
var shared_1 = require("~/modules/shared");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, jobId, job, rootMethod, methodId, _d, materials, operations, tags, makeMethod;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        bypassRls: true
                    })];
                case 1:
                    _c = _u.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = params.jobId;
                    if (!jobId) {
                        return [2 /*return*/, { jobDisplayId: null, billOfProcess: null }];
                    }
                    return [4 /*yield*/, (0, production_1.getJob)(client, jobId)];
                case 2:
                    job = _u.sent();
                    if (job.error || !job.data) {
                        return [2 /*return*/, { jobDisplayId: null, billOfProcess: null }];
                    }
                    return [4 /*yield*/, (0, production_1.getRootMakeMethod)(client, jobId, companyId)];
                case 3:
                    rootMethod = _u.sent();
                    if (rootMethod.error || !((_e = rootMethod.data) === null || _e === void 0 ? void 0 : _e.id)) {
                        return [2 /*return*/, { jobDisplayId: (_f = job.data.jobId) !== null && _f !== void 0 ? _f : null, billOfProcess: null }];
                    }
                    methodId = rootMethod.data.id;
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJobMaterialsByMethodId)(client, methodId),
                            (0, production_1.getJobOperationsByMethodId)(client, methodId),
                            (0, shared_1.getTagsList)(client, companyId, "operation"),
                            (0, production_1.getJobMakeMethodById)(client, methodId, companyId)
                        ])];
                case 4:
                    _d = _u.sent(), materials = _d[0], operations = _d[1], tags = _d[2], makeMethod = _d[3];
                    if (!((_g = makeMethod.data) === null || _g === void 0 ? void 0 : _g.id)) {
                        return [2 /*return*/, { jobDisplayId: (_h = job.data.jobId) !== null && _h !== void 0 ? _h : null, billOfProcess: null }];
                    }
                    return [2 /*return*/, {
                            jobDisplayId: (_j = job.data.jobId) !== null && _j !== void 0 ? _j : null,
                            billOfProcess: {
                                routeJobId: job.data.id,
                                routeJob: job.data,
                                customerId: (_k = job.data.customerId) !== null && _k !== void 0 ? _k : "",
                                itemId: (_l = makeMethod.data.itemId) !== null && _l !== void 0 ? _l : "",
                                jobMakeMethodId: makeMethod.data.id,
                                locationId: (_m = job.data.locationId) !== null && _m !== void 0 ? _m : "",
                                materials: (_p = (_o = materials === null || materials === void 0 ? void 0 : materials.data) === null || _o === void 0 ? void 0 : _o.map(function (m) {
                                    var _a, _b;
                                    return (__assign(__assign({}, m), { itemType: m.itemType, unitOfMeasureCode: (_a = m.unitOfMeasureCode) !== null && _a !== void 0 ? _a : "", jobOperationId: (_b = m.jobOperationId) !== null && _b !== void 0 ? _b : undefined }));
                                })) !== null && _p !== void 0 ? _p : [],
                                operations: (_r = (_q = operations.data) === null || _q === void 0 ? void 0 : _q.map(function (o) {
                                    var _a, _b, _c, _d, _e, _f, _g;
                                    return (__assign(__assign({}, o), { jobId: (_a = o.jobId) !== null && _a !== void 0 ? _a : job.data.id, description: (_b = o.description) !== null && _b !== void 0 ? _b : "", workCenterId: (_c = o.workCenterId) !== null && _c !== void 0 ? _c : undefined, laborRate: (_d = o.laborRate) !== null && _d !== void 0 ? _d : 0, machineRate: (_e = o.machineRate) !== null && _e !== void 0 ? _e : 0, operationSupplierProcessId: (_f = o.operationSupplierProcessId) !== null && _f !== void 0 ? _f : undefined, jobMakeMethodId: (_g = o.jobMakeMethodId) !== null && _g !== void 0 ? _g : methodId, workInstruction: o.workInstruction }));
                                })) !== null && _r !== void 0 ? _r : [],
                                salesOrderLineId: (_s = job.data.salesOrderLineId) !== null && _s !== void 0 ? _s : "",
                                tags: (_t = tags.data) !== null && _t !== void 0 ? _t : []
                            }
                        }];
            }
        });
    });
}
