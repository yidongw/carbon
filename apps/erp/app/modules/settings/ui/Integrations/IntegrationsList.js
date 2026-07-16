"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
var useAnyVisible_1 = require("~/hooks/useAnyVisible");
var usePlanGate_1 = require("~/hooks/usePlanGate");
var IntegrationCard_1 = require("./IntegrationCard");
var IntegrationsList = function (_a) {
    var integrations = _a.integrations, availableIntegrations = _a.availableIntegrations;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, react_1.useUrlParams)()[0];
    var _b = (0, react_2.useState)("all"), filter = _b[0], setFilter = _b[1];
    var isGated = (0, usePlanGate_1.usePlanGate)({ feature: "INTEGRATIONS" }).isGated;
    var search = params.get("search") || "";
    var gridRef = (0, react_2.useRef)(null);
    var installed = integrations.filter(function (i) { return i.id && i.active; });
    var installedIds = installed.map(function (i) { return i.id; });
    var filteredIntegrations = (0, react_2.useMemo)(function () {
        var filtered = availableIntegrations;
        if (search) {
            filtered = filtered.filter(function (integration) {
                return integration.name.toLowerCase().includes(search.toLowerCase());
            });
        }
        if (filter === "installed") {
            filtered = filtered.filter(function (integration) {
                return installedIds.includes(integration.id);
            });
        }
        else if (filter === "available") {
            filtered = filtered.filter(function (integration) {
                return !installedIds.includes(integration.id) && integration.active;
            });
        }
        return filtered;
    }, [availableIntegrations, installedIds, search, filter]);
    var anyWhitelistedVisible = (0, useAnyVisible_1.useAnyVisible)({
        containerRef: gridRef,
        selector: '[data-whitelisted="true"]',
        enabled: isGated,
        deps: [filteredIntegrations]
    });
    var showOverlay = isGated && !anyWhitelistedVisible;
    return (<div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 pt-4 px-4">
        <div>
          <components_1.SearchFilter param="search" size="sm" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search"], ["Search"])))}/>
        </div>
        <div>
          <react_1.Select value={filter} onValueChange={function (value) {
            return setFilter(value);
        }}>
            <react_1.SelectTrigger size="sm">
              <react_1.SelectValue placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select a category"], ["Select a category"])))}/>
            </react_1.SelectTrigger>
            <react_1.SelectContent>
              <react_1.SelectItem value="all">All</react_1.SelectItem>
              <react_1.SelectItem value="installed">Installed</react_1.SelectItem>
              <react_1.SelectItem value="available">Available</react_1.SelectItem>
            </react_1.SelectContent>
          </react_1.Select>
        </div>
      </div>
      <div ref={gridRef} className={"grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 w-full ".concat(isGated ? "pb-64" : "pb-4")}>
        {filteredIntegrations.map(function (integration) {
            return (<IntegrationCard_1.IntegrationCard key={integration.id} integration={integration} installed={installed.find(function (i) { return i.id === integration.id; }) || null}/>);
        })}
      </div>

      {isGated && (<>
          <UpgradeOverlay_1.UpgradeOverlayStickyGradient className={"transition-all duration-300 ease-out ".concat(showOverlay
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20 pointer-events-none")}>
            <UpgradeOverlay_1.UpgradeOverlayIcon>
              <lu_1.LuPuzzle className="size-6 text-muted-foreground"/>
            </UpgradeOverlay_1.UpgradeOverlayIcon>
            <UpgradeOverlay_1.UpgradeOverlayContent>
              <UpgradeOverlay_1.UpgradeOverlayTitle>
                <macro_1.Trans>Integrations</macro_1.Trans>
              </UpgradeOverlay_1.UpgradeOverlayTitle>
              <UpgradeOverlay_1.UpgradeOverlayDescription>
                <macro_1.Trans>
                  Connect to your accounting, project management, and CAD tools
                  and much more.
                </macro_1.Trans>
              </UpgradeOverlay_1.UpgradeOverlayDescription>
            </UpgradeOverlay_1.UpgradeOverlayContent>
            <UpgradeOverlay_1.UpgradeOverlayActions>
              <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
            </UpgradeOverlay_1.UpgradeOverlayActions>
          </UpgradeOverlay_1.UpgradeOverlayStickyGradient>
        </>)}
    </div>);
};
exports.default = IntegrationsList;
var templateObject_1, templateObject_2;
