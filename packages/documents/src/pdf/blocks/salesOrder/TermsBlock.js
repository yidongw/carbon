"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsBlock = TermsBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var resolveTerms_1 = require("../resolveTerms");
var tw_1 = require("../tw");
function TermsBlock(_a) {
    var block = _a.block, data = _a.data;
    var tw = (0, tw_1.useTw)();
    var theme = data.theme, vars = data.vars;
    var terms = (0, resolveTerms_1.resolveTerms)(block, data.terms, vars);
    if (!(0, resolveTerms_1.hasContent)(terms))
        return null;
    return (<renderer_1.View break>
      <renderer_1.View style={tw("border-b border-gray-400 mb-3 pb-2 mt-2")}>
        <renderer_1.Text style={[
            tw("text-[14px] font-bold uppercase tracking-wide"),
            { color: theme.accent }
        ]}>
          Terms & Conditions
        </renderer_1.Text>
      </renderer_1.View>
      <components_1.Note content={terms}/>
    </renderer_1.View>);
}
