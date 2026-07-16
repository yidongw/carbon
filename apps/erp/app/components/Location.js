"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var lu_1 = require("react-icons/lu");
var Location = function (_a) {
    var location = _a.location, actions = _a.actions;
    if (!location.address) {
        return null;
    }
    var locationName = location.name;
    var addressLines = (0, utils_1.formatAddressLines)(location.address.addressLine1, location.address.addressLine2);
    var cityStatePostalCode = (0, utils_1.formatCityStatePostalCode)(location.address.city, location.address.stateProvince, location.address.postalCode);
    return (<div className="grid w-full gap-4 grid-cols-[auto_1fr_auto]">
      <lu_1.LuMapPin className="size-5 mt-2"/>
      <react_1.VStack spacing={0}>
        <p className="font-bold line-clamp-1">{locationName}</p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {addressLines}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {cityStatePostalCode}
        </p>
        {location.address.country && (<p className="text-sm text-muted-foreground line-clamp-1">
            {location.address.country.name}
          </p>)}
      </react_1.VStack>
      {actions.length > 0 && (<react_1.ActionMenu>
          {actions.map(function (action) { return (<react_1.DropdownMenuItem key={action.label} onClick={action.onClick}>
              {action.icon && <react_1.DropdownMenuIcon icon={action.icon}/>}
              {action.label}
            </react_1.DropdownMenuItem>); })}
        </react_1.ActionMenu>)}
    </div>);
};
exports.default = Location;
