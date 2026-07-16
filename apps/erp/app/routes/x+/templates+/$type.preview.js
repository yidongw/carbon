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
var auth_server_1 = require("@carbon/auth/auth.server");
var pdf_1 = require("@carbon/documents/pdf");
var template_1 = require("@carbon/documents/template");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var zod_1 = require("zod");
var settings_1 = require("~/modules/settings");
var documentPreview_server_1 = require("~/modules/settings/documentPreview.server");
/**
 * Renders a sample of the document with the draft block layout, server-side.
 * Keeps @react-pdf/renderer off the client entirely (it relies on Node's
 * Buffer/streams) and guarantees the preview matches the real PDF route.
 */
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, documentType, formData, parsed, theme, settingsParsed, settings, headerSectionId, footerSectionId, sections, headerConfig, locale, _d, Component, sample, previewId, real, _e, baseProps, company, size, stream, body;
        var _f, _g, _h, _j, _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId;
                    documentType = template_1.documentTemplateTypeSchema.parse(params.type);
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _p.sent();
                    parsed = zod_1.z
                        .array(template_1.blockSchema)
                        .safeParse(JSON.parse(String((_f = formData.get("blocks")) !== null && _f !== void 0 ? _f : "[]")));
                    theme = template_1.themeSchema.safeParse(JSON.parse(String((_g = formData.get("theme")) !== null && _g !== void 0 ? _g : "{}")));
                    settingsParsed = template_1.documentSettingsSchema.safeParse(JSON.parse(String((_h = formData.get("settings")) !== null && _h !== void 0 ? _h : "{}")));
                    settings = settingsParsed.success
                        ? settingsParsed.data
                        : __assign({}, template_1.DEFAULT_DOCUMENT_SETTINGS);
                    if (!parsed.success || !theme.success) {
                        return [2 /*return*/, new Response("Invalid template", { status: 400 })];
                    }
                    headerSectionId = String((_j = formData.get("headerSectionId")) !== null && _j !== void 0 ? _j : "") || null;
                    footerSectionId = String((_k = formData.get("footerSectionId")) !== null && _k !== void 0 ? _k : "") || null;
                    return [4 /*yield*/, (0, settings_1.resolveSections)(client, companyId, (0, template_1.collectSectionIds)({ blocks: parsed.data, headerSectionId: headerSectionId, footerSectionId: footerSectionId }))];
                case 3:
                    sections = _p.sent();
                    headerConfig = template_1.sectionConfigSchema.safeParse(JSON.parse(String((_l = formData.get("headerConfig")) !== null && _l !== void 0 ? _l : "{}")));
                    if (headerConfig.success && headerSectionId && sections[headerSectionId]) {
                        sections[headerSectionId] = __assign(__assign({}, sections[headerSectionId]), { config: __assign(__assign({}, sections[headerSectionId].config), headerConfig.data) });
                    }
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    return [4 /*yield*/, (0, pdf_1.ensureFont)(settings.fontFamily)];
                case 4:
                    _p.sent();
                    _d = pdf_1.DOCUMENT_PDFS[documentType], Component = _d.Component, sample = _d.sample;
                    previewId = String((_m = formData.get("previewId")) !== null && _m !== void 0 ? _m : "") || null;
                    if (!previewId) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, documentPreview_server_1.buildPreviewProps)(client, companyId, companyGroupId, documentType, previewId, locale)];
                case 5:
                    _e = _p.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _e = null;
                    _p.label = 7;
                case 7:
                    real = _e;
                    if (!real) return [3 /*break*/, 8];
                    baseProps = real;
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, (0, settings_1.getCompany)(client, companyId)];
                case 9:
                    company = _p.sent();
                    baseProps = __assign(__assign({}, sample), { company: (_o = company.data) !== null && _o !== void 0 ? _o : sample.company, locale: locale });
                    _p.label = 10;
                case 10:
                    // Tracking-label preview: render against the picked stock (the layout scales
                    // to any size). Overrides the sample's fixed size.
                    if (documentType === "trackingLabel") {
                        size = utils_1.labelSizes.find(function (s) { var _a; return s.id === String((_a = formData.get("labelSizeId")) !== null && _a !== void 0 ? _a : ""); });
                        if (size)
                            baseProps.labelSize = size;
                    }
                    return [4 /*yield*/, (0, renderer_1.renderToStream)(<Component {...baseProps} template={{
                                formatVersion: template_1.CURRENT_TEMPLATE_FORMAT_VERSION,
                                documentType: documentType,
                                blocks: parsed.data,
                                theme: theme.data,
                                settings: settings,
                                headerSectionId: headerSectionId,
                                footerSectionId: footerSectionId
                            }} sections={sections}/>)];
                case 11:
                    stream = _p.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            stream.on("data", function (data) { return buffers.push(data); });
                            stream.on("end", function () { return resolve(Buffer.concat(buffers)); });
                            stream.on("error", reject);
                        })];
                case 12:
                    body = _p.sent();
                    return [2 /*return*/, new Response(new Uint8Array(body), {
                            status: 200,
                            headers: { "Content-Type": "application/pdf" }
                        })];
            }
        });
    });
}
