"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiddenModulesPopover = HiddenModulesPopover;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
function HiddenModulesPopover(_a) {
    var hiddenModules = _a.hiddenModules, onToggleHidden = _a.onToggleHidden;
    if (hiddenModules.length === 0)
        return null;
    return (<react_1.Popover>
      <react_1.PopoverTrigger asChild>
        <button type="button" className={(0, react_1.cn)("relative", "h-10 w-10 group-data-[state=expanded]:w-full", "flex items-center rounded-md", "group-data-[state=collapsed]:justify-center", "font-medium shrink-0 inline-flex select-none", "text-muted-foreground", "hover:bg-accent hover:text-accent-foreground", "transition-[background-color,color,width] duration-100 ease-out")}>
          <lu_1.LuPlus className="absolute left-3 top-3 flex items-center justify-center"/>
          <span className={(0, react_1.cn)("min-w-[128px] text-sm", "absolute left-7 group-data-[state=expanded]:left-12", "opacity-0 group-data-[state=expanded]:opacity-100")}>
            Add module
          </span>
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent side="right" align="end" className="w-48 p-1">
        {hiddenModules.map(function (m) { return (<button key={m.key} type="button" onClick={function () { return onToggleHidden(m.key); }} className={(0, react_1.cn)("flex items-center gap-2 w-full px-2 py-1.5 rounded-sm", "text-sm text-left", "hover:bg-accent hover:text-accent-foreground")}>
            <m.icon className="w-4 h-4"/>
            {m.name}
          </button>); })}
      </react_1.PopoverContent>
    </react_1.Popover>);
}
