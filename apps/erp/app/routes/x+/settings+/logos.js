"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.action = action;
exports.default = LogosRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var CompanyLogoForm_1 = require("~/modules/settings/ui/Company/CompanyLogoForm");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Logos"], ["Logos"]))),
    to: path_1.path.to.logos
};
var TARGET_UPDATERS = {
    logoLight: settings_1.updateLogoLight,
    logoDark: settings_1.updateLogoDark,
    logoLightIcon: settings_1.updateLogoLightIcon,
    logoDarkIcon: settings_1.updateLogoDarkIcon,
    logoWatermark: settings_1.updateLogoWatermark
};
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, target, logoPath, error;
        var request = _b.request;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _d.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _d.sent();
                    target = formData.get("target");
                    logoPath = formData.get("path");
                    if (typeof target !== "string" || !(target in TARGET_UPDATERS)) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid target" }, { status: 400 })];
                    }
                    return [4 /*yield*/, TARGET_UPDATERS[target](client, companyId, logoPath)];
                case 3:
                    error = (_d.sent()).error;
                    if (error)
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to update logo" }, { status: 500 })];
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function LogosRoute() {
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var company = routeData === null || routeData === void 0 ? void 0 : routeData.company;
    if (!company)
        throw new Error("Company not found");
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto">
        <div className="flex w-full justify-between items-center gap-1">
          <react_1.Heading size="h3">
            <macro_2.Trans>Logos</macro_2.Trans>
          </react_1.Heading>
          <react_1.Badge variant="outline">{CompanyLogoForm_1.maxSizeMB}MB limit</react_1.Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <lu_1.LuSun /> <macro_2.Trans>Mark Light Mode</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Used in the navigation and on documents like sales orders
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <settings_1.CompanyLogoForm company={company} target="logoLightIcon"/>
            </react_1.CardContent>
          </react_1.Card>
          <react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <lu_1.LuMoon /> <macro_2.Trans>Mark Dark Mode</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>Used in the navigation in dark mode</macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <settings_1.CompanyLogoForm company={company} target="logoDarkIcon"/>
            </react_1.CardContent>
          </react_1.Card>
        </div>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle className="flex items-center gap-2">
              <lu_1.LuSun /> <macro_2.Trans>Wordmark Light Mode</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>Used on the home screen and digital quotes</macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <settings_1.CompanyLogoForm company={company} target="logoLight"/>
          </react_1.CardContent>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle className="flex items-center gap-2">
              <lu_1.LuMoon /> <macro_2.Trans>Wordmark Dark Mode</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>Used on the home screen in dark mode</macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <settings_1.CompanyLogoForm company={company} target="logoDark"/>
          </react_1.CardContent>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle className="flex items-center gap-2">
              <macro_2.Trans>PDF Watermark</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>
                Shown as a faint background behind every page of generated PDFs
              </macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <settings_1.CompanyLogoForm company={company} target="logoWatermark"/>
          </react_1.CardContent>
        </react_1.Card>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1;
