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
var accounting_1 = require("~/modules/accounting");
var inventory_1 = require("~/modules/inventory");
var purchasing_1 = require("~/modules/purchasing");
var sales_1 = require("~/modules/sales");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, company, shipment, shipmentLines, serviceRole, terms, locale, documentTemplate, templateConfig, resolvedTemplate, showThumbnails, templateSections, _e, _f, salesOrder, salesOrderShipment, _g, customer, customerLocation, paymentTerm, shippingMethod, shipmentTracking, thumbnails, thumbnailPaths, _h, stream_1, body, headers, salesInvoice, _j, customer, customerLocation, paymentTerm, shippingMethod, shipmentTracking, thumbnails, thumbnailPaths, _k, stream_2, body, headers, _l, purchaseOrder, purchaseOrderDelivery, _m, supplier, supplierLocation, poPaymentTerm, poShippingMethod, poShipmentTracking, poThumbnails, poThumbnailPaths, _o, poStream_1, poBody, poHeaders, warehouseTransfer, _p, shippingMethod, shipmentTracking, toLocation, shippingAddress, transferThumbnails, transferThumbnailPaths, _q, transferStream_1, transferBody, transferHeaders;
        var _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_75) {
            switch (_75.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _75.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(client, companyId),
                            (0, inventory_1.getShipment)(client, id),
                            (0, inventory_1.getShipmentLinesWithDetails)(client, id)
                        ])];
                case 2:
                    _d = _75.sent(), company = _d[0], shipment = _d[1], shipmentLines = _d[2];
                    if (company.error) {
                        console.error(company.error);
                    }
                    if (shipment.error) {
                        console.error(shipment.error);
                    }
                    if (shipmentLines.error) {
                        console.error(shipmentLines.error);
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, sales_1.getSalesTerms)(serviceRole, companyId)];
                case 3:
                    terms = _75.sent();
                    if (terms.error) {
                        console.error(terms.error);
                    }
                    if (company.error ||
                        shipment.error ||
                        shipmentLines.error ||
                        terms.error ||
                        shipment.data.sourceDocumentId === null) {
                        throw new Error("Failed to load sales order");
                    }
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    return [4 /*yield*/, (0, settings_1.getDocumentTemplate)(client, companyId, "packingSlip")];
                case 4:
                    documentTemplate = _75.sent();
                    templateConfig = (0, template_1.toDocumentTemplate)(documentTemplate.data, "packingSlip");
                    resolvedTemplate = (0, template_1.resolveTemplate)("packingSlip", templateConfig);
                    showThumbnails = (0, template_1.templateShowsThumbnails)(templateConfig, "packingSlip");
                    return [4 /*yield*/, (0, settings_1.resolveSections)(client, companyId, (0, template_1.collectSectionIds)(resolvedTemplate))];
                case 5:
                    templateSections = _75.sent();
                    return [4 /*yield*/, (0, pdf_1.ensureFont)(resolvedTemplate.settings.fontFamily)];
                case 6:
                    _75.sent();
                    _e = shipment.data.sourceDocument;
                    switch (_e) {
                        case "Sales Order": return [3 /*break*/, 7];
                        case "Sales Invoice": return [3 /*break*/, 16];
                        case "Purchase Order": return [3 /*break*/, 25];
                        case "Outbound Transfer": return [3 /*break*/, 34];
                    }
                    return [3 /*break*/, 43];
                case 7: return [4 /*yield*/, Promise.all([
                        (0, sales_1.getSalesOrder)(serviceRole, shipment.data.sourceDocumentId),
                        (0, sales_1.getSalesOrderShipment)(serviceRole, shipment.data.sourceDocumentId)
                    ])];
                case 8:
                    _f = _75.sent(), salesOrder = _f[0], salesOrderShipment = _f[1];
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("customer")
                                .select("*")
                                .eq("id", (_s = (_r = salesOrder.data) === null || _r === void 0 ? void 0 : _r.customerId) !== null && _s !== void 0 ? _s : "")
                                .single(),
                            (0, sales_1.getCustomerLocation)(serviceRole, (_u = (_t = salesOrder.data) === null || _t === void 0 ? void 0 : _t.customerLocationId) !== null && _u !== void 0 ? _u : ""),
                            (0, accounting_1.getPaymentTerm)(serviceRole, (_w = (_v = salesOrder.data) === null || _v === void 0 ? void 0 : _v.paymentTermId) !== null && _w !== void 0 ? _w : ""),
                            (0, inventory_1.getShippingMethod)(serviceRole, (_z = (_x = shipment.data.shippingMethodId) !== null && _x !== void 0 ? _x : (_y = salesOrderShipment.data) === null || _y === void 0 ? void 0 : _y.shippingMethodId) !== null && _z !== void 0 ? _z : ""),
                            (0, inventory_1.getShipmentTracking)(serviceRole, shipment.data.id, companyId)
                        ])];
                case 9:
                    _g = _75.sent(), customer = _g[0], customerLocation = _g[1], paymentTerm = _g[2], shippingMethod = _g[3], shipmentTracking = _g[4];
                    if (customer.error) {
                        console.error(customer.error);
                        throw new Error("Failed to load customer");
                    }
                    thumbnails = {};
                    if (!showThumbnails) return [3 /*break*/, 13];
                    thumbnailPaths = (_0 = shipmentLines.data) === null || _0 === void 0 ? void 0 : _0.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!thumbnailPaths) return [3 /*break*/, 11];
                    return [4 /*yield*/, Promise.all(Object.entries(thumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_1.getBase64ImageFromSupabase)(serviceRole, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 10:
                    _h = _75.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _h = [];
                    _75.label = 12;
                case 12:
                    thumbnails =
                        (_2 = (_1 = (_h)) === null || _1 === void 0 ? void 0 : _1.reduce(function (acc, thumbnail) {
                            if (thumbnail) {
                                acc[thumbnail.id] = thumbnail.data;
                            }
                            return acc;
                        }, {})) !== null && _2 !== void 0 ? _2 : {};
                    _75.label = 13;
                case 13: return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.PackingSlipPDF company={company.data} customer={customer.data} locale={locale} meta={{
                            author: "Carbon",
                            keywords: "packing slip",
                            subject: "Packing Slip"
                        }} customerReference={(_4 = (_3 = salesOrder.data) === null || _3 === void 0 ? void 0 : _3.customerReference) !== null && _4 !== void 0 ? _4 : undefined} sourceDocument="Sales Order" sourceDocumentId={(_6 = (_5 = salesOrder.data) === null || _5 === void 0 ? void 0 : _5.salesOrderId) !== null && _6 !== void 0 ? _6 : undefined} shipment={shipment.data} shipmentLines={(_7 = shipmentLines.data) !== null && _7 !== void 0 ? _7 : []} 
                    // @ts-expect-error
                    shippingAddress={(_9 = (_8 = customerLocation.data) === null || _8 === void 0 ? void 0 : _8.address) !== null && _9 !== void 0 ? _9 : null} terms={((_11 = (_10 = terms === null || terms === void 0 ? void 0 : terms.data) === null || _10 === void 0 ? void 0 : _10.salesTerms) !== null && _11 !== void 0 ? _11 : {})} paymentTerm={(_12 = paymentTerm.data) !== null && _12 !== void 0 ? _12 : { id: "", name: "" }} shippingMethod={(_13 = shippingMethod.data) !== null && _13 !== void 0 ? _13 : { id: "", name: "" }} trackedEntities={(_14 = shipmentTracking.data) !== null && _14 !== void 0 ? _14 : []} title="Packing Slip" thumbnails={thumbnails} template={templateConfig} sections={templateSections}/>)];
                case 14:
                    stream_1 = _75.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            stream_1.on("data", function (data) {
                                buffers.push(data);
                            });
                            stream_1.on("end", function () {
                                resolve(Buffer.concat(buffers));
                            });
                            stream_1.on("error", reject);
                        })];
                case 15:
                    body = _75.sent();
                    headers = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(shipment.data.shipmentId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(body), { status: 200, headers: headers })];
                case 16: return [4 /*yield*/, serviceRole
                        .from("salesInvoice")
                        .select("*, salesInvoiceShipment(*)")
                        .eq("id", (_15 = shipment.data.sourceDocumentId) !== null && _15 !== void 0 ? _15 : "")
                        .single()];
                case 17:
                    salesInvoice = _75.sent();
                    if (salesInvoice.error) {
                        console.error(salesInvoice.error);
                        throw new Error("Failed to load sales invoice");
                    }
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("customer")
                                .select("*")
                                .eq("id", (_17 = (_16 = salesInvoice.data) === null || _16 === void 0 ? void 0 : _16.customerId) !== null && _17 !== void 0 ? _17 : "")
                                .single(),
                            (0, sales_1.getCustomerLocation)(serviceRole, (_19 = (_18 = salesInvoice.data) === null || _18 === void 0 ? void 0 : _18.locationId) !== null && _19 !== void 0 ? _19 : ""),
                            (0, accounting_1.getPaymentTerm)(serviceRole, (_21 = (_20 = salesInvoice.data) === null || _20 === void 0 ? void 0 : _20.paymentTermId) !== null && _21 !== void 0 ? _21 : ""),
                            (0, inventory_1.getShippingMethod)(serviceRole, (_25 = (_22 = shipment.data.shippingMethodId) !== null && _22 !== void 0 ? _22 : (_24 = (_23 = salesInvoice.data) === null || _23 === void 0 ? void 0 : _23.salesInvoiceShipment) === null || _24 === void 0 ? void 0 : _24.shippingMethodId) !== null && _25 !== void 0 ? _25 : ""),
                            (0, inventory_1.getShipmentTracking)(serviceRole, shipment.data.id, companyId)
                        ])];
                case 18:
                    _j = _75.sent(), customer = _j[0], customerLocation = _j[1], paymentTerm = _j[2], shippingMethod = _j[3], shipmentTracking = _j[4];
                    if (customer.error) {
                        console.error(customer.error);
                        throw new Error("Failed to load customer");
                    }
                    thumbnails = {};
                    if (!showThumbnails) return [3 /*break*/, 22];
                    thumbnailPaths = (_26 = shipmentLines.data) === null || _26 === void 0 ? void 0 : _26.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!thumbnailPaths) return [3 /*break*/, 20];
                    return [4 /*yield*/, Promise.all(Object.entries(thumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_1.getBase64ImageFromSupabase)(serviceRole, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 19:
                    _k = _75.sent();
                    return [3 /*break*/, 21];
                case 20:
                    _k = [];
                    _75.label = 21;
                case 21:
                    thumbnails =
                        (_28 = (_27 = (_k)) === null || _27 === void 0 ? void 0 : _27.reduce(function (acc, thumbnail) {
                            if (thumbnail) {
                                acc[thumbnail.id] = thumbnail.data;
                            }
                            return acc;
                        }, {})) !== null && _28 !== void 0 ? _28 : {};
                    _75.label = 22;
                case 22: return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.PackingSlipPDF company={company.data} customer={customer.data} locale={locale} meta={{
                            author: "Carbon",
                            keywords: "packing slip",
                            subject: "Packing Slip"
                        }} customerReference={(_30 = (_29 = salesInvoice.data) === null || _29 === void 0 ? void 0 : _29.customerReference) !== null && _30 !== void 0 ? _30 : undefined} sourceDocument="Sales Invoice" sourceDocumentId={(_32 = (_31 = salesInvoice.data) === null || _31 === void 0 ? void 0 : _31.invoiceId) !== null && _32 !== void 0 ? _32 : undefined} shipment={shipment.data} shipmentLines={(_33 = shipmentLines.data) !== null && _33 !== void 0 ? _33 : []} 
                    // @ts-expect-error
                    shippingAddress={(_35 = (_34 = customerLocation.data) === null || _34 === void 0 ? void 0 : _34.address) !== null && _35 !== void 0 ? _35 : null} terms={((_37 = (_36 = terms === null || terms === void 0 ? void 0 : terms.data) === null || _36 === void 0 ? void 0 : _36.salesTerms) !== null && _37 !== void 0 ? _37 : {})} paymentTerm={(_38 = paymentTerm.data) !== null && _38 !== void 0 ? _38 : { id: "", name: "" }} shippingMethod={(_39 = shippingMethod.data) !== null && _39 !== void 0 ? _39 : { id: "", name: "" }} trackedEntities={(_40 = shipmentTracking.data) !== null && _40 !== void 0 ? _40 : []} title="Packing Slip" thumbnails={thumbnails} template={templateConfig} sections={templateSections}/>)];
                case 23:
                    stream_2 = _75.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            stream_2.on("data", function (data) {
                                buffers.push(data);
                            });
                            stream_2.on("end", function () {
                                resolve(Buffer.concat(buffers));
                            });
                            stream_2.on("error", reject);
                        })];
                case 24:
                    body = _75.sent();
                    headers = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(shipment.data.shipmentId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(body), { status: 200, headers: headers })];
                case 25: return [4 /*yield*/, Promise.all([
                        (0, purchasing_1.getPurchaseOrder)(client, shipment.data.sourceDocumentId),
                        (0, purchasing_1.getPurchaseOrderDelivery)(client, shipment.data.sourceDocumentId)
                    ])];
                case 26:
                    _l = _75.sent(), purchaseOrder = _l[0], purchaseOrderDelivery = _l[1];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("supplier")
                                .select("*")
                                .eq("id", (_42 = (_41 = purchaseOrder.data) === null || _41 === void 0 ? void 0 : _41.supplierId) !== null && _42 !== void 0 ? _42 : "")
                                .single(),
                            (0, purchasing_1.getSupplierLocation)(client, (_44 = (_43 = purchaseOrder.data) === null || _43 === void 0 ? void 0 : _43.supplierLocationId) !== null && _44 !== void 0 ? _44 : ""),
                            (0, accounting_1.getPaymentTerm)(client, (_46 = (_45 = purchaseOrder.data) === null || _45 === void 0 ? void 0 : _45.paymentTermId) !== null && _46 !== void 0 ? _46 : ""),
                            (0, inventory_1.getShippingMethod)(client, (_48 = (_47 = purchaseOrderDelivery.data) === null || _47 === void 0 ? void 0 : _47.shippingMethodId) !== null && _48 !== void 0 ? _48 : ""),
                            (0, inventory_1.getShipmentTracking)(client, shipment.data.id, companyId)
                        ])];
                case 27:
                    _m = _75.sent(), supplier = _m[0], supplierLocation = _m[1], poPaymentTerm = _m[2], poShippingMethod = _m[3], poShipmentTracking = _m[4];
                    if (supplier.error) {
                        console.error(supplier.error);
                        throw new Error("Failed to load supplier");
                    }
                    poThumbnails = {};
                    if (!showThumbnails) return [3 /*break*/, 31];
                    poThumbnailPaths = (_49 = shipmentLines.data) === null || _49 === void 0 ? void 0 : _49.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!poThumbnailPaths) return [3 /*break*/, 29];
                    return [4 /*yield*/, Promise.all(Object.entries(poThumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_1.getBase64ImageFromSupabase)(client, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 28:
                    _o = _75.sent();
                    return [3 /*break*/, 30];
                case 29:
                    _o = [];
                    _75.label = 30;
                case 30:
                    poThumbnails =
                        (_51 = (_50 = (_o)) === null || _50 === void 0 ? void 0 : _50.reduce(function (acc, thumbnail) {
                            if (thumbnail) {
                                acc[thumbnail.id] = thumbnail.data;
                            }
                            return acc;
                        }, {})) !== null && _51 !== void 0 ? _51 : {};
                    _75.label = 31;
                case 31: return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.PackingSlipPDF company={company.data} customer={supplier.data} locale={locale} meta={{
                            author: "Carbon",
                            keywords: "packing slip",
                            subject: "Packing Slip"
                        }} customerReference={(_53 = (_52 = purchaseOrder.data) === null || _52 === void 0 ? void 0 : _52.supplierReference) !== null && _53 !== void 0 ? _53 : undefined} sourceDocument="Purchase Order" sourceDocumentId={(_55 = (_54 = purchaseOrder.data) === null || _54 === void 0 ? void 0 : _54.purchaseOrderId) !== null && _55 !== void 0 ? _55 : undefined} shipment={shipment.data} shipmentLines={(_56 = shipmentLines.data) !== null && _56 !== void 0 ? _56 : []} 
                    // @ts-expect-error
                    shippingAddress={(_58 = (_57 = supplierLocation.data) === null || _57 === void 0 ? void 0 : _57.address) !== null && _58 !== void 0 ? _58 : null} terms={((_60 = (_59 = terms === null || terms === void 0 ? void 0 : terms.data) === null || _59 === void 0 ? void 0 : _59.salesTerms) !== null && _60 !== void 0 ? _60 : {})} paymentTerm={(_61 = poPaymentTerm.data) !== null && _61 !== void 0 ? _61 : { id: "", name: "" }} shippingMethod={(_62 = poShippingMethod.data) !== null && _62 !== void 0 ? _62 : { id: "", name: "" }} trackedEntities={(_63 = poShipmentTracking.data) !== null && _63 !== void 0 ? _63 : []} title="Packing Slip" thumbnails={poThumbnails} template={templateConfig} sections={templateSections}/>)];
                case 32:
                    poStream_1 = _75.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            poStream_1.on("data", function (data) {
                                buffers.push(data);
                            });
                            poStream_1.on("end", function () {
                                resolve(Buffer.concat(buffers));
                            });
                            poStream_1.on("error", reject);
                        })];
                case 33:
                    poBody = _75.sent();
                    poHeaders = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(shipment.data.shipmentId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(poBody), {
                            status: 200,
                            headers: poHeaders
                        })];
                case 34: return [4 /*yield*/, (0, inventory_1.getWarehouseTransfer)(client, shipment.data.sourceDocumentId)];
                case 35:
                    warehouseTransfer = _75.sent();
                    if (warehouseTransfer.error) {
                        console.error(warehouseTransfer.error);
                        throw new Error("Failed to load warehouse transfer");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, inventory_1.getShippingMethod)(client, (_64 = shipment.data.shippingMethodId) !== null && _64 !== void 0 ? _64 : ""),
                            (0, inventory_1.getShipmentTracking)(client, shipment.data.id, companyId)
                        ])];
                case 36:
                    _p = _75.sent(), shippingMethod = _p[0], shipmentTracking = _p[1];
                    toLocation = warehouseTransfer.data.toLocation;
                    shippingAddress = toLocation
                        ? {
                            addressLine1: toLocation.addressLine1,
                            addressLine2: toLocation.addressLine2,
                            city: toLocation.city,
                            stateProvince: toLocation.stateProvince,
                            postalCode: toLocation.postalCode,
                            countryCode: toLocation.countryCode
                        }
                        : null;
                    transferThumbnails = {};
                    if (!showThumbnails) return [3 /*break*/, 40];
                    transferThumbnailPaths = (_65 = shipmentLines.data) === null || _65 === void 0 ? void 0 : _65.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!transferThumbnailPaths) return [3 /*break*/, 38];
                    return [4 /*yield*/, Promise.all(Object.entries(transferThumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_1.getBase64ImageFromSupabase)(client, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 37:
                    _q = _75.sent();
                    return [3 /*break*/, 39];
                case 38:
                    _q = [];
                    _75.label = 39;
                case 39:
                    transferThumbnails =
                        (_67 = (_66 = (_q)) === null || _66 === void 0 ? void 0 : _66.reduce(function (acc, thumbnail) {
                            if (thumbnail) {
                                acc[thumbnail.id] = thumbnail.data;
                            }
                            return acc;
                        }, {})) !== null && _67 !== void 0 ? _67 : {};
                    _75.label = 40;
                case 40: return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.PackingSlipPDF company={company.data} customer={{ name: (_68 = toLocation === null || toLocation === void 0 ? void 0 : toLocation.name) !== null && _68 !== void 0 ? _68 : "" }} locale={locale} meta={{
                            author: "Carbon",
                            keywords: "packing slip",
                            subject: "Packing Slip"
                        }} sourceDocument="Outbound Transfer" sourceDocumentId={(_69 = warehouseTransfer.data.transferId) !== null && _69 !== void 0 ? _69 : undefined} shipment={shipment.data} shipmentLines={(_70 = shipmentLines.data) !== null && _70 !== void 0 ? _70 : []} 
                    // @ts-expect-error
                    shippingAddress={shippingAddress} terms={((_72 = (_71 = terms === null || terms === void 0 ? void 0 : terms.data) === null || _71 === void 0 ? void 0 : _71.salesTerms) !== null && _72 !== void 0 ? _72 : {})} paymentTerm={{ id: "", name: "" }} shippingMethod={(_73 = shippingMethod.data) !== null && _73 !== void 0 ? _73 : { id: "", name: "" }} trackedEntities={(_74 = shipmentTracking.data) !== null && _74 !== void 0 ? _74 : []} title="Packing Slip" thumbnails={transferThumbnails} template={templateConfig} sections={templateSections}/>)];
                case 41:
                    transferStream_1 = _75.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            transferStream_1.on("data", function (data) {
                                buffers.push(data);
                            });
                            transferStream_1.on("end", function () {
                                resolve(Buffer.concat(buffers));
                            });
                            transferStream_1.on("error", reject);
                        })];
                case 42:
                    transferBody = _75.sent();
                    transferHeaders = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(shipment.data.shipmentId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(transferBody), {
                            status: 200,
                            headers: transferHeaders
                        })];
                case 43: throw new Error("Invalid source document");
            }
        });
    });
}
