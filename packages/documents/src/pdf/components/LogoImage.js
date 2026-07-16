"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoImage = LogoImage;
var renderer_1 = require("@react-pdf/renderer");
/**
 * Renders a logo at a fixed height, optionally cropped. With a crop, it draws a
 * clip box sized to the crop's stored pixel aspect and blows the image up so the
 * cropped region fills it — `overflow: hidden` clips the rest. No intrinsic
 * image dimensions are needed at render time. Shared by the document header and
 * the tracking-label logo block so both crop identically.
 */
function LogoImage(_a) {
    var src = _a.src, height = _a.height, crop = _a.crop, marginRight = _a.marginRight;
    if (!crop) {
        return (<renderer_1.Image src={src} style={{ height: height, width: "auto", objectFit: "contain", marginRight: marginRight }}/>);
    }
    var boxH = height;
    var boxW = height * crop.aspect;
    return (<renderer_1.View style={{
            width: boxW,
            height: boxH,
            overflow: "hidden",
            position: "relative",
            marginRight: marginRight
        }}>
      <renderer_1.Image src={src} style={{
            position: "absolute",
            width: boxW / crop.width,
            height: boxH / crop.height,
            left: -(crop.x / crop.width) * boxW,
            top: -(crop.y / crop.height) * boxH
        }}/>
    </renderer_1.View>);
}
