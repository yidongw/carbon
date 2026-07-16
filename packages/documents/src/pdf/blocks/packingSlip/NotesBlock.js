"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesBlock = NotesBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("../tw");
function NotesBlock(_a) {
    var _b, _c;
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var notes = ((_c = (_b = data.shipment) === null || _b === void 0 ? void 0 : _b.externalNotes) !== null && _c !== void 0 ? _c : {});
    if (Object.keys(notes).length === 0)
        return null;
    return (<renderer_1.View style={tw("mb-3 w-full")}>
      <components_1.Note title="Notes" content={notes}/>
    </renderer_1.View>);
}
