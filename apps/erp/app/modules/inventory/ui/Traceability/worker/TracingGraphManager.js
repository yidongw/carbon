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
exports.TracingGraphManager = void 0;
var Comlink = require("comlink");
var TracingGraphManager = /** @class */ (function () {
    function TracingGraphManager() {
        this.worker = null;
        this.proxy = null;
        this.layoutSeq = 0;
        this.selectionSeq = 0;
        this.disposed = false;
    }
    TracingGraphManager.prototype.init = function () {
        if (this.worker || this.disposed || typeof Worker === "undefined")
            return;
        this.worker = new Worker(new URL("./lineage.worker.ts", import.meta.url), {
            type: "module"
        });
        this.proxy = Comlink.wrap(this.worker);
    };
    TracingGraphManager.prototype.dispose = function () {
        var _a, _b;
        this.disposed = true;
        (_a = this.proxy) === null || _a === void 0 ? void 0 : _a[Comlink.releaseProxy]();
        (_b = this.worker) === null || _b === void 0 ? void 0 : _b.terminate();
        this.worker = null;
        this.proxy = null;
    };
    TracingGraphManager.prototype.layout = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var seq, result, computeFullLayout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        seq = ++this.layoutSeq;
                        if (!this.proxy) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.proxy.layout(input)];
                    case 1:
                        result = _a.sent();
                        if (this.disposed || seq !== this.layoutSeq)
                            return [2 /*return*/, null];
                        return [2 /*return*/, result];
                    case 2: return [4 /*yield*/, Promise.resolve().then(function () { return require("./core"); })];
                    case 3:
                        computeFullLayout = (_a.sent()).computeFullLayout;
                        if (this.disposed || seq !== this.layoutSeq)
                            return [2 /*return*/, null];
                        return [2 /*return*/, computeFullLayout(input)];
                }
            });
        });
    };
    TracingGraphManager.prototype.selection = function (edges, rootIds, excludedIds, additionalRootIds) {
        return __awaiter(this, void 0, void 0, function () {
            var seq, result, computeSelectionPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        seq = ++this.selectionSeq;
                        if (!this.proxy) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.proxy.selection(edges, rootIds, excludedIds, additionalRootIds)];
                    case 1:
                        result = _a.sent();
                        if (this.disposed || seq !== this.selectionSeq)
                            return [2 /*return*/, null];
                        return [2 /*return*/, result];
                    case 2: return [4 /*yield*/, Promise.resolve().then(function () { return require("./core"); })];
                    case 3:
                        computeSelectionPath = (_a.sent()).computeSelectionPath;
                        if (this.disposed || seq !== this.selectionSeq)
                            return [2 /*return*/, null];
                        return [2 /*return*/, computeSelectionPath(edges, rootIds, excludedIds, additionalRootIds)];
                }
            });
        });
    };
    return TracingGraphManager;
}());
exports.TracingGraphManager = TracingGraphManager;
