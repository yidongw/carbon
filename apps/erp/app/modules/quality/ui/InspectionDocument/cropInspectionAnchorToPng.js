"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cropInspectionAnchorToPngBlob = cropInspectionAnchorToPngBlob;
var react_pdf_1 = require("react-pdf");
/** Extra resolution for vision / OCR vs on-screen PDF preview. */
var VISION_RENDER_SCALE = 1.75;
/** Cap raster width so very large displays do not allocate huge canvases. */
var MAX_VISION_RASTER_WIDTH_PX = 4096;
/** Pad crop by this fraction of max(width,height) on each side (percent space). */
var CROP_PAD_FRAC = 0.1;
var CROP_PAD_MAX_PCT = 4;
var CROP_PAD_MIN_PCT = 0.3;
/** Minimum crop width/height in percent-of-page so tiny boxes stay readable. */
var CROP_MIN_SIZE_PCT = 2.5;
/**
 * Expands the anchor rect with padding, enforces a minimum size, and clamps to the page (0–100 %).
 */
function prepareVisionCropRect(x, y, width, height) {
    var w0 = Math.max(1e-6, width);
    var h0 = Math.max(1e-6, height);
    var mx = Math.max(w0, h0);
    var pad = Math.min(CROP_PAD_MAX_PCT, Math.max(CROP_PAD_MIN_PCT, CROP_PAD_FRAC * mx));
    var cx = x + w0 / 2;
    var cy = y + h0 / 2;
    var w = w0 + 2 * pad;
    var h = h0 + 2 * pad;
    w = Math.max(w, CROP_MIN_SIZE_PCT);
    h = Math.max(h, CROP_MIN_SIZE_PCT);
    w = Math.min(w, 100);
    h = Math.min(h, 100);
    var nx = cx - w / 2;
    var ny = cy - h / 2;
    nx = Math.max(0, Math.min(nx, 100 - w));
    ny = Math.max(0, Math.min(ny, 100 - h));
    return { x: nx, y: ny, width: w, height: h };
}
/**
 * Renders one PDF page at higher resolution than the editor preview, then crops the (padded, min-sized) anchor rectangle to PNG.
 */
function cropInspectionAnchorToPngBlob(args) {
    return __awaiter(this, void 0, void 0, function () {
        var pdfBytes, pageNumber, x, y, width, height, renderedPageWidthPx, _a, rx, ry, rw, rh, data, pdf, page, baseVp, targetWidth, scale, viewport, cw, ch, canvas, ctx, renderTask, sx, sy, sw, sh, sx2, sy2, sw2, sh2, crop_1, cctx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pdfBytes = args.pdfBytes, pageNumber = args.pageNumber, x = args.x, y = args.y, width = args.width, height = args.height, renderedPageWidthPx = args.renderedPageWidthPx;
                    _a = prepareVisionCropRect(x, y, width, height), rx = _a.x, ry = _a.y, rw = _a.width, rh = _a.height;
                    data = new Uint8Array(pdfBytes);
                    return [4 /*yield*/, react_pdf_1.pdfjs.getDocument({ data: data }).promise];
                case 1:
                    pdf = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 6, 8]);
                    return [4 /*yield*/, pdf.getPage(pageNumber)];
                case 3:
                    page = _b.sent();
                    baseVp = page.getViewport({ scale: 1 });
                    targetWidth = Math.min(Math.max(1, Math.floor(renderedPageWidthPx * VISION_RENDER_SCALE)), MAX_VISION_RASTER_WIDTH_PX);
                    scale = targetWidth / baseVp.width;
                    viewport = page.getViewport({ scale: scale });
                    cw = Math.max(1, Math.floor(viewport.width));
                    ch = Math.max(1, Math.floor(viewport.height));
                    canvas = document.createElement("canvas");
                    canvas.width = cw;
                    canvas.height = ch;
                    ctx = canvas.getContext("2d");
                    if (!ctx) {
                        throw new Error("Could not get canvas context");
                    }
                    renderTask = page.render({
                        canvas: canvas,
                        canvasContext: ctx,
                        viewport: viewport
                    });
                    return [4 /*yield*/, renderTask.promise];
                case 4:
                    _b.sent();
                    sx = Math.floor((rx / 100) * cw);
                    sy = Math.floor((ry / 100) * ch);
                    sw = Math.max(1, Math.floor((rw / 100) * cw));
                    sh = Math.max(1, Math.floor((rh / 100) * ch));
                    sx2 = Math.max(0, Math.min(sx, cw - 1));
                    sy2 = Math.max(0, Math.min(sy, ch - 1));
                    sw2 = Math.max(1, Math.min(sw, cw - sx2));
                    sh2 = Math.max(1, Math.min(sh, ch - sy2));
                    crop_1 = document.createElement("canvas");
                    crop_1.width = sw2;
                    crop_1.height = sh2;
                    cctx = crop_1.getContext("2d");
                    if (!cctx) {
                        throw new Error("Could not get crop canvas context");
                    }
                    cctx.drawImage(canvas, sx2, sy2, sw2, sh2, 0, 0, sw2, sh2);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            crop_1.toBlob(function (b) {
                                if (b)
                                    resolve(b);
                                else
                                    reject(new Error("Canvas toBlob failed"));
                            }, "image/png");
                        })];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [4 /*yield*/, pdf.destroy()];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
