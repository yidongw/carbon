"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var StyleSizes = function (props) {
    var _a;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        fetcher.load(path_1.path.to.api.styleSizes);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a;
        return ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? fetcher.data.data.map(function (s) { return ({
                value: s.id,
                label: s.sizeCode,
                helper: s.sizeName
            }); })
            : [];
    }, [fetcher.data]);
    return (<form_1.MultiSelect options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Sizes"}/>);
};
StyleSizes.displayName = "StyleSizes";
exports.default = StyleSizes;
