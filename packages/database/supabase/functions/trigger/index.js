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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var headers_ts_1 = require("../lib/headers.ts");
var inngest_ts_1 = require("../lib/inngest.ts");
var recipientValidator = npm_zod__3_24_1_1.z.discriminatedUnion("type", [
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("user"),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("group"),
        groupIds: npm_zod__3_24_1_1.z.array(npm_zod__3_24_1_1.z.string()),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("users"),
        userIds: npm_zod__3_24_1_1.z.array(npm_zod__3_24_1_1.z.string()),
    }),
]);
var payloadValidator = npm_zod__3_24_1_1.z.discriminatedUnion("type", [
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("notify"),
        event: npm_zod__3_24_1_1.z.enum([
            "job-completed",
            "quote-assignment",
            "sales-rfq-assignment",
            "sales-order-assignment",
        ]),
        documentId: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        recipient: recipientValidator,
        from: npm_zod__3_24_1_1.z.string().optional(),
    }),
]);
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, validatedPayload, type, data, _a, err_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, 7, , 8]);
                validatedPayload = payloadValidator.parse(payload);
                type = validatedPayload.type, data = __rest(validatedPayload, ["type"]);
                console.log(__assign({ function: "trigger", type: type }, data));
                _a = type;
                switch (_a) {
                    case "notify": return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, inngest_ts_1.sendInngestEvent)("carbon/notify", {
                    companyId: data.companyId,
                    documentId: data.documentId,
                    event: data.event,
                    recipient: data.recipient,
                    from: (_b = data.from) !== null && _b !== void 0 ? _b : "system",
                })];
            case 4:
                _c.sent();
                return [3 /*break*/, 6];
            case 5: throw new Error("Invalid type  ".concat(type));
            case 6: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 7:
                err_1 = _c.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 8: return [2 /*return*/];
        }
    });
}); });
