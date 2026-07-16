"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("@react-pdf/renderer");
var react_pdf_tailwind_1 = require("react-pdf-tailwind");
var Note_1 = require("./Note");
var tw = (0, react_pdf_tailwind_1.createTw)({
    theme: {
        fontFamily: {
            sans: ["Helvetica", "Arial", "sans-serif"]
        }
    }
});
var Footer = function (_a) {
    var label = _a.label, documentId = _a.documentId, content = _a.content, _b = _a.showPageNumbers, showPageNumbers = _b === void 0 ? true : _b, _c = _a.pageNumberFormat, pageNumberFormat = _c === void 0 ? "pageOfTotal" : _c, _d = _a.showRegistrationLine, showRegistrationLine = _d === void 0 ? true : _d;
    var hasContent = content &&
        typeof content === "object" &&
        Array.isArray(content.content) &&
        content.content.length > 0;
    return (<renderer_1.View style={[
            tw("absolute bottom-0 left-0 right-0 pb-5"),
            { paddingLeft: 16, paddingRight: 16 }
        ]} fixed>
      {hasContent && (<renderer_1.View style={tw("text-[8px] text-gray-500 mb-2 px-1")}>
          <Note_1.default content={content}/>
        </renderer_1.View>)}
      <renderer_1.View style={tw("border-t border-gray-200 pt-3")}>
        <renderer_1.View style={tw("flex flex-row justify-between items-center text-xs text-gray-500 px-1")}>
          <renderer_1.Text>{showRegistrationLine ? (label !== null && label !== void 0 ? label : "") : ""}</renderer_1.Text>
          {showPageNumbers && (<renderer_1.Text render={function (_a) {
                var pageNumber = _a.pageNumber, totalPages = _a.totalPages;
                return "".concat(documentId ? "".concat(documentId, "   ") : "", "Page ").concat(pageNumber).concat(pageNumberFormat === "pageOfTotal" ? " of ".concat(totalPages) : "");
            }}/>)}
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
};
exports.default = Footer;
