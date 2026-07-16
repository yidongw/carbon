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
var renderer_1 = require("@react-pdf/renderer");
var react_1 = require("react");
var react_pdf_tailwind_1 = require("react-pdf-tailwind");
var template_1 = require("../template");
var trackingLabel_1 = require("./blocks/trackingLabel");
var labelGeometry_1 = require("./components/labelGeometry");
// Initialize tailwind-styled-components
var tw = (0, react_pdf_tailwind_1.createTw)({
    theme: {
        fontFamily: {
            sans: ["Helvetica", "Arial", "sans-serif"]
        },
        extend: {
            colors: {
                gray: {
                    500: "#7d7d7d"
                }
            }
        }
    }
});
var ProductLabelPDF = function (_a) {
    var items = _a.items, labelSize = _a.labelSize, template = _a.template, _b = _a.sections, sections = _b === void 0 ? {} : _b, company = _a.company, logo = _a.logo;
    // Default to 1 row and 1 column if not specified
    var rows = labelSize.rows || 1;
    var columns = labelSize.columns || 1;
    var rotated = labelSize.rotated || false;
    var resolved = (0, template_1.resolveTemplate)("trackingLabel", template !== null && template !== void 0 ? template : null);
    var visibleBlocks = resolved.blocks.filter(function (block) { return block.visible; });
    // Standard letter size paper (8.5 x 11 inches in points)
    var LETTER_WIDTH = 8.5 * 72;
    var LETTER_HEIGHT = 11 * 72;
    // Calculate dimensions in points (72 points per inch)
    var labelWidthPt = labelSize.width * 72;
    var labelHeightPt = labelSize.height * 72;
    // Account for rotation when calculating effective dimensions
    var effectiveLabelWidthPt = rotated ? labelHeightPt : labelWidthPt;
    var effectiveLabelHeightPt = rotated ? labelWidthPt : labelHeightPt;
    // A single label prints on a page sized exactly to the label, with no
    // margins, so it feeds correctly on a thermal/label printer. Multi-up sheets
    // (rows × columns, e.g. Avery) print on a standard letter sheet with the
    // grid centred.
    var isMultiUp = rows > 1 || columns > 1;
    var pageWidth = isMultiUp ? LETTER_WIDTH : effectiveLabelWidthPt;
    var pageHeight = isMultiUp ? LETTER_HEIGHT : effectiveLabelHeightPt;
    // Font + QR sizing comes from the shared label geometry (203dpi, 2"x1"
    // baseline, unit-matched to the ZPL output) so the PDF and ZPL prints look
    // alike and scale continuously across stock sizes.
    var geometry = (0, labelGeometry_1.getLabelPdfGeometry)(labelSize);
    var titleFontSize = geometry.titleFontSize;
    var descriptionFontSize = geometry.descFontSize;
    var qrCodeSize = geometry.qrSize;
    // Calculate how many pages we need
    var labelsPerPage = rows * columns;
    var pageCount = Math.ceil(items.length / labelsPerPage);
    // Labels never carry a footer (no page numbers / registration line) — every
    // millimetre of the stock is for the label content. Multi-up sheets centre
    // their grid on the letter page; a single label fills its label-sized page
    // edge-to-edge (no margins).
    var horizontalMargin = isMultiUp
        ? (pageWidth - columns * effectiveLabelWidthPt) / 2
        : 0;
    var verticalMargin = isMultiUp
        ? (pageHeight - rows * effectiveLabelHeightPt) / 2
        : 0;
    return (<renderer_1.Document>
      {Array.from({ length: pageCount }).map(function (_, pageIndex) { return (<renderer_1.Page key={pageIndex} size={[pageWidth, pageHeight]} style={tw("p-0")}>
          {Array.from({ length: rows }).map(function (_, rowIndex) { return (<renderer_1.View key={"row-".concat(rowIndex)} style={{
                    flexDirection: "row",
                    marginLeft: horizontalMargin,
                    marginTop: rowIndex === 0 ? verticalMargin : 0
                }}>
              {Array.from({ length: columns }).map(function (_, colIndex) {
                    var itemIndex = pageIndex * labelsPerPage + rowIndex * columns + colIndex;
                    var item = items[itemIndex];
                    if (!item)
                        return (<renderer_1.View key={"empty-".concat(colIndex)} style={{ width: labelWidthPt, height: labelHeightPt }}/>);
                    var data = {
                        item: item,
                        company: company,
                        logo: logo,
                        theme: resolved.theme,
                        vars: (0, trackingLabel_1.buildLabelVars)(item, company),
                        titleFontSize: titleFontSize,
                        descriptionFontSize: descriptionFontSize,
                        qrCodeSize: qrCodeSize,
                        labelColWidth: labelWidthPt * 0.26,
                        labelHeightPt: effectiveLabelHeightPt,
                        sections: sections
                    };
                    var renderBlock = function (block) {
                        var render = trackingLabel_1.trackingLabelBlockRegistry[block.type];
                        if (!render)
                            return null;
                        return (<react_1.Fragment key={block.id}>
                      {render({ block: block, data: data })}
                    </react_1.Fragment>);
                    };
                    // Slots: fields stack top-left; logo + "right" codes top-right;
                    // "full" codes span full width near the bottom; entity id at the
                    // very bottom.
                    var rightBlocks = visibleBlocks.filter(function (b) {
                        return b.type === "labelLogo" ||
                            (b.type === "labelBarcode" && b.placement === "right");
                    });
                    var barcodeBlocks = visibleBlocks.filter(function (b) {
                        return b.type === "labelBarcode" &&
                            (b.placement === "full" || b.placement === "center");
                    });
                    var entityBlocks = visibleBlocks.filter(function (b) { return b.type === "labelEntityId"; });
                    var textBlocks = visibleBlocks.filter(function (b) {
                        return b.type !== "labelLogo" &&
                            b.type !== "labelBarcode" &&
                            b.type !== "labelEntityId";
                    });
                    return (<renderer_1.View key={"label-".concat(itemIndex)} style={__assign(__assign({}, tw("relative p-2 flex flex-col pl-[10pt]")), { width: labelWidthPt, height: labelHeightPt, 
                            // Clip so a dense label's content can't bleed into the
                            // neighbouring cell (which clipped the next heading).
                            overflow: "hidden", transform: rotated ? "rotate(90deg)" : undefined })} wrap={false}>
                    <renderer_1.View style={__assign(__assign({}, tw("flex flex-row justify-between")), { flexShrink: 0 })}>
                      <renderer_1.View style={__assign(__assign({}, tw("flex flex-col justify-start pr-2")), { flex: 1, minWidth: 0 })}>
                        {textBlocks.map(renderBlock)}
                      </renderer_1.View>
                      {rightBlocks.length > 0 && (<renderer_1.View style={__assign(__assign({}, tw("flex flex-col items-end justify-start")), { flexShrink: 0 })}>
                          {rightBlocks.map(renderBlock)}
                        </renderer_1.View>)}
                    </renderer_1.View>
                    {barcodeBlocks.map(renderBlock)}
                    {entityBlocks.map(renderBlock)}
                  </renderer_1.View>);
                })}
            </renderer_1.View>); })}
        </renderer_1.Page>); })}
    </renderer_1.Document>);
};
exports.default = ProductLabelPDF;
