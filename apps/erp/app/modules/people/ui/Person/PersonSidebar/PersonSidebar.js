"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("~/components/Layout");
var usePersonSidebar_1 = require("./usePersonSidebar");
var PersonSidebar = function (_a) {
    var attributeCategories = _a.attributeCategories, timeCardEnabled = _a.timeCardEnabled;
    var links = (0, usePersonSidebar_1.usePersonSidebar)(attributeCategories, timeCardEnabled);
    return <Layout_1.DetailSidebar links={links}/>;
};
exports.default = PersonSidebar;
