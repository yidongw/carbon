"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var productionLabels_1 = require("../../productionLabels");
var ProcedureStatus = function (_a) {
    var status = _a.status, iconOnly = _a.iconOnly;
    var getProcedureStatusLabel = (0, productionLabels_1.useProcedureStatusLabel)();
    if (!status)
        return null;
    var label = getProcedureStatusLabel(status);
    switch (status) {
        case "Draft":
            return (<react_1.Status color="gray" iconOnly={iconOnly}>
          {label}
        </react_1.Status>);
        case "Active":
            if (iconOnly) {
                return (<react_1.Status color="green" iconOnly>
            {label}
          </react_1.Status>);
            }
            return (<react_1.Badge variant="green">
          <lu_1.LuLock className="size-3 mr-1"/>
          {label}
        </react_1.Badge>);
        case "Archived":
            if (iconOnly) {
                return (<react_1.Status color="red" iconOnly>
            {label}
          </react_1.Status>);
            }
            return (<react_1.Badge variant="red">
          <lu_1.LuLock className="size-3 mr-1"/>
          {label}
        </react_1.Badge>);
        default:
            return null;
    }
};
exports.default = ProcedureStatus;
