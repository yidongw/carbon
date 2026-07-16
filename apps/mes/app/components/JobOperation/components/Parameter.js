"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametersListItem = ParametersListItem;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
function ParametersListItem(_a) {
    var parameter = _a.parameter, operationId = _a.operationId, className = _a.className;
    var key = parameter.key, value = parameter.value;
    if (!operationId)
        return null;
    return (<div className={(0, react_1.cn)("border-b p-6 hover:bg-muted/30", className)}>
      <div className="flex flex-1 justify-between items-center w-full">
        <react_1.HStack spacing={4} className="w-2/3">
          <react_1.HStack spacing={4} className="flex-1">
            <div className="bg-muted border rounded-full flex items-center justify-center p-2">
              <lu_1.LuActivity />
            </div>
            <p className="text-foreground text-sm font-medium">{key}</p>
          </react_1.HStack>
        </react_1.HStack>
        <div className="flex items-center justify-end gap-2">
          <p className={(0, react_1.cn)("text-foreground", (value === null || value === void 0 ? void 0 : value.length) > 8
            ? "text-sm"
            : "text-2xl font-semibold tracking-tight")}>
            {value}
          </p>
        </div>
      </div>
    </div>);
}
