"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaugeCalibrationRecordStatus = void 0;
var react_1 = require("@carbon/react");
var GaugeCalibrationRecordStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Pass":
            return <react_1.Status color="green">{status}</react_1.Status>;
        case "Fail":
            return <react_1.Status color="red">{status}</react_1.Status>;
        default:
            return null;
    }
};
exports.GaugeCalibrationRecordStatus = GaugeCalibrationRecordStatus;
