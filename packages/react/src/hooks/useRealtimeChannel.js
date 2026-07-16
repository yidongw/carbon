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
exports.useRealtimeChannel = void 0;
var env_1 = require("@carbon/env");
var supabase_js_1 = require("@supabase/supabase-js");
var react_1 = require("react");
var CarbonContext_1 = require("../CarbonContext");
var Toast_1 = require("../Toast");
function formatSubscribeErr(err) {
    if (err == null)
        return "No error details";
    if (typeof err === "string")
        return err.trim() || "No error details";
    if (err instanceof Error)
        return err.message || "No error details";
    if (typeof err === "object") {
        var o = err;
        if (typeof o.message === "string" && o.message.trim())
            return o.message;
    }
    try {
        return JSON.stringify(err);
    }
    catch (_a) {
        return String(err);
    }
}
var useRealtimeChannel = function (options) {
    var topic = options.topic, setup = options.setup, _a = options.enabled, enabled = _a === void 0 ? true : _a, _b = options.dependencies, dependencies = _b === void 0 ? [] : _b, _c = options.notifyOnSubscribeError, notifyOnSubscribeError = _c === void 0 ? env_1.NODE_ENV === "development" : _c;
    var channelRef = (0, react_1.useRef)(null);
    var isTearingDownRef = (0, react_1.useRef)(false);
    var lastErrorToastAtRef = (0, react_1.useRef)(0);
    var lastErrorToastIdRef = (0, react_1.useRef)(null);
    var retryCountRef = (0, react_1.useRef)(0);
    var retryTimerRef = (0, react_1.useRef)(null);
    var isSilentReconnectRef = (0, react_1.useRef)(false);
    // Updated each effect run so the retry timer always calls the latest subscribe closure.
    var doSubscribeRef = (0, react_1.useRef)(function () { return Promise.resolve(); });
    var _d = (0, CarbonContext_1.useCarbon)(), carbon = _d.carbon, isRealtimeAuthSet = _d.isRealtimeAuthSet;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var memoSetup = (0, react_1.useCallback)(setup, __spreadArray([topic], dependencies, true));
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (!carbon)
            return;
        // Define teardown inline - NOT in dependency array
        var teardown = function () { return __awaiter(void 0, void 0, void 0, function () {
            var channel, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (isTearingDownRef.current)
                            return [2 /*return*/];
                        channel = channelRef.current;
                        if (!channel)
                            return [2 /*return*/];
                        isTearingDownRef.current = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        // Add timeout to prevent hanging indefinitely
                        return [4 /*yield*/, Promise.race([
                                carbon.removeChannel(channel),
                                new Promise(function (_, reject) {
                                    return setTimeout(function () { return reject(new Error("Channel removal timeout")); }, 5000);
                                })
                            ])];
                    case 2:
                        // Add timeout to prevent hanging indefinitely
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error removing channel ".concat(topic, ":"), error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        channelRef.current = null;
                        isTearingDownRef.current = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        if (!isRealtimeAuthSet || !enabled) {
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
                retryTimerRef.current = null;
            }
            retryCountRef.current = 0;
            void teardown();
            return;
        }
        var doSubscribe = function () { return __awaiter(void 0, void 0, void 0, function () {
            var channel, configuredChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!channelRef.current) return [3 /*break*/, 2];
                        return [4 /*yield*/, teardown()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        try {
                            channel = carbon.channel(topic);
                            configuredChannel = memoSetup(channel, carbon, dependencies);
                            channelRef.current = configuredChannel;
                            configuredChannel.subscribe(function (status, err) { return __awaiter(void 0, void 0, void 0, function () {
                                var isRetriableError, opts, schedule, delay;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (status === supabase_js_1.REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
                                                retryCountRef.current = 0;
                                                // Dismiss any lingering disconnect toast — reconnect succeeded.
                                                if (lastErrorToastIdRef.current != null) {
                                                    Toast_1.toast.dismiss(lastErrorToastIdRef.current);
                                                    lastErrorToastIdRef.current = null;
                                                }
                                                return [2 /*return*/];
                                            }
                                            isRetriableError = status === supabase_js_1.REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR ||
                                                status === supabase_js_1.REALTIME_SUBSCRIBE_STATES.TIMED_OUT;
                                            if (isRetriableError &&
                                                notifyOnSubscribeError &&
                                                !isSilentReconnectRef.current) {
                                                // Persistent loading toast — sticks with a spinner until reconnect
                                                // succeeds. Reuses the same id so repeated CHANNEL_ERRORs don't
                                                // stack. Underlying error stored in console only; users see a
                                                // calm "reconnecting" indicator, not an alarming red toast.
                                                if (err) {
                                                    console.warn("Realtime ".concat(topic, " ").concat(status, ": ").concat(formatSubscribeErr(err)));
                                                }
                                                opts = {
                                                    id: (_a = lastErrorToastIdRef.current) !== null && _a !== void 0 ? _a : undefined,
                                                    description: "Trying to reconnect…",
                                                    duration: Number.POSITIVE_INFINITY,
                                                    dismissible: false
                                                };
                                                lastErrorToastIdRef.current = Toast_1.toast.loading("Realtime disconnected", opts);
                                                lastErrorToastAtRef.current = Date.now();
                                            }
                                            if (!isRetriableError) return [3 /*break*/, 2];
                                            return [4 /*yield*/, teardown()];
                                        case 1:
                                            _b.sent();
                                            schedule = [1000, 2000, 5000, 10000, 30000, 60000];
                                            delay = schedule[Math.min(retryCountRef.current, schedule.length - 1)];
                                            retryCountRef.current++;
                                            retryTimerRef.current = setTimeout(function () {
                                                retryTimerRef.current = null;
                                                void doSubscribeRef.current();
                                            }, delay);
                                            return [3 /*break*/, 4];
                                        case 2:
                                            if (!(status === supabase_js_1.REALTIME_SUBSCRIBE_STATES.CLOSED)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, teardown()];
                                        case 3:
                                            _b.sent();
                                            _b.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        catch (error) {
                            console.error("Failed to subscribe to realtime channel ".concat(topic, ":"), error);
                            if (notifyOnSubscribeError) {
                                Toast_1.toast.error("Realtime setup failed (".concat(topic, ")"), {
                                    description: error instanceof Error ? error.message : formatSubscribeErr(error)
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        // Keep ref up-to-date so retry timers always call the latest closure.
        doSubscribeRef.current = doSubscribe;
        void doSubscribe();
        var forceReconnect = function (silent) {
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
                retryTimerRef.current = null;
            }
            retryCountRef.current = 0;
            isSilentReconnectRef.current = silent;
            void doSubscribeRef.current().finally(function () {
                isSilentReconnectRef.current = false;
            });
        };
        var handleVisibilityChange = function () {
            if (document.visibilityState === "visible")
                forceReconnect(true);
        };
        var handleOnline = function () { return forceReconnect(true); };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("online", handleOnline);
        // Cleanup on unmount or dependency change
        return function () {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("online", handleOnline);
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
                retryTimerRef.current = null;
            }
            retryCountRef.current = 0;
            if (lastErrorToastIdRef.current != null) {
                Toast_1.toast.dismiss(lastErrorToastIdRef.current);
                lastErrorToastIdRef.current = null;
            }
            void teardown();
        };
    }, [
        carbon,
        isRealtimeAuthSet,
        enabled,
        topic,
        memoSetup,
        notifyOnSubscribeError
        // teardown/doSubscribe are NOT in dependencies - defined inline
    ]);
    return channelRef;
};
exports.useRealtimeChannel = useRealtimeChannel;
