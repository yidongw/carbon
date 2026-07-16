"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrapReasons = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var ScrapReason = function (props) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var options = (0, exports.useScrapReasons)();
    return (<form_1.Combobox options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Scrap Reason"], ["Scrap Reason"])))}/>);
};
ScrapReason.displayName = "ScrapReason";
exports.default = ScrapReason;
var useScrapReasons = function () {
    var _a;
    var scrapReasonFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        scrapReasonFetcher.load(path_1.path.to.scrapReasons);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        var dataSource = (_b = (_a = scrapReasonFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
        return dataSource.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); });
    }, [(_a = scrapReasonFetcher.data) === null || _a === void 0 ? void 0 : _a.data]);
    return options;
};
exports.useScrapReasons = useScrapReasons;
var templateObject_1;
