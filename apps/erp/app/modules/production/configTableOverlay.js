"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConfigTableOverlaySuccess = isConfigTableOverlaySuccess;
exports.buildConfigTableActionResponse = buildConfigTableActionResponse;
var jobConfiguration_1 = require("./jobConfiguration");
function isConfigTableOverlaySuccess(data) {
    return (typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        data.ok === true &&
        "configuration" in data &&
        "total" in data &&
        "primaryKeys" in data);
}
function buildConfigTableActionResponse(configuration) {
    var primaryKeysRaw = configuration.configTablePrimaryKeys;
    var primaryKeys = Array.isArray(primaryKeysRaw)
        ? primaryKeysRaw.filter(function (k) { return typeof k === "string"; })
        : ["Quantities"];
    return {
        ok: true,
        configuration: configuration,
        total: (0, jobConfiguration_1.computeJobConfigTableTotal)(configuration),
        primaryKeys: primaryKeys
    };
}
