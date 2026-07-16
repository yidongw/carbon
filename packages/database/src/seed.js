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
// import type { User } from "@supabase/supabase-js";
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv = require("dotenv");
var index_ts_1 = require("./seed/index.ts");
dotenv.config({ path: ".env.local" });
dotenv.config();
var supabaseAdmin = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var upsertConfig, upsertPlans;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabaseAdmin.from("config").upsert([
                        {
                            id: true,
                            apiUrl: resolveApiUrl(),
                            anonKey: process.env.SUPABASE_ANON_KEY
                        }
                    ])];
                case 1:
                    upsertConfig = _a.sent();
                    if (upsertConfig.error)
                        throw upsertConfig.error;
                    return [4 /*yield*/, supabaseAdmin.from("plan").upsert(Object.entries(index_ts_1.devPrices).map(function (_a) {
                            var id = _a[0], _b = _a[1], stripePriceId = _b.stripePriceId, name = _b.name;
                            return ({
                                id: id,
                                stripePriceId: stripePriceId,
                                name: name
                            });
                        }), { onConflict: "id" })];
                case 2:
                    upsertPlans = _a.sent();
                    if (upsertPlans.error)
                        throw upsertPlans.error;
                    return [2 /*return*/];
            }
        });
    });
}
// Postgres triggers + edge functions call back to the API from inside the
// docker network, so the public portless hostname (https://<branch>.api.dev)
// won't resolve. Use host.docker.internal with the worktree's PORT_API
// (written to .env.local by `crbn up`). Cloud runs (e.g. CI seeding a fresh
// workspace) have no PORT_API and a `*.supabase.co` URL — return as-is.
function resolveApiUrl() {
    var supabaseUrl = process.env.SUPABASE_URL;
    var port = process.env.PORT_API;
    var isCrbnDevHost = /\.api\.dev(\/|$)/.test(supabaseUrl) || supabaseUrl.includes("localhost");
    if (!isCrbnDevHost)
        return supabaseUrl;
    if (!port) {
        throw new Error("seed: SUPABASE_URL looks like a crbn dev host but PORT_API is unset — run via `crbn` so .env.local is loaded.");
    }
    return "http://host.docker.internal:".concat(port);
}
seed().catch(function (e) {
    console.error(e);
    process.exit(1);
});
