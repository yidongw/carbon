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
exports.carbonClient = exports.getCarbon = exports.createCarbonWithAuthGetter = exports.getCarbonAPIKeyClient = exports.getCarbonClient = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var env_1 = require("../../config/env");
var PER_ATTEMPT_TIMEOUT_MS = 25000;
var MAX_RETRIES = 2;
var BACKOFF_MS = [500, 1000];
var RETRYABLE_STATUS = new Set([500, 502, 503, 504, 512, 408, 524]);
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
var fetchWithRetry = function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
    var lastError, attempt, timeoutSignal, signal, response, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                attempt = 0;
                _d.label = 1;
            case 1:
                if (!(attempt <= MAX_RETRIES)) return [3 /*break*/, 9];
                timeoutSignal = AbortSignal.timeout(PER_ATTEMPT_TIMEOUT_MS);
                signal = (init === null || init === void 0 ? void 0 : init.signal)
                    ? AbortSignal.any([init.signal, timeoutSignal])
                    : timeoutSignal;
                _d.label = 2;
            case 2:
                _d.trys.push([2, 6, , 8]);
                return [4 /*yield*/, fetch(input, __assign(__assign({}, init), { signal: signal }))];
            case 3:
                response = _d.sent();
                if (!(RETRYABLE_STATUS.has(response.status) && attempt < MAX_RETRIES)) return [3 /*break*/, 5];
                return [4 /*yield*/, sleep((_a = BACKOFF_MS[attempt]) !== null && _a !== void 0 ? _a : 1000)];
            case 4:
                _d.sent();
                return [3 /*break*/, 8];
            case 5: return [2 /*return*/, response];
            case 6:
                error_1 = _d.sent();
                lastError = error_1;
                if ((_b = init === null || init === void 0 ? void 0 : init.signal) === null || _b === void 0 ? void 0 : _b.aborted)
                    throw error_1;
                if (attempt >= MAX_RETRIES)
                    throw error_1;
                return [4 /*yield*/, sleep((_c = BACKOFF_MS[attempt]) !== null && _c !== void 0 ? _c : 1000)];
            case 7:
                _d.sent();
                return [3 /*break*/, 8];
            case 8:
                attempt++;
                return [3 /*break*/, 1];
            case 9: throw lastError;
        }
    });
}); };
var getCarbonClient = function (supabaseKey, accessToken) {
    var headers = accessToken
        ? { Authorization: "Bearer ".concat(accessToken) }
        : undefined;
    var client = (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        global: __assign({ fetch: fetchWithRetry }, (headers ? { headers: headers } : {}))
    });
    return client;
};
exports.getCarbonClient = getCarbonClient;
var getCarbonAPIKeyClient = function (apiKey) {
    var client = (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, env_1.SUPABASE_ANON_KEY, {
        global: {
            fetch: fetchWithRetry,
            headers: {
                "carbon-key": apiKey
            }
        }
    });
    return client;
};
exports.getCarbonAPIKeyClient = getCarbonAPIKeyClient;
var createCarbonWithAuthGetter = function (store) {
    return (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, env_1.SUPABASE_ANON_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        global: {
            fetch: fetchWithRetry
        },
        accessToken: function () {
            return __awaiter(this, void 0, void 0, function () {
                var state;
                return __generator(this, function (_a) {
                    if (!store.current)
                        return [2 /*return*/, null];
                    state = store.current.getState();
                    return [2 /*return*/, state.accessToken];
                });
            });
        }
    });
};
exports.createCarbonWithAuthGetter = createCarbonWithAuthGetter;
var getCarbon = function (accessToken) {
    return (0, exports.getCarbonClient)(env_1.SUPABASE_ANON_KEY, accessToken);
};
exports.getCarbon = getCarbon;
exports.carbonClient = (0, exports.getCarbon)();
