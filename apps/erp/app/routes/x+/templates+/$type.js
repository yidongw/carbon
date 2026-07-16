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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = DocumentTemplateRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var template_1 = require("@carbon/documents/template");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var DocumentTemplateEditor_1 = require("~/components/DocumentTemplateEditor");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var documentPreview_server_1 = require("~/modules/settings/documentPreview.server");
var shared_server_1 = require("~/modules/shared/shared.server");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: function (params) { var _a; return (0, template_1.getDocumentLabel)((_a = params.type) !== null && _a !== void 0 ? _a : ""); }
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, documentType, _d, stored, sections, customFieldSchemas, previewEntities, terms, company, companySettings, TERMS_FIELD, termsField, termsSeed, customFields, _e, blocks, theme, settings, headerSectionId, footerSectionId;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings",
                        role: "employee"
                    })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId;
                    documentType = template_1.documentTemplateTypeSchema.parse(params.type);
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getDocumentTemplate)(client, companyId, documentType),
                            (0, settings_1.getDocumentSections)(client, companyId),
                            // Custom field definitions for this record type, to offer as insertable
                            // blocks. The customField `table` matches the document type.
                            (0, shared_server_1.getCustomFieldsSchemas)(client, { companyId: companyId, table: documentType }),
                            // Recent records to optionally preview against live data.
                            (0, documentPreview_server_1.listPreviewEntities)(client, companyId, documentType),
                            // Company terms setting — seeds the Terms block when it has no content.
                            (0, settings_1.getTerms)(client, companyId),
                            (0, settings_1.getCompany)(client, companyId),
                            // Company's configured label stock — seeds the label-size preview picker.
                            (0, settings_1.getCompanySettings)(client, companyId)
                        ])];
                case 2:
                    _d = _r.sent(), stored = _d[0], sections = _d[1], customFieldSchemas = _d[2], previewEntities = _d[3], terms = _d[4], company = _d[5], companySettings = _d[6];
                    TERMS_FIELD = {
                        salesInvoice: "salesTerms",
                        salesOrder: "salesTerms",
                        quote: "salesTerms",
                        packingSlip: "salesTerms",
                        purchaseOrder: "purchasingTerms"
                    };
                    termsField = TERMS_FIELD[documentType];
                    termsSeed = termsField
                        ? ((_g = (_f = terms.data) === null || _f === void 0 ? void 0 : _f[termsField]) !== null && _g !== void 0 ? _g : undefined)
                        : undefined;
                    customFields = ((_k = (_j = ((_h = customFieldSchemas.data) !== null && _h !== void 0 ? _h : []).find(function (t) { return t.table === documentType; })) === null || _j === void 0 ? void 0 : _j.fields) !== null && _k !== void 0 ? _k : []).map(function (f) { return ({ id: f.id, name: f.name }); });
                    _e = (0, template_1.resolveTemplate)(documentType, ((_l = stored.data) !== null && _l !== void 0 ? _l : null)), blocks = _e.blocks, theme = _e.theme, settings = _e.settings, headerSectionId = _e.headerSectionId, footerSectionId = _e.footerSectionId;
                    return [2 /*return*/, {
                            documentType: documentType,
                            blocks: blocks,
                            theme: theme,
                            settings: settings,
                            headerSectionId: headerSectionId,
                            footerSectionId: footerSectionId,
                            sections: (0, template_1.withBuiltInSections)(((_m = sections.data) !== null && _m !== void 0 ? _m : [])).map(function (s) { return ({
                                id: s.id,
                                name: s.name,
                                placement: s.placement,
                                content: s.content,
                                config: s.config
                            }); }),
                            customFields: customFields,
                            previewEntities: previewEntities,
                            termsSeed: termsSeed,
                            hasWatermark: Boolean((_o = company.data) === null || _o === void 0 ? void 0 : _o.logoWatermark),
                            initialLabelSizeId: documentType === "trackingLabel"
                                ? ((_q = (_p = companySettings.data) === null || _p === void 0 ? void 0 : _p.productLabelSize) !== null && _q !== void 0 ? _q : undefined)
                                : undefined
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, validation, _d, _e, _f, documentType, blocks, theme, settings, headerSectionId, footerSectionId, headerConfig, resolved, header, section, _g, _h, upsert, _j, _k, _l, _m;
        var _o, _p;
        var request = _b.request;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings"
                        })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(settings_1.documentTemplateValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_q.sent()])];
                case 3:
                    validation = _q.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, documentType = _f.documentType, blocks = _f.blocks, theme = _f.theme, settings = _f.settings, headerSectionId = _f.headerSectionId, footerSectionId = _f.footerSectionId, headerConfig = _f.headerConfig;
                    if (!(headerConfig && headerSectionId)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, settings_1.resolveSections)(client, companyId, [
                            headerSectionId
                        ])];
                case 4:
                    resolved = _q.sent();
                    header = resolved[headerSectionId];
                    return [4 /*yield*/, (0, settings_1.upsertDocumentSection)(client, {
                            id: headerSectionId,
                            companyId: companyId,
                            name: (_o = header === null || header === void 0 ? void 0 : header.name) !== null && _o !== void 0 ? _o : "Default Header",
                            placement: "header",
                            content: ((_p = header === null || header === void 0 ? void 0 : header.content) !== null && _p !== void 0 ? _p : { type: "doc", content: [] }),
                            config: headerConfig,
                            createdBy: userId,
                            updatedBy: userId
                        })];
                case 5:
                    section = _q.sent();
                    if (!section.error) return [3 /*break*/, 7];
                    _g = react_router_1.data;
                    _h = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(section.error, "Failed to save header"))];
                case 6: return [2 /*return*/, _g.apply(void 0, _h.concat([_q.sent()]))];
                case 7: return [4 /*yield*/, (0, settings_1.upsertDocumentTemplate)(client, {
                        companyId: companyId,
                        documentType: documentType,
                        // Validated at runtime by documentTemplateValidator; the form-data
                        // inferred type is looser than the schema output, so assert here.
                        blocks: blocks,
                        theme: theme,
                        settings: settings,
                        headerSectionId: headerSectionId || null,
                        footerSectionId: footerSectionId || null,
                        createdBy: userId,
                        updatedBy: userId
                    })];
                case 8:
                    upsert = _q.sent();
                    if (!upsert.error) return [3 /*break*/, 10];
                    _j = react_router_1.data;
                    _k = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(upsert.error, "Failed to save document layout"))];
                case 9: return [2 /*return*/, _j.apply(void 0, _k.concat([_q.sent()]))];
                case 10:
                    _l = react_router_1.data;
                    _m = [{ success: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Saved document layout"))];
                case 11: return [2 /*return*/, _l.apply(void 0, _m.concat([_q.sent()]))];
            }
        });
    });
}
function DocumentTemplateRoute() {
    var _a = (0, react_router_1.useLoaderData)(), documentType = _a.documentType, blocks = _a.blocks, theme = _a.theme, settings = _a.settings, headerSectionId = _a.headerSectionId, footerSectionId = _a.footerSectionId, sections = _a.sections, customFields = _a.customFields, previewEntities = _a.previewEntities, termsSeed = _a.termsSeed, hasWatermark = _a.hasWatermark, initialLabelSizeId = _a.initialLabelSizeId;
    var permissions = (0, hooks_1.usePermissions)();
    return (<DocumentTemplateEditor_1.DocumentTemplateEditor key={documentType} documentType={documentType} actionPath={path_1.path.to.documentTemplate(documentType)} initialBlocks={blocks} initialTheme={theme} initialSettings={settings} initialHeaderSectionId={headerSectionId} initialFooterSectionId={footerSectionId} sections={sections} customFields={customFields} previewEntities={previewEntities} termsSeed={termsSeed} hasWatermark={hasWatermark} initialLabelSizeId={initialLabelSizeId} canEdit={permissions.can("update", "settings")}/>);
}
