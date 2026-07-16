"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesListView = CompaniesListView;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function CompaniesRow(_a) {
    var company = _a.company, companies = _a.companies, depth = _a.depth, onDelete = _a.onDelete, onAddChild = _a.onAddChild;
    var t = (0, macro_1.useLingui)().t;
    var children = companies.filter(function (s) { return s.parentCompanyId === company.id; });
    var isElimination = company.isEliminationEntity;
    var canAddChild = !isElimination;
    var canDelete = !!company.parentCompanyId;
    var hasActions = canAddChild || canDelete;
    return (<div>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/50" style={{ paddingLeft: "".concat(depth * 28 + 16, "px") }}>
        {children.length > 0 ? (<lu_1.LuChevronRight className="size-4 text-muted-foreground"/>) : (<div className="size-4"/>)}

        <div className="flex size-8 shrink-0 items-center justify-center bg-muted">
          {company.countryCode && !isElimination ? (<form_1.CountryFlag countryCode={company.countryCode} className="flex h-4 w-6 overflow-hidden rounded-sm"/>) : (<lu_1.LuBuilding2 className="size-3.5 text-muted-foreground"/>)}
        </div>

        <div className="flex flex-col gap-0 min-w-0">
          <span className={"text-sm font-medium ".concat(isElimination ? "text-muted-foreground" : "text-foreground")}>
            {company.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {company.baseCurrencyCode}
          </span>
        </div>

        {hasActions && (<div className="ml-auto">
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton variant="ghost" size="sm" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Actions"], ["Actions"])))} icon={<lu_1.LuEllipsisVertical />}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end" className="w-44">
                {canAddChild && (<react_1.DropdownMenuItem onClick={function () { return onAddChild(company.id); }}>
                    <lu_1.LuPlus className="mr-2 size-4"/>
                    Add company
                  </react_1.DropdownMenuItem>)}
                {canDelete && (<react_1.DropdownMenuItem className="text-destructive focus:text-destructive" onClick={function () { return onDelete(company.id); }}>
                    <lu_1.LuTrash2 className="mr-2 size-4"/>
                    Delete
                  </react_1.DropdownMenuItem>)}
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>)}
      </div>

      {children.map(function (child) { return (<CompaniesRow key={child.id} company={child} companies={companies} depth={depth + 1} onDelete={onDelete} onAddChild={onAddChild}/>); })}
    </div>);
}
function CompaniesListView(_a) {
    var companies = _a.companies, onDelete = _a.onDelete, onAddChild = _a.onAddChild;
    var roots = companies.filter(function (s) { return s.parentCompanyId === null; });
    return (<div className="bg-card overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] items-center border-b border-border bg-card h-11 px-6">
        <span className="text-sm font-medium text-foreground/80">Company</span>
        <span className="text-sm font-medium text-foreground/80">Actions</span>
      </div>
      {roots.map(function (root) { return (<CompaniesRow key={root.id} company={root} companies={companies} depth={0} onDelete={onDelete} onAddChild={onAddChild}/>); })}
    </div>);
}
var templateObject_1;
