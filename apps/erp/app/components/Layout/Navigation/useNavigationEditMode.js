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
exports.useNavigationEditMode = useNavigationEditMode;
var sortable_1 = require("@dnd-kit/sortable");
var react_1 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
function useNavigationEditMode() {
    var _this = this;
    var allModules = (0, hooks_1.useAllModules)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var _a = (0, react_1.useState)(false), isEditing = _a[0], setIsEditing = _a[1];
    var _b = (0, react_1.useState)([]), draft = _b[0], setDraft = _b[1];
    var _c = (0, react_1.useState)(false), isSaving = _c[0], setIsSaving = _c[1];
    var originalRef = (0, react_1.useMemo)(function () {
        return allModules.map(function (m, i) {
            var _a, _b;
            return (__assign(__assign({}, m), { position: (_a = m.position) !== null && _a !== void 0 ? _a : i + 1, hidden: (_b = m.hidden) !== null && _b !== void 0 ? _b : false }));
        });
    }, [allModules]);
    var enterEditMode = (0, react_1.useCallback)(function () {
        setDraft(originalRef.map(function (m) { return (__assign({}, m)); }));
        setIsEditing(true);
    }, [originalRef]);
    var cancelEditMode = (0, react_1.useCallback)(function () {
        setDraft([]);
        setIsEditing(false);
    }, []);
    var visibleDraft = (0, react_1.useMemo)(function () { return draft.filter(function (m) { return !m.hidden; }); }, [draft]);
    var hiddenDraft = (0, react_1.useMemo)(function () { return draft.filter(function (m) { return m.hidden; }); }, [draft]);
    var isDirty = (0, react_1.useMemo)(function () {
        if (draft.length === 0)
            return false;
        return draft.some(function (d) {
            var orig = originalRef.find(function (o) { return o.key === d.key; });
            if (!orig)
                return true;
            return d.position !== orig.position || d.hidden !== orig.hidden;
        });
    }, [draft, originalRef]);
    var handleDragEnd = (0, react_1.useCallback)(function (event) {
        var active = event.active, over = event.over;
        if (!over || active.id === over.id)
            return;
        setDraft(function (prev) {
            var visible = prev.filter(function (m) { return !m.hidden; });
            var hidden = prev.filter(function (m) { return m.hidden; });
            var oldIndex = visible.findIndex(function (m) { return m.key === active.id; });
            var newIndex = visible.findIndex(function (m) { return m.key === over.id; });
            if (oldIndex === -1 || newIndex === -1)
                return prev;
            var reordered = (0, sortable_1.arrayMove)(visible, oldIndex, newIndex);
            var repositioned = reordered.map(function (m, i) { return (__assign(__assign({}, m), { position: i + 1 })); });
            return __spreadArray(__spreadArray([], repositioned, true), hidden, true);
        });
    }, []);
    var toggleHidden = (0, react_1.useCallback)(function (key) {
        setDraft(function (prev) {
            var updated = prev.map(function (m) {
                return m.key === key ? __assign(__assign({}, m), { hidden: !m.hidden }) : m;
            });
            var visible = updated.filter(function (m) { return !m.hidden; });
            var hidden = updated.filter(function (m) { return m.hidden; });
            return __spreadArray(__spreadArray([], visible.map(function (m, i) { return (__assign(__assign({}, m), { position: i + 1 })); }), true), hidden, true);
        });
    }, []);
    var save = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fetch("/api/module-preferences", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                preferences: draft.map(function (m) { return ({
                                    module: m.key,
                                    position: m.position,
                                    hidden: m.hidden
                                }); })
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to save preferences");
                    }
                    setIsEditing(false);
                    setDraft([]);
                    revalidator.revalidate();
                    return [3 /*break*/, 4];
                case 3:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [draft, revalidator]);
    return {
        isEditing: isEditing,
        isSaving: isSaving,
        isDirty: isDirty,
        visibleDraft: visibleDraft,
        hiddenDraft: hiddenDraft,
        enterEditMode: enterEditMode,
        cancelEditMode: cancelEditMode,
        handleDragEnd: handleDragEnd,
        toggleHidden: toggleHidden,
        save: save
    };
}
