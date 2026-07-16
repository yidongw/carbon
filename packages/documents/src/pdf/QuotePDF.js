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
var quote_1 = require("./blocks/quote");
var components_1 = require("./components");
var QuotePDF = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var company = _a.company, companySettings = _a.companySettings, meta = _a.meta, exchangeRate = _a.exchangeRate, quote = _a.quote, quoteLines = _a.quoteLines, quoteLinePrices = _a.quoteLinePrices, quoteCustomerDetails = _a.quoteCustomerDetails, payment = _a.payment, paymentTerms = _a.paymentTerms, shipment = _a.shipment, terms = _a.terms, thumbnails = _a.thumbnails, locale = _a.locale, template = _a.template, _l = _a.sections, sections = _l === void 0 ? {} : _l, _m = _a.title, title = _m === void 0 ? "Quote" : _m;
    var currencyCode = (_b = quote.currencyCode) !== null && _b !== void 0 ? _b : company.baseCurrencyCode;
    var shouldConvertCurrency = !!currencyCode && currencyCode !== company.baseCurrencyCode;
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
    var pricesByLine = quoteLinePrices.reduce(function (acc, price) {
        var _a;
        var _b;
        ((_a = acc[_b = price.quoteLineId]) !== null && _a !== void 0 ? _a : (acc[_b] = [])).push(price);
        return acc;
    }, {});
    var priceForFirstQty = function (line) {
        var _a, _b;
        var lineQuantity = (_a = line.quantity) !== null && _a !== void 0 ? _a : [];
        var prices = line.id != null ? ((_b = pricesByLine[line.id]) !== null && _b !== void 0 ? _b : []) : [];
        return prices.find(function (p) { return p.quantity === lineQuantity[0]; });
    };
    var hasSinglePricePerLine = quoteLines.every(function (line) { var _a; return ((_a = line.quantity) !== null && _a !== void 0 ? _a : []).length === 1; });
    var hasAnyLeadTime = quoteLines.some(function (line) {
        var _a, _b;
        if (line.status === "No Quote")
            return false;
        return ((_b = (_a = priceForFirstQty(line)) === null || _a === void 0 ? void 0 : _a.leadTime) !== null && _b !== void 0 ? _b : 0) > 0;
    });
    var columnCount = 3 + (!hasSinglePricePerLine ? 1 : 0) + (hasAnyLeadTime ? 1 : 0);
    var colWidth = columnCount === 3 ? "w-1/3" : columnCount === 4 ? "w-1/4" : "w-1/5";
    var maxLeadTime = 0;
    for (var _i = 0, _o = Object.values(pricesByLine); _i < _o.length; _i++) {
        var prices = _o[_i];
        for (var _p = 0, prices_1 = prices; _p < prices_1.length; _p++) {
            var price = prices_1[_p];
            if (price && price.leadTime > maxLeadTime)
                maxLeadTime = price.leadTime;
        }
    }
    var subtotal = quoteLines.reduce(function (total, line) {
        var _a, _b;
        if (line.status === "No Quote")
            return total;
        return total + ((_b = (_a = priceForFirstQty(line)) === null || _a === void 0 ? void 0 : _a.convertedNetExtendedPrice) !== null && _b !== void 0 ? _b : 0);
    }, 0);
    var shipping = quoteLines.reduce(function (total, line) {
        var _a, _b;
        if (line.status === "No Quote")
            return total;
        return total + ((_b = (_a = priceForFirstQty(line)) === null || _a === void 0 ? void 0 : _a.convertedShippingCost) !== null && _b !== void 0 ? _b : 0);
    }, 0) +
        ((_c = shipment === null || shipment === void 0 ? void 0 : shipment.shippingCost) !== null && _c !== void 0 ? _c : 0) * (exchangeRate !== null && exchangeRate !== void 0 ? exchangeRate : 1);
    var fees = quoteLines.reduce(function (total, line) {
        var _a, _b;
        if (line.status === "No Quote")
            return total;
        var additionalCharges = (_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {};
        var quantity = ((_b = line.quantity) !== null && _b !== void 0 ? _b : [])[0];
        var charges = Object.values(additionalCharges).reduce(function (acc, charge) {
            var _a, _b;
            var amount = quantity != null ? ((_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0) : 0;
            if (shouldConvertCurrency)
                amount *= exchangeRate;
            return acc + amount;
        }, 0);
        return total + charges;
    }, 0);
    var taxes = quoteLines.reduce(function (total, line) {
        var _a, _b, _c, _d, _e;
        if (line.status === "No Quote")
            return total;
        var price = priceForFirstQty(line);
        var netExtendedPrice = (_a = price === null || price === void 0 ? void 0 : price.convertedNetExtendedPrice) !== null && _a !== void 0 ? _a : 0;
        var additionalCharges = (_b = line.additionalCharges) !== null && _b !== void 0 ? _b : {};
        var quantity = ((_c = line.quantity) !== null && _c !== void 0 ? _c : [])[0];
        var taxableFees = Object.values(additionalCharges).reduce(function (acc, charge) {
            var _a, _b;
            if (charge.taxable === false)
                return acc;
            var amount = quantity != null ? ((_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0) : 0;
            if (shouldConvertCurrency)
                amount *= exchangeRate;
            return acc + amount;
        }, 0);
        var lineShipping = (_d = price === null || price === void 0 ? void 0 : price.convertedShippingCost) !== null && _d !== void 0 ? _d : 0;
        var taxableAmount = netExtendedPrice + taxableFees + lineShipping;
        return total + taxableAmount * ((_e = line.taxPercent) !== null && _e !== void 0 ? _e : 0);
    }, 0);
    var totals = {
        subtotal: subtotal,
        shipping: shipping,
        fees: fees,
        taxes: taxes,
        total: subtotal + shipping + fees + taxes
    };
    var _q = (0, template_1.resolveTemplate)("quote", template), blocks = _q.blocks, theme = _q.theme, settings = _q.settings, headerSectionId = _q.headerSectionId, footerSectionId = _q.footerSectionId;
    var vars = (0, quote_1.buildQuoteVars)({
        quote: quote,
        quoteCustomerDetails: quoteCustomerDetails,
        company: company,
        currencyCode: currencyCode
    });
    var headerOptions = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (headerSectionId ? ((_e = (_d = sections[headerSectionId]) === null || _d === void 0 ? void 0 : _d.config) !== null && _e !== void 0 ? _e : {}) : {}));
    var data = {
        company: company,
        companySettings: companySettings,
        locale: locale,
        quote: quote,
        quoteLines: quoteLines,
        quoteLinePrices: quoteLinePrices,
        quoteCustomerDetails: quoteCustomerDetails,
        payment: payment,
        shipment: shipment,
        paymentTerms: paymentTerms,
        terms: terms,
        thumbnails: thumbnails,
        exchangeRate: exchangeRate,
        shouldConvertCurrency: shouldConvertCurrency,
        pricesByLine: pricesByLine,
        hasSinglePricePerLine: hasSinglePricePerLine,
        hasAnyLeadTime: hasAnyLeadTime,
        colWidth: colWidth,
        maxLeadTime: maxLeadTime,
        totals: totals,
        theme: theme,
        sections: sections,
        currencyCode: currencyCode,
        numberFormatter: numberFormatter,
        vars: vars,
        headerOptions: headerOptions
    };
    var headerSection = headerSectionId
        ? (_f = sections[headerSectionId]) === null || _f === void 0 ? void 0 : _f.content
        : undefined;
    var footerSection = footerSectionId
        ? (_g = sections[footerSectionId]) === null || _g === void 0 ? void 0 : _g.content
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
            author: (_h = meta === null || meta === void 0 ? void 0 : meta.author) !== null && _h !== void 0 ? _h : "Carbon",
            keywords: (_j = meta === null || meta === void 0 ? void 0 : meta.keywords) !== null && _j !== void 0 ? _j : "quote",
            subject: (_k = meta === null || meta === void 0 ? void 0 : meta.subject) !== null && _k !== void 0 ? _k : "Quote"
        }} footerDocumentId={quote === null || quote === void 0 ? void 0 : quote.quoteId} footerLabel={registrationLine !== null && registrationLine !== void 0 ? registrationLine : undefined} showFooter={showFooter} showPageNumbers={settings.showPageNumbers} pageNumberFormat={settings.pageNumberFormat} showRegistrationLine={settings.showRegistrationLine} fontFamily={settings.fontFamily} headerContent={headerContent} footerContent={footerContent}>
      {visibleBlocks.map(function (block) {
            var render = quote_1.quoteBlockRegistry[block.type];
            if (!render)
                return null;
            return <react_1.Fragment key={block.id}>{render({ block: block, data: data })}</react_1.Fragment>;
        })}
    </components_1.Template>);
};
exports.default = QuotePDF;
