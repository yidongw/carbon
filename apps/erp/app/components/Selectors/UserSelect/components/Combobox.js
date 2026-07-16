"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = require("../provider");
var Combobox = function (_a) {
    var children = _a.children;
    var onKeyDown = (0, provider_1.default)().onKeyDown;
    return <div onKeyDown={onKeyDown}>{children}</div>;
};
exports.default = Combobox;
