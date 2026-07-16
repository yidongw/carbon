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
var npm_ai_5_0_87_1 = require("npm:ai@5.0.87");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var openai_ts_1 = require("../lib/ai/openai.ts");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var transcriptionRequestSchema = npm_zod__3_24_1_1.z.object({
    audio: npm_zod__3_24_1_1.z.string().describe("Base64 encoded audio data"),
    mimeType: npm_zod__3_24_1_1.z.string().describe("MIME type of the audio file"),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var client, userId, companyId, authHeader, token, user, body, validationResult, _a, audio, mimeType, audioBuffer, formData, audioBlob, result, error_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                console.log({
                    function: "transcription",
                });
                client = null;
                userId = null;
                companyId = null;
                authHeader = req.headers.get("Authorization");
                token = (_b = authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace("Bearer ", "")) !== null && _b !== void 0 ? _b : null;
                if (!token) return [3 /*break*/, 3];
                client = (0, supabase_ts_1.getSupabase)(token);
                companyId = req.headers.get("x-company-id");
                return [4 /*yield*/, client.auth.setSession({
                        access_token: token,
                        refresh_token: token,
                    })];
            case 1:
                _e.sent();
                return [4 /*yield*/, client.auth.getUser()];
            case 2:
                user = (_d = (_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.user;
                if (user) {
                    userId = user.id;
                }
                _e.label = 3;
            case 3:
                if (!client || !companyId || !userId) {
                    return [2 /*return*/, new Response("Unauthorized", {
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                            status: 401,
                        })];
                }
                _e.label = 4;
            case 4:
                _e.trys.push([4, 7, , 8]);
                return [4 /*yield*/, req.json()];
            case 5:
                body = _e.sent();
                validationResult = transcriptionRequestSchema.safeParse(body);
                if (!validationResult.success) {
                    return [2 /*return*/, new Response(JSON.stringify({ success: false, error: validationResult.error }), {
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                            status: 400,
                        })];
                }
                _a = validationResult.data, audio = _a.audio, mimeType = _a.mimeType;
                console.log({
                    function: "transcription",
                    mimeType: mimeType,
                    audioLength: audio.length,
                });
                audioBuffer = Uint8Array.from(atob(audio), function (c) { return c.charCodeAt(0); });
                formData = new FormData();
                audioBlob = new Blob([audioBuffer], { type: mimeType });
                formData.append("file", audioBlob, "audio.webm");
                formData.append("model", "whisper-1");
                return [4 /*yield*/, (0, npm_ai_5_0_87_1.experimental_transcribe)({
                        model: openai_ts_1.openai.transcription("gpt-4o-mini-transcribe"),
                        audio: audioBuffer,
                    })];
            case 6:
                result = _e.sent();
                console.log({
                    function: "Audio transcription completed",
                    userId: userId,
                    companyId: companyId,
                    transcriptLength: result.text.length,
                });
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        text: result.text,
                        language: result.language,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 7:
                error_1 = _e.sent();
                console.error("Transcription failed:", error_1);
                return [2 /*return*/, new Response(JSON.stringify({
                        success: false,
                        error: "Failed to transcribe audio",
                        message: error_1 instanceof Error ? error_1.message : "Unknown error",
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 8: return [2 /*return*/];
        }
    });
}); });
