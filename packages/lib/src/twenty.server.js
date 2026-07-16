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
exports.twentyClient = exports.getTwentyClient = void 0;
var TwentyClient = /** @class */ (function () {
    function TwentyClient(apiKey) {
        this.baseUrl = "https://api.twenty.com/rest";
        this.apiKey = apiKey;
    }
    TwentyClient.prototype.request = function (endpoint, method, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response, errorText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                            method: method,
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(this.apiKey)
                            },
                            body: body ? JSON.stringify(body) : undefined
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error("Twenty CRM API error: ".concat(response.status, " ").concat(response.statusText, " - ").concat(errorText));
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    TwentyClient.prototype.createPerson = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/people", "POST", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.createPerson.id];
                }
            });
        });
    };
    TwentyClient.prototype.updatePerson = function (personId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/people/".concat(personId), "PUT", data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TwentyClient.prototype.createCompany = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/companies", "POST", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.createCompany.id];
                }
            });
        });
    };
    TwentyClient.prototype.createOpportunity = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/opportunities", "POST", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.createOpportunity.id];
                }
            });
        });
    };
    return TwentyClient;
}());
var getTwentyClient = function () {
    var apiKey = process.env.TWENTY_API_KEY;
    if (!apiKey) {
        throw new Error("TWENTY_API_KEY environment variable is not set");
    }
    return new TwentyClient(apiKey);
};
exports.getTwentyClient = getTwentyClient;
exports.twentyClient = new TwentyClient(process.env.TWENTY_API_KEY);
