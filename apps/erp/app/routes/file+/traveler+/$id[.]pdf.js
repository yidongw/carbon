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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var pdf_1 = require("@carbon/documents/pdf");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var production_service_1 = require("~/modules/production/production.service");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, id, serviceRole, jobMakeMethod, _c, company, job, _d, jobOperations, customer, item, batchNumber, trackedEntity, jobNotes, bomId, methodTree, flatMethods, bomIds, nodeIndex, thumbnail, locale, stream, body, headers;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    companyId = (_t.sent()).companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find job make method id");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _t.sent();
                    return [4 /*yield*/, (0, production_service_1.getJobMakeMethodById)(serviceRole, id, companyId)];
                case 3:
                    jobMakeMethod = _t.sent();
                    if (jobMakeMethod.error) {
                        console.error(jobMakeMethod.error);
                        throw new Error("Failed to load job make method");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, (_f = (_e = jobMakeMethod.data) === null || _e === void 0 ? void 0 : _e.companyId) !== null && _f !== void 0 ? _f : ""),
                            (0, production_service_1.getJob)(serviceRole, (_h = (_g = jobMakeMethod.data) === null || _g === void 0 ? void 0 : _g.jobId) !== null && _h !== void 0 ? _h : "")
                        ])];
                case 4:
                    _c = _t.sent(), company = _c[0], job = _c[1];
                    if (company.error) {
                        console.error(company.error);
                        throw new Error("Failed to load company");
                    }
                    if (job.error || !job.data) {
                        console.error(job.error);
                        throw new Error("Failed to load job");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, production_service_1.getJobOperationsByMethodId)(serviceRole, id),
                            serviceRole
                                .from("customer")
                                .select("*")
                                .eq("id", (_j = job.data.customerId) !== null && _j !== void 0 ? _j : "")
                                .maybeSingle(),
                            serviceRole
                                .from("item")
                                .select("*, modelUpload(thumbnailPath)")
                                .eq("id", (_k = jobMakeMethod.data.itemId) !== null && _k !== void 0 ? _k : "")
                                .single()
                        ])];
                case 5:
                    _d = _t.sent(), jobOperations = _d[0], customer = _d[1], item = _d[2];
                    if (jobOperations.error || !jobOperations.data) {
                        console.error(jobOperations.error);
                        throw new Error("Failed to load job operations");
                    }
                    if (item.error || !item.data) {
                        console.error(item.error);
                        throw new Error("Failed to load item");
                    }
                    if (!["Batch", "Serial"].includes(item.data.itemTrackingType)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, production_service_1.getTrackedEntityByJobId)(serviceRole, job.data.id)];
                case 6:
                    trackedEntity = _t.sent();
                    if (trackedEntity.error) {
                        console.error(trackedEntity.error);
                        throw new Error("Failed to load tracked entity");
                    }
                    batchNumber = (_m = (_l = trackedEntity.data) === null || _l === void 0 ? void 0 : _l.readableId) !== null && _m !== void 0 ? _m : undefined;
                    _t.label = 7;
                case 7:
                    jobNotes = job.data.notes;
                    return [4 /*yield*/, (0, production_service_1.getJobMethodTree)(serviceRole, job.data.id)];
                case 8:
                    methodTree = _t.sent();
                    if (!methodTree.error && ((_o = methodTree.data) === null || _o === void 0 ? void 0 : _o.length) > 0) {
                        flatMethods = (0, utils_1.flattenTree)(methodTree.data[0]);
                        bomIds = (0, utils_1.generateBomIds)(flatMethods);
                        nodeIndex = flatMethods.findIndex(function (node) { return node.data.jobMaterialMakeMethodId === id; });
                        if (nodeIndex >= 0) {
                            bomId = bomIds[nodeIndex];
                        }
                    }
                    thumbnail = null;
                    if (!(item.data.thumbnailPath || ((_p = item.data.modelUpload) === null || _p === void 0 ? void 0 : _p.thumbnailPath))) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, shared_1.getBase64ImageFromSupabase)(serviceRole, (_s = (_q = item.data.thumbnailPath) !== null && _q !== void 0 ? _q : (_r = item.data.modelUpload) === null || _r === void 0 ? void 0 : _r.thumbnailPath) !== null && _s !== void 0 ? _s : "")];
                case 9:
                    thumbnail = _t.sent();
                    _t.label = 10;
                case 10:
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.JobTravelerPDF company={company.data} job={job.data} jobMakeMethod={jobMakeMethod.data} jobOperations={jobOperations.data} customer={customer.data} item={item.data} batchNumber={batchNumber} bomId={bomId} locale={locale} meta={{
                                author: "Carbon",
                                keywords: "job traveler, manufacturing",
                                subject: "Job Traveler"
                            }} notes={jobNotes} thumbnail={thumbnail} title="Job Traveler"/>)];
                case 11:
                    stream = _t.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            stream.on("data", function (data) {
                                buffers.push(data);
                            });
                            stream.on("end", function () {
                                resolve(Buffer.concat(buffers));
                            });
                            stream.on("error", reject);
                        })];
                case 12:
                    body = _t.sent();
                    headers = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(job.data.jobId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(body), { status: 200, headers: headers })];
            }
        });
    });
}
