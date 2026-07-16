"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Route;
var useSwaggerDocs_1 = require("~/hooks/useSwaggerDocs");
var api_1 = require("~/modules/api");
var string_1 = require("~/utils/string");
var functionPath = "rpc/";
function Route() {
    var swaggerDocsSchema = (0, useSwaggerDocs_1.useSwaggerDocs)();
    //
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var rpcs = Object.entries((swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.paths) || {}).reduce(function (a, _a) {
        var _b;
        var name = _a[0];
        var trimmedName = name.slice(1);
        var id = trimmedName.replace(functionPath, "");
        var displayName = id.replace(/_/g, " ");
        var camelCase = (0, string_1.snakeToCamel)(id);
        var enriched = { id: id, displayName: displayName, camelCase: camelCase };
        if (!trimmedName.length) {
            return a;
        }
        return {
            rpcs: __assign(__assign({}, a.rpcs), (trimmedName.includes(functionPath)
                ? (_b = {},
                    _b[id] = enriched,
                    _b) : {}))
        };
    }, { rpcs: {} }).rpcs;
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var selectedLang = (0, api_1.useSelectedLang)();
    return null;
}
