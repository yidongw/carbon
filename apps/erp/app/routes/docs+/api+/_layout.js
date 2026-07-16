"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.meta = void 0;
exports.links = links;
exports.default = ApiDocsRoute;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var Navigation_1 = require("~/components/Layout/Navigation");
var useSwaggerDocs_1 = require("~/hooks/useSwaggerDocs");
var api_1 = require("~/modules/api");
var docs_css_url_1 = require("~/styles/docs.css?url");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | API Docs" }];
};
exports.meta = meta;
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["API Docs"], ["API Docs"]))),
    to: path_1.path.to.apiIntroduction,
    module: "api"
};
function links() {
    return [{ rel: "stylesheet", href: docs_css_url_1.default }];
}
function ApiDocsRoute() {
    var groups = useApiDocsMenu();
    var selectedLang = (0, api_1.useSelectedLang)();
    var navigate = (0, react_router_1.useNavigate)();
    var pathname = (0, react_router_1.useLocation)().pathname;
    var onChangeLanguage = function (newLang) {
        if (newLang === selectedLang)
            return;
        var newPath = "";
        switch (selectedLang) {
            case "bash":
                newPath = pathname.replace("/bash/", "/".concat(newLang, "/"));
                navigate(newPath);
                break;
            case "js":
                newPath = pathname.replace("/js/", "/".concat(newLang, "/"));
                navigate(newPath);
                break;
            default:
                throw new Error("Invalid language: ".concat(selectedLang));
        }
    };
    return (<api_1.ApiDocsProvider>
      <Navigation_1.CollapsibleSidebarProvider>
        <div className="flex flex-col h-screen">
          <div className="bg-background border-b h-[var(--header-height)] col-span-full px-6 items-center flex flex-shrink-0 justify-between">
            <react_router_1.Link to={path_1.path.to.authenticatedRoot}>
              <img src="/carbon-word-light.svg" alt="Carbon Logo" className="h-6 dark:hidden z-50"/>
              <img src="/carbon-word-dark.svg" alt="Carbon Logo" className="h-6 dark:block hidden z-50"/>
            </react_router_1.Link>
            <ApiDocsConfigInputs />
          </div>
          <div className="relative grid grid-cols-[auto_1fr] w-full h-full">
            <div className="flex absolute top-2 right-2 z-50 gap-2">
              <react_1.Button variant={selectedLang === "js" ? "primary" : "secondary"} onClick={function () {
            onChangeLanguage("js");
        }}>
                JS
              </react_1.Button>
              <react_1.Button variant={selectedLang === "bash" ? "primary" : "secondary"} onClick={function () {
            onChangeLanguage("bash");
        }}>
                Bash
              </react_1.Button>
            </div>
            <Layout_1.GroupedContentSidebar groups={groups} width={270} exactMatch/>
            <div className="Docs Docs--api-page w-full h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
              <div className="Docs--inner-wrapper pt-4">
                <react_1.ClientOnly>{function () { return <react_router_1.Outlet />; }}</react_1.ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </Navigation_1.CollapsibleSidebarProvider>
    </api_1.ApiDocsProvider>);
}
function ApiDocsConfigInputs() {
    var _a = (0, api_1.useApiDocsConfig)(), apiUrl = _a.apiUrl, apiKey = _a.apiKey, setApiUrl = _a.setApiUrl, setApiKey = _a.setApiKey;
    var _b = (0, react_2.useState)(false), showKey = _b[0], setShowKey = _b[1];
    var isConfigured = !!(apiUrl || apiKey);
    return (<react_1.Popover>
      <react_1.PopoverTrigger asChild>
        <react_1.Button variant="secondary" size="sm" className="gap-1.5">
          <lu_1.LuSettings2 className="h-3.5 w-3.5"/>
          <span>API Settings</span>
          {isConfigured && (<span className="h-1.5 w-1.5 rounded-full bg-green-500"/>)}
        </react_1.Button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="end" sideOffset={8} className="w-[400px] p-0">
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              API Configuration
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Set a custom server URL and API key. Snippets will update
              automatically.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Server URL
              </label>
              <react_1.Input size="sm" placeholder="https://your-api-url.supabase.co" value={apiUrl} onChange={function (e) {
            return setApiUrl(e.target.value);
        }} className="font-mono text-xs"/>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                API Key
              </label>
              <div className="relative">
                <react_1.Input size="sm" type={showKey ? "text" : "password"} placeholder="your-api-key" value={apiKey} onChange={function (e) {
            return setApiKey(e.target.value);
        }} className="font-mono text-xs pr-8"/>
                <button type="button" onClick={function () { return setShowKey(function (prev) { return !prev; }); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showKey ? "Hide API key" : "Show API key"}>
                  {showKey ? (<lu_1.LuEyeOff className="h-3.5 w-3.5"/>) : (<lu_1.LuEye className="h-3.5 w-3.5"/>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var tableBlacklist = new Set([
    "apiKey",
    "challengeAttempt",
    "documentTransaction",
    "feedback",
    "groups_recursive",
    "invite",
    "lessonCompletion",
    "oauthClient",
    "oauthCode",
    "oauthToken",
    "purchaseOrderTransaction",
    "salesOrderTransaction",
    "search"
]);
function useApiDocsMenu() {
    var _a;
    var swaggerDocsSchema = (0, useSwaggerDocs_1.useSwaggerDocs)();
    var selectedLang = (0, api_1.useSelectedLang)();
    var result = [
        {
            name: "Getting Started",
            routes: [
                {
                    name: "Introduction",
                    to: path_1.path.to.apiIntro(selectedLang)
                }
            ]
        }
    ];
    var tables = Object.keys((_a = swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.definitions) !== null && _a !== void 0 ? _a : {}).sort();
    var isTable = function (table) {
        var _a;
        if (!(swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.paths))
            return false;
        var tableKey = "/".concat(table);
        return Object.keys((_a = swaggerDocsSchema.paths[tableKey]) !== null && _a !== void 0 ? _a : {}).some(function (x) { return x.toUpperCase() === "POST"; });
    };
    result.push({
        name: "Tables and Views",
        routes: tables
            .filter(function (table) { return !tableBlacklist.has(table); })
            .map(function (table) { return ({
            name: table,
            to: path_1.path.to.apiTable(selectedLang, table),
            icon: isTable(table) ? (<lu_1.LuTable2 className="flex-shrink-0"/>) : (<lu_1.LuEye className="flex-shrink-0"/>)
        }); })
    });
    return result;
}
var templateObject_1;
