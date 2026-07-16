"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("@react-pdf/renderer");
var labelGeometry_1 = require("./components/labelGeometry");
/**
 * Renders one page per storage unit, each page exactly the label size,
 * matching the ZPL generator: the unit name vertically centered at the
 * left margin.
 */
var StorageUnitLabelPDF = function (_a) {
    var items = _a.items, labelSize = _a.labelSize;
    var g = (0, labelGeometry_1.getLabelPdfGeometry)(labelSize);
    var titleFontSize = (40 / 25) * g.titleFontSize;
    return (<renderer_1.Document>
      {items.map(function (item) { return (<renderer_1.Page key={item.id} size={[g.pageWidth, g.pageHeight]}>
          <renderer_1.View style={{
                flex: 1,
                justifyContent: "center",
                paddingLeft: g.margin,
                paddingRight: g.margin
            }}>
            <renderer_1.Text style={{
                fontSize: titleFontSize,
                fontFamily: "Helvetica-Bold"
            }}>
              {item.name}
            </renderer_1.Text>
          </renderer_1.View>
        </renderer_1.Page>); })}
    </renderer_1.Document>);
};
exports.default = StorageUnitLabelPDF;
