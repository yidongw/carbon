"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Comlink = require("comlink");
var core_1 = require("./core");
var api = {
    layout: core_1.computeFullLayout,
    selection: core_1.computeSelectionPath
};
Comlink.expose(api);
