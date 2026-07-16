"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedBlock = SharedBlock;
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../template");
var components_1 = require("../components");
var tw_1 = require("./tw");
/** Extension block — doc-agnostic. Takes resolved sections + merge `vars`. */
function SharedBlock(_a) {
    var block = _a.block, sections = _a.sections, vars = _a.vars;
    var tw = (0, tw_1.useTw)();
    var section = sections[block.sectionId];
    if (!section)
        return null;
    var hasContent = section.content &&
        typeof section.content === "object" &&
        Array.isArray(section.content.content) &&
        section.content.content.length > 0;
    if (!hasContent)
        return null;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("p-3")}>
        <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
          {section.name}
        </renderer_1.Text>
        <renderer_1.View style={tw("text-[9px] text-gray-800")}>
          <components_1.Note content={(0, template_1.interpolateContent)(section.content, vars)}/>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
