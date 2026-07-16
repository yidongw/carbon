"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentNode = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("@xyflow/react");
var react_3 = require("react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function DepartmentNodeComponent(_a) {
    var data = _a.data;
    var t = (0, macro_1.useLingui)().t;
    var department = data.department, onEdit = data.onEdit, onDelete = data.onDelete, onAddChild = data.onAddChild;
    return (<div className="group relative">
      <react_2.Handle type="target" position={react_2.Position.Top} className="!bg-transparent !border-0 !w-px !h-px !min-w-0 !min-h-0"/>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md" style={{ minWidth: 170, maxWidth: 220 }}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
          <lu_1.LuBuilding className="size-4 text-muted-foreground"/>
        </div>

        <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
          <span className="truncate text-sm font-medium leading-tight text-foreground">
            {department.name}
          </span>
        </div>

        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <button className="ml-auto shrink-0 rounded-md p-1 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 focus:opacity-100" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Actions"], ["Actions"])))}>
              <lu_1.LuEllipsisVertical className="size-3.5 text-muted-foreground"/>
            </button>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent align="end" className="w-44">
            <react_1.DropdownMenuItem onClick={function () { return onEdit(department.id); }}>
              <lu_1.LuPencil className="mr-2 size-4"/>
              Edit
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem onClick={function () { return onAddChild(department.id); }}>
              <lu_1.LuPlus className="mr-2 size-4"/>
              Add department
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem className="text-destructive focus:text-destructive" onClick={function () { return onDelete(department.id); }}>
              <lu_1.LuTrash2 className="mr-2 size-4"/>
              Delete
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </div>

      <react_2.Handle type="source" position={react_2.Position.Bottom} className="!bg-transparent !border-0 !w-px !h-px !min-w-0 !min-h-0"/>
    </div>);
}
exports.DepartmentNode = (0, react_3.memo)(DepartmentNodeComponent);
var templateObject_1;
