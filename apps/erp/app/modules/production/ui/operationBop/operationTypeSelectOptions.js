"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationTypeConfigureListOptions = void 0;
exports.useOperationTypeSelectOptions = useOperationTypeSelectOptions;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
function useOperationTypeSelectOptions() {
    return (0, react_1.useMemo)(function () { return [
        { value: "Inside", label: <macro_1.Trans>Inside</macro_1.Trans> },
        { value: "Outside", label: <macro_1.Trans>Outside</macro_1.Trans> },
        {
            value: "Inside and Outside",
            label: <macro_1.Trans>Inside and Outside</macro_1.Trans>
        }
    ]; }, []);
}
exports.operationTypeConfigureListOptions = [
    "Inside",
    "Outside",
    "Inside and Outside"
];
