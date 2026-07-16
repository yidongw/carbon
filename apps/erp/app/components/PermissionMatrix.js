"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var string_1 = require("~/utils/string");
var PermissionMatrix = function (_a) {
    var matrix = _a.matrix, label = _a.label, isDisabled = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var resolvedLabel = label !== null && label !== void 0 ? label : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Permissions"], ["Permissions"])));
    var modules = matrix.modules, actions = matrix.actions, isChecked = matrix.isChecked, toggleCell = matrix.toggleCell, toggleRow = matrix.toggleRow, toggleAll = matrix.toggleAll, allChecked = matrix.allChecked, someChecked = matrix.someChecked, isRowAllChecked = matrix.isRowAllChecked, isRowIndeterminate = matrix.isRowIndeterminate, hasAction = matrix.hasAction;
    return (<div className={"w-full".concat(isDisabled ? " opacity-50 pointer-events-none select-none" : "")}>
      {resolvedLabel && (<label className="block text-sm font-medium leading-none mb-2">
          {resolvedLabel}
        </label>)}
      <div className="rounded-md border overflow-hidden">
        <react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th className="w-[140px]">
                <div className="flex items-center gap-2">
                  <react_1.Checkbox isChecked={allChecked} isIndeterminate={someChecked && !allChecked} onCheckedChange={function () { return toggleAll(); }}/>
                  <span>
                    <macro_1.Trans>Module</macro_1.Trans>
                  </span>
                </div>
              </react_1.Th>
              {actions.map(function (action) { return (<react_1.Th key={action} className="w-[80px] text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span>{(0, string_1.capitalize)(action)}</span>
                  </div>
                </react_1.Th>); })}
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {modules.map(function (_a) {
            var mod = _a[0];
            return (<react_1.Tr key={mod}>
                <react_1.Td>
                  <div className="flex items-center gap-2">
                    <react_1.Checkbox isChecked={isRowAllChecked(mod)} isIndeterminate={isRowIndeterminate(mod)} onCheckedChange={function () { return toggleRow(mod); }}/>
                    <span className="text-sm font-medium">
                      {(0, string_1.capitalize)(mod)}
                    </span>
                  </div>
                </react_1.Td>
                {actions.map(function (action) { return (<react_1.Td key={action} className="text-center">
                    {hasAction(mod, action) ? (<react_1.Checkbox isChecked={isChecked(mod, action)} onCheckedChange={function () { return toggleCell(mod, action); }}/>) : (<span className="text-muted-foreground pl-6 block">
                        --
                      </span>)}
                  </react_1.Td>); })}
              </react_1.Tr>);
        })}
          </react_1.Tbody>
        </react_1.Table>
      </div>
    </div>);
};
exports.default = PermissionMatrix;
var templateObject_1;
