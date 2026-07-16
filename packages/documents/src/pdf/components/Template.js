"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("@react-pdf/renderer");
var react_1 = require("react");
var template_1 = require("../../template");
var tw_1 = require("../blocks/tw");
var Footer_1 = require("./Footer");
var Note_1 = require("./Note");
var Template = function (_a) {
    var _b;
    var title = _a.title, meta = _a.meta, footerLabel = _a.footerLabel, footerDocumentId = _a.footerDocumentId, _c = _a.showFooter, showFooter = _c === void 0 ? true : _c, _d = _a.showPageNumbers, showPageNumbers = _d === void 0 ? true : _d, _e = _a.pageNumberFormat, pageNumberFormat = _e === void 0 ? "pageOfTotal" : _e, _f = _a.showRegistrationLine, showRegistrationLine = _f === void 0 ? true : _f, _g = _a.fontFamily, fontFamily = _g === void 0 ? "Inter" : _g, headerContent = _a.headerContent, footerContent = _a.footerContent, _h = _a.theme, theme = _h === void 0 ? template_1.DEFAULT_THEME : _h, children = _a.children;
    var docStyle = (0, react_1.useMemo)(function () { return ({ tw: (0, tw_1.makeDocTw)(theme), theme: theme }); }, [theme]);
    var hasHeader = headerContent &&
        typeof headerContent === "object" &&
        Array.isArray(headerContent.content) &&
        headerContent.content.length > 0;
    renderer_1.Font.register({
        family: "Inter",
        fonts: [
            {
                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
            },
            {
                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
                fontWeight: 300
            },
            {
                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
                fontWeight: 500
            },
            {
                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
                fontWeight: 700
            },
            {
                src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
                fontWeight: 900
            }
        ]
    });
    // Built-ins need no registration; otherwise the font must have been
    // registered (Inter statically here, Google fonts via ensureFont before
    // render). Fall back to Helvetica so an unregistered font never errors.
    var BUILT_IN_FONTS = ["Helvetica", "Times-Roman", "Courier"];
    var safeFontFamily = BUILT_IN_FONTS.includes(fontFamily) ||
        renderer_1.Font.getRegisteredFontFamilies().includes(fontFamily)
        ? fontFamily
        : "Helvetica";
    var styles = renderer_1.StyleSheet.create({
        body: {
            fontFamily: safeFontFamily,
            // Unitless line-height = a multiple of font size, so vertical rhythm is
            // identical for every font (Inter, serif, mono) and every text size.
            // letterSpacing 0 drops each font's default tracking for consistency.
            lineHeight: 1.4,
            letterSpacing: 0,
            padding: "10px 16px 36px 16px",
            color: "#000000",
            backgroundColor: "#FFFFFF"
        }
    });
    return (<renderer_1.Document author={(_b = meta === null || meta === void 0 ? void 0 : meta.author) !== null && _b !== void 0 ? _b : "Carbon"} keywords={meta === null || meta === void 0 ? void 0 : meta.keywords} subject={meta === null || meta === void 0 ? void 0 : meta.subject} title={title}>
      <renderer_1.Page size="A4" style={styles.body}>
        <tw_1.DocStyleProvider value={docStyle}>
          {hasHeader && (<renderer_1.View fixed style={{ marginBottom: 8 }}>
              <Note_1.default content={headerContent}/>
            </renderer_1.View>)}
          {children}
          {showFooter && (<Footer_1.default label={footerLabel} documentId={footerDocumentId} content={footerContent} showPageNumbers={showPageNumbers} pageNumberFormat={pageNumberFormat} showRegistrationLine={showRegistrationLine}/>)}
        </tw_1.DocStyleProvider>
      </renderer_1.Page>
    </renderer_1.Document>);
};
exports.default = Template;
