"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var stores_1 = require("~/stores");
var Avatar_1 = require("../Avatar");
var EmployeeAvatar_1 = require("../EmployeeAvatar");
var EmployeePreview = function (value, options) {
    return <EmployeeAvatar_1.default employeeId={value}/>;
};
var Employee = function (_a) {
    var _b, _c;
    var type = _a.type, inline = _a.inline, props = __rest(_a, ["type", "inline"]);
    var t = (0, macro_1.useLingui)().t;
    var people = (0, stores_1.usePeople)()[0];
    var options = (0, react_1.useMemo)(function () {
        var _a;
        var base = (_a = people.map(function (person) { return ({
            value: person.id,
            label: (<div className="flex flex-row items-center gap-2 flex-grow">
            <Avatar_1.default name={person.name} path={person.avatarUrl} size="xs"/>
            <span>
              {person.name}
              {person.number ? " (".concat(person.number, ")") : ""}
            </span>
          </div>)
        }); })) !== null && _a !== void 0 ? _a : [];
        if (type === "assignee") {
            return __spreadArray([
                {
                    value: "",
                    label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unassigned"], ["Unassigned"])))
                }
            ], base, true);
        }
        return base;
    }, [type, people, t]);
    return (<>
      <form_1.Combobox options={options} {...props} inline={inline ? EmployeePreview : undefined} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Employee"], ["Employee"])))} placeholder={(_c = props === null || props === void 0 ? void 0 : props.placeholder) !== null && _c !== void 0 ? _c : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Select Employee"], ["Select Employee"])))}/>
    </>);
};
Employee.displayName = "Employee";
exports.default = Employee;
var templateObject_1, templateObject_2, templateObject_3;
