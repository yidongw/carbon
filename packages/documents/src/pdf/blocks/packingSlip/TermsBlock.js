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
    var terms = (0, resolveTerms_1.resolveTerms)(block, data.terms, data.vars);
    if (!(0, resolveTerms_1.hasContent)(terms))
        return null;
    return (<renderer_1.View style={tw("w-full")}>
      <components_1.Note title="Standard Terms & Conditions" content={terms}/>
    </renderer_1.View>);
}
