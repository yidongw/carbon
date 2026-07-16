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
var mod_ts_1 = require("https://deno.land/x/puppeteer@16.2.0/mod.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var node_buffer_1 = require("node:buffer");
var headers_ts_1 = require("../lib/headers.ts");
var magick_wasm_0_0_30_1 = require("npm:@imagemagick/magick-wasm@0.0.30");
var wasmBytes = await Deno.readFile(new URL("magick.wasm", import.meta.resolve("npm:@imagemagick/magick-wasm@0.0.30")));
await (0, magick_wasm_0_0_30_1.initializeImageMagick)(wasmBytes);
var payloadSchema = npm_zod__3_24_1_1.z.object({
    url: npm_zod__3_24_1_1.z.string(),
});
var browserWSEndpoint = "ws://5.161.255.30?token=59ecf910-aaa8-4c7e-aedb-7c18b34e266e";
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, payload, url, page, screenshot, screenshotArray, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, 11, 14]);
                return [4 /*yield*/, req.json()];
            case 2:
                payload = _a.sent();
                url = payloadSchema.parse(payload).url;
                console.log({
                    function: "thumbnail",
                    url: url,
                });
                return [4 /*yield*/, mod_ts_1.default.connect({
                        browserWSEndpoint: browserWSEndpoint,
                    })];
            case 3:
                browser = _a.sent();
                console.log("browser connected");
                return [4 /*yield*/, browser.newPage()];
            case 4:
                page = _a.sent();
                console.log("page created");
                return [4 /*yield*/, page.setViewport({ width: 1000, height: 1000 })];
            case 5:
                _a.sent();
                console.log("viewport set");
                return [4 /*yield*/, page.goto(url)];
            case 6:
                _a.sent();
                console.log("navigated to ".concat(url));
                // Wait for the canvas with id=viewer to be visible, but no longer than 5 seconds
                return [4 /*yield*/, page.waitForSelector("#model-viewer-canvas", {
                        timeout: 10000,
                    })];
            case 7:
                // Wait for the canvas with id=viewer to be visible, but no longer than 5 seconds
                _a.sent();
                console.log("model-viewer-canvas visible");
                return [4 /*yield*/, page.screenshot({
                        encoding: "binary",
                        clip: { x: 15, y: 15, width: 960, height: 960 },
                    })];
            case 8:
                screenshot = _a.sent();
                screenshotArray = new Uint8Array(typeof screenshot === "string"
                    ? node_buffer_1.Buffer.from(screenshot, "utf-8")
                    : screenshot);
                return [4 /*yield*/, magick_wasm_0_0_30_1.ImageMagick.read(screenshotArray, function (img) {
                        img.transparent(new magick_wasm_0_0_30_1.MagickColor("white"));
                        img.resize(300, 300);
                        return img.write(function (data) { return data; });
                    })];
            case 9:
                result = _a.sent();
                return [2 /*return*/, new Response(result, {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "image/png" }),
                        status: 200,
                    })];
            case 10:
                err_1 = _a.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 400,
                    })];
            case 11:
                if (!browser) return [3 /*break*/, 13];
                return [4 /*yield*/, browser.close()];
            case 12:
                _a.sent();
                console.log("browser closed");
                _a.label = 13;
            case 13: return [7 /*endfinally*/];
            case 14: return [2 /*return*/];
        }
    });
}); });
