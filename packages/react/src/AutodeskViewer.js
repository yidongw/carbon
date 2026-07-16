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
exports.AutodeskViewer = void 0;
exports.getAccessToken = getAccessToken;
exports.AutodeskProvider = AutodeskProvider;
exports.useAutodesk = useAutodesk;
/// <reference path="./autodesk.d.ts" />
var react_1 = require("react");
var hooks_1 = require("./hooks");
var cn_1 = require("./utils/cn");
var AutodeskContext = (0, react_1.createContext)(null);
function AutodeskProvider(_a) {
    var _this = this;
    var children = _a.children, tokenEndpoint = _a.tokenEndpoint;
    var _b = (0, react_1.useState)(null), token = _b[0], setToken = _b[1];
    (0, hooks_1.useMount)(function () {
        getToken().then(setToken);
    });
    var getToken = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var newToken, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getAccessToken(tokenEndpoint)];
                case 1:
                    newToken = _a.sent();
                    setToken(newToken);
                    return [2 /*return*/, newToken];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to refresh Autodesk token:", error_1);
                    return [2 /*return*/, ""];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [tokenEndpoint]);
    return (<AutodeskContext.Provider value={{ token: token, getToken: getToken }}>
      {children}
    </AutodeskContext.Provider>);
}
function useAutodesk() {
    var context = (0, react_1.useContext)(AutodeskContext);
    if (!context) {
        throw new Error("useAutodesk must be used within an AutodeskProvider");
    }
    return context;
}
var AutodeskViewer = function (_a) {
    var urn = _a.urn, registerExtensionsCallback = _a.registerExtensionsCallback, loadAutodeskExtensions = _a.loadAutodeskExtensions, loadCustomExtensions = _a.loadCustomExtensions, theme = _a.theme, showDefaultToolbar = _a.showDefaultToolbar, className = _a.className;
    var _b = (0, react_1.useState)(null), viewer = _b[0], setViewer = _b[1];
    var viewerRef = (0, react_1.useRef)(null);
    var _c = useAutodesk(), token = _c.token, getToken = _c.getToken;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (!urn ||
            !token ||
            !viewerRef.current ||
            // biome-ignore lint/correctness/noUndeclaredVariables: suppressed due to migration
            typeof Autodesk === "undefined") {
            return;
        }
        var options = {
            env: "AutodeskProduction",
            getAccessToken: function (callback) {
                getToken().then(function (token) {
                    callback(token, 3600);
                });
            }
        };
        // biome-ignore lint/correctness/noUndeclaredVariables: suppressed due to migration
        Autodesk.Viewing.Initializer(options, function () {
            var viewerOptions = {
                extensions: loadAutodeskExtensions || [
                    "Autodesk.DocumentBrowser",
                    "Autodesk.VisualClusters"
                ]
            };
            // biome-ignore lint/correctness/noUndeclaredVariables: suppressed due to migration
            var viewer = new Autodesk.Viewing.GuiViewer3D(viewerRef.current, viewerOptions);
            viewer.start();
            viewer.setTheme(theme || "light-theme");
            viewer.resize();
            var onDocumentLoadSuccess = function (doc) { return __awaiter(void 0, void 0, void 0, function () {
                var extensionPromises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry())];
                        case 1:
                            _a.sent();
                            extensionPromises = (loadCustomExtensions || []).map(function (extension) { return viewer.loadExtension(extension); });
                            return [4 /*yield*/, Promise.all(extensionPromises)];
                        case 2:
                            _a.sent();
                            viewer.toolbar.setVisible(showDefaultToolbar === true);
                            return [2 /*return*/];
                    }
                });
            }); };
            var onDocumentLoadFailure = function (errorCode, errorMessage, errorDetails) {
                console.error({
                    code: errorCode,
                    message: errorMessage,
                    errors: errorDetails
                });
            };
            viewer.setLightPreset(0);
            if (registerExtensionsCallback) {
                registerExtensionsCallback(viewer);
            }
            setViewer(viewer);
            // biome-ignore lint/correctness/noUndeclaredVariables: suppressed due to migration
            Autodesk.Viewing.Document.load("urn:" + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
        });
        return function () {
            if (viewer) {
                viewer.finish();
                setViewer(null);
                // biome-ignore lint/correctness/noUndeclaredVariables: suppressed due to migration
                Autodesk.Viewing.shutdown();
            }
        };
    }, [
        token,
        urn
        // showDefaultToolbar,
        // theme,
        // getToken,
        // loadAutodeskExtensions,
        // registerExtensionsCallback,
        // loadCustomExtensions,
        // viewer,
    ]);
    // biome-ignore lint/correctness/noUndeclaredVariables: suppressed due to migration
    return typeof Autodesk === "undefined" ? (<div>Please include viewer3D.min.js to the index.html </div>) : (<div ref={viewerRef} className={(0, cn_1.cn)("forge-viewer", className)}></div>);
};
exports.AutodeskViewer = AutodeskViewer;
function getAccessToken(endpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(endpoint, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.token];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error getting Autodesk access token:", error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
