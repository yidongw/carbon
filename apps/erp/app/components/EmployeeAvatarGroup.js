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
var react_1 = require("@carbon/react");
var stores_1 = require("~/stores");
var Avatar_1 = require("./Avatar");
var EmployeeAvatarGroup = function (_a) {
    var employeeIds = _a.employeeIds, size = _a.size, _b = _a.limit, limit = _b === void 0 ? 5 : _b, props = __rest(_a, ["employeeIds", "size", "limit"]);
    var people = (0, stores_1.usePeople)()[0];
    var employees = people.filter(function (p) { return employeeIds.includes(p.id); });
    if (employees.length === 0) {
        return null;
    }
    return (<react_1.AvatarGroup size={size !== null && size !== void 0 ? size : "xs"} limit={limit}>
      <react_1.AvatarGroupList>
        {employees.map(function (employee, index) {
            var _a;
            return (<react_1.Tooltip key={index}>
            <react_1.TooltipTrigger>
              <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} name={(_a = employee.name) !== null && _a !== void 0 ? _a : undefined} path={employee.avatarUrl}/>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>{employee.name}</react_1.TooltipContent>
          </react_1.Tooltip>);
        })}
      </react_1.AvatarGroupList>
      <react_1.AvatarOverflowIndicator />
    </react_1.AvatarGroup>);
};
exports.default = EmployeeAvatarGroup;
