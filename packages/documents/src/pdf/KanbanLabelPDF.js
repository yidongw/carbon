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
var react_pdf_tailwind_1 = require("react-pdf-tailwind");
var qr_code_1 = require("../qr/qr-code");
var Footer_1 = require("./components/Footer");
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
var KanbanLabelPDF = function (_a) {
    var baseUrl = _a.baseUrl, labels = _a.labels, _b = _a.action, action = _b === void 0 ? "order" : _b;
    // Fixed 2x3 layout (6 labels per page)
    var rows = 3;
    var columns = 2;
    // Standard letter size paper (8.5 x 11 inches in points)
    var LETTER_WIDTH = 8.5 * 72;
    var LETTER_HEIGHT = 11 * 72;
    // Reserve space for the footer (page number) at the bottom
    var footerHeight = 35;
    // Calculate label dimensions for 2x3 layout with margins
    var margin = 36; // 0.5 inch margins
    var labelWidth = (LETTER_WIDTH - 2 * margin) / columns;
    var labelHeight = (LETTER_HEIGHT - 2 * margin - footerHeight) / rows;
    // Calculate how many pages we need
    var labelsPerPage = rows * columns;
    var pageCount = Math.ceil(labels.length / labelsPerPage);
    // QR code size - make it prominent
    var qrCodeSize = Math.min(labelHeight * 0.35, labelWidth * 0.4);
    // QR code color based on action type
    var getQRColor = function () {
        if (action === "start")
            return "059669"; // emerald-600
        if (action === "complete")
            return "2563eb"; // blue-600
        return "000000"; // black for order
    };
    // Get appropriate API endpoint based on action
    var getKanbanUrl = function (labelId) {
        if (action === "start")
            return "".concat(baseUrl, "/api/kanban/start/").concat(labelId);
        if (action === "complete")
            return "".concat(baseUrl, "/api/kanban/complete/").concat(labelId);
        return "".concat(baseUrl, "/api/kanban/").concat(labelId);
    };
    return (<renderer_1.Document>
      {Array.from({ length: pageCount }).map(function (_, pageIndex) { return (<renderer_1.Page key={pageIndex} size={[LETTER_WIDTH, LETTER_HEIGHT]} style={tw("p-0")}>
          <renderer_1.View style={{ margin: margin }}>
            {Array.from({ length: rows }).map(function (_, rowIndex) { return (<renderer_1.View key={"row-".concat(rowIndex)} style={{
                    flexDirection: "row"
                }} wrap={false}>
                {Array.from({ length: columns }).map(function (_, colIndex) {
                    var itemIndex = pageIndex * labelsPerPage + rowIndex * columns + colIndex;
                    var label = labels[itemIndex];
                    if (!label)
                        return (<renderer_1.View key={"empty-".concat(colIndex)} style={{ width: labelWidth, height: labelHeight }}/>);
                    return (<renderer_1.View key={"label-".concat(itemIndex)} style={__assign(__assign({}, tw("relative p-4 flex flex-col border border-gray-300")), { width: labelWidth, height: labelHeight })}>
                      {/* QR Code and Thumbnail row */}
                      <renderer_1.View style={tw("flex flex-row items-center justify-center mb-3")}>
                        {/* QR Code */}
                        <renderer_1.Image src={(0, qr_code_1.generateQRCode)(getKanbanUrl(label.id), qrCodeSize / 72, getQRColor())} style={{
                            width: qrCodeSize,
                            height: qrCodeSize,
                            objectFit: "contain"
                        }}/>

                        {/* Thumbnail if available */}
                        {label.thumbnail && (<renderer_1.Image src={label.thumbnail} style={{
                                width: qrCodeSize,
                                height: qrCodeSize,
                                objectFit: "contain",
                                marginLeft: 8
                            }}/>)}
                      </renderer_1.View>

                      {/* Item Information */}
                      <renderer_1.View style={tw("flex-1 flex flex-col justify-center")}>
                        {/* Item Name - Main Title */}
                        <renderer_1.Text style={__assign(__assign({}, tw("text-center mb-2")), { fontSize: "14pt", fontWeight: "bold" })}>
                          {label.itemName}
                        </renderer_1.Text>

                        {/* Item ID */}
                        <renderer_1.Text style={__assign(__assign({}, tw("text-center mb-1")), { fontSize: "10pt" })}>
                          {label.itemReadableId}
                        </renderer_1.Text>

                        {/* Location and Storage Unit */}
                        <renderer_1.View style={tw("border-t border-gray-300 pt-2 mt-2 flex flex-col items-center text-center text-[14pt]")}>
                          {label.storageUnitName ? (<renderer_1.Text>{label.storageUnitName}</renderer_1.Text>) : (<renderer_1.Text>{label.locationName}</renderer_1.Text>)}
                        </renderer_1.View>

                        {/* Quantity */}
                        <renderer_1.View style={tw("border-t border-gray-300 pt-2 mt-2 flex items-center")}>
                          <renderer_1.Text style={__assign(__assign({}, tw("text-center")), { fontSize: "16pt", fontWeight: "bold" })}>
                            QTY: {label.quantity}
                            {label.unitOfMeasureCode
                            ? " ".concat(label.unitOfMeasureCode)
                            : ""}
                          </renderer_1.Text>
                        </renderer_1.View>
                      </renderer_1.View>

                      {/* Kanban ID at bottom */}
                      <renderer_1.Text style={__assign(__assign({}, tw("text-center")), { fontSize: "12pt", color: "#7d7d7d" })}>
                        {label.supplierName}
                      </renderer_1.Text>
                    </renderer_1.View>);
                })}
              </renderer_1.View>); })}
          </renderer_1.View>
          <Footer_1.default />
        </renderer_1.Page>); })}
    </renderer_1.Document>);
};
exports.default = KanbanLabelPDF;
