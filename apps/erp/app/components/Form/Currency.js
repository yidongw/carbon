"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var CurrencyPreview = function (value, options) {
    var currency = options.find(function (o) { return o.value === value; });
    if (!currency)
        return null;
    return <span>{currency.label}</span>;
};
var Currency = function (_a) {
    var _b;
    var inline = _a.inline, props = __rest(_a, ["inline"]);
    var options = useCurrencyCodes();
    return (<form_1.Combobox {...props} inline={inline ? CurrencyPreview : undefined} options={options} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Currency"}/>);
};
Currency.displayName = "Currency";
exports.default = Currency;
var useCurrencyCodes = function () {
    var currencyFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        currencyFetcher.load(path_1.path.to.api.currencies);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = currencyFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = currencyFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.code,
                label: c.name
            }); })
            : [];
    }, [currencyFetcher.data]);
    return options;
};
