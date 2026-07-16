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
var EmployeeAvatar = function (_a) {
    var _b, _c;
    var employeeId = _a.employeeId, size = _a.size, _d = _a.withName, withName = _d === void 0 ? true : _d, className = _a.className, props = __rest(_a, ["employeeId", "size", "withName", "className"]);
    var people = (0, stores_1.usePeople)()[0];
    if (!employeeId)
        return null;
    if (employeeId === "system") {
        return (<react_1.HStack className="truncate no-underline hover:no-underline">
        <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} path={undefined}/>
        {withName && <span>System</span>}
      </react_1.HStack>);
    }
    var person = people.find(function (p) { return p.id === employeeId; });
    if (!person) {
        return <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} path={undefined}/>;
    }
    return (<react_1.HStack className="truncate no-underline hover:no-underline">
      <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} path={(_b = person.avatarUrl) !== null && _b !== void 0 ? _b : undefined} name={(_c = person === null || person === void 0 ? void 0 : person.name) !== null && _c !== void 0 ? _c : ""}/>
      {withName && <span>{person.name}</span>}
    </react_1.HStack>);
};
exports.default = EmployeeAvatar;
