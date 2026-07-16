"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostCentersListView = CostCentersListView;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function CostCentersRow(_a) {
    var _b;
    var costCenter = _a.costCenter, costCenters = _a.costCenters, depth = _a.depth, onEdit = _a.onEdit, onDelete = _a.onDelete, onAddChild = _a.onAddChild;
    var t = (0, macro_1.useLingui)().t;
    var children = costCenters.filter(function (c) { return c.parentCostCenterId === costCenter.id; });
    return (<div>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/50" style={{ paddingLeft: "".concat(depth * 28 + 16, "px") }}>
        {children.length > 0 ? (<lu_1.LuChevronRight className="size-4 text-muted-foreground"/>) : (<div className="size-4"/>)}

        <div className="flex size-8 shrink-0 items-center justify-center bg-muted">
          <lu_1.LuCircleDollarSign className="size-3.5 text-muted-foreground"/>
        </div>

        <div className="flex flex-col gap-0 min-w-0">
          <span className="text-sm font-medium text-foreground">
            {costCenter.name}
          </span>
          {((_b = costCenter.owner) === null || _b === void 0 ? void 0 : _b.fullName) && (<span className="text-xs text-muted-foreground">
              {costCenter.owner.fullName}
            </span>)}
        </div>

        <div className="ml-auto">
          <react_1.DropdownMenu>
            <react_1.DropdownMenuTrigger asChild>
              <react_1.IconButton variant="ghost" size="sm" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Actions"], ["Actions"])))} icon={<lu_1.LuEllipsisVertical />}/>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent align="end" className="w-44">
              <react_1.DropdownMenuItem onClick={function () { return onEdit(costCenter.id); }}>
                <lu_1.LuPencil className="mr-2 size-4"/>
                Edit
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem onClick={function () { return onAddChild(costCenter.id); }}>
                <lu_1.LuPlus className="mr-2 size-4"/>
                Add cost center
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem className="text-destructive focus:text-destructive" onClick={function () { return onDelete(costCenter.id); }}>
                <lu_1.LuTrash2 className="mr-2 size-4"/>
                Delete
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>
        </div>
      </div>

      {children.map(function (child) { return (<CostCentersRow key={child.id} costCenter={child} costCenters={costCenters} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild}/>); })}
    </div>);
}
function CostCentersListView(_a) {
    var costCenters = _a.costCenters, onEdit = _a.onEdit, onDelete = _a.onDelete, onAddChild = _a.onAddChild;
    var roots = costCenters.filter(function (c) { return c.parentCostCenterId === null; });
    return (<div className="bg-card overflow-hidden h-full">
      <div className="grid grid-cols-[1fr_auto] items-center border-b border-border bg-card h-11 px-6">
        <span className="text-sm font-medium text-foreground/80">
          Cost Center
        </span>
        <span className="text-sm font-medium text-foreground/80">Actions</span>
      </div>
      {roots.map(function (root) { return (<CostCentersRow key={root.id} costCenter={root} costCenters={costCenters} depth={0} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild}/>); })}
    </div>);
}
var templateObject_1;
