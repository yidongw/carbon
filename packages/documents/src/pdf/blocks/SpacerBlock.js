"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacerBlock = SpacerBlock;
var renderer_1 = require("@react-pdf/renderer");
/**
 * Structural spacing block. Uses explicit style objects (not Tailwind arbitrary
 * values like `h-[1px]`, which react-pdf-tailwind can silently drop) so every
 * variant renders deterministically.
 */
function SpacerBlock(_a) {
    var _b;
    var block = _a.block;
    switch (block.variant) {
        case "divider":
            return (<renderer_1.View style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#e5e7eb",
                    borderBottomStyle: "solid",
                    marginVertical: 12
                }}/>);
        case "pageBreak":
            return <renderer_1.View break/>;
        default:
            return <renderer_1.View style={{ height: (_b = block.size) !== null && _b !== void 0 ? _b : 16 }}/>;
    }
}
