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
var purchaseOrder_1 = require("./blocks/purchaseOrder");
var components_1 = require("./components");
var PurchaseOrderPDF = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var accountsPayableBillingAddress = _a.accountsPayableBillingAddress, company = _a.company, companySettings = _a.companySettings, meta = _a.meta, paymentTerms = _a.paymentTerms, purchaseOrder = _a.purchaseOrder, purchaseOrderLines = _a.purchaseOrderLines, purchaseOrderLocations = _a.purchaseOrderLocations, terms = _a.terms, thumbnails = _a.thumbnails, locale = _a.locale, template = _a.template, _m = _a.sections, sections = _m === void 0 ? {} : _m, _o = _a.title, title = _o === void 0 ? "Purchase Order" : _o;
    var currencyCode = (_c = (_b = purchaseOrder.currencyCode) !== null && _b !== void 0 ? _b : company.baseCurrencyCode) !== null && _c !== void 0 ? _c : "USD";
    var numberFormatter = new Intl.NumberFormat(locale, {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    var registrationLine = (0, footer_1.composeRegistrationLine)({
        companyName: company.name,
        country: (_d = purchaseOrderLocations.companyCountryName) !== null && _d !== void 0 ? _d : company.countryCode,
        eori: company.eori
    });
    var headerTitle = (purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchaseOrderId)
        ? "".concat(title, ": ").concat(purchaseOrder.purchaseOrderId)
        : title;
    var _p = (0, template_1.resolveTemplate)("purchaseOrder", template), blocks = _p.blocks, theme = _p.theme, settings = _p.settings, headerSectionId = _p.headerSectionId, footerSectionId = _p.footerSectionId;
    var vars = (0, purchaseOrder_1.buildPurchaseOrderVars)({
        purchaseOrder: purchaseOrder,
        purchaseOrderLocations: purchaseOrderLocations,
        company: company,
        currencyCode: currencyCode
    });
    var headerOptions = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (headerSectionId ? ((_f = (_e = sections[headerSectionId]) === null || _e === void 0 ? void 0 : _e.config) !== null && _f !== void 0 ? _f : {}) : {}));
    var data = {
        company: company,
        companySettings: companySettings,
        locale: locale,
        purchaseOrder: purchaseOrder,
        purchaseOrderLines: purchaseOrderLines,
        purchaseOrderLocations: purchaseOrderLocations,
        accountsPayableBillingAddress: accountsPayableBillingAddress,
        paymentTerms: paymentTerms !== null && paymentTerms !== void 0 ? paymentTerms : [],
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
        ? (_g = sections[headerSectionId]) === null || _g === void 0 ? void 0 : _g.content
        : undefined;
    var footerSection = footerSectionId
        ? (_h = sections[footerSectionId]) === null || _h === void 0 ? void 0 : _h.content
        : undefined;
    var headerContent = headerSection
        ? (0, template_1.interpolateContent)(headerSection, vars)
        : undefined;
    var footerContent = footerSection
        ? (0, template_1.interpolateContent)(footerSection, vars)
        : undefined;
    var showHeader = headerSectionId !== null;
    var showFooter = footerSectionId !== null;
    var visibleBlocks = blocks.filter(function (block) { return block.visible && !(block.type === "header" && !showHeader); });
    return (<components_1.Template theme={theme} title={headerTitle} meta={{
            author: (_j = meta === null || meta === void 0 ? void 0 : meta.author) !== null && _j !== void 0 ? _j : "Carbon",
            keywords: (_k = meta === null || meta === void 0 ? void 0 : meta.keywords) !== null && _k !== void 0 ? _k : "purchase order",
            subject: (_l = meta === null || meta === void 0 ? void 0 : meta.subject) !== null && _l !== void 0 ? _l : "Purchase Order"
        }} footerDocumentId={purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchaseOrderId} footerLabel={registrationLine !== null && registrationLine !== void 0 ? registrationLine : undefined} showFooter={showFooter} showPageNumbers={settings.showPageNumbers} pageNumberFormat={settings.pageNumberFormat} showRegistrationLine={settings.showRegistrationLine} fontFamily={settings.fontFamily} headerContent={headerContent} footerContent={footerContent}>
      {visibleBlocks.map(function (block) {
            var render = purchaseOrder_1.purchaseOrderBlockRegistry[block.type];
            if (!render)
                return null;
            return <react_1.Fragment key={block.id}>{render({ block: block, data: data })}</react_1.Fragment>;
        })}
    </components_1.Template>);
};
exports.default = PurchaseOrderPDF;
