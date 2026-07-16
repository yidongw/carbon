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
exports.IntegrationCard = IntegrationCard;
var plan_1 = require("@carbon/ee/plan");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var usePlanGate_1 = require("~/hooks/usePlanGate");
var path_1 = require("~/utils/path");
function IntegrationCard(_a) {
    var _this = this;
    var integration = _a.integration, installed = _a.installed;
    var fetcher = (0, react_router_1.useFetcher)();
    var navigate = (0, react_router_1.useNavigate)();
    var routeData = (0, react_1.useRouteData)(path_1.path.to.integrations);
    var isGated = (0, usePlanGate_1.usePlanGate)({ feature: "INTEGRATIONS" }).isGated;
    var isWhitelisted = (0, plan_1.isIntegrationWhitelisted)(integration.id);
    var isStarterPlan = isGated && !isWhitelisted;
    var getOauthUrl = function (integration) {
        var _a;
        if ("oauth" in integration && !!integration.oauth) {
            var _b = integration.oauth, clientId = _b.clientId, redirectUri = _b.redirectUri, scopes = _b.scopes;
            var encodedRedirectUri = encodeURIComponent("".concat(window.location.origin).concat(redirectUri));
            var encodedScopes = encodeURIComponent(scopes.join(" "));
            var encodedState = encodeURIComponent((_a = routeData === null || routeData === void 0 ? void 0 : routeData.state) !== null && _a !== void 0 ? _a : Math.random().toString(36).substring(2, 15));
            return "".concat(integration.oauth.authUrl, "?client_id=").concat(clientId, "&redirect_uri=").concat(encodedRedirectUri, "&response_type=code&state=").concat(encodedState, "&scope=").concat(encodedScopes);
        }
        return null;
    };
    var handleInstall = function () { return __awaiter(_this, void 0, void 0, function () {
        var oauthUrl, formData;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    oauthUrl = getOauthUrl(integration);
                    if (!oauthUrl) return [3 /*break*/, 1];
                    window.open(oauthUrl);
                    return [3 /*break*/, 5];
                case 1:
                    if (!integration.settings.some(function (setting) { return setting.required; })) return [3 /*break*/, 2];
                    navigate(path_1.path.to.integration(integration.id));
                    return [3 /*break*/, 5];
                case 2:
                    if (!integration.onClientInstall) return [3 /*break*/, 4];
                    return [4 /*yield*/, ((_a = integration.onClientInstall) === null || _a === void 0 ? void 0 : _a.call(integration))];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    formData = new FormData();
                    fetcher.submit(formData, {
                        method: "post",
                        action: path_1.path.to.integration(integration.id)
                    });
                    _b.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleUninstall = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ((_a = integration === null || integration === void 0 ? void 0 : integration.onClientUninstall) === null || _a === void 0 ? void 0 : _a.call(integration))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<react_1.Card data-whitelisted={isGated && isWhitelisted ? "true" : undefined}>
      <div className="pt-6 px-6 h-16 flex items-center justify-between gap-6">
        <integration.logo className="h-10 w-auto"/>
        {integration.active ? (installed ? (<react_1.Badge className="flex-shrink-0" variant="green">
              <macro_1.Trans>Installed</macro_1.Trans>
            </react_1.Badge>) : null) : (<react_1.Badge className="flex-shrink-0" variant="secondary">
            <macro_1.Trans>Coming soon</macro_1.Trans>
          </react_1.Badge>)}
      </div>
      <react_1.CardHeader className="pb-0">
        <div className="flex items-center space-x-2 pb-4">
          <react_1.CardTitle className="text-md font-medium leading-none p-0 m-0">
            {integration.name}
          </react_1.CardTitle>
        </div>
      </react_1.CardHeader>
      <react_1.CardContent className="text-sm text-muted-foreground pb-4">
        {integration.description}
      </react_1.CardContent>
      <react_1.CardFooter className="flex flex-end flex-row-reverse gap-2">
        {isStarterPlan ? (<react_1.Button variant="secondary" leftIcon={<lu_1.LuLock />} asChild>
            <react_router_1.Link to={path_1.path.to.billing}>
              <macro_1.Trans>Upgrade</macro_1.Trans>
            </react_router_1.Link>
          </react_1.Button>) : (<>
            <react_1.Button isDisabled={!installed} variant="secondary" asChild={!!installed}>
              {!installed ? (<span>
                  <macro_1.Trans>Details</macro_1.Trans>
                </span>) : (<react_router_1.Link to={integration.active ? integration.id : "#"}>
                  <macro_1.Trans>Details</macro_1.Trans>
                </react_router_1.Link>)}
            </react_1.Button>
            {installed ? (<fetcher.Form method="post" action={path_1.path.to.integrationDeactivate(integration.id)} onSubmit={handleUninstall}>
                <react_1.Button variant="destructive" type="submit" isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                  <macro_1.Trans>Uninstall</macro_1.Trans>
                </react_1.Button>
              </fetcher.Form>) : (<react_1.Button isDisabled={!integration.active || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} onClick={handleInstall}>
                <macro_1.Trans>Install</macro_1.Trans>
              </react_1.Button>)}
          </>)}
        {installed && integration.active && (<StatusBadge status={installed.health}/>)}
      </react_1.CardFooter>
    </react_1.Card>);
}
var StatusBadge = function (_a) {
    var status = _a.status;
    var colors = {
        healthy: "bg-green-500",
        unhealthy: "bg-red-500",
        inactive: "bg-gray-400"
    };
    var badgeVariants = {
        healthy: "green",
        unhealthy: "red",
        inactive: "gray"
    };
    var ping = colors[status] || "text-gray-400";
    return (<react_1.Badge variant={badgeVariants[status]} className="flex items-center mr-auto gap-x-2 py-0.5">
      <span className="relative flex size-2">
        <span className={(0, react_1.cn)("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", ping)}/>
        <span className={(0, react_1.cn)("relative inline-flex size-2 rounded-full", ping)}/>
      </span>
      {status}
    </react_1.Badge>);
};
