"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var CustomerPartNumber = function (_a) {
    var customerPartNumber = _a.customerPartNumber, actions = _a.actions;
    return (<div className="grid w-full gap-4 grid-cols-[auto_1fr_auto]">
      <lu_1.LuMapPin className="w-8 h-8"/>
      <react_1.VStack spacing={0}>
        <p className="font-bold line-clamp-1">
          {customerPartNumber.customer.name}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {customerPartNumber.customerPartId}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {customerPartNumber.customerPartRevision}
        </p>
      </react_1.VStack>
      {actions.length > 0 && (<react_1.ActionMenu>
          {actions.map(function (action) { return (<react_1.DropdownMenuItem key={action.label} onClick={action.onClick}>
              {action.icon && <react_1.DropdownMenuIcon icon={action.icon}/>}
              {action.label}
            </react_1.DropdownMenuItem>); })}
        </react_1.ActionMenu>)}
    </div>);
};
exports.default = CustomerPartNumber;
