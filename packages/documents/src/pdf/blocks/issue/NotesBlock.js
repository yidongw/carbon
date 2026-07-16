"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesBlock = NotesBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("../tw");
/** Description of the issue (rich text). Renders nothing when empty. */
function NotesBlock(_a) {
    var _b;
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var nonConformance = data.nonConformance;
    if (Object.keys((_b = nonConformance.content) !== null && _b !== void 0 ? _b : {}).length === 0)
        return null;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("p-3")}>
        <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
          Description of Issue
        </renderer_1.Text>
        <renderer_1.View style={tw("mt-1")}>
          <components_1.Note content={nonConformance.content}/>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
