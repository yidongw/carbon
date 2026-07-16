"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoCropper = LogoCropper;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var FULL = { x: 0, y: 0, width: 1, height: 1, aspect: 1 };
var clamp01 = function (n) { return Math.min(1, Math.max(0, n)); };
/**
 * Logo crop field: a compact preview + buttons. The actual drag-to-crop canvas
 * lives in a dialog (kept out of the cramped config panels) so the source logo
 * never blows the surrounding form open. Emits a crop rectangle normalized to
 * the source image (0..1) plus the cropped region's pixel aspect ratio, so the
 * PDF/ZPL renderers can size a clip box without loading the image.
 */
function LogoCropper(_a) {
    var src = _a.src, crop = _a.crop, onChange = _a.onChange;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    return (<div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Crop</span>
        <div className="flex items-center gap-1">
          {crop && (<react_1.Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={function () { return onChange(undefined); }}>
              Reset
            </react_1.Button>)}
          <react_1.Button variant="secondary" size="sm" className="h-6 px-2 text-xs" onClick={function () { return setOpen(true); }}>
            {crop ? "Edit crop" : "Crop"}
          </react_1.Button>
        </div>
      </div>
      <button type="button" onClick={function () { return setOpen(true); }} className="flex h-16 items-center justify-center overflow-hidden rounded-md border bg-white p-1">
        <img src={src} alt="" className="max-h-full w-auto"/>
      </button>
      {open && (<CropDialog src={src} crop={crop} onChange={onChange} onClose={function () { return setOpen(false); }}/>)}
    </div>);
}
/** The drag-to-crop canvas, in a dialog. Live-updates the crop as you drag. */
function CropDialog(_a) {
    var src = _a.src, crop = _a.crop, onChange = _a.onChange, onClose = _a.onClose;
    var boxRef = (0, react_2.useRef)(null);
    var natural = (0, react_2.useRef)({ w: 1, h: 1 });
    var drag = (0, react_2.useRef)(null);
    var _b = (0, react_2.useState)(false), active = _b[0], setActive = _b[1];
    var c = crop !== null && crop !== void 0 ? crop : FULL;
    var aspectOf = (0, react_2.useCallback)(function (width, height) {
        var _a = natural.current, w = _a.w, h = _a.h;
        return (width * w) / (height * h) || 1;
    }, []);
    var onPointerMove = (0, react_2.useCallback)(function (e) {
        var _a;
        var d = drag.current;
        var rect = (_a = boxRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (!d || !rect)
            return;
        var dx = (e.clientX - d.startX) / rect.width;
        var dy = (e.clientY - d.startY) / rect.height;
        var next;
        if (d.mode === "move") {
            var x = clamp01(d.start.x + dx);
            var y = clamp01(d.start.y + dy);
            next = __assign(__assign({}, d.start), { x: Math.min(x, 1 - d.start.width), y: Math.min(y, 1 - d.start.height) });
        }
        else {
            var width = clamp01(d.start.width + dx) || 0.05;
            var height = clamp01(d.start.height + dy) || 0.05;
            var w = Math.max(0.05, Math.min(width, 1 - d.start.x));
            var h = Math.max(0.05, Math.min(height, 1 - d.start.y));
            next = __assign(__assign({}, d.start), { width: w, height: h, aspect: aspectOf(w, h) });
        }
        onChange(next);
    }, [aspectOf, onChange]);
    var endDrag = (0, react_2.useCallback)(function () {
        drag.current = null;
        setActive(false);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", endDrag);
    }, [onPointerMove]);
    var startDrag = (0, react_2.useCallback)(function (mode) { return function (e) {
        e.preventDefault();
        e.stopPropagation();
        drag.current = {
            mode: mode,
            startX: e.clientX,
            startY: e.clientY,
            start: crop !== null && crop !== void 0 ? crop : __assign(__assign({}, FULL), { aspect: aspectOf(1, 1) })
        };
        setActive(true);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", endDrag);
    }; }, [aspectOf, crop, endDrag, onPointerMove]);
    return (<react_1.Modal open onOpenChange={function (o) { return !o && onClose(); }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>Crop logo</react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <p className="mb-3 text-sm text-muted-foreground">
            Drag the box to move it, drag the bottom-right handle to resize.
          </p>
          <div className="flex justify-center">
            <div ref={boxRef} className="relative inline-block max-h-[55vh] select-none overflow-hidden rounded-md border bg-white" style={{ touchAction: "none" }}>
              <img src={src} alt="" draggable={false} className="pointer-events-none block max-h-[55vh] w-auto" onLoad={function (e) {
            natural.current = {
                w: e.currentTarget.naturalWidth || 1,
                h: e.currentTarget.naturalHeight || 1
            };
        }}/>
              <div onPointerDown={startDrag("move")} className="absolute cursor-move border-2 border-white" style={{
            left: "".concat(c.x * 100, "%"),
            top: "".concat(c.y * 100, "%"),
            width: "".concat(c.width * 100, "%"),
            height: "".concat(c.height * 100, "%"),
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
            outline: active ? "1px solid #fff" : undefined
        }}>
                <div onPointerDown={startDrag("resize")} className="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-se-resize rounded-sm border-2 border-white bg-foreground"/>
              </div>
            </div>
          </div>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={function () {
            onChange(undefined);
        }}>
            Reset
          </react_1.Button>
          <react_1.Button onClick={onClose}>Done</react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
