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
exports.useNextItemId = useNextItemId;
var auth_1 = require("@carbon/auth");
var react_1 = require("react");
var useUser_1 = require("./useUser");
function useNextItemId(table) {
    var _this = this;
    var company = (0, useUser_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(""), id = _b[0], setId = _b[1];
    var onIdChange = function (newItemId) { return __awaiter(_this, void 0, void 0, function () {
        var prefix, nextIdRpc, sequence, currentSequence, nextSequence, nextId, _a, nextIdRpc, sequence, currentSequence, nextSequence, nextId, _b;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!(newItemId.endsWith("...") && carbon)) return [3 /*break*/, 11];
                    setLoading(true);
                    prefix = newItemId.slice(0, -3);
                    if (!prefix) return [3 /*break*/, 6];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.rpc("get_next_prefixed_sequence", {
                            company_id: company.id,
                            item_type: table,
                            prefix: prefix
                        }))];
                case 2:
                    nextIdRpc = _g.sent();
                    if (nextIdRpc.data) {
                        sequence = nextIdRpc.data.slice(prefix.length);
                        currentSequence = parseInt(sequence);
                        nextSequence = currentSequence + 1;
                        nextId = "".concat(prefix).concat(nextSequence
                            .toString()
                            .padStart(sequence.length -
                            ((_d = (_c = nextIdRpc.data.split("".concat(currentSequence))) === null || _c === void 0 ? void 0 : _c[1].length) !== null && _d !== void 0 ? _d : 0), "0"));
                        setId(nextId);
                    }
                    else {
                        setId("".concat(prefix).concat((1).toString().padStart(9, "0")));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    _a = _g.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [3 /*break*/, 10];
                case 6:
                    _g.trys.push([6, 8, 9, 10]);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.rpc("get_next_numeric_sequence", {
                            company_id: company.id,
                            item_type: table
                        }))];
                case 7:
                    nextIdRpc = _g.sent();
                    if (nextIdRpc.data) {
                        sequence = nextIdRpc.data.slice(prefix.length);
                        currentSequence = parseInt(sequence);
                        nextSequence = currentSequence + 1;
                        nextId = "".concat(prefix).concat(nextSequence
                            .toString()
                            .padStart(sequence.length -
                            ((_f = (_e = nextIdRpc.data.split("".concat(currentSequence))) === null || _e === void 0 ? void 0 : _e[1].length) !== null && _f !== void 0 ? _f : 0), "0"));
                        setId(nextId);
                    }
                    else {
                        setId("".concat(prefix).concat((1).toString().padStart(9, "0")));
                    }
                    return [3 /*break*/, 10];
                case 8:
                    _b = _g.sent();
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [3 /*break*/, 12];
                case 11:
                    setId(newItemId);
                    _g.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    }); };
    return { id: id, onIdChange: onIdChange, loading: loading };
}
