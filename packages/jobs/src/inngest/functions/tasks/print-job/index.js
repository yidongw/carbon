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
exports.printJobFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var env_1 = require("@carbon/env");
var printing_1 = require("@carbon/printing");
var printing_server_1 = require("@carbon/printing/printing.server");
var inngest_1 = require("inngest");
var client_1 = require("../../../client");
var renderers_1 = require("./renderers");
var resolvers_1 = require("./resolvers");
var DEFAULT_MEDIA_SIZE_ID = "label2x1";
exports.printJobFunction = client_1.inngest.createFunction({ id: "print-job", retries: 0 }, { event: "carbon/print-job" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var client, payload, sourceDocument, sourceDocumentId, companyId, userId, locationId, workCenterId, explicitPrinterRouteId, thirtySecondsAgo, recentJobCount, printerConfig, route, documentTypeIds, allPrintJobIds, _i, documentTypeIds_1, documentTypeId, docType, printJobIds;
    var _c, _d, _e, _f;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                client = (0, client_server_1.getCarbonServiceRole)();
                payload = event.data;
                sourceDocument = payload.sourceDocument, sourceDocumentId = payload.sourceDocumentId, companyId = payload.companyId, userId = payload.userId, locationId = payload.locationId, workCenterId = payload.workCenterId, explicitPrinterRouteId = payload.printerRouteId;
                thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
                return [4 /*yield*/, client
                        .from("printJob")
                        .select("id", { count: "exact", head: true })
                        .eq("sourceDocumentId", sourceDocumentId)
                        .eq("companyId", companyId)
                        .eq("origin", "auto")
                        .gte("createdAt", thirtySecondsAgo)];
            case 1:
                recentJobCount = (_g.sent()).count;
                if (recentJobCount && recentJobCount > 0) {
                    throw new inngest_1.NonRetriableError("Print jobs already exist for ".concat(sourceDocument, " ").concat(sourceDocumentId));
                }
                printerConfig = null;
                if (!explicitPrinterRouteId) return [3 /*break*/, 3];
                return [4 /*yield*/, client
                        .from("printerRoute")
                        .select("id, name, format, mediaSizeId, printerUrl, apiKey, templateId")
                        .eq("id", explicitPrinterRouteId)
                        .eq("companyId", companyId)
                        .single()];
            case 2:
                route = (_g.sent()).data;
                if (route) {
                    printerConfig = {
                        printerRouteId: route.id,
                        printerUrl: route.printerUrl,
                        format: route.format,
                        mediaSizeId: route.mediaSizeId,
                        templateId: route.templateId,
                        autoPrint: true
                    };
                }
                return [3 /*break*/, 5];
            case 3:
                if (!locationId) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, printing_server_1.getCachedPrinterConfig)(client, companyId, locationId, (0, printing_1.getPrinterContextForSource)(sourceDocument, workCenterId), workCenterId)];
            case 4:
                printerConfig = _g.sent();
                _g.label = 5;
            case 5:
                documentTypeIds = (0, printing_1.getDocumentTypesForSource)(sourceDocument);
                allPrintJobIds = [];
                _i = 0, documentTypeIds_1 = documentTypeIds;
                _g.label = 6;
            case 6:
                if (!(_i < documentTypeIds_1.length)) return [3 /*break*/, 9];
                documentTypeId = documentTypeIds_1[_i];
                docType = (0, printing_1.getDocumentType)(documentTypeId);
                if (!docType)
                    return [3 /*break*/, 8];
                return [4 /*yield*/, processDocumentType(client, step, {
                        documentTypeId: documentTypeId,
                        hasBuiltInRenderer: docType.builtInRenderer !== null,
                        sourceDocument: sourceDocument,
                        sourceDocumentId: sourceDocumentId,
                        companyId: companyId,
                        userId: userId,
                        printerUrl: (_c = printerConfig === null || printerConfig === void 0 ? void 0 : printerConfig.printerUrl) !== null && _c !== void 0 ? _c : "",
                        format: (_d = printerConfig === null || printerConfig === void 0 ? void 0 : printerConfig.format) !== null && _d !== void 0 ? _d : docType.defaultFormat,
                        mediaSizeId: (_e = printerConfig === null || printerConfig === void 0 ? void 0 : printerConfig.mediaSizeId) !== null && _e !== void 0 ? _e : DEFAULT_MEDIA_SIZE_ID,
                        templateId: (_f = printerConfig === null || printerConfig === void 0 ? void 0 : printerConfig.templateId) !== null && _f !== void 0 ? _f : null
                    })];
            case 7:
                printJobIds = _g.sent();
                allPrintJobIds.push.apply(allPrintJobIds, printJobIds);
                _g.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/, { printJobIds: allPrintJobIds, count: allPrintJobIds.length }];
        }
    });
}); });
function resolveDocumentItems(client, documentTypeId, sourceDocument, sourceDocumentId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, resolved, resolved, resolved;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = documentTypeId;
                    switch (_a) {
                        case "productLabel": return [3 /*break*/, 1];
                        case "kanbanCard": return [3 /*break*/, 3];
                        case "storageUnitLabel": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, (0, resolvers_1.resolveTrackedEntityData)(client, sourceDocument, sourceDocumentId, companyId)];
                case 2:
                    resolved = _h.sent();
                    return [2 /*return*/, {
                            docs: (_b = resolved === null || resolved === void 0 ? void 0 : resolved.items.map(function (item) { return ({
                                type: "productLabel",
                                item: item
                            }); })) !== null && _b !== void 0 ? _b : [],
                            readableId: (_c = resolved === null || resolved === void 0 ? void 0 : resolved.readableId) !== null && _c !== void 0 ? _c : null
                        }];
                case 3: return [4 /*yield*/, (0, resolvers_1.resolveKanbanData)(client, sourceDocumentId)];
                case 4:
                    resolved = _h.sent();
                    return [2 /*return*/, {
                            docs: (_d = resolved === null || resolved === void 0 ? void 0 : resolved.items.map(function (item) { return ({
                                type: "kanbanCard",
                                item: item
                            }); })) !== null && _d !== void 0 ? _d : [],
                            readableId: (_e = resolved === null || resolved === void 0 ? void 0 : resolved.readableId) !== null && _e !== void 0 ? _e : null
                        }];
                case 5: return [4 /*yield*/, (0, resolvers_1.resolveStorageUnitData)(client, sourceDocumentId)];
                case 6:
                    resolved = _h.sent();
                    return [2 /*return*/, {
                            docs: (_f = resolved === null || resolved === void 0 ? void 0 : resolved.items.map(function (item) { return ({
                                type: "storageUnitLabel",
                                item: item
                            }); })) !== null && _f !== void 0 ? _f : [],
                            readableId: (_g = resolved === null || resolved === void 0 ? void 0 : resolved.readableId) !== null && _g !== void 0 ? _g : null
                        }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function describeDocument(doc, readableId, sourceDocumentId) {
    var parts = [readableId !== null && readableId !== void 0 ? readableId : sourceDocumentId];
    switch (doc.type) {
        case "productLabel":
            if (doc.item.itemId)
                parts.push(doc.item.itemId);
            if (doc.item.number)
                parts.push(doc.item.number);
            break;
        case "kanbanCard":
            if (doc.item.itemId)
                parts.push(doc.item.itemId);
            break;
        case "storageUnitLabel":
            break;
    }
    return parts.join(" — ");
}
function processDocumentType(client, step, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var documentTypeId, hasBuiltInRenderer, sourceDocument, sourceDocumentId, companyId, userId, printerUrl, format, mediaSizeId, templateId, _a, docs, readableId, printJobIds, _i, docs_1, doc, job, jobId, content, renderError_1, message;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    documentTypeId = ctx.documentTypeId, hasBuiltInRenderer = ctx.hasBuiltInRenderer, sourceDocument = ctx.sourceDocument, sourceDocumentId = ctx.sourceDocumentId, companyId = ctx.companyId, userId = ctx.userId, printerUrl = ctx.printerUrl, format = ctx.format, mediaSizeId = ctx.mediaSizeId, templateId = ctx.templateId;
                    return [4 /*yield*/, resolveDocumentItems(client, documentTypeId, sourceDocument, sourceDocumentId, companyId)];
                case 1:
                    _a = _c.sent(), docs = _a.docs, readableId = _a.readableId;
                    if (docs.length === 0)
                        return [2 /*return*/, []];
                    printJobIds = [];
                    _i = 0, docs_1 = docs;
                    _c.label = 2;
                case 2:
                    if (!(_i < docs_1.length)) return [3 /*break*/, 19];
                    doc = docs_1[_i];
                    return [4 /*yield*/, (0, printing_1.createPrintJob)(client, {
                            companyId: companyId,
                            printerUrl: printerUrl,
                            sourceDocument: sourceDocument,
                            sourceDocumentId: sourceDocumentId,
                            sourceDocumentReadableId: readableId !== null && readableId !== void 0 ? readableId : undefined,
                            description: describeDocument(doc, readableId, sourceDocumentId),
                            status: "generating",
                            origin: "auto",
                            createdBy: userId
                        })];
                case 3:
                    job = _c.sent();
                    if (job.error || !job.data) {
                        console.error("Failed to create print job: ".concat((_b = job.error) === null || _b === void 0 ? void 0 : _b.message));
                        return [3 /*break*/, 18];
                    }
                    jobId = job.data.id;
                    printJobIds.push(jobId);
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 16, , 18]);
                    content = void 0;
                    if (!(templateId && env_1.BINDERY_PRESS_API_KEY)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, renderers_1.renderItemWithTemplate)(doc, templateId, env_1.BINDERY_PRESS_API_KEY, format)];
                case 5:
                    content = _c.sent();
                    return [3 /*break*/, 10];
                case 6:
                    if (!hasBuiltInRenderer) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, renderers_1.renderItemBuiltIn)(client, companyId, doc, format, mediaSizeId)];
                case 7:
                    content = _c.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, (0, printing_1.updatePrintJobStatus)(client, jobId, companyId, "failed", {
                        error: "Document type \"".concat(documentTypeId, "\" requires a BinderyPress template.")
                    })];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 18];
                case 10: return [4 /*yield*/, (0, printing_1.updatePrintJobContent)(client, jobId, companyId, content.content, content.contentType)];
                case 11:
                    _c.sent();
                    if (!printerUrl) return [3 /*break*/, 13];
                    return [4 /*yield*/, step.sendEvent("deliver-".concat(jobId), {
                            name: "carbon/print-job-deliver",
                            data: { printJobId: jobId, companyId: companyId }
                        })];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, (0, printing_1.updatePrintJobStatus)(client, jobId, companyId, "completed")];
                case 14:
                    _c.sent();
                    _c.label = 15;
                case 15: return [3 /*break*/, 18];
                case 16:
                    renderError_1 = _c.sent();
                    message = renderError_1 instanceof Error
                        ? renderError_1.message
                        : String(renderError_1);
                    console.error("Rendering failed for job ".concat(jobId, ": ").concat(message));
                    return [4 /*yield*/, (0, printing_1.updatePrintJobStatus)(client, jobId, companyId, "failed", {
                            error: "Rendering failed: ".concat(message)
                        })];
                case 17:
                    _c.sent();
                    return [3 /*break*/, 18];
                case 18:
                    _i++;
                    return [3 /*break*/, 2];
                case 19: return [2 /*return*/, printJobIds];
            }
        });
    });
}
