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
var pdf_1 = require("@carbon/documents/pdf");
var template_1 = require("@carbon/documents/template");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var accounting_1 = require("~/modules/accounting");
var inventory_1 = require("~/modules/inventory");
var sales_1 = require("~/modules/sales");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, company, companySettings, arBillingAddress, salesOrder, salesOrderLines, salesOrderLocations, terms, paymentTerms, shippingMethods, documentTemplate, templateConfig, showThumbnails, thumbnails, thumbnailPaths, _e, locale, resolved, sections, stream, body, headers;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(client, companyId),
                            (0, settings_1.getCompanySettings)(client, companyId),
                            (0, settings_1.getAccountsReceivableBillingAddress)(client, companyId),
                            (0, sales_1.getSalesOrder)(client, id),
                            (0, sales_1.getSalesOrderLines)(client, id),
                            (0, sales_1.getSalesOrderCustomerDetails)(client, id),
                            (0, sales_1.getSalesTerms)(client, companyId),
                            (0, accounting_1.getPaymentTermsList)(client, companyId),
                            (0, inventory_1.getShippingMethodsList)(client, companyId),
                            (0, settings_1.getDocumentTemplate)(client, companyId, "salesOrder")
                        ])];
                case 2:
                    _d = _q.sent(), company = _d[0], companySettings = _d[1], arBillingAddress = _d[2], salesOrder = _d[3], salesOrderLines = _d[4], salesOrderLocations = _d[5], terms = _d[6], paymentTerms = _d[7], shippingMethods = _d[8], documentTemplate = _d[9];
                    if (company.error) {
                        console.error(company.error);
                    }
                    if (salesOrder.error) {
                        console.error(salesOrder.error);
                    }
                    if (salesOrderLines.error) {
                        console.error(salesOrderLines.error);
                    }
                    if (salesOrderLocations.error) {
                        console.error(salesOrderLocations.error);
                    }
                    if (terms.error) {
                        console.error(terms.error);
                    }
                    if (company.error ||
                        salesOrder.error ||
                        salesOrderLines.error ||
                        salesOrderLocations.error ||
                        terms.error) {
                        throw new Error("Failed to load sales order");
                    }
                    templateConfig = (0, template_1.toDocumentTemplate)(documentTemplate.data, "salesOrder");
                    showThumbnails = (0, template_1.templateShowsThumbnails)(templateConfig, "salesOrder");
                    thumbnails = {};
                    if (!showThumbnails) return [3 /*break*/, 6];
                    thumbnailPaths = (_f = salesOrderLines.data) === null || _f === void 0 ? void 0 : _f.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!thumbnailPaths) return [3 /*break*/, 4];
                    return [4 /*yield*/, Promise.all(Object.entries(thumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_1.getBase64ImageFromSupabase)(client, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 3:
                    _e = _q.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _e = [];
                    _q.label = 5;
                case 5:
                    thumbnails =
                        (_h = (_g = (_e)) === null || _g === void 0 ? void 0 : _g.reduce(function (acc, thumbnail) {
                            if (thumbnail) {
                                acc[thumbnail.id] = thumbnail.data;
                            }
                            return acc;
                        }, {})) !== null && _h !== void 0 ? _h : {};
                    _q.label = 6;
                case 6:
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    resolved = (0, template_1.resolveTemplate)("salesOrder", templateConfig);
                    return [4 /*yield*/, (0, settings_1.resolveSections)(client, companyId, (0, template_1.collectSectionIds)(resolved))];
                case 7:
                    sections = _q.sent();
                    return [4 /*yield*/, (0, pdf_1.ensureFont)(resolved.settings.fontFamily)];
                case 8:
                    _q.sent();
                    return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.SalesOrderPDF company={company.data} companySettings={companySettings.data} locale={locale} meta={{
                                author: "Carbon",
                                keywords: "sales order",
                                subject: "Sales Order"
                            }} salesOrder={salesOrder.data} salesOrderLines={(_j = salesOrderLines.data) !== null && _j !== void 0 ? _j : []} salesOrderLocations={salesOrderLocations.data} accountsReceivableBillingAddress={((_k = companySettings.data) === null || _k === void 0 ? void 0 : _k.accountsReceivableAddress)
                                ? arBillingAddress.data
                                : null} terms={((_m = (_l = terms === null || terms === void 0 ? void 0 : terms.data) === null || _l === void 0 ? void 0 : _l.salesTerms) !== null && _m !== void 0 ? _m : {})} paymentTerms={(_o = paymentTerms.data) !== null && _o !== void 0 ? _o : []} shippingMethods={(_p = shippingMethods.data) !== null && _p !== void 0 ? _p : []} title="Sales Order" thumbnails={thumbnails} template={templateConfig} sections={sections}/>)];
                case 9:
                    stream = _q.sent();
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
                case 10:
                    body = _q.sent();
                    headers = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(salesOrder.data.salesOrderId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(body), { status: 200, headers: headers })];
            }
        });
    });
}
