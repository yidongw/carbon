"use strict";
// This module is .tsx because the built-in renderers render React PDF
// components (ProductLabelPDF, StorageUnitLabelPDF, KanbanLabelPDF) via
// renderToStream.
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
exports.renderItemWithTemplate = renderItemWithTemplate;
exports.renderItemBuiltIn = renderItemBuiltIn;
var labels_1 = require("@carbon/documents/labels");
var pdf_1 = require("@carbon/documents/pdf");
var template_1 = require("@carbon/documents/template");
var zpl_1 = require("@carbon/documents/zpl");
var env_1 = require("@carbon/env");
var printing_server_1 = require("@carbon/printing/printing.server");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
function renderItemWithTemplate(doc, templateId, apiKey, format) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, printing_server_1.renderWithBinderyPress)({
                        apiKey: apiKey,
                        templateId: templateId,
                        data: __assign({}, doc.item),
                        format: format
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            content: result.content,
                            contentType: result.contentType
                        }];
            }
        });
    });
}
function renderItemBuiltIn(client, companyId, doc, format, mediaSizeId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, mediaSize, _b, template, logo, mediaSize;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = doc.type;
                    switch (_a) {
                        case "productLabel": return [3 /*break*/, 1];
                        case "kanbanCard": return [3 /*break*/, 3];
                        case "storageUnitLabel": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    mediaSize = requireMediaSize(mediaSizeId);
                    return [4 /*yield*/, loadProductLabelContext(client, companyId, mediaSize)];
                case 2:
                    _b = _c.sent(), template = _b.template, logo = _b.logo;
                    if (format === "pdf") {
                        return [2 /*return*/, renderPdfContent(<pdf_1.ProductLabelPDF items={[doc.item]} labelSize={mediaSize} template={template} logo={logo}/>)];
                    }
                    requireZplCapable(mediaSize);
                    return [2 /*return*/, {
                            content: (0, zpl_1.generateProductLabelZPL)(doc.item, mediaSize, template, logo),
                            contentType: "zpl"
                        }];
                case 3: return [2 /*return*/, renderKanbanCardPDF(client, doc.item, format)];
                case 4:
                    {
                        mediaSize = requireMediaSize(mediaSizeId);
                        if (format === "pdf") {
                            return [2 /*return*/, renderPdfContent(<pdf_1.StorageUnitLabelPDF items={[doc.item]} labelSize={mediaSize}/>)];
                        }
                        requireZplCapable(mediaSize);
                        return [2 /*return*/, {
                                content: (0, zpl_1.generateStorageUnitLabelZPL)(doc.item, mediaSize),
                                contentType: "zpl"
                            }];
                    }
                    _c.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function requireMediaSize(mediaSizeId) {
    var mediaSize = utils_1.labelSizes.find(function (s) { return s.id === mediaSizeId; });
    if (!mediaSize) {
        throw new Error("Unknown media size ".concat(mediaSizeId));
    }
    return mediaSize;
}
var PUBLIC_STORAGE_URL_PREFIX = "".concat(env_1.SUPABASE_URL, "/storage/v1/object/public/public/");
/**
 * Resolve the company's tracking-label template + logo for a built-in render.
 * Mirrors the interactive label routes (which use `getDocumentTemplateConfig`
 * + `resolveLabelLogo`) so queued print jobs honor the customizer layout. The
 * jobs package can't import app modules, so it reads the row directly here.
 */
function loadProductLabelContext(client, companyId, labelSize) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, templateRow, companyRow, template, expand, company, logo;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("documentTemplate")
                            .select("*")
                            .eq("companyId", companyId)
                            .eq("documentType", "trackingLabel")
                            .maybeSingle(),
                        client
                            .from("company")
                            .select("logoLight, logoLightIcon")
                            .eq("id", companyId)
                            .maybeSingle()
                    ])];
                case 1:
                    _a = _b.sent(), templateRow = _a[0], companyRow = _a[1];
                    template = (0, template_1.toDocumentTemplate)(templateRow.data, "trackingLabel");
                    expand = function (path) {
                        return path ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(path) : null;
                    };
                    company = companyRow.data
                        ? {
                            logoLight: expand(companyRow.data.logoLight),
                            logoLightIcon: expand(companyRow.data.logoLightIcon)
                        }
                        : null;
                    return [4 /*yield*/, (0, labels_1.resolveLabelLogo)(company, template, labelSize, {
                            supabaseUrl: env_1.SUPABASE_URL !== null && env_1.SUPABASE_URL !== void 0 ? env_1.SUPABASE_URL : ""
                        })];
                case 2:
                    logo = _b.sent();
                    return [2 /*return*/, { template: template, logo: logo }];
            }
        });
    });
}
function requireZplCapable(mediaSize) {
    if (!mediaSize.zpl) {
        throw new Error("Media size ".concat(mediaSize.id, " does not support ZPL"));
    }
}
function renderPdfContent(element) {
    return __awaiter(this, void 0, void 0, function () {
        var stream, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, renderer_1.renderToStream)(element)];
                case 1:
                    stream = _a.sent();
                    return [4 /*yield*/, streamToBuffer(stream)];
                case 2:
                    body = _a.sent();
                    return [2 /*return*/, {
                            content: body.toString("base64"),
                            contentType: "pdf"
                        }];
            }
        });
    });
}
function streamToBuffer(stream) {
    return new Promise(function (resolve, reject) {
        var buffers = [];
        stream.on("data", function (d) { return buffers.push(d); });
        stream.on("end", function () { return resolve(Buffer.concat(buffers)); });
        stream.on("error", reject);
    });
}
function renderKanbanCardPDF(client, item, format) {
    return __awaiter(this, void 0, void 0, function () {
        var thumbnail, data, buffer, _a, _b, ext, mime;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (format === "zpl") {
                        throw new Error("Built-in kanban card generation only supports PDF printers.");
                    }
                    thumbnail = null;
                    if (!item.thumbnailPath) return [3 /*break*/, 3];
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .download(item.thumbnailPath)];
                case 1:
                    data = (_d.sent()).data;
                    if (!data) return [3 /*break*/, 3];
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, data.arrayBuffer()];
                case 2:
                    buffer = _b.apply(_a, [_d.sent()]);
                    ext = (_c = item.thumbnailPath.split(".").pop()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                    mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
                    thumbnail = "data:".concat(mime, ";base64,").concat(buffer.toString("base64"));
                    _d.label = 3;
                case 3: return [2 /*return*/, renderPdfContent(<pdf_1.KanbanLabelPDF baseUrl={env_1.ERP_URL !== null && env_1.ERP_URL !== void 0 ? env_1.ERP_URL : ""} labels={[
                            {
                                id: item.id,
                                itemId: item.itemId,
                                itemName: item.itemName,
                                itemReadableId: item.itemId,
                                locationName: item.locationName,
                                storageUnitId: item.storageUnitId,
                                storageUnitName: item.storageUnitName,
                                supplierName: item.supplierName,
                                quantity: item.quantity,
                                unitOfMeasureCode: item.unitOfMeasureCode,
                                thumbnail: thumbnail
                            }
                        ]} action="order"/>)];
            }
        });
    });
}
