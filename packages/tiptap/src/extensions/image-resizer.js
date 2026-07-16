"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageResizer = void 0;
var react_1 = require("@tiptap/react");
var react_moveable_1 = require("react-moveable");
var ImageResizer = function () {
    var editor = (0, react_1.useCurrentEditor)().editor;
    if (!(editor === null || editor === void 0 ? void 0 : editor.isActive("image")))
        return null;
    var updateMediaSize = function () {
        var imageInfo = document.querySelector(".ProseMirror-selectednode");
        if (imageInfo) {
            var selection = editor.state.selection;
            var setImage = editor.commands.setImage;
            setImage({
                src: imageInfo.src,
                width: Number(imageInfo.style.width.replace("px", "")),
                height: Number(imageInfo.style.height.replace("px", ""))
            });
            editor.commands.setNodeSelection(selection.from);
        }
    };
    return (<react_moveable_1.default target={document.querySelector(".ProseMirror-selectednode")} container={null} origin={false} 
    /* Resize event edges */
    edge={false} throttleDrag={0} 
    /* When resize or scale, keeps a ratio of the width, height. */
    keepRatio={true} 
    /* resizable*/
    /* Only one of resizable, scalable, warpable can be used. */
    resizable={true} throttleResize={0} onResize={function (_a) {
            var target = _a.target, width = _a.width, height = _a.height, 
            // dist,
            delta = _a.delta;
            if (delta[0])
                target.style.width = "".concat(width, "px");
            if (delta[1])
                target.style.height = "".concat(height, "px");
        }} 
    // { target, isDrag, clientX, clientY }: any
    onResizeEnd={function () {
            updateMediaSize();
        }} 
    /* scalable */
    /* Only one of resizable, scalable, warpable can be used. */
    scalable={true} throttleScale={0} 
    /* Set the direction of resizable */
    renderDirections={["w", "e"]} onScale={function (_a) {
            var target = _a.target, 
            // scale,
            // dist,
            // delta,
            transform = _a.transform;
            target.style.transform = transform;
        }}/>);
};
exports.ImageResizer = ImageResizer;
