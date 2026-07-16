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
var shared_1 = require("../utils/shared");
var packingSlip_1 = require("./blocks/packingSlip");
var components_1 = require("./components");
var PackingSlipPDF = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var company = _a.company, customer = _a.customer, meta = _a.meta, customerReference = _a.customerReference, sourceDocument = _a.sourceDocument, sourceDocumentId = _a.sourceDocumentId, shipment = _a.shipment, shipmentLines = _a.shipmentLines, shippingAddress = _a.shippingAddress, terms = _a.terms, paymentTerm = _a.paymentTerm, shippingMethod = _a.shippingMethod, _j = _a.title, title = _j === void 0 ? "Packing Slip" : _j, locale = _a.locale, trackedEntities = _a.trackedEntities, thumbnails = _a.thumbnails, template = _a.template, _k = _a.sections, sections = _k === void 0 ? {} : _k;
    var _l = (0, template_1.resolveTemplate)("packingSlip", template), blocks = _l.blocks, theme = _l.theme, settings = _l.settings, headerSectionId = _l.headerSectionId, footerSectionId = _l.footerSectionId;
    var vars = (0, packingSlip_1.buildPackingSlipVars)({
        shipment: shipment,
        customer: customer,
        shippingAddress: shippingAddress,
        company: company
    });
    var headerOptions = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (headerSectionId ? ((_c = (_b = sections[headerSectionId]) === null || _b === void 0 ? void 0 : _b.config) !== null && _c !== void 0 ? _c : {}) : {}));
    var data = {
        company: company,
        locale: locale,
        customer: customer,
        customerReference: customerReference,
        sourceDocument: sourceDocument,
        sourceDocumentId: sourceDocumentId,
        shipment: shipment,
        shipmentLines: shipmentLines,
        shippingAddress: shippingAddress,
        paymentTerm: paymentTerm,
        shippingMethod: shippingMethod,
        terms: terms,
        trackedEntities: trackedEntities,
        thumbnails: thumbnails,
        theme: theme,
        sections: sections,
        vars: vars,
        headerOptions: headerOptions
    };
    var headerSection = headerSectionId
        ? (_d = sections[headerSectionId]) === null || _d === void 0 ? void 0 : _d.content
        : undefined;
    var footerSection = footerSectionId
        ? (_e = sections[footerSectionId]) === null || _e === void 0 ? void 0 : _e.content
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
    return (<components_1.Template theme={theme} title={title} meta={{
            author: (_f = meta === null || meta === void 0 ? void 0 : meta.author) !== null && _f !== void 0 ? _f : "Carbon",
            keywords: (_g = meta === null || meta === void 0 ? void 0 : meta.keywords) !== null && _g !== void 0 ? _g : "packing slip",
            subject: (_h = meta === null || meta === void 0 ? void 0 : meta.subject) !== null && _h !== void 0 ? _h : "Packing Slip"
        }} footerLabel={(0, shared_1.getRegistrationFooter)(company.name, company.countryCode, company.taxId)} footerDocumentId={shipment === null || shipment === void 0 ? void 0 : shipment.shipmentId} showFooter={showFooter} showPageNumbers={settings.showPageNumbers} pageNumberFormat={settings.pageNumberFormat} showRegistrationLine={settings.showRegistrationLine} fontFamily={settings.fontFamily} headerContent={headerContent} footerContent={footerContent}>
      {visibleBlocks.map(function (block) {
            var render = packingSlip_1.packingSlipBlockRegistry[block.type];
            if (!render)
                return null;
            return <react_1.Fragment key={block.id}>{render({ block: block, data: data })}</react_1.Fragment>;
        })}
    </components_1.Template>);
};
exports.default = PackingSlipPDF;
