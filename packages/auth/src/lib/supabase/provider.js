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
exports.CarbonProvider = exports.useCarbon = void 0;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_2 = require("react");
var react_router_1 = require("react-router");
var zustand_1 = require("zustand");
var path_1 = require("../../utils/path");
var client_1 = require("./client");
var react_3 = require("@carbon/react");
Object.defineProperty(exports, "useCarbon", { enumerable: true, get: function () { return react_3.useCarbon; } });
var CarbonProvider = function (_a) {
    var children = _a.children, session = _a.session;
    var store = (0, react_2.useRef)(null);
    if (!store.current) {
        store.current = (0, zustand_1.createStore)(function (set, get) {
            var _a;
            return ({
                accessToken: (_a = session.accessToken) !== null && _a !== void 0 ? _a : "",
                isRealtimeAuthSet: false,
                carbon: (0, client_1.createCarbonWithAuthGetter)(store),
                setAuthToken: function (accessToken) { return __awaiter(void 0, void 0, void 0, function () {
                    var carbon;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                carbon = get().carbon;
                                return [4 /*yield*/, carbon.realtime.setAuth(accessToken)];
                            case 1:
                                _a.sent();
                                set({ accessToken: accessToken, isRealtimeAuthSet: true });
                                return [2 /*return*/];
                        }
                    });
                }); }
            });
        });
        // Keep a module-level reference for HMR recovery
        (0, react_1.setCarbonHmrStore)(store.current);
    }
    var _b = (0, zustand_1.useStore)(store.current), carbon = _b.carbon, setAuthToken = _b.setAuthToken;
    var initialLoad = (0, react_2.useRef)(true);
    var refresh = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (session.accessToken) {
            setAuthToken(session.accessToken);
        }
    }, [carbon, setAuthToken, session.accessToken]);
    (0, react_2.useEffect)(function () {
        var handleVisibilityChange = function () {
            if (document.visibilityState === "visible") {
                refresh.submit(null, {
                    method: "post",
                    action: path_1.path.to.refreshSession
                });
            }
        };
        if (utils_1.isBrowser) {
            document.addEventListener("visibilitychange", handleVisibilityChange);
        }
        return function () {
            if (utils_1.isBrowser) {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            }
        };
    }, [refresh]);
    (0, react_1.useInterval)(function () {
        var _a;
        // refresh ten minutes before expiry
        var expiresAt = (_a = session.expiresAt) !== null && _a !== void 0 ? _a : 0;
        var shouldRefresh = expiresAt - 60 * 10 < Date.now() / 1000;
        var shouldReload = !session.bypass && expiresAt < Date.now() / 1000;
        if (shouldReload) {
            window.location.reload();
        }
        if (!initialLoad.current && shouldRefresh && carbon) {
            refresh.submit(null, {
                method: "post",
                action: path_1.path.to.refreshSession
            });
        }
        initialLoad.current = false;
    }, 60000); // Check every minute
    return (<react_1.CarbonContext.Provider value={store.current}>
      {children}
    </react_1.CarbonContext.Provider>);
};
exports.CarbonProvider = CarbonProvider;
