"use strict";
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
exports.SubmoduleVisibility = SubmoduleVisibility;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
/**
 * Toggles that show/hide each nav sub-item of a module (persisted to
 * companySettings.hiddenSubmodules). `groups` should come from the module's
 * submodule hook with { includeHidden: true } so hidden items still appear here.
 */
function SubmoduleVisibility(_a) {
    var _b;
    var groups = _a.groups, hidden = _a.hidden;
    var fetcher = (0, react_router_1.useFetcher)();
    var optimistic = (_b = fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("hiddenSubmodules");
    var current = typeof optimistic === "string" ? JSON.parse(optimistic) : hidden;
    var toggle = function (to, show) {
        var next = show
            ? current.filter(function (x) { return x !== to; })
            : Array.from(new Set(__spreadArray(__spreadArray([], current, true), [to], false)));
        fetcher.submit({ intent: "hiddenSubmodules", hiddenSubmodules: JSON.stringify(next) }, { method: "post" });
    };
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Navigation</macro_1.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <macro_1.Trans>Show or hide items in this module's sidebar.</macro_1.Trans>
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_1.VStack spacing={4} className="max-w-[420px]">
          {groups.map(function (group) { return (<react_1.VStack key={group.name} spacing={1} className="w-full">
              <span className="text-xxs uppercase text-muted-foreground tracking-wide font-light">
                {group.name}
              </span>
              {group.routes.map(function (route) { return (<react_1.HStack key={route.to} className="justify-between w-full py-1.5 border-b border-border last:border-0">
                  <react_1.HStack spacing={2} className="min-w-0">
                    <span className="text-muted-foreground">{route.icon}</span>
                    <span className="text-sm truncate">{route.name}</span>
                  </react_1.HStack>
                  <react_1.Switch checked={!current.includes(route.to)} onCheckedChange={function (checked) { return toggle(route.to, checked); }}/>
                </react_1.HStack>); })}
            </react_1.VStack>); })}
        </react_1.VStack>
      </react_1.CardContent>
    </react_1.Card>);
}
