"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOURS_PER_WORKDAY = void 0;
exports.calculateDurationHours = calculateDurationHours;
exports.calculateDurationDays = calculateDurationDays;
exports.calculateDurationMs = calculateDurationMs;
exports.calculateDurationBreakdown = calculateDurationBreakdown;
exports.convertToHours = convertToHours;
exports.convertToMilliseconds = convertToMilliseconds;
var HOURS_PER_WORKDAY = 8;
exports.HOURS_PER_WORKDAY = HOURS_PER_WORKDAY;
var MS_PER_HOUR = 3600000;
var MS_PER_MINUTE = 60000;
var MS_PER_SECOND = 1000;
/**
 * Convert time value to hours based on the unit type
 */
function convertToHours(time, unit, quantity) {
    if (!time || !unit)
        return 0;
    switch (unit) {
        case "Total Hours":
            return time;
        case "Total Minutes":
            return time / 60;
        case "Hours/Piece":
            return time * quantity;
        case "Hours/100 Pieces":
            return (time / 100) * quantity;
        case "Hours/1000 Pieces":
            return (time / 1000) * quantity;
        case "Minutes/Piece":
            return (time * quantity) / 60;
        case "Minutes/100 Pieces":
            return ((time / 100) * quantity) / 60;
        case "Minutes/1000 Pieces":
            return ((time / 1000) * quantity) / 60;
        case "Pieces/Hour":
            return time > 0 ? quantity / time : 0;
        case "Pieces/Minute":
            return time > 0 ? quantity / (time * 60) : 0;
        case "Seconds/Piece":
            return (time * quantity) / 3600;
        default:
            return 0;
    }
}
/**
 * Convert time value to milliseconds based on the unit type
 */
function convertToMilliseconds(time, unit, quantity) {
    if (!time || !unit)
        return 0;
    switch (unit) {
        case "Total Hours":
            return time * MS_PER_HOUR;
        case "Total Minutes":
            return time * MS_PER_MINUTE;
        case "Hours/Piece":
            return time * quantity * MS_PER_HOUR;
        case "Hours/100 Pieces":
            return (time / 100) * quantity * MS_PER_HOUR;
        case "Hours/1000 Pieces":
            return (time / 1000) * quantity * MS_PER_HOUR;
        case "Minutes/Piece":
            return time * quantity * MS_PER_MINUTE;
        case "Minutes/100 Pieces":
            return (time / 100) * quantity * MS_PER_MINUTE;
        case "Minutes/1000 Pieces":
            return (time / 1000) * quantity * MS_PER_MINUTE;
        case "Pieces/Hour":
            return time > 0 ? (quantity / time) * MS_PER_HOUR : 0;
        case "Pieces/Minute":
            return time > 0 ? (quantity / time) * MS_PER_MINUTE : 0;
        case "Seconds/Piece":
            return time * quantity * MS_PER_SECOND;
        default:
            return 0;
    }
}
/**
 * Calculate the total duration of an operation in hours
 * Total = setup + max(labor, machine) since labor and machine can overlap
 */
function calculateDurationHours(operation) {
    var quantity = operation.operationQuantity || 1;
    var setupHours = convertToHours(operation.setupTime, operation.setupUnit, quantity);
    var laborHours = convertToHours(operation.laborTime, operation.laborUnit, quantity);
    var machineHours = convertToHours(operation.machineTime, operation.machineUnit, quantity);
    // Total = setup + max(labor, machine) since labor and machine can overlap
    return setupHours + Math.max(laborHours, machineHours);
}
/**
 * Calculate the total duration of an operation in working days
 * Rounds up to at least 1 day
 */
function calculateDurationDays(operation, hoursPerDay) {
    if (hoursPerDay === void 0) { hoursPerDay = HOURS_PER_WORKDAY; }
    var hours = calculateDurationHours(operation);
    return Math.max(Math.ceil(hours / hoursPerDay), 1);
}
/**
 * Calculate the total duration of an operation in milliseconds
 * Used for load balancing calculations
 */
function calculateDurationMs(operation) {
    var quantity = operation.operationQuantity || 1;
    var setupMs = convertToMilliseconds(operation.setupTime, operation.setupUnit, quantity);
    var laborMs = convertToMilliseconds(operation.laborTime, operation.laborUnit, quantity);
    var machineMs = convertToMilliseconds(operation.machineTime, operation.machineUnit, quantity);
    // Total = setup + max(labor, machine) since labor and machine can overlap
    return setupMs + Math.max(laborMs, machineMs);
}
/**
 * Calculate detailed duration breakdown for an operation
 */
function calculateDurationBreakdown(operation) {
    var quantity = operation.operationQuantity || 1;
    var setupHours = convertToHours(operation.setupTime, operation.setupUnit, quantity);
    var laborHours = convertToHours(operation.laborTime, operation.laborUnit, quantity);
    var machineHours = convertToHours(operation.machineTime, operation.machineUnit, quantity);
    var totalHours = setupHours + Math.max(laborHours, machineHours);
    var totalDays = Math.max(Math.ceil(totalHours / HOURS_PER_WORKDAY), 1);
    var totalMs = totalHours * MS_PER_HOUR;
    return {
        setupHours: setupHours,
        laborHours: laborHours,
        machineHours: machineHours,
        totalHours: totalHours,
        totalDays: totalDays,
        totalMs: totalMs,
    };
}
