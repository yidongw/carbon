"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleCards = ModuleCards;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
// Mirrors the ERP module icons (app/hooks/useModules.tsx). invoicing/account/
// shared have no top-level nav icon, so the closest lucide stands in.
var MODULE_ICONS = {
    sales: lu_1.LuCrown,
    items: lu_1.LuSquareStack,
    production: lu_1.LuFactory,
    purchasing: lu_1.LuShoppingCart,
    resources: lu_1.LuWrench,
    settings: lu_1.LuSettings,
    quality: lu_1.LuFolderCheck,
    accounting: lu_1.LuLandmark,
    inventory: lu_1.LuBox,
    people: lu_1.LuUsers,
    users: lu_1.LuShield,
    documents: lu_1.LuFiles,
    invoicing: lu_1.LuReceipt,
    account: lu_1.LuCircleUser,
    shared: lu_1.LuLayers
};
function Card(_a) {
    var Icon = _a.icon, label = _a.label, count = _a.count, active = _a.active, onClick = _a.onClick;
    return (<button type="button" onClick={onClick} aria-pressed={active} className={(0, react_1.cn)("flex items-center gap-[9px] text-left p-[10px] rounded-lg border cursor-pointer transition-[border-color,background,transform] duration-150 active:scale-[0.97]", active
            ? "border-[var(--acc)] bg-[var(--acc-tint)]"
            : "border-border bg-card hover:border-muted-foreground")}>
      <Icon size={16} className={(0, react_1.cn)("shrink-0", active ? "text-[var(--acc)]" : "text-muted-foreground")}/>
      <span className="min-w-0">
        <span className="block font-medium text-[0.8rem] text-foreground truncate">
          {label}
        </span>
        <span className="block font-[var(--mono)] text-[0.62rem] text-muted-foreground tabular-nums">
          {count.toLocaleString()}
        </span>
      </span>
    </button>);
}
function ModuleCards(_a) {
    var modules = _a.modules, total = _a.total, value = _a.value, onChange = _a.onChange;
    return (<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[8px] mb-[18px]">
      <Card icon={lu_1.LuLayoutGrid} label="All modules" count={total} active={value === ""} onClick={function () { return onChange(""); }}/>
      {modules.map(function (m) {
            var _a;
            return (<Card key={m.key} icon={(_a = MODULE_ICONS[m.key]) !== null && _a !== void 0 ? _a : lu_1.LuBox} label={m.label} count={m.count} active={value === m.key} onClick={function () { return onChange(value === m.key ? "" : m.key); }}/>);
        })}
    </div>);
}
