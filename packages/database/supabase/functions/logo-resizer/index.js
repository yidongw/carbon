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
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var magick_wasm_0_0_30_1 = require("npm:@imagemagick/magick-wasm@0.0.30");
var headers_ts_1 = require("../lib/headers.ts");
var wasmBytes = await Deno.readFile(new URL("magick.wasm", import.meta.resolve("npm:@imagemagick/magick-wasm@0.0.30")));
await (0, magick_wasm_0_0_30_1.initializeImageMagick)(wasmBytes);
var HEX = "0123456789ABCDEF";
/**
 * Pack a monochrome RGBA buffer into a ZPL `^GFA` graphic field: rows of 1-bpp
 * pixels (MSB-first, `1` = black), padded to a byte boundary per row, hex-coded.
 */
function rgbaToGFA(rgba, w, h, thresh) {
    if (thresh === void 0) { thresh = 128; }
    var rowBytes = Math.ceil(w / 8);
    var total = rowBytes * h;
    var bytes = new Uint8Array(total);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var i = (y * w + x) * 4;
            var a = rgba[i + 3];
            var lum = a === 0 ? 255 : rgba[i] * 0.299 + rgba[i + 1] * 0.587 + rgba[i + 2] * 0.114;
            if (lum < thresh)
                bytes[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7);
        }
    }
    var hex = "";
    for (var k = 0; k < total; k++) {
        hex += HEX[bytes[k] >> 4] + HEX[bytes[k] & 15];
    }
    return "^GFA,".concat(total, ",").concat(total, ",").concat(rowBytes, ",").concat(hex);
}
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var formData_1, file, widthDots_1, threshold_1, num, cropX_1, cropY_1, cropW_1, cropH_1, hasCrop_1, bytes, _a, monoPng_1, gfa_1, outW_1, outH_1, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, req.formData()];
            case 2:
                formData_1 = _b.sent();
                file = formData_1.get("file");
                widthDots_1 = Math.max(16, Math.min(1200, parseInt(formData_1.get("widthDots") || "240", 10)));
                threshold_1 = parseInt(formData_1.get("threshold") || "50", 10);
                num = function (k) {
                    var v = formData_1.get(k);
                    return v === null ? null : parseFloat(v);
                };
                cropX_1 = num("cropX");
                cropY_1 = num("cropY");
                cropW_1 = num("cropW");
                cropH_1 = num("cropH");
                hasCrop_1 = cropX_1 !== null && cropY_1 !== null && cropW_1 !== null && cropH_1 !== null;
                if (!file)
                    throw new Error("No file provided");
                _a = Uint8Array.bind;
                return [4 /*yield*/, file.arrayBuffer()];
            case 3:
                bytes = new (_a.apply(Uint8Array, [void 0, _b.sent()]))();
                monoPng_1 = "";
                gfa_1 = "";
                outW_1 = 0;
                outH_1 = 0;
                magick_wasm_0_0_30_1.ImageMagick.read(bytes, function (img) {
                    // Crop first (normalized → pixels), so downstream sizing sees the region.
                    if (hasCrop_1) {
                        var px = Math.max(1, Math.round(cropW_1 * img.width));
                        var py = Math.max(1, Math.round(cropH_1 * img.height));
                        img.crop(new magick_wasm_0_0_30_1.MagickGeometry(Math.round(cropX_1 * img.width), Math.round(cropY_1 * img.height), px, py));
                        img.resetPage();
                    }
                    // Flatten transparency onto white so it doesn't threshold to black.
                    img.backgroundColor = new magick_wasm_0_0_30_1.MagickColor("white");
                    img.alpha(magick_wasm_0_0_30_1.AlphaOption.Remove);
                    // Grayscale + threshold → clean 1-bit black & white.
                    img.grayscale();
                    img.threshold(new magick_wasm_0_0_30_1.Percentage(threshold_1));
                    // Scale to the requested dot width (height proportional).
                    img.resize(new magick_wasm_0_0_30_1.MagickGeometry("".concat(widthDots_1)));
                    outW_1 = img.width;
                    outH_1 = img.height;
                    // PDF B&W logo.
                    img.format = magick_wasm_0_0_30_1.MagickFormat.Png;
                    img.write(function (data) {
                        var b = "";
                        for (var i = 0; i < data.length; i++)
                            b += String.fromCharCode(data[i]);
                        monoPng_1 = "data:image/png;base64,".concat(btoa(b));
                    });
                    // ZPL graphic.
                    img.getPixels(function (pixels) {
                        var rgba = pixels.toByteArray(0, 0, outW_1, outH_1, "RGBA");
                        if (rgba)
                            gfa_1 = rgbaToGFA(rgba, outW_1, outH_1);
                    });
                });
                return [2 /*return*/, new Response(JSON.stringify({ monoPng: monoPng_1, gfa: gfa_1, widthDots: outW_1, heightDots: outH_1 }), { headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }) })];
            case 4:
                err_1 = _b.sent();
                return [2 /*return*/, new Response(JSON.stringify({ error: err_1.message }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); });
