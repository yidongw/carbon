"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMaterials = exports.useServices = exports.useTools = exports.useParts = exports.useItems = void 0;
var react_1 = require("@nanostores/react");
var nanostores_1 = require("nanostores");
var hooks_1 = require("~/hooks");
var $itemsStore = (0, nanostores_1.atom)([]);
var $partsStore = (0, nanostores_1.computed)($itemsStore, function (item) {
    return item.filter(function (i) { return i.type === "Part"; });
});
var $toolsStore = (0, nanostores_1.computed)($itemsStore, function (item) {
    return item.filter(function (i) { return i.type === "Tool"; });
});
var $serivceStore = (0, nanostores_1.computed)($itemsStore, function (item) {
    return item.filter(function (i) { return i.type === "Service"; });
});
var $materialsStore = (0, nanostores_1.computed)($itemsStore, function (item) {
    return item.filter(function (i) { return i.type === "Material"; });
});
var useItems = function () { return (0, hooks_1.useNanoStore)($itemsStore, "items"); };
exports.useItems = useItems;
var useParts = function () { return (0, react_1.useStore)($partsStore); };
exports.useParts = useParts;
var useTools = function () { return (0, react_1.useStore)($toolsStore); };
exports.useTools = useTools;
var useServices = function () { return (0, react_1.useStore)($serivceStore); };
exports.useServices = useServices;
var useMaterials = function () { return (0, react_1.useStore)($materialsStore); };
exports.useMaterials = useMaterials;
