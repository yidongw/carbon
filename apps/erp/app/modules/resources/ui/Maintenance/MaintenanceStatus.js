"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var productionLabels_1 = require("~/modules/production/productionLabels");
function MaintenanceStatus(_a) {
    var status = _a.status, className = _a.className, iconOnly = _a.iconOnly;
    var getMaintenanceDispatchStatusLabel = (0, productionLabels_1.useMaintenanceDispatchStatusLabel)();
    if (!status)
        return null;
    var label = getMaintenanceDispatchStatusLabel(status);
    switch (status) {
        case "Open":
            return (<react_1.Status color="gray" className={className} iconOnly={iconOnly}>
          {label}
        </react_1.Status>);
        case "Assigned":
            return (<react_1.Status color="yellow" className={className} iconOnly={iconOnly}>
          {label}
        </react_1.Status>);
        case "In Progress":
            return (<react_1.Status color="blue" className={className} iconOnly={iconOnly}>
          {label}
        </react_1.Status>);
        case "Completed":
            return (<react_1.Status color="green" className={className} iconOnly={iconOnly}>
          {label}
        </react_1.Status>);
        case "Cancelled":
            return (<react_1.Status color="red" className={className} iconOnly={iconOnly}>
          {label}
        </react_1.Status>);
        default:
            return null;
    }
}
exports.default = MaintenanceStatus;
