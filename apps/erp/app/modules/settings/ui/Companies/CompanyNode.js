"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyNode = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("@xyflow/react");
var macro_1 = require("@lingui/react/macro");
var react_3 = require("react");
var lu_1 = require("react-icons/lu");
function CompanyNodeComponent(_a) {
    var data = _a.data;
    var t = (0, macro_1.useLingui)().t;
    var company = data.company, onDelete = data.onDelete, onAddChild = data.onAddChild;
    var isElimination = company.isEliminationEntity;
    return (<div className="group relative">
      <react_2.Handle type="target" position={react_2.Position.Top} className="!bg-transparent !border-0 !w-px !h-px !min-w-0 !min-h-0"/>

      <div className={"\n          flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 shadow-sm\n          transition-shadow hover:shadow-md\n          ".concat(isElimination ? "border-dashed border-muted-foreground/30" : "border-border", "\n        ")} style={{ minWidth: isElimination ? 140 : 170, maxWidth: 220 }}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
          {company.countryCode && !isElimination ? (<form_1.CountryFlag countryCode={company.countryCode} className="flex h-5 w-7 overflow-hidden rounded-sm"/>) : (<lu_1.LuBuilding2 className="size-4 text-muted-foreground"/>)}
        </div>

        <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
          <span className={"truncate text-sm font-medium leading-tight ".concat(isElimination ? "text-muted-foreground" : "text-foreground")}>
            {company.name}
          </span>
          <span className="text-xs text-muted-foreground leading-tight truncate">
            {company.baseCurrencyCode}
          </span>
        </div>

        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <button className="ml-auto shrink-0 rounded-md p-1 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 focus:opacity-100" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Actions"], ["Actions"])))}>
              <lu_1.LuEllipsisVertical className="size-3.5 text-muted-foreground"/>
            </button>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent align="end" className="w-40">
            {!isElimination && (<react_1.DropdownMenuItem onClick={function () { return onAddChild(company.id); }}>
                <lu_1.LuPlus className="mr-2 size-4"/>
                Add company
              </react_1.DropdownMenuItem>)}

            {company.parentCompanyId && (<react_1.DropdownMenuItem className="text-destructive focus:text-destructive" onClick={function () { return onDelete(company.id); }}>
                <lu_1.LuTrash2 className="mr-2 size-4"/>
                Delete
              </react_1.DropdownMenuItem>)}
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </div>

      <react_2.Handle type="source" position={react_2.Position.Bottom} className="!bg-transparent !border-0 !w-px !h-px !min-w-0 !min-h-0"/>
    </div>);
}
exports.CompanyNode = (0, react_3.memo)(CompanyNodeComponent);
var templateObject_1;
