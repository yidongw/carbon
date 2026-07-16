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
exports.ensureFont = ensureFont;
var renderer_1 = require("@react-pdf/renderer");
/**
 * Google fonts offered in the template editor, registered on demand at render
 * time. Inter is registered statically in Template; Helvetica / Times-Roman /
 * Courier are PDF standard fonts and need no registration.
 *
 * react-pdf can render TTF/WOFF but NOT WOFF2, so we fetch the CSS2 stylesheet
 * with a legacy User-Agent that makes Google serve TTF `src` URLs, then parse
 * one TTF per weight and register them.
 */
var GOOGLE_FONTS = {
    Roboto: { family: "Roboto", weights: [400, 700] },
    "Open Sans": { family: "Open Sans", weights: [400, 700] },
    Lato: { family: "Lato", weights: [400, 700] },
    Montserrat: { family: "Montserrat", weights: [400, 700] },
    Merriweather: { family: "Merriweather", weights: [400, 700] },
    "Playfair Display": { family: "Playfair Display", weights: [400, 700] },
    Lora: { family: "Lora", weights: [400, 700] }
};
// IE6 UA — Google serves plain TTF (no woff/woff2) to it.
var TTF_USER_AGENT = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)";
var done = new Set();
var inFlight = new Map();
/**
 * Ensure `family` is registered with react-pdf before rendering. No-op for
 * built-ins, Inter, or unknown families. Best-effort: on any failure the font
 * is simply left unregistered (Template falls back to a safe font).
 */
function ensureFont(family) {
    return __awaiter(this, void 0, void 0, function () {
        var meta, pending;
        return __generator(this, function (_a) {
            meta = GOOGLE_FONTS[family];
            if (!meta || done.has(family))
                return [2 /*return*/];
            pending = inFlight.get(family);
            if (!pending) {
                pending = registerGoogleFont(meta)
                    .catch(function () {
                    // Font load failure is non-fatal; PDF falls back to the default face.
                })
                    .finally(function () {
                    done.add(family);
                    inFlight.delete(family);
                });
                inFlight.set(family, pending);
            }
            return [2 /*return*/, pending];
        });
    });
}
function registerGoogleFont(meta) {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, css, fonts, seen, re, match, weight;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://fonts.googleapis.com/css2?family=".concat(meta.family.replace(/ /g, "+"), ":wght@").concat(meta.weights.join(";"));
                    return [4 /*yield*/, fetch(url, { headers: { "User-Agent": TTF_USER_AGENT } })];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        return [2 /*return*/];
                    return [4 /*yield*/, res.text()];
                case 2:
                    css = _a.sent();
                    fonts = [];
                    seen = new Set();
                    re = /font-weight:\s*(\d+);[\s\S]*?src:\s*url\((https:\/\/fonts\.gstatic\.com\/[^)]+?\.ttf)\)/g;
                    while ((match = re.exec(css)) !== null) {
                        weight = Number(match[1]);
                        if (seen.has(weight))
                            continue;
                        seen.add(weight);
                        fonts.push({ src: match[2], fontWeight: weight });
                    }
                    if (fonts.length > 0) {
                        renderer_1.Font.register({ family: meta.family, fonts: fonts });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
