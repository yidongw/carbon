"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function MaintenanceOeeImpact(_a) {
    var oeeImpact = _a.oeeImpact, className = _a.className;
    switch (oeeImpact) {
        case "Down":
            return (<react_1.Badge variant="red" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuCircleX className="h-3 w-3"/>
          <macro_1.Trans>Down</macro_1.Trans>
        </react_1.Badge>);
        case "Planned":
            return (<react_1.Badge variant="secondary" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuCalendar className="h-3 w-3"/>
          <macro_1.Trans>Planned</macro_1.Trans>
        </react_1.Badge>);
        case "Impact":
            return (<react_1.Badge variant="yellow" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuTriangleAlert className="h-3 w-3"/>
          <macro_1.Trans>Impact</macro_1.Trans>
        </react_1.Badge>);
        case "No Impact":
            return (<react_1.Badge variant="blue" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuCircleCheck className="h-3 w-3"/>
          <macro_1.Trans>No Impact</macro_1.Trans>
        </react_1.Badge>);
        default:
            return null;
    }
}
exports.default = MaintenanceOeeImpact;
