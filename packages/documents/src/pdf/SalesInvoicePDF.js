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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var template_1 = require("../template");
var footer_1 = require("../utils/footer");
var blocks_1 = require("./blocks");
var components_1 = require("./components");
var SalesInvoicePDF = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var accountsReceivableBillingAddress = _a.accountsReceivableBillingAddress, company = _a.company, companySettings = _a.companySettings, meta = _a.meta, salesInvoice = _a.salesInvoice, salesInvoiceShipment = _a.salesInvoiceShipment, salesInvoiceLines = _a.salesInvoiceLines, salesInvoiceLocations = _a.salesInvoiceLocations, salesOrderIds = _a.salesOrderIds, terms = _a.terms, paymentTerms = _a.paymentTerms, shippingMethods = _a.shippingMethods, thumbnails = _a.thumbnails, locale = _a.locale, template = _a.template, _k = _a.sections, sections = _k === void 0 ? {} : _k, _l = _a.title, title = _l === void 0 ? "Invoice" : _l;
    var currencyCode = (_b = salesInvoice.currencyCode) !== null && _b !== void 0 ? _b : company.baseCurrencyCode;
    var numberFormatter = new Intl.NumberFormat(locale, {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    var registrationLine = (0, footer_1.composeRegistrationLine)({
        companyName: company.name,
        country: company.countryCode,
        eori: company.eori
    });
    var _m = (0, template_1.resolveTemplate)("salesInvoice", template), blocks = _m.blocks, theme = _m.theme, settings = _m.settings, headerSectionId = _m.headerSectionId, footerSectionId = _m.footerSectionId;
    var vars = (0, blocks_1.buildSalesInvoiceVars)({
        salesInvoice: salesInvoice,
        salesInvoiceLocations: salesInvoiceLocations,
        company: company,
        currencyCode: currencyCode
    });
    // Header layout now lives on the global header section's config (not the
    // block), so every document shares one header configuration.
    var headerOptions = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (headerSectionId ? ((_d = (_c = sections[headerSectionId]) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : {}) : {}));
    var data = {
        company: company,
        companySettings: companySettings,
        locale: locale,
        salesInvoice: salesInvoice,
        salesInvoiceLines: salesInvoiceLines,
        salesInvoiceLocations: salesInvoiceLocations,
        salesInvoiceShipment: salesInvoiceShipment,
        salesOrderIds: salesOrderIds,
        accountsReceivableBillingAddress: accountsReceivableBillingAddress,
        paymentTerms: paymentTerms,
        shippingMethods: shippingMethods,
        terms: terms,
        thumbnails: thumbnails,
        theme: theme,
        sections: sections,
        currencyCode: currencyCode,
        numberFormatter: numberFormatter,
        vars: vars,
        headerOptions: headerOptions
    };
    var headerSection = headerSectionId
        ? (_e = sections[headerSectionId]) === null || _e === void 0 ? void 0 : _e.content
        : undefined;
    var footerSection = footerSectionId
        ? (_f = sections[footerSectionId]) === null || _f === void 0 ? void 0 : _f.content
        : undefined;
    var headerContent = headerSection
        ? (0, template_1.interpolateContent)(headerSection, vars)
        : undefined;
    var footerContent = footerSection
        ? (0, template_1.interpolateContent)(footerSection, vars)
        : undefined;
    // The header/footer selectors are the single control for the top header and
    // the footer band. "None" (null id) removes them entirely; the built-in
    // default id keeps them. This drives both the company Header block and the
    // structural footer (registration line + page numbers).
    var showHeader = headerSectionId !== null;
    var showFooter = footerSectionId !== null;
    var visibleBlocks = blocks.filter(function (block) { return block.visible && !(block.type === "header" && !showHeader); });
    return (<components_1.Template theme={theme} title={title} meta={{
            author: (_g = meta === null || meta === void 0 ? void 0 : meta.author) !== null && _g !== void 0 ? _g : "Carbon",
            keywords: (_h = meta === null || meta === void 0 ? void 0 : meta.keywords) !== null && _h !== void 0 ? _h : "sales invoice",
            subject: (_j = meta === null || meta === void 0 ? void 0 : meta.subject) !== null && _j !== void 0 ? _j : "Invoice"
        }} footerDocumentId={salesInvoice === null || salesInvoice === void 0 ? void 0 : salesInvoice.invoiceId} footerLabel={registrationLine !== null && registrationLine !== void 0 ? registrationLine : undefined} showFooter={showFooter} showPageNumbers={settings.showPageNumbers} pageNumberFormat={settings.pageNumberFormat} showRegistrationLine={settings.showRegistrationLine} fontFamily={settings.fontFamily} headerContent={headerContent} footerContent={footerContent}>
      {visibleBlocks.map(function (block) {
            var render = blocks_1.salesInvoiceBlockRegistry[block.type];
            if (!render)
                return null;
            return <react_1.Fragment key={block.id}>{render({ block: block, data: data })}</react_1.Fragment>;
        })}
    </components_1.Template>);
};
exports.default = SalesInvoicePDF;
