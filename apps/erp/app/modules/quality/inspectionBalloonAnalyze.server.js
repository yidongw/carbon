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
exports.INSPECTION_BALLOON_ANALYZE_MAX_IMAGE_BYTES = void 0;
exports.runInspectionBalloonRegionVisionAnalysis = runInspectionBalloonRegionVisionAnalysis;
var openai_1 = require("@ai-sdk/openai");
var ai_1 = require("ai");
var inspectionBalloonAnalyze_1 = require("./inspectionBalloonAnalyze");
/** Decoded image size limit for vision analyze (bytes). */
exports.INSPECTION_BALLOON_ANALYZE_MAX_IMAGE_BYTES = 12 * 1024 * 1024;
var BALLOON_REGION_ANALYSIS_SYSTEM = "You assist with mechanical inspection ballooning on technical CAD drawings.\n\nYou receive one raster image: a crop of a single callout region from a sheet.\n\nReturn ONLY the JSON object matching the schema (field names and allowed enum values exactly).\n\ntype (required, exactly one of):\n- linear \u2014 linear length/width/height dimension without \u2300 or R prefix.\n- diameter \u2014 nominal is the value for a diameter callout (\u2300 or equivalent).\n- radius \u2014 nominal is the value for a radius callout (R or equivalent).\n- angle \u2014 nominal is the numeric angle; set unit to degree or rad only when \u00B0, deg, or rad is visible in the crop; otherwise unit null.\n- unknown \u2014 not clearly one of the above, or unreadable / ambiguous.\n\nunit (nullable, exactly one of the allowed enum strings or null):\n- Default is null. Set unit ONLY when this crop visibly shows a unit indicator (e.g. mm, cm, m, um, \u00B5m, in, \", IN, ft, \u00B0, DEG, RAD, or equivalent text/symbols next to the dimension).\n- Do NOT infer unit from decimal places, title block, drawing \"standard,\" locale, or anything outside visible pixels in this crop. A bare number with tolerances but no unit text/symbol \u2192 unit null.\n- For type angle: use degree or rad only when that angle notation is visible; otherwise unit null.\n\nnominal / tolerances:\n- Prefer numbers from the print; use null (not zero) when not shown or unreadable.\n- Bilateral \u00B1T: tol_plus = +T, tol_minus = -T (e.g. \u00B10.02 \u2192 tol_plus 0.02, tol_minus -0.02).\n- Unilateral stacked +0.005 / -0.000 (plus above, minus below nominal): tol_plus = 0.005, tol_minus = 0 (minus side is zero additional tolerance below nominal).\n- Other asymmetric +a / \u2212b (both non-zero): tol_plus = +a, tol_minus = -b using the signed values as printed relative to nominal.\n\nDo not invent title-block or revision data outside the crop.\n";
var BALLOON_REGION_ANALYSIS_USER_MESSAGE = "Extract nominal, tol_plus, tol_minus, unit, and type per the system rules. For unit: use null unless a unit symbol or unit letters are literally visible in this crop; do not guess. Use only allowed enum literals for type and for unit when non-null.";
var BALLOON_REGION_ANALYSIS_SCHEMA_DESCRIPTION = "Drawing crop: nominal, tolerances, type enum; unit enum only when a unit symbol/text is visible in the crop, otherwise null";
/**
 * Runs vision extraction on a prepared PNG/JPEG/WebP buffer (caller validates size and auth).
 */
function runInspectionBalloonRegionVisionAnalysis(args) {
    return __awaiter(this, void 0, void 0, function () {
        var imageBytes, mediaType, object;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    imageBytes = args.imageBytes, mediaType = args.mediaType;
                    return [4 /*yield*/, (0, ai_1.generateObject)({
                            model: (0, openai_1.openai)("gpt-4o"),
                            schema: inspectionBalloonAnalyze_1.balloonRegionAnalysisResultSchema,
                            schemaName: "balloon_region_analysis",
                            schemaDescription: BALLOON_REGION_ANALYSIS_SCHEMA_DESCRIPTION,
                            system: BALLOON_REGION_ANALYSIS_SYSTEM,
                            messages: [
                                {
                                    role: "user",
                                    content: [
                                        { type: "text", text: BALLOON_REGION_ANALYSIS_USER_MESSAGE },
                                        {
                                            type: "image",
                                            image: imageBytes,
                                            mediaType: mediaType
                                        }
                                    ]
                                }
                            ],
                            temperature: 0.1
                        })];
                case 1:
                    object = (_a.sent()).object;
                    return [2 /*return*/, object];
            }
        });
    });
}
