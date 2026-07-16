"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var productionLabels_1 = require("~/modules/production/productionLabels");
function MaintenanceSource(_a) {
    var source = _a.source, className = _a.className;
    var getMaintenanceSourceLabel = (0, productionLabels_1.useMaintenanceSourceLabel)();
    if (!source)
        return null;
    var label = getMaintenanceSourceLabel(source);
    switch (source) {
        case "Scheduled":
            return (<react_1.Badge variant="outline" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuCalendarClock />
          {label}
        </react_1.Badge>);
        case "Reactive":
            return (<react_1.Badge variant="orange" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuRefreshCcwDot />
          {label}
        </react_1.Badge>);
        case "Non-Conformance":
            return (<react_1.Badge variant="gray" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuShieldX />
          {label}
        </react_1.Badge>);
        default:
            return null;
    }
}
exports.default = MaintenanceSource;
