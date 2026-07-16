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
exports.buildInspectionDocumentPdfWithOverlaysBytes = buildInspectionDocumentPdfWithOverlaysBytes;
var pdf_lib_1 = require("pdf-lib");
var react_pdf_1 = require("react-pdf");
var CALLOUT_STROKE = "#f97316";
function liangBarskySegmentRect(x0, y0, x1, y1, minX, minY, maxX, maxY) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var u0 = 0;
    var u1 = 1;
    var p = [-dx, dx, -dy, dy];
    var q = [x0 - minX, maxX - x0, y0 - minY, maxY - y0];
    for (var i = 0; i < 4; i += 1) {
        if (Math.abs(p[i]) < 1e-12) {
            if (q[i] < 0)
                return null;
        }
        else {
            var r = q[i] / p[i];
            if (p[i] < 0) {
                u0 = Math.max(u0, r);
            }
            else {
                u1 = Math.min(u1, r);
            }
            if (u0 > u1)
                return null;
        }
    }
    return { u0: u0, u1: u1 };
}
function clippedBalloonToAnchorLine(bx, by, radiusPx, ax, ay, rect) {
    var L = Math.hypot(ax - bx, ay - by);
    if (L < 1e-6)
        return null;
    var epsU = Math.max(1e-4, 2 / L);
    var uBalloonExit = Math.min(1 - epsU, radiusPx / L + epsU);
    var x = rect.x, y = rect.y, w = rect.w, h = rect.h;
    var hit = liangBarskySegmentRect(bx, by, ax, ay, x, y, x + w, y + h);
    var uEnd = 1 - epsU;
    if (hit) {
        var uEnter = Math.max(0, Math.min(1, hit.u0));
        if (uEnter > uBalloonExit) {
            uEnd = Math.min(uEnd, uEnter - epsU);
        }
    }
    if (uEnd <= uBalloonExit + 1e-4)
        return null;
    var x0 = bx + (ax - bx) * uBalloonExit;
    var y0 = by + (ay - by) * uBalloonExit;
    var x1 = bx + (ax - bx) * uEnd;
    var y1 = by + (ay - by) * uEnd;
    return [x0, y0, x1, y1];
}
function drawMarkupOnPageCanvas(ctx, cw, ch, pageNumber, featureRows, anchorRects) {
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (var _i = 0, anchorRects_1 = anchorRects; _i < anchorRects_1.length; _i++) {
        var s = anchorRects_1[_i];
        if (s.pageNumber !== pageNumber)
            continue;
        var sx = (s.x / 100) * cw;
        var sy = (s.y / 100) * ch;
        var sw = (s.width / 100) * cw;
        var sh = (s.height / 100) * ch;
        ctx.strokeStyle = CALLOUT_STROKE;
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, sy, sw, sh);
    }
    var _loop_1 = function (b) {
        if (b.pageNumber !== pageNumber)
            return "continue";
        var bw = (b.width / 100) * cw;
        var bh = (b.height / 100) * ch;
        var balloonX = (b.x / 100) * cw;
        var balloonY = (b.y / 100) * ch;
        var balloonCenterX = balloonX + bw / 2;
        var balloonCenterY = balloonY + bh / 2;
        var radius = Math.max(8, Math.min(bw, bh) / 2);
        var balloonLabelFontSize = Math.max(14, Math.min(26, Math.round(radius * 1.15)));
        var linkedSelector = anchorRects.find(function (s) { return s.id === b.balloonAnchorId; });
        var linePoints = null;
        if (linkedSelector) {
            var sx = (linkedSelector.x / 100) * cw;
            var sy = (linkedSelector.y / 100) * ch;
            var sw = (linkedSelector.width / 100) * cw;
            var sh = (linkedSelector.height / 100) * ch;
            var anchorX = sx + sw / 2;
            var anchorY = sy + sh / 2;
            linePoints = clippedBalloonToAnchorLine(balloonCenterX, balloonCenterY, radius, anchorX, anchorY, { x: sx, y: sy, w: sw, h: sh });
        }
        if (linePoints) {
            ctx.beginPath();
            ctx.strokeStyle = CALLOUT_STROKE;
            ctx.lineWidth = 2;
            ctx.moveTo(linePoints[0], linePoints[1]);
            ctx.lineTo(linePoints[2], linePoints[3]);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(balloonCenterX, balloonCenterY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = CALLOUT_STROKE;
        ctx.lineWidth = 2;
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.stroke();
        ctx.font = "bold ".concat(balloonLabelFontSize, "px ui-sans-serif, system-ui, sans-serif");
        ctx.fillStyle = CALLOUT_STROKE;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.label, balloonCenterX, balloonCenterY);
    };
    for (var _a = 0, featureRows_1 = featureRows; _a < featureRows_1.length; _a++) {
        var b = featureRows_1[_a];
        _loop_1(b);
    }
    ctx.restore();
}
/**
 * Rasterizes each PDF page with anchor + balloon markup (matching the Konva overlay) and builds a new PDF.
 */
function buildInspectionDocumentPdfWithOverlaysBytes(args) {
    return __awaiter(this, void 0, void 0, function () {
        var scale, data, pdf, outDoc, numPages, _loop_2, pageNum;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    scale = (_a = args.scale) !== null && _a !== void 0 ? _a : 2;
                    data = new Uint8Array(args.pdfBytes);
                    return [4 /*yield*/, react_pdf_1.pdfjs.getDocument({ data: data }).promise];
                case 1:
                    pdf = _b.sent();
                    return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                case 2:
                    outDoc = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 9, 11]);
                    numPages = pdf.numPages;
                    _loop_2 = function (pageNum) {
                        var page, viewport, cw, ch, canvas, ctx, renderTask, blob, pngBytes, _c, image, pdfPage;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, pdf.getPage(pageNum)];
                                case 1:
                                    page = _d.sent();
                                    viewport = page.getViewport({ scale: scale });
                                    cw = Math.floor(viewport.width);
                                    ch = Math.floor(viewport.height);
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
                                case 2:
                                    _d.sent();
                                    drawMarkupOnPageCanvas(ctx, cw, ch, pageNum, args.featureRows, args.anchorRects);
                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            canvas.toBlob(function (b) {
                                                if (b)
                                                    resolve(b);
                                                else
                                                    reject(new Error("Canvas toBlob failed"));
                                            }, "image/png");
                                        })];
                                case 3:
                                    blob = _d.sent();
                                    _c = Uint8Array.bind;
                                    return [4 /*yield*/, blob.arrayBuffer()];
                                case 4:
                                    pngBytes = new (_c.apply(Uint8Array, [void 0, _d.sent()]))();
                                    return [4 /*yield*/, outDoc.embedPng(pngBytes)];
                                case 5:
                                    image = _d.sent();
                                    pdfPage = outDoc.addPage([cw, ch]);
                                    pdfPage.drawImage(image, {
                                        x: 0,
                                        y: 0,
                                        width: cw,
                                        height: ch
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    pageNum = 1;
                    _b.label = 4;
                case 4:
                    if (!(pageNum <= numPages)) return [3 /*break*/, 7];
                    return [5 /*yield**/, _loop_2(pageNum)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    pageNum += 1;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, outDoc.save({ useObjectStreams: true })];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: return [4 /*yield*/, pdf.destroy()];
                case 10:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
