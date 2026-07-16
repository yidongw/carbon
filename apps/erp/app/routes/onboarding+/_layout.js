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
exports.shouldRevalidate = void 0;
exports.loader = loader;
exports.default = OnboardingLayout;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var shaders_react_1 = require("@paper-design/shaders-react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var useTheme_1 = require("~/hooks/useTheme");
var resources_1 = require("~/modules/resources");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var shouldRevalidate = function () { return true; };
exports.shouldRevalidate = shouldRevalidate;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, company, locations, pathname, onboardingSteps, pathIndex, previousPath, nextPath;
        var _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(client, companyId),
                            (0, resources_1.getLocationsList)(client, companyId)
                        ])];
                case 2:
                    _d = _g.sent(), company = _d[0], locations = _d[1];
                    pathname = new URL(request.url).pathname;
                    // Onboarding is complete once the company has a name and a location. Plan
                    // selection has moved to Billing settings, so we no longer force it here.
                    if (((_e = company.data) === null || _e === void 0 ? void 0 : _e.name) && ((_f = locations.data) === null || _f === void 0 ? void 0 : _f.length)) {
                        throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot);
                    }
                    onboardingSteps = path_1.onboardingSequence;
                    pathIndex = onboardingSteps.findIndex(function (p) { return p === pathname; });
                    previousPath = pathIndex === 0 ? undefined : onboardingSteps[pathIndex - 1];
                    nextPath = pathIndex === onboardingSteps.length - 1
                        ? path_1.path.to.authenticatedRoot
                        : onboardingSteps[pathIndex + 1];
                    return [2 /*return*/, {
                            currentIndex: pathIndex,
                            onboardingSteps: onboardingSteps.length,
                            previousPath: previousPath,
                            nextPath: nextPath
                        }];
            }
        });
    });
}
var meshColorsByTheme = {
    zinc: {
        light: ["#d4d4d8", "#f4f4f5", "#ffffff", "#e4e4e7"],
        dark: ["#18181b", "#000000", "#0D0D0D", "#050505"]
    },
    neutral: {
        light: ["#d6d3d1", "#f5f5f4", "#ffffff", "#e7e5e4"],
        dark: ["#1c1917", "#000000", "#0D0D0D", "#050505"]
    },
    red: {
        light: ["#fecdd3", "#fff1f2", "#ffffff", "#ffe4e6"],
        dark: ["#2d0a0a", "#000000", "#0D0D0D", "#050505"]
    },
    orange: {
        light: ["#fed7aa", "#fff7ed", "#ffffff", "#ffedd5"],
        dark: ["#2d1a0a", "#000000", "#0D0D0D", "#050505"]
    },
    yellow: {
        light: ["#fde68a", "#fefce8", "#ffffff", "#fef9c3"],
        dark: ["#2d2a0a", "#000000", "#0D0D0D", "#050505"]
    },
    green: {
        light: ["#a7f3d0", "#ecfdf5", "#ffffff", "#d1fae5"],
        dark: ["#023225", "#000000", "#0D0D0D", "#050505"]
    },
    blue: {
        light: ["#bdcdff", "#f7f5ff", "#ffffff", "#e6f3ff"],
        dark: ["#0a1a2d", "#000000", "#0D0D0D", "#050505"]
    },
    violet: {
        light: ["#c4b5fd", "#f5f3ff", "#ffffff", "#ede9fe"],
        dark: ["#1e0a2d", "#000000", "#0D0D0D", "#050505"]
    }
};
function getMeshColors(theme, mode) {
    var _a;
    var colors = (_a = meshColorsByTheme[theme]) !== null && _a !== void 0 ? _a : meshColorsByTheme.blue;
    return mode === "light" ? colors.light : colors.dark;
}
function getBackgroundGradient(theme, mode) {
    var colors = getMeshColors(theme, mode);
    return "linear-gradient(to bottom right, ".concat(colors[1], " 35.67%, ").concat(colors[0], " 88.95%)");
}
function OnboardingLayout() {
    var mode = (0, react_1.useMode)();
    var serverTheme = (0, useTheme_1.useTheme)();
    var _a = (0, react_2.useState)(serverTheme), theme = _a[0], setTheme = _a[1];
    (0, react_2.useEffect)(function () {
        setTheme(serverTheme);
    }, [serverTheme]);
    (0, react_2.useEffect)(function () {
        var handler = function (e) {
            setTheme(e.detail);
        };
        window.addEventListener("onboarding-theme-change", handler);
        return function () { return window.removeEventListener("onboarding-theme-change", handler); };
    }, []);
    var meshGradientColors = getMeshColors(theme, mode);
    var backgroundGradient = getBackgroundGradient(theme, mode);
    return (<react_1.TooltipProvider>
      <div className="relative h-screen w-screen">
        <div className="absolute inset-0" style={{ background: backgroundGradient }}>
          <shaders_react_1.MeshGradient speed={1} colors={meshGradientColors} distortion={0.8} swirl={0.1} grainMixer={0} grainOverlay={0} className="absolute inset-0 w-full h-full" style={{ height: "100%", width: "100%" }}/>
        </div>
        <div className="relative z-10 h-full w-full overflow-y-auto">
          <div className="flex min-h-full w-full items-center justify-center p-4">
            <react_router_1.Outlet />
          </div>
        </div>
      </div>
    </react_1.TooltipProvider>);
}
