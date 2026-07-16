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
exports.loader = loader;
exports.default = SelectCompanyLayout;
var auth_1 = require("@carbon/auth");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var shaders_react_1 = require("@paper-design/shaders-react");
var react_router_1 = require("react-router");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var authSession;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, session_server_1.requireAuthSession)(request, { verify: true })];
                case 1:
                    authSession = _c.sent();
                    // Console terminals are MES-only — never let them reach the ERP picker.
                    // Mirrors the guard in x+/_layout.tsx.
                    if (authSession.console) {
                        throw (0, react_router_1.redirect)((0, auth_1.getMESUrl)());
                    }
                    return [2 /*return*/, {}];
            }
        });
    });
}
var MESH_COLORS = {
    light: ["#bdcdff", "#f7f5ff", "#ffffff", "#e6f3ff"],
    dark: ["#0a1a2d", "#000000", "#0D0D0D", "#050505"]
};
function SelectCompanyLayout() {
    var _a;
    var mode = (0, react_1.useMode)();
    var colors = (_a = MESH_COLORS[mode]) !== null && _a !== void 0 ? _a : MESH_COLORS.light;
    var background = "linear-gradient(to bottom right, ".concat(colors[1], " 35.67%, ").concat(colors[0], " 88.95%)");
    return (<react_1.TooltipProvider>
      <div className="relative h-screen w-screen">
        <div className="absolute inset-0" style={{ background: background }}>
          <shaders_react_1.MeshGradient speed={1} colors={colors} distortion={0.8} swirl={0.1} grainMixer={0} grainOverlay={0} className="absolute inset-0 w-full h-full" style={{ height: "100%", width: "100%" }}/>
        </div>
        <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
          <react_router_1.Outlet />
        </div>
      </div>
    </react_1.TooltipProvider>);
}
