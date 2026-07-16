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
exports.Header = void 0;
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../template");
var tw_1 = require("../blocks/tw");
var LogoImage_1 = require("./LogoImage");
var Header = function (_a) {
    var _b, _c;
    var company = _a.company, title = _a.title, documentId = _a.documentId, documentSubId = _a.documentSubId, options = _a.options, fixed = _a.fixed;
    var tw = (0, tw_1.useTw)();
    var opts = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), options);
    // `icon` variant prefers the square logo; `mark` prefers the full logo.
    var logoSrc = opts.logoVariant === "icon"
        ? ((_b = company.logoLightIcon) !== null && _b !== void 0 ? _b : company.logoLight)
        : ((_c = company.logoLight) !== null && _c !== void 0 ? _c : company.logoLightIcon);
    var showLogo = opts.showLogo && Boolean(logoSrc);
    // Name fallback only when a logo is wanted but missing. With the logo turned
    // off, render nothing here (the company name still shows in the details block).
    var showNameFallback = opts.showLogo && !logoSrc;
    var headerView = (<renderer_1.View style={tw("flex flex-row justify-between mb-1")}>
      <renderer_1.View style={tw("flex flex-row")}>
        {showLogo ? (<LogoImage_1.LogoImage src={logoSrc} height={opts.logoHeight} crop={opts.logoCrop} marginRight={12}/>) : showNameFallback ? (<renderer_1.Text style={tw("text-2xl font-bold text-gray-800 mr-3")}>
            {company.name}
          </renderer_1.Text>) : null}
        {opts.showCompanyDetails && (<renderer_1.View style={tw("flex flex-col text-[9px] text-gray-800")}>
            {company.name && (<renderer_1.Text style={tw("font-bold")}>{company.name}</renderer_1.Text>)}
            {company.addressLine1 && <renderer_1.Text>{company.addressLine1}</renderer_1.Text>}
            {company.addressLine2 && <renderer_1.Text>{company.addressLine2}</renderer_1.Text>}
            {(company.city || company.stateProvince || company.postalCode) && (<renderer_1.Text>
                {(0, utils_1.formatCityStatePostalCode)(company.city, company.stateProvince, company.postalCode)}
              </renderer_1.Text>)}
          </renderer_1.View>)}
      </renderer_1.View>
      <renderer_1.View style={tw("flex flex-col items-end justify-start")}>
        {opts.showDocumentTitle && (<renderer_1.Text style={tw("text-2xl font-bold text-gray-800")}>{title}</renderer_1.Text>)}
        {opts.showDocumentId && documentId && (<renderer_1.Text style={tw("text-sm font-bold text-gray-600 -mt-4")}>
            {documentId}
          </renderer_1.Text>)}
        {documentSubId && (<renderer_1.Text style={tw("text-[8px] font-bold text-gray-600")}>
            {documentSubId}
          </renderer_1.Text>)}
      </renderer_1.View>
    </renderer_1.View>);
    if (fixed) {
        return (<>
        <renderer_1.View fixed>{headerView}</renderer_1.View>
        <renderer_1.View fixed style={tw("h-[1px] bg-gray-200 mb-4")}/>
      </>);
    }
    return (<>
      {headerView}
      <renderer_1.View style={tw("h-[1px] bg-gray-200 mb-4")}/>
    </>);
};
exports.Header = Header;
