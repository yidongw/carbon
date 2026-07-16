"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var bi_1 = require("react-icons/bi");
var react_router_1 = require("react-router");
var dom_1 = require("~/utils/dom");
var path_1 = require("~/utils/path");
var ModeSwitcher = function () {
    var t = (0, macro_1.useLingui)().t;
    var mode = (0, react_1.useMode)();
    var nextMode = mode === "dark" ? "light" : "dark";
    var modeLabel = {
        light: <bi_1.BiSun />,
        dark: <bi_1.BiMoon />,
        system: <bi_1.BiLaptop />
    };
    var fetcher = (0, react_router_1.useFetcher)();
    var onClick = function () {
        var formData = new FormData();
        formData.append("mode", nextMode);
        (0, dom_1.startModeTransition)(nextMode, function () {
            fetcher.submit(formData, { method: "post", action: path_1.path.to.root });
        });
    };
    return (<react_1.IconButton icon={modeLabel[nextMode]} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Light Mode"], ["Light Mode"])))} variant="ghost" onClick={onClick} className="hidden sm:block"/>);
};
exports.default = ModeSwitcher;
var templateObject_1;
