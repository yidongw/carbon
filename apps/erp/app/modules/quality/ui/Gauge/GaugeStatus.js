"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaugeStatus = exports.GaugeRole = exports.GaugeCalibrationStatus = void 0;
var react_1 = require("@carbon/react");
var GaugeStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Active":
            return <react_1.Status color="gray">{status}</react_1.Status>;
        case "Inactive":
            return <react_1.Status color="red">{status}</react_1.Status>;
        default:
            return null;
    }
};
exports.GaugeStatus = GaugeStatus;
var GaugeCalibrationStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Pending":
            return <react_1.Status color="orange">{status}</react_1.Status>;
        case "In-Calibration":
            return <react_1.Status color="green">{status}</react_1.Status>;
        case "Out-of-Calibration":
            return <react_1.Status color="red">{status}</react_1.Status>;
        default:
            return null;
    }
};
exports.GaugeCalibrationStatus = GaugeCalibrationStatus;
var GaugeRole = function (_a) {
    var role = _a.role;
    switch (role) {
        case "Master":
            return <react_1.Status color="blue">{role}</react_1.Status>;
        case "Standard":
            return <react_1.Status color="gray">{role}</react_1.Status>;
        default:
            return null;
    }
};
exports.GaugeRole = GaugeRole;
