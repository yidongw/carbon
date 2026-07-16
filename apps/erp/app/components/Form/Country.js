"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCountries = void 0;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var path_1 = require("~/utils/path");
var Country = function (props) {
    var t = (0, macro_1.useLingui)().t;
    var options = (0, exports.useCountries)();
    return <Form_1.Combobox options={options} label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Country"], ["Country"])))} {...props}/>;
};
Country.displayName = "Country";
exports.default = Country;
var useCountries = function () {
    var _a, _b;
    var countryFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        countryFetcher.load(path_1.path.to.api.countries);
    });
    var countries = (_b = (_a = countryFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
    var options = countries.map(function (c) { return ({
        value: c.alpha2,
        label: c.name
    }); });
    return options;
};
exports.useCountries = useCountries;
var templateObject_1;
