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
var wasmBytes = await Deno.readFile(new URL("magick.wasm", import.meta.resolve("npm:@imagemagick/magick-wasm@0.0.30")));
await (0, magick_wasm_0_0_30_1.initializeImageMagick)(wasmBytes);
var headers_ts_1 = require("../lib/headers.ts");
// Target maximum dimension for processing. Large JPEGs are decoded at or below
// this size via shrink-on-load; larger non-JPEG images are downscaled to it
// after decode. The 10MB file-size gate bounds the rest.
var MAX_SAFE_DIMENSION = 2000;
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var formData, file, targetHeight_1, contained_1, arrayBuffer, bytes_1, fileSizeMB, isJpgFile_1, result, outputFormat_1, DECODE_HINT, readSettings_1, imgError_1, contentType, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                console.log({
                    function: "image-resizer",
                });
                return [4 /*yield*/, req.formData()];
            case 2:
                formData = _a.sent();
                file = formData.get("file");
                targetHeight_1 = formData.get("height");
                contained_1 = !!formData.get("contained");
                if (!file) {
                    throw new Error("No file provided");
                }
                return [4 /*yield*/, file.arrayBuffer()];
            case 3:
                arrayBuffer = _a.sent();
                bytes_1 = new Uint8Array(arrayBuffer);
                // Log file info for debugging
                console.log({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: bytes_1.length,
                    targetHeight: targetHeight_1,
                    contained: contained_1,
                });
                // For extremely large files, reject immediately
                if (bytes_1.length > 10 * 1024 * 1024) {
                    fileSizeMB = (bytes_1.length / (1024 * 1024)).toFixed(2);
                    throw new Error("File is ".concat(fileSizeMB, "MB, but maximum allowed size is 10MB"));
                }
                isJpgFile_1 = file.name.toLowerCase().endsWith(".jpg") ||
                    file.name.toLowerCase().endsWith(".jpeg") ||
                    file.type === "image/jpg" ||
                    file.type === "image/jpeg";
                result = void 0;
                outputFormat_1 = magick_wasm_0_0_30_1.MagickFormat.Png;
                DECODE_HINT = 1000;
                readSettings_1 = new magick_wasm_0_0_30_1.MagickReadSettings();
                readSettings_1.setDefine(magick_wasm_0_0_30_1.MagickFormat.Jpeg, "size", "".concat(DECODE_HINT, "x").concat(DECODE_HINT));
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 8]);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        try {
                            var data = magick_wasm_0_0_30_1.ImageMagick.read(bytes_1, readSettings_1, function (img) {
                                console.log({
                                    originalFormat: img.format,
                                    loadedWidth: img.width,
                                    loadedHeight: img.height,
                                    originalDepth: img.depth,
                                    originalColorSpace: img.colorSpace,
                                    isJpgFile: isJpgFile_1,
                                });
                                // Bake the EXIF orientation into the pixels before we strip metadata
                                // below — otherwise a portrait phone photo (stored landscape + an
                                // orientation flag) uploads sideways once the flag is discarded.
                                img.autoOrient();
                                // Shrink-on-load only applies to JPEG; clamp anything still larger
                                // than MAX_SAFE_DIMENSION (e.g. a PNG decoded at full size) down so
                                // downstream processing stays cheap.
                                var loadedMax = Math.max(img.width, img.height);
                                if (loadedMax > MAX_SAFE_DIMENSION) {
                                    var scale = MAX_SAFE_DIMENSION / loadedMax;
                                    var newWidth = Math.floor(img.width * scale);
                                    var newHeight = Math.floor(img.height * scale);
                                    console.log("Pre-scaling loaded image to ".concat(newWidth, "x").concat(newHeight));
                                    img.resize(newWidth, newHeight);
                                }
                                // Enhanced JPG handling
                                if (isJpgFile_1) {
                                    console.log("Enhanced handling for JPG/JPEG file");
                                    // First ensure it's in a consistent format
                                    img.format = magick_wasm_0_0_30_1.MagickFormat.Jpeg;
                                    // Apply quality settings for JPEG
                                    img.quality = 95;
                                    // Then convert to PNG for further processing
                                    img.format = magick_wasm_0_0_30_1.MagickFormat.Png;
                                }
                                else {
                                    // For non-JPG images, just convert to PNG
                                    img.format = magick_wasm_0_0_30_1.MagickFormat.Png;
                                }
                                var width = img.width;
                                var height = img.height;
                                if (targetHeight_1) {
                                    console.log("Processing with targetHeight:", targetHeight_1);
                                    var targetHeightInt = parseInt(targetHeight_1, 10);
                                    // Ensure we have valid dimensions
                                    if (isNaN(targetHeightInt) || targetHeightInt <= 0) {
                                        throw new Error("Invalid target height");
                                    }
                                    var ratio = width / height;
                                    var targetWidthInt = Math.round(targetHeightInt * ratio);
                                    console.log("Resizing to ".concat(targetWidthInt, "x").concat(targetHeightInt));
                                    img.resize(targetWidthInt, targetHeightInt);
                                    img.quality = 90;
                                }
                                else if (contained_1) {
                                    console.log("Processing with contained mode");
                                    // For contained mode, use a more efficient approach
                                    // First resize to a reasonable size while maintaining aspect ratio
                                    var targetSize = 500; // Target size for the longer dimension
                                    var newWidth = void 0, newHeight = void 0;
                                    if (width > height) {
                                        newWidth = targetSize;
                                        newHeight = Math.round(targetSize * (height / width));
                                    }
                                    else {
                                        newHeight = targetSize;
                                        newWidth = Math.round(targetSize * (width / height));
                                    }
                                    console.log("Resizing to ".concat(newWidth, "x").concat(newHeight, " before containment"));
                                    img.resize(newWidth, newHeight);
                                    // Calculate size with 10% padding
                                    var padding = 0.1; // 10% padding
                                    var maxDimension = Math.max(newWidth, newHeight);
                                    var sizeWithPadding = Math.ceil(maxDimension * (1 + 2 * padding));
                                    console.log("Extending to ".concat(sizeWithPadding, "x").concat(sizeWithPadding));
                                    // Create geometry for the centered image with padding
                                    var containedGeometry = new magick_wasm_0_0_30_1.MagickGeometry(0, 0, sizeWithPadding, sizeWithPadding);
                                    containedGeometry.ignoreAspectRatio = true;
                                    // Use white background for JPG files, transparent for others
                                    var backgroundColor = isJpgFile_1
                                        ? new magick_wasm_0_0_30_1.MagickColor("white")
                                        : new magick_wasm_0_0_30_1.MagickColor("transparent");
                                    img.extent(containedGeometry, magick_wasm_0_0_30_1.Gravity.Center, backgroundColor);
                                    console.log("Resizing to 300x300");
                                    var resizeGeometry = new magick_wasm_0_0_30_1.MagickGeometry(300, 300);
                                    resizeGeometry.ignoreAspectRatio = true;
                                    img.resize(resizeGeometry);
                                    img.quality = 90;
                                }
                                else {
                                    console.log("Processing with default square crop mode");
                                    // For square crop, first resize to a reasonable size to reduce CPU usage
                                    var maxDimension = Math.max(width, height);
                                    if (maxDimension > 600) {
                                        var scaleFactor = 600 / maxDimension;
                                        var newWidth = Math.floor(width * scaleFactor);
                                        var newHeight = Math.floor(height * scaleFactor);
                                        console.log("Pre-scaling to ".concat(newWidth, "x").concat(newHeight, " before cropping"));
                                        img.resize(newWidth, newHeight);
                                    }
                                    // Now perform the square crop
                                    var size = Math.min(img.width, img.height);
                                    var x = Math.floor((img.width - size) / 2);
                                    var y = Math.floor((img.height - size) / 2);
                                    console.log("Cropping to ".concat(size, "x").concat(size, " from position ").concat(x, ",").concat(y));
                                    var cropGeometry = new magick_wasm_0_0_30_1.MagickGeometry(x, y, size, size);
                                    cropGeometry.ignoreAspectRatio = true;
                                    img.crop(cropGeometry);
                                    console.log("Resizing to 300x300");
                                    img.resize(300, 300);
                                    img.quality = 90;
                                }
                                // Strip metadata to reduce size
                                img.strip();
                                // Set the output format
                                if (isJpgFile_1) {
                                    img.format = magick_wasm_0_0_30_1.MagickFormat.Jpeg;
                                    outputFormat_1 = magick_wasm_0_0_30_1.MagickFormat.Jpeg;
                                }
                                else {
                                    img.format = magick_wasm_0_0_30_1.MagickFormat.Png;
                                    outputFormat_1 = magick_wasm_0_0_30_1.MagickFormat.Png;
                                }
                                console.log("Final processing complete, format: ".concat(img.format));
                                return img.write(function (data) {
                                    console.log("Image data generated, size:", data.length);
                                    return data;
                                });
                            });
                            if (!data) {
                                throw new Error("Failed to process image: No data returned");
                            }
                            resolve(data);
                        }
                        catch (err) {
                            reject(err);
                        }
                    })];
            case 5:
                result = _a.sent();
                return [3 /*break*/, 8];
            case 6:
                imgError_1 = _a.sent();
                console.error("ImageMagick processing error:", imgError_1);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        try {
                            var data = magick_wasm_0_0_30_1.ImageMagick.read(bytes_1, readSettings_1, function (img) {
                                console.log("Using enhanced fallback processing method");
                                // Honor EXIF orientation before stripping metadata (see primary path)
                                img.autoOrient();
                                // Special handling for JPG files in fallback
                                if (isJpgFile_1) {
                                    console.log("Fallback: Enhanced handling for JPG/JPEG file");
                                    // Force conversion to JPEG with high quality
                                    img.format = magick_wasm_0_0_30_1.MagickFormat.Jpeg;
                                    img.quality = 100;
                                    outputFormat_1 = magick_wasm_0_0_30_1.MagickFormat.Jpeg;
                                    // Apply a blur to help with problematic JPGs
                                    img.blur(0, 0.5);
                                }
                                else {
                                    outputFormat_1 = magick_wasm_0_0_30_1.MagickFormat.Png;
                                }
                                // Aggressively downscale first
                                var scaleFactor = 800 / Math.max(img.width, img.height);
                                var newWidth = Math.floor(img.width * scaleFactor);
                                var newHeight = Math.floor(img.height * scaleFactor);
                                console.log("Fallback: downscaling to ".concat(newWidth, "x").concat(newHeight));
                                img.resize(newWidth, newHeight);
                                if (!isJpgFile_1) {
                                    // Convert to PNG to maintain transparency for non-JPG images
                                    img.format = magick_wasm_0_0_30_1.MagickFormat.Png;
                                }
                                if (contained_1) {
                                    // Simple contained mode for fallback
                                    var size = 300;
                                    var canvas = new magick_wasm_0_0_30_1.MagickGeometry(0, 0, size, size);
                                    // Use white background for JPG files, transparent for others
                                    var backgroundColor = isJpgFile_1
                                        ? new magick_wasm_0_0_30_1.MagickColor("white")
                                        : new magick_wasm_0_0_30_1.MagickColor("transparent");
                                    img.extent(canvas, magick_wasm_0_0_30_1.Gravity.Center, backgroundColor);
                                }
                                else {
                                    // Simple resize to 300x300
                                    img.resize(300, 300);
                                }
                                img.strip();
                                img.quality = 90;
                                return img.write(function (data) { return data; });
                            });
                            if (!data) {
                                throw new Error("Failed to process image in fallback: No data returned");
                            }
                            resolve(data);
                        }
                        catch (err) {
                            reject(err);
                        }
                    })];
            case 7:
                // Enhanced fallback for problematic images, especially JPGs
                result = _a.sent();
                return [3 /*break*/, 8];
            case 8:
                if (!result || result.length === 0) {
                    throw new Error("Failed to generate image data");
                }
                contentType = isJpgFile_1 ? "image/jpeg" : "image/png";
                console.log("Returning processed image with content type: ".concat(contentType));
                return [2 /*return*/, new Response(result, {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": contentType, "Content-Length": result.length.toString(), "Cache-Control": "public, max-age=31536000" }),
                    })];
            case 9:
                err_1 = _a.sent();
                console.error("Image processing error:", err_1);
                return [2 /*return*/, new Response(JSON.stringify({ error: err_1.message }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 10: return [2 /*return*/];
        }
    });
}); });
