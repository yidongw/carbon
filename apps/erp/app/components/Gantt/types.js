"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gantEventStyle = exports.GantEventLevel = void 0;
var zod_1 = require("zod");
var GantEventLevel;
(function (GantEventLevel) {
    GantEventLevel["TRACE"] = "TRACE";
    GantEventLevel["DEBUG"] = "DEBUG";
    GantEventLevel["INFO"] = "INFO";
    GantEventLevel["LOG"] = "LOG";
    GantEventLevel["WARN"] = "WARN";
    GantEventLevel["ERROR"] = "ERROR";
})(GantEventLevel || (exports.GantEventLevel = GantEventLevel = {}));
var variant = zod_1.z.enum(["primary"]);
var accessoryItem = zod_1.z.object({
    text: zod_1.z.string(),
    variant: zod_1.z.string().optional(),
    url: zod_1.z.string().optional()
});
var accessory = zod_1.z.object({
    items: zod_1.z.array(accessoryItem),
    style: zod_1.z.enum(["person"]).optional()
});
exports.gantEventStyle = zod_1.z
    .object({
    icon: zod_1.z.string().optional(),
    variant: variant.optional(),
    accessory: accessory.optional()
})
    .default({
    icon: undefined,
    variant: undefined
});
