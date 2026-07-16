"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bs_1 = require("react-icons/bs");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
var productionLabels_1 = require("~/modules/production/productionLabels");
function MaintenancePriority(_a) {
    var priority = _a.priority, className = _a.className;
    var getMaintenanceDispatchPriorityLabel = (0, productionLabels_1.useMaintenanceDispatchPriorityLabel)();
    if (!priority)
        return null;
    var label = getMaintenanceDispatchPriorityLabel(priority);
    switch (priority) {
        case "Low":
            return (<div className={"flex gap-1 items-center ".concat(className !== null && className !== void 0 ? className : "")}>
          <LowPriorityIcon_1.LowPriorityIcon />
          <span>{label}</span>
        </div>);
        case "Medium":
            return (<div className={"flex gap-1 items-center ".concat(className !== null && className !== void 0 ? className : "")}>
          <MediumPriorityIcon_1.MediumPriorityIcon />
          <span>{label}</span>
        </div>);
        case "High":
            return (<div className={"flex gap-1 items-center ".concat(className !== null && className !== void 0 ? className : "")}>
          <HighPriorityIcon_1.HighPriorityIcon />
          <span>{label}</span>
        </div>);
        case "Critical":
            return (<div className={"flex gap-1 items-center ".concat(className !== null && className !== void 0 ? className : "")}>
          <bs_1.BsExclamationSquareFill className="text-red-500"/>
          <span>{label}</span>
        </div>);
        default:
            return null;
    }
}
exports.default = MaintenancePriority;
