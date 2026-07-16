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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExchangeRatesClient_apiKey, _ExchangeRatesClient_apiUrl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeRatesClient = exports.ExchangeRatesClient = void 0;
var ExchangeRatesClient = /** @class */ (function () {
    function ExchangeRatesClient(options) {
        _ExchangeRatesClient_apiKey.set(this, void 0);
        _ExchangeRatesClient_apiUrl.set(this, void 0);
        if (!options.apiKey)
            throw new Error("EXCHANGE_RATES_API_KEY not set");
        __classPrivateFieldSet(this, _ExchangeRatesClient_apiKey, options.apiKey, "f");
        __classPrivateFieldSet(this, _ExchangeRatesClient_apiUrl, options.apiUrl, "f");
    }
    ExchangeRatesClient.prototype.getMetaData = function () {
        return {
            apiUrl: __classPrivateFieldGet(this, _ExchangeRatesClient_apiUrl, "f")
        };
    };
    ExchangeRatesClient.prototype.getExchangeRates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(__classPrivateFieldGet(this, _ExchangeRatesClient_apiUrl, "f"), "?access_key=").concat(__classPrivateFieldGet(this, _ExchangeRatesClient_apiKey, "f"));
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if ("success" in data && data.success === true) {
                            return [2 /*return*/, data.rates];
                        }
                        throw new Error("Unrecognized response from exchange rates server");
                }
            });
        });
    };
    ExchangeRatesClient.prototype.convertExchangeRates = function (baseCurrencyCode, rates) {
        return __awaiter(this, void 0, void 0, function () {
            var baseRate, convertedRates;
            var _a;
            return __generator(this, function (_b) {
                baseRate = rates[baseCurrencyCode];
                if (!baseRate)
                    throw new Error("Base rate not found");
                convertedRates = Object.entries(rates).reduce(function (acc, _a) {
                    var _b;
                    var currency = _a[0], value = _a[1];
                    return __assign(__assign({}, acc), (_b = {}, _b[currency] = value / baseRate, _b));
                }, (_a = {},
                    _a[baseCurrencyCode] = 1,
                    _a));
                return [2 /*return*/, convertedRates];
            });
        });
    };
    return ExchangeRatesClient;
}());
exports.ExchangeRatesClient = ExchangeRatesClient;
_ExchangeRatesClient_apiKey = new WeakMap(), _ExchangeRatesClient_apiUrl = new WeakMap();
var getExchangeRatesClient = function (apiKey, apiUrl) {
    if (apiUrl === void 0) { apiUrl = "https://api.exchangeratesapi.io/v1/latest"; }
    return typeof apiKey === "string"
        ? new ExchangeRatesClient({
            apiKey: apiKey,
            apiUrl: apiUrl
        })
        : undefined;
};
exports.getExchangeRatesClient = getExchangeRatesClient;
