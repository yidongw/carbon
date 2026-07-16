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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSearch = useSearch;
var react_1 = require("@carbon/react");
var localforage_1 = require("localforage");
var react_2 = require("react");
var react_router_1 = require("react-router");
function useSearch(_a) {
    var _this = this;
    var _b, _c;
    var companyId = _a.companyId, onClose = _a.onClose;
    var navigate = (0, react_router_1.useNavigate)();
    var fetcher = (0, react_router_1.useFetcher)();
    var storageKey = "recentSearches_".concat(companyId);
    var _d = (0, react_2.useState)(""), input = _d[0], setInputState = _d[1];
    var _e = (0, react_2.useState)(false), isDebouncing = _e[0], setIsDebouncing = _e[1];
    var _f = (0, react_2.useState)([]), recentSearches = _f[0], setRecentSearches = _f[1];
    var debounceSearch = (0, react_1.useDebounce)(function (q) {
        if (q && q.length >= 2) {
            fetcher.load("/api/search?q=".concat(encodeURIComponent(q)));
        }
        setIsDebouncing(false);
    }, 500);
    // Load recent searches from IndexedDB
    (0, react_2.useEffect)(function () {
        var loadRecentSearches = function () { return __awaiter(_this, void 0, void 0, function () {
            var stored;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localforage_1.default.getItem(storageKey)];
                    case 1:
                        stored = _a.sent();
                        if (stored) {
                            setRecentSearches(stored);
                        }
                        else {
                            setRecentSearches([]);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        loadRecentSearches();
    }, [storageKey]);
    // Handle input changes with debounced search
    var setInput = (0, react_2.useCallback)(function (value) {
        setInputState(value);
        if (value && value.length >= 2) {
            setIsDebouncing(true);
            debounceSearch(value);
        }
    }, [debounceSearch]);
    // Reset input without triggering search
    var resetInput = (0, react_2.useCallback)(function () {
        setInputState("");
    }, []);
    // Select a result and save to recent searches
    var onSelect = (0, react_2.useCallback)(function (route, entityType, module) { return __awaiter(_this, void 0, void 0, function () {
        var newRecent, existingRecent, filtered, updated;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    navigate(route.to);
                    onClose();
                    newRecent = {
                        to: route.to,
                        name: route.name,
                        entityType: entityType,
                        module: module
                    };
                    return [4 /*yield*/, localforage_1.default.getItem(storageKey)];
                case 1:
                    existingRecent = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : [];
                    filtered = existingRecent.filter(function (item) { return item.to !== route.to; });
                    updated = __spreadArray([newRecent], filtered, true).slice(0, 5);
                    setRecentSearches(updated);
                    return [4 /*yield*/, localforage_1.default.setItem(storageKey, updated)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [navigate, onClose, storageKey]);
    // Remove a recent search
    var removeRecentSearch = (0, react_2.useCallback)(function (path) { return __awaiter(_this, void 0, void 0, function () {
        var existingRecent, updated;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, localforage_1.default.getItem(storageKey)];
                case 1:
                    existingRecent = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : [];
                    updated = existingRecent.filter(function (item) { return item.to !== path; });
                    setRecentSearches(updated);
                    return [4 /*yield*/, localforage_1.default.setItem(storageKey, updated)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [storageKey]);
    // Filter out recent searches from API results
    var recentPaths = new Set(recentSearches.map(function (r) { return r.to; }));
    var searchResults = ((_c = (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.results) !== null && _c !== void 0 ? _c : []).filter(function (r) { return !recentPaths.has(r.link); });
    var isLoading = fetcher.state === "loading";
    return {
        input: input,
        setInput: setInput,
        isLoading: isLoading,
        isDebouncing: isDebouncing,
        searchResults: searchResults,
        recentSearches: recentSearches,
        onSelect: onSelect,
        removeRecentSearch: removeRecentSearch,
        resetInput: resetInput
    };
}
