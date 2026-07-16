"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateTime = formatDateTime;
exports.getJobReadableId = getJobReadableId;
exports.getProcessName = getProcessName;
exports.getUnitCost = getUnitCost;
exports.getEarned = getEarned;
exports.getJobOperationDescription = getJobOperationDescription;
exports.getItemReadableIdWithRevision = getItemReadableIdWithRevision;
exports.getItemName = getItemName;
exports.getJobInternalId = getJobInternalId;
exports.getItemInternalId = getItemInternalId;
exports.hasConfigurationTable = hasConfigurationTable;
function formatDateTime(dateStr) {
    if (!dateStr)
        return "—";
    return new Date(dateStr).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function getJobOperation(row) {
    var _a;
    if (!row.jobOperation)
        return null;
    return Array.isArray(row.jobOperation)
        ? ((_a = row.jobOperation[0]) !== null && _a !== void 0 ? _a : null)
        : row.jobOperation;
}
function getJobReadableId(row) {
    var _a;
    var jo = getJobOperation(row);
    if (!jo)
        return "—";
    var job = Array.isArray(jo.job) ? jo.job[0] : jo.job;
    return (_a = job === null || job === void 0 ? void 0 : job.jobId) !== null && _a !== void 0 ? _a : "—";
}
function getProcessName(row) {
    var _a;
    var jo = getJobOperation(row);
    if (!jo)
        return null;
    var process = Array.isArray(jo.process) ? jo.process[0] : jo.process;
    return (_a = process === null || process === void 0 ? void 0 : process.name) !== null && _a !== void 0 ? _a : null;
}
function getUnitCost(row) {
    var _a, _b;
    return (_b = (_a = getJobOperation(row)) === null || _a === void 0 ? void 0 : _a.insideUnitCost) !== null && _b !== void 0 ? _b : 0;
}
function getEarned(row) {
    var _a;
    return ((_a = row.quantity) !== null && _a !== void 0 ? _a : 0) * getUnitCost(row);
}
function getJobOperationDescription(row) {
    var _a, _b;
    return (_b = (_a = getJobOperation(row)) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : undefined;
}
function getJob(row) {
    var jo = getJobOperation(row);
    if (!jo)
        return null;
    return Array.isArray(jo.job) ? jo.job[0] : jo.job;
}
function getItem(row) {
    var job = getJob(row);
    if (!job)
        return null;
    return Array.isArray(job.item) ? job.item[0] : job.item;
}
function getItemReadableIdWithRevision(row) {
    var _a, _b;
    return (_b = (_a = getItem(row)) === null || _a === void 0 ? void 0 : _a.readableIdWithRevision) !== null && _b !== void 0 ? _b : "—";
}
function getItemName(row) {
    var _a, _b;
    return (_b = (_a = getItem(row)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "";
}
function getJobInternalId(row) {
    var _a, _b;
    if ((_a = row.jobId) === null || _a === void 0 ? void 0 : _a.trim())
        return row.jobId.trim();
    var jo = getJobOperation(row);
    if (jo && "jobId" in jo && typeof jo.jobId === "string" && jo.jobId.trim()) {
        return jo.jobId.trim();
    }
    var job = getJob(row);
    return ((_b = job === null || job === void 0 ? void 0 : job.id) === null || _b === void 0 ? void 0 : _b.trim()) || null;
}
function getItemInternalId(row) {
    var _a, _b;
    if ((_a = row.itemId) === null || _a === void 0 ? void 0 : _a.trim())
        return row.itemId.trim();
    var item = getItem(row);
    return ((_b = item === null || item === void 0 ? void 0 : item.id) === null || _b === void 0 ? void 0 : _b.trim()) || null;
}
function hasConfigurationTable(configuration) {
    if (configuration === null ||
        configuration === undefined ||
        typeof configuration !== "object" ||
        Array.isArray(configuration)) {
        return false;
    }
    var configTable = configuration.configTable;
    return Array.isArray(configTable) && configTable.length > 0;
}
