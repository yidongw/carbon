"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispositionStatus = DispositionStatus;
var react_1 = require("@carbon/react");
function DispositionStatus(_a) {
    var disposition = _a.disposition;
    switch (disposition) {
        case "Conditional Acceptance":
            return <react_1.Status color="blue">Conditional Acceptance</react_1.Status>;
        case "Deviation Accepted":
            return <react_1.Status color="green">Deviation Accepted</react_1.Status>;
        case "Hold":
            return <react_1.Status color="yellow">Hold</react_1.Status>;
        case "No Action Required":
            return <react_1.Status color="blue">No Action Required</react_1.Status>;
        case "Pending":
            return <react_1.Status color="orange">Pending</react_1.Status>;
        case "Quarantine":
            return <react_1.Status color="red">Quarantine</react_1.Status>;
        case "Repair":
            return <react_1.Status color="yellow">Repair</react_1.Status>;
        case "Return to Supplier":
            return <react_1.Status color="red">Return to Supplier</react_1.Status>;
        case "Rework":
            return <react_1.Status color="yellow">Rework</react_1.Status>;
        case "Scrap":
            return <react_1.Status color="red">Scrap</react_1.Status>;
        case "Use As Is":
            return <react_1.Status color="green">Use As Is</react_1.Status>;
        default:
            return <react_1.Status color="gray">{disposition}</react_1.Status>;
    }
}
