"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var productionLabels_1 = require("~/modules/production/productionLabels");
function MaintenanceSeverity(_a) {
    var severity = _a.severity, className = _a.className;
    var getMaintenanceSeverityLabel = (0, productionLabels_1.useMaintenanceSeverityLabel)();
    if (!severity)
        return null;
    var label = getMaintenanceSeverityLabel(severity);
    switch (severity) {
        case "Preventive":
            return (<react_1.Badge variant="outline" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuSettings />
          {label}
        </react_1.Badge>);
        case "Operator Performed":
            return (<react_1.Badge variant="blue" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuSquareUser />
          {label}
        </react_1.Badge>);
        case "Support Required":
            return (<react_1.Badge variant="yellow" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuWrench />
          {label}
        </react_1.Badge>);
        case "OEM Required":
            return (<react_1.Badge variant="red" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuTriangleAlert />
          {label}
        </react_1.Badge>);
        default:
            return null;
    }
}
exports.default = MaintenanceSeverity;
