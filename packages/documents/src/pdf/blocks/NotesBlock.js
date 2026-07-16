"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesBlock = NotesBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../components");
var tw_1 = require("./tw");
function NotesBlock(_a) {
    var _b, _c;
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var salesInvoice = data.salesInvoice;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("p-3")}>
        <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
          Notes
        </renderer_1.Text>
        <renderer_1.View style={tw("text-[9px] text-gray-800")}>
          {Object.keys((_b = salesInvoice === null || salesInvoice === void 0 ? void 0 : salesInvoice.externalNotes) !== null && _b !== void 0 ? _b : {}).length > 0 ? (<components_1.Note content={((_c = salesInvoice.externalNotes) !== null && _c !== void 0 ? _c : {})}/>) : (<renderer_1.Text style={tw("text-gray-400")}>None</renderer_1.Text>)}
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
