"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShifts = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var Shift = function (props) {
    var _a;
    var options = (0, exports.useShifts)({
        location: props.location
    });
    return (<form_1.Select options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Shift"}/>);
};
exports.default = Shift;
var useShifts = function (props) {
    var shiftFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (props === null || props === void 0 ? void 0 : props.location) {
            shiftFetcher.load(path_1.path.to.api.shifts(props.location));
        }
    }, [props === null || props === void 0 ? void 0 : props.location]);
    var options = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = shiftFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); })) !== null && _c !== void 0 ? _c : [];
    }, [shiftFetcher.data]);
    return options;
};
exports.useShifts = useShifts;
