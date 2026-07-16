"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var Ability_1 = require("./Ability");
var Abilities = function (props) {
    var _a;
    var options = (0, Ability_1.useAbilities)();
    return (<form_1.MultiSelect options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Ability"}/>);
};
Abilities.displayName = "Abilities";
exports.default = Abilities;
