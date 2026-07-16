"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function MaintenanceSeverity(_a) {
    var severity = _a.severity, className = _a.className;
    switch (severity) {
        case "Preventive":
            return (<react_1.Badge variant="outline" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuSettings />
          <macro_1.Trans>Preventive</macro_1.Trans>
        </react_1.Badge>);
        case "Operator Performed":
            return (<react_1.Badge variant="blue" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuSquareUser />
          <macro_1.Trans>Operator Performed</macro_1.Trans>
        </react_1.Badge>);
        case "Support Required":
            return (<react_1.Badge variant="yellow" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuWrench />
          <macro_1.Trans>Support Required</macro_1.Trans>
        </react_1.Badge>);
        case "OEM Required":
            return (<react_1.Badge variant="red" className={(0, react_1.cn)(className, "inline-flex items-center gap-1")}>
          <lu_1.LuTriangleAlert />
          <macro_1.Trans>OEM Required</macro_1.Trans>
        </react_1.Badge>);
        default:
            return null;
    }
}
exports.default = MaintenanceSeverity;
