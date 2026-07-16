"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greeting = Greeting;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
function Greeting(props) {
    var t = (0, macro_1.useLingui)().t;
    var user = (0, hooks_1.useUser)();
    var _a = (0, react_2.useState)(function () { return (0, date_1.now)((0, date_1.getLocalTimeZone)()); }), currentTime = _a[0], setCurrentTime = _a[1];
    (0, react_1.useInterval)(function () {
        setCurrentTime((0, date_1.now)((0, date_1.getLocalTimeZone)()));
    }, 60 * 60 * 1000);
    var greeting = (0, react_2.useMemo)(function () {
        if (currentTime.hour >= 3 && currentTime.hour < 12) {
            return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Good morning, ", ""], ["Good morning, ", ""])), user.firstName);
        }
        else if (currentTime.hour >= 12 && currentTime.hour < 18) {
            return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Good afternoon, ", ""], ["Good afternoon, ", ""])), user.firstName);
        }
        else {
            return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Good evening, ", ""], ["Good evening, ", ""])), user.firstName);
        }
    }, [currentTime.hour, t, user.firstName]);
    return (<react_1.Heading size="h3" {...props}>
      {greeting}
    </react_1.Heading>);
}
var templateObject_1, templateObject_2, templateObject_3;
