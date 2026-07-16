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
var stockTransfer_1 = require("./blocks/stockTransfer");
var components_1 = require("./components");
var StockTransferPDF = function (_a) {
    var _b, _c, _d, _e;
    var company = _a.company, stockTransfer = _a.stockTransfer, stockTransferLines = _a.stockTransferLines, location = _a.location, locale = _a.locale, thumbnails = _a.thumbnails, template = _a.template, _f = _a.sections, sections = _f === void 0 ? {} : _f, _g = _a.title, title = _g === void 0 ? "Stock Transfer" : _g;
    var _h = (0, template_1.resolveTemplate)("stockTransfer", template), blocks = _h.blocks, theme = _h.theme, settings = _h.settings, headerSectionId = _h.headerSectionId, footerSectionId = _h.footerSectionId;
    var vars = (0, stockTransfer_1.buildStockTransferVars)({ stockTransfer: stockTransfer, location: location, company: company });
    var headerOptions = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (headerSectionId ? ((_c = (_b = sections[headerSectionId]) === null || _b === void 0 ? void 0 : _b.config) !== null && _c !== void 0 ? _c : {}) : {}));
    var data = {
        company: company,
        locale: locale,
        stockTransfer: stockTransfer,
        stockTransferLines: stockTransferLines,
        location: location,
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
            author: "Carbon",
            keywords: "stock transfer",
            subject: "Stock Transfer"
        }} footerDocumentId={stockTransfer === null || stockTransfer === void 0 ? void 0 : stockTransfer.stockTransferId} showFooter={showFooter} showPageNumbers={settings.showPageNumbers} pageNumberFormat={settings.pageNumberFormat} showRegistrationLine={settings.showRegistrationLine} fontFamily={settings.fontFamily} headerContent={headerContent} footerContent={footerContent}>
      {visibleBlocks.map(function (block) {
            var render = stockTransfer_1.stockTransferBlockRegistry[block.type];
            if (!render)
                return null;
            return <react_1.Fragment key={block.id}>{render({ block: block, data: data })}</react_1.Fragment>;
        })}
    </components_1.Template>);
};
exports.default = StockTransferPDF;
