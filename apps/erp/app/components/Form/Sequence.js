"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var Sequence = function (props) {
    var _a;
    var sequenceFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        sequenceFetcher.load(path_1.path.to.api.sequences(props.table));
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = sequenceFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = sequenceFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.id
            }); })
            : [];
    }, [sequenceFetcher.data]);
    return (<form_1.Select options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Sequence"}/>);
};
exports.default = Sequence;
