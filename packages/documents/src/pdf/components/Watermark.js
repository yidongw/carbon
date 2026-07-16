"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watermark = Watermark;
var renderer_1 = require("@react-pdf/renderer");
/**
 * Faint, page-fixed company watermark behind the document. Renders nothing when
 * disabled or when no watermark logo is set. Shared by every document that
 * supports a watermark.
 */
function Watermark(_a) {
    var src = _a.src, show = _a.show, _b = _a.opacity, opacity = _b === void 0 ? 0.07 : _b, _c = _a.placement, placement = _c === void 0 ? "center" : _c, _d = _a.size, size = _d === void 0 ? 50 : _d;
    if (!show || !src)
        return null;
    var justifyContent = placement === "top"
        ? "flex-start"
        : placement === "bottom"
            ? "flex-end"
            : "center";
    return (<renderer_1.View fixed style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: justifyContent,
            padding: 64,
            opacity: opacity
        }}>
      <renderer_1.Image src={src} style={{ width: "".concat(size, "%") }}/>
    </renderer_1.View>);
}
