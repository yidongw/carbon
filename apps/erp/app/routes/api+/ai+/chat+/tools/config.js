"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolConfigs = void 0;
// Dynamically import all tool configs from sibling files
// Exclude config.ts itself to avoid circular imports
var toolModules = import.meta.glob(["./*.ts", "!./*.server.ts"], {
    eager: true
});
// Create the config object from imported tool modules
exports.toolConfigs = Object.entries(toolModules).reduce(function (acc, _a) {
    var path = _a[0], module = _a[1];
    // Skip config.ts itself to avoid circular imports
    if (path.includes("config.ts"))
        return acc;
    if (module.config) {
        acc[module.config.name] = {
            icon: module.config.icon,
            displayText: module.config.displayText,
            message: module.config.message
        };
    }
    return acc;
}, {});
