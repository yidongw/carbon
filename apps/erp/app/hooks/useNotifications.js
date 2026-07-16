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
exports.useNotifications = useNotifications;
var react_1 = require("@carbon/react");
var react_2 = require("react");
function rowToNotification(row) {
    var _a;
    return {
        _id: row.id,
        createdAt: row.createdAt,
        payload: (_a = row.payload) !== null && _a !== void 0 ? _a : {},
        read: row.readAt !== null,
        seen: row.seenAt !== null
    };
}
function useNotifications(_a) {
    var _this = this;
    var userId = _a.userId, companyId = _a.companyId;
    var carbon = (0, react_1.useCarbon)().carbon;
    var _b = (0, react_2.useState)(true), isLoading = _b[0], setLoading = _b[1];
    var _c = (0, react_2.useState)([]), notifications = _c[0], setNotifications = _c[1];
    // Initial fetch — runs once per (carbon/user/company) tuple.
    (0, react_2.useEffect)(function () {
        if (!carbon)
            return;
        var cancelled = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, carbon
                            .from("notification")
                            .select("id, userId, companyId, readAt, seenAt, createdAt, payload")
                            .eq("userId", userId)
                            .eq("companyId", companyId)
                            .is("digestedInto", null)
                            .order("createdAt", { ascending: false })
                            .limit(100)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (cancelled)
                            return [2 /*return*/];
                        if (error) {
                            console.error("Failed to load notifications", error);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        setNotifications((data !== null && data !== void 0 ? data : []).map(rowToNotification));
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            cancelled = true;
        };
    }, [carbon, userId, companyId]);
    // Realtime stream — useRealtimeChannel waits for isRealtimeAuthSet so RLS
    // policies on `notification` resolve via the user's JWT.
    (0, react_1.useRealtimeChannel)({
        dependencies: [userId, companyId],
        setup: function (channel) {
            return channel.on("postgres_changes", {
                event: "*",
                filter: "userId=eq.".concat(userId),
                schema: "public",
                table: "notification"
            }, function (payload) {
                if (payload.new && payload.new.companyId !== companyId)
                    return;
                if (payload.eventType === "INSERT") {
                    setNotifications(function (prev) { return __spreadArray([
                        rowToNotification(payload.new)
                    ], prev, true); });
                }
                else if (payload.eventType === "UPDATE") {
                    // A row that just got attached to a digest disappears from the
                    // topbar — it's now represented by its digest parent.
                    var newRow_1 = payload.new;
                    if (newRow_1.digestedInto) {
                        setNotifications(function (prev) {
                            return prev.filter(function (n) { return n._id !== newRow_1.id; });
                        });
                    }
                    else {
                        setNotifications(function (prev) {
                            return prev.map(function (n) {
                                return n._id === newRow_1.id ? rowToNotification(newRow_1) : n;
                            });
                        });
                    }
                }
                else if (payload.eventType === "DELETE") {
                    setNotifications(function (prev) {
                        return prev.filter(function (n) { return n._id !== payload.old.id; });
                    });
                }
            });
        },
        topic: "notification:".concat(companyId, ":").concat(userId)
    });
    var markMessageAsRead = (0, react_2.useCallback)(function (messageId) { return __awaiter(_this, void 0, void 0, function () {
        var now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setNotifications(function (prev) {
                        return prev.map(function (n) { return (n._id === messageId ? __assign(__assign({}, n), { read: true }) : n); });
                    });
                    if (!carbon)
                        return [2 /*return*/];
                    now = new Date().toISOString();
                    return [4 /*yield*/, carbon
                            .from("notification")
                            .update({ readAt: now })
                            .eq("id", messageId)];
                case 1:
                    _a.sent();
                    // If this is a digest row, sweep its children read too. RLS scopes
                    // both updates to auth.uid()::text = userId, so a malicious id won't
                    // affect anyone else.
                    return [4 /*yield*/, carbon
                            .from("notification")
                            .update({ readAt: now })
                            .eq("digestedInto", messageId)
                            .is("readAt", null)];
                case 2:
                    // If this is a digest row, sweep its children read too. RLS scopes
                    // both updates to auth.uid()::text = userId, so a malicious id won't
                    // affect anyone else.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon]);
    // Lazily loads child rows for a digest parent. The topbar query filters out
    // anything with `digestedInto` set, so children aren't in `notifications` —
    // we fetch them on demand when the user expands a digest.
    var fetchDigestChildren = (0, react_2.useCallback)(function (digestId) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, carbon
                            .from("notification")
                            .select("id, userId, companyId, readAt, seenAt, createdAt, payload")
                            .eq("digestedInto", digestId)
                            .order("createdAt", { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("Failed to load digest children", error);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, (data !== null && data !== void 0 ? data : []).map(rowToNotification)];
            }
        });
    }); }, [carbon]);
    var markAllMessagesAsRead = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setNotifications(function (prev) { return prev.map(function (n) { return (__assign(__assign({}, n), { read: true })); }); });
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("notification")
                            .update({ readAt: new Date().toISOString() })
                            .eq("userId", userId)
                            .eq("companyId", companyId)
                            .is("readAt", null)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, userId, companyId]);
    var markAllMessagesAsSeen = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setNotifications(function (prev) { return prev.map(function (n) { return (__assign(__assign({}, n), { seen: true })); }); });
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("notification")
                            .update({ seenAt: new Date().toISOString() })
                            .eq("userId", userId)
                            .eq("companyId", companyId)
                            .is("seenAt", null)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, userId, companyId]);
    var hasUnseenNotifications = (0, react_2.useMemo)(function () { return notifications.some(function (n) { return !n.seen; }); }, [notifications]);
    return {
        fetchDigestChildren: fetchDigestChildren,
        hasUnseenNotifications: hasUnseenNotifications,
        isLoading: isLoading,
        markAllMessagesAsRead: markAllMessagesAsRead,
        markAllMessagesAsSeen: markAllMessagesAsSeen,
        markMessageAsRead: markMessageAsRead,
        notifications: notifications
    };
}
