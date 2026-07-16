"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var Template = function (props) {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var templateFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        templateFetcher.load(path_1.path.to.api.templates);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = templateFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (template) {
            var _a;
            return ({
                value: template.id,
                label: template.name,
                helper: (_a = template.description) !== null && _a !== void 0 ? _a : ""
            });
        });
    }, [(_a = templateFetcher.data) === null || _a === void 0 ? void 0 : _a.data]);
    var inlinePreview = props.inline
        ? function (value, opts) { var _a, _b; return (_b = (_a = opts.find(function (o) { return o.value === value; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : value; }
        : undefined;
    return (<form_1.Combobox options={options} {...props} inline={inlinePreview} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Template"], ["Template"])))} isLoading={templateFetcher.state === "loading"} isOptional itemHeight={56}/>);
};
Template.displayName = "Template";
exports.default = Template;
var templateObject_1;
