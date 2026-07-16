"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesBlock = NotesBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("./tw");
/** Job notes (rich text). Renders nothing when there are no notes. */
function NotesBlock(_a) {
    var data = _a.data;
    if (!data.notes)
        return null;
    return (<renderer_1.View style={(0, tw_1.tw)("mb-6")}>
      <components_1.Note title="Job Notes" content={data.notes}/>
    </renderer_1.View>);
}
