"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAbilities = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var Ability = function (props) {
    var _a;
    var options = (0, exports.useAbilities)();
    return (<form_1.Combobox options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Ability"}/>);
};
Ability.displayName = "Ability";
exports.default = Ability;
var useAbilities = function () {
    var abilityFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        abilityFetcher.load(path_1.path.to.api.abilities);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = abilityFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = abilityFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.name
            }); })
            : [];
    }, [abilityFetcher.data]);
    return options;
};
exports.useAbilities = useAbilities;
