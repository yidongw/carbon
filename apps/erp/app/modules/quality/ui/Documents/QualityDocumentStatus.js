"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var QualityDocumentStatus = function (_a) {
    var status = _a.status, iconOnly = _a.iconOnly;
    switch (status) {
        case "Draft":
            return (<react_1.Status color="gray" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Active":
            if (iconOnly) {
                return (<react_1.Status color="green" iconOnly>
            {status}
          </react_1.Status>);
            }
            return (<react_1.Badge variant="green">
          <lu_1.LuLock className="size-3 mr-1"/>
          {status}
        </react_1.Badge>);
        case "Archived":
            if (iconOnly) {
                return (<react_1.Status color="red" iconOnly>
            {status}
          </react_1.Status>);
            }
            return (<react_1.Badge variant="red">
          <lu_1.LuLock className="size-3 mr-1"/>
          {status}
        </react_1.Badge>);
        default:
            return null;
    }
};
exports.default = QualityDocumentStatus;
