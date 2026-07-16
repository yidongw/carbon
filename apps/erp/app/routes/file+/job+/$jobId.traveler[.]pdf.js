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
var template_1 = require("@carbon/documents/template");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var production_service_1 = require("~/modules/production/production.service");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, locale, jobId, serviceRole, job, jobMakeMethods, company, customer, jobNotes, bomIdMap, methodTree, flatMethods, bomIds_1, makeMethodsWithData, documentTemplate, templateConfig, resolved, sections, footerSectionContent, footerContent, showFooter, styles, stream, body, headers;
        var _this = this;
        var _c, _d, _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    companyId = (_j.sent()).companyId;
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find job id");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _j.sent();
                    return [4 /*yield*/, (0, production_service_1.getJob)(serviceRole, jobId)];
                case 3:
                    job = _j.sent();
                    if (job.error || !job.data) {
                        console.error(job.error);
                        throw new Error("Failed to load job");
                    }
                    // Verify job belongs to this company
                    if (job.data.companyId !== companyId) {
                        throw new Error("Job does not belong to this company");
                    }
                    return [4 /*yield*/, serviceRole
                            .from("jobMakeMethod")
                            .select("*, ...item(itemType:type)")
                            .eq("jobId", jobId)
                            .order("createdAt", { ascending: true })];
                case 4:
                    jobMakeMethods = _j.sent();
                    if (jobMakeMethods.error || !jobMakeMethods.data) {
                        console.error(jobMakeMethods.error);
                        throw new Error("Failed to load job make methods");
                    }
                    return [4 /*yield*/, (0, settings_1.getCompany)(serviceRole, (_c = job.data.companyId) !== null && _c !== void 0 ? _c : "")];
                case 5:
                    company = _j.sent();
                    if (company.error) {
                        console.error(company.error);
                        throw new Error("Failed to load company");
                    }
                    return [4 /*yield*/, serviceRole
                            .from("customer")
                            .select("*")
                            .eq("id", (_d = job.data.customerId) !== null && _d !== void 0 ? _d : "")
                            .maybeSingle()];
                case 6:
                    customer = _j.sent();
                    jobNotes = job.data.notes;
                    bomIdMap = new Map();
                    return [4 /*yield*/, (0, production_service_1.getJobMethodTree)(serviceRole, jobId)];
                case 7:
                    methodTree = _j.sent();
                    if (!methodTree.error && ((_e = methodTree.data) === null || _e === void 0 ? void 0 : _e.length) > 0) {
                        flatMethods = (0, utils_1.flattenTree)(methodTree.data[0]);
                        bomIds_1 = (0, utils_1.generateBomIds)(flatMethods);
                        flatMethods.forEach(function (node, index) {
                            bomIdMap.set(node.data.jobMaterialMakeMethodId, bomIds_1[index]);
                        });
                    }
                    return [4 /*yield*/, Promise.all(jobMakeMethods.data.map(function (makeMethod) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, operations, item, thumbnail, batchNumber, trackedEntity;
                            var _b, _c, _d, _e, _f, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            (0, production_service_1.getJobOperationsByMethodId)(serviceRole, makeMethod.id),
                                            serviceRole
                                                .from("item")
                                                .select("*, modelUpload(thumbnailPath)")
                                                .eq("id", (_b = makeMethod.itemId) !== null && _b !== void 0 ? _b : "")
                                                .single()
                                        ])];
                                    case 1:
                                        _a = _h.sent(), operations = _a[0], item = _a[1];
                                        if (operations.error || !operations.data) {
                                            console.error(operations.error);
                                            throw new Error("Failed to load operations for make method ".concat(makeMethod.id));
                                        }
                                        if (item.error || !item.data) {
                                            console.error(item.error);
                                            throw new Error("Failed to load item for make method ".concat(makeMethod.id));
                                        }
                                        thumbnail = null;
                                        if (!(item.data.thumbnailPath || ((_c = item.data.modelUpload) === null || _c === void 0 ? void 0 : _c.thumbnailPath))) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, shared_1.getBase64ImageFromSupabase)(serviceRole, (_f = (_d = item.data.thumbnailPath) !== null && _d !== void 0 ? _d : (_e = item.data.modelUpload) === null || _e === void 0 ? void 0 : _e.thumbnailPath) !== null && _f !== void 0 ? _f : "")];
                                    case 2:
                                        thumbnail = _h.sent();
                                        _h.label = 3;
                                    case 3:
                                        if (!(["Batch", "Serial"].includes(item.data.itemTrackingType) &&
                                            makeMethod.parentMaterialId === null)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, (0, production_service_1.getTrackedEntityByJobId)(serviceRole, job.data.id)];
                                    case 4:
                                        trackedEntity = _h.sent();
                                        if (!trackedEntity.error && trackedEntity.data) {
                                            batchNumber = (_g = trackedEntity.data.readableId) !== null && _g !== void 0 ? _g : undefined;
                                        }
                                        _h.label = 5;
                                    case 5: return [2 /*return*/, {
                                            makeMethod: makeMethod,
                                            operations: operations.data,
                                            item: item.data,
                                            thumbnail: thumbnail,
                                            batchNumber: batchNumber,
                                            bomId: bomIdMap.get(makeMethod.id)
                                        }];
                                }
                            });
                        }); }))];
                case 8:
                    makeMethodsWithData = _j.sent();
                    return [4 /*yield*/, (0, settings_1.getDocumentTemplate)(serviceRole, companyId, "jobTraveler")];
                case 9:
                    documentTemplate = _j.sent();
                    templateConfig = (0, template_1.toDocumentTemplate)(documentTemplate.data, "jobTraveler");
                    resolved = (0, template_1.resolveTemplate)("jobTraveler", templateConfig);
                    return [4 /*yield*/, (0, settings_1.resolveSections)(serviceRole, companyId, (0, template_1.collectSectionIds)(resolved))];
                case 10:
                    sections = _j.sent();
                    return [4 /*yield*/, (0, pdf_1.ensureFont)(resolved.settings.fontFamily)];
                case 11:
                    _j.sent();
                    footerSectionContent = resolved.footerSectionId
                        ? (_f = sections[resolved.footerSectionId]) === null || _f === void 0 ? void 0 : _f.content
                        : undefined;
                    footerContent = footerSectionContent
                        ? (0, template_1.interpolateContent)(footerSectionContent, {
                            "job.number": (_g = job.data.jobId) !== null && _g !== void 0 ? _g : "",
                            "company.name": (_h = company.data.name) !== null && _h !== void 0 ? _h : ""
                        })
                        : undefined;
                    showFooter = resolved.footerSectionId !== null;
                    // Register fonts (same as Template component)
                    renderer_1.Font.register({
                        family: "Inter",
                        fonts: [
                            {
                                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                            },
                            {
                                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
                                fontWeight: 300
                            },
                            {
                                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
                                fontWeight: 500
                            },
                            {
                                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
                                fontWeight: 700
                            },
                            {
                                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
                                fontWeight: 900
                            }
                        ]
                    });
                    styles = renderer_1.StyleSheet.create({
                        body: {
                            fontFamily: resolved.settings.fontFamily,
                            padding: "20px 40px 50px 40px",
                            color: "#000000",
                            backgroundColor: "#FFFFFF"
                        }
                    });
                    return [4 /*yield*/, (0, renderer_1.renderToStream)(<renderer_1.Document title="Job Traveler" author="Carbon" subject="Job Traveler" keywords="job traveler, manufacturing">
      {makeMethodsWithData.map(function (data, index) {
                                var _a;
                                return (<renderer_1.Page key={data.makeMethod.id} size="A4" style={styles.body}>
          <pdf_1.JobTravelerPageContent company={company.data} job={job.data} jobOperations={data.operations} customer={customer.data} item={data.item} batchNumber={data.batchNumber} bomId={data.bomId} locale={locale} notes={index === 0 ? jobNotes : undefined} thumbnail={data.thumbnail} methodRevision={(_a = data.makeMethod.version) === null || _a === void 0 ? void 0 : _a.toString()} template={templateConfig} sections={sections}/>
          {showFooter && (<pdf_1.Footer documentId={job.data.jobId} content={footerContent} showPageNumbers={resolved.settings.showPageNumbers} pageNumberFormat={resolved.settings.pageNumberFormat} showRegistrationLine={resolved.settings.showRegistrationLine}/>)}
        </renderer_1.Page>);
                            })}
    </renderer_1.Document>)];
                case 12:
                    stream = _j.sent();
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
                case 13:
                    body = _j.sent();
                    headers = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(job.data.jobId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(body), { status: 200, headers: headers })];
            }
        });
    });
}
