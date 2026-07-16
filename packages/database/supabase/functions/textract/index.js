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
var mod_ts_1 = require("https://deno.land/x/aws_sdk@v3.32.0-1/client-s3/mod.ts");
var mod_ts_2 = require("https://deno.land/x/aws_sdk@v3.32.0-1/client-textract/mod.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var AWS_REGION = Deno.env.get("AWS_REGION");
var AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID");
var AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY");
var AWS_S3_BUCKET = Deno.env.get("AWS_S3_BUCKET");
if (!AWS_REGION ||
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !AWS_S3_BUCKET) {
    throw new Error("Missing required AWS environment variables");
}
var s3Client = new mod_ts_1.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});
var textractClient = new mod_ts_2.TextractClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});
var payloadValidator = npm_zod__3_24_1_1.default.object({
    path: npm_zod__3_24_1_1.default.string(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, path, supabase, s3Key, error_1, _a, data, error_2, textractResponse, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 13, , 14]);
                path = payloadValidator.parse(payload).path;
                console.log({
                    function: "textract",
                    path: path,
                });
                return [4 /*yield*/, (0, supabase_ts_1.getSupabaseServiceRole)(req.headers.get("Authorization"))];
            case 3:
                supabase = _b.sent();
                s3Key = "textract/".concat(Date.now(), "-").concat(path.split("/").pop());
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 11]);
                return [4 /*yield*/, s3Client.send(new mod_ts_1.HeadObjectCommand({
                        Bucket: AWS_S3_BUCKET,
                        Key: s3Key,
                    }))];
            case 5:
                _b.sent();
                console.log("File already exists in S3, skipping upload");
                return [3 /*break*/, 11];
            case 6:
                error_1 = _b.sent();
                if (!(error_1.name === "NotFound")) return [3 /*break*/, 9];
                return [4 /*yield*/, supabase.storage
                        .from("documents")
                        .download(path)];
            case 7:
                _a = _b.sent(), data = _a.data, error_2 = _a.error;
                if (error_2)
                    throw error_2;
                // Upload file to S3
                return [4 /*yield*/, s3Client.send(new mod_ts_1.PutObjectCommand({
                        Bucket: AWS_S3_BUCKET,
                        Key: s3Key,
                        Body: data,
                    }))];
            case 8:
                // Upload file to S3
                _b.sent();
                console.log("File uploaded to S3");
                return [3 /*break*/, 10];
            case 9: 
            // Unexpected error
            throw error_1;
            case 10: return [3 /*break*/, 11];
            case 11: return [4 /*yield*/, textractClient.send(new mod_ts_2.AnalyzeDocumentCommand({
                    Document: {
                        S3Object: {
                            Bucket: AWS_S3_BUCKET,
                            Name: s3Key,
                        },
                    },
                    FeatureTypes: ["FORMS", "TABLES"],
                }))];
            case 12:
                textractResponse = _b.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        analysis: textractResponse,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 13:
                err_1 = _b.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 14: return [2 /*return*/];
        }
    });
}); });
