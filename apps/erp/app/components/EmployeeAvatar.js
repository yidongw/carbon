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
var macro_1 = require("@lingui/react/macro");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var Avatar_1 = require("./Avatar");
var EmployeeAvatar = function (_a) {
    var _b, _c, _d, _e, _f;
    var employeeId = _a.employeeId, fallback = _a.fallback, size = _a.size, _g = _a.withName, withName = _g === void 0 ? true : _g, className = _a.className, rowClassName = _a.rowClassName, props = __rest(_a, ["employeeId", "fallback", "size", "withName", "className", "rowClassName"]);
    var people = (0, stores_1.usePeople)()[0];
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    if (!employeeId)
        return null;
    if (employeeId === "system") {
        return (<react_1.HStack className={(0, react_1.cn)("min-w-0 gap-2 no-underline hover:no-underline", rowClassName !== null && rowClassName !== void 0 ? rowClassName : "items-center")}>
        <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} path={undefined}/>
        {withName && (<span className="min-w-0 break-words text-sm font-medium leading-5">
            <macro_1.Trans>System</macro_1.Trans>
          </span>)}
      </react_1.HStack>);
    }
    var storePerson = people.find(function (p) { return p.id === employeeId; });
    var displayName = formatPersonName({
        firstName: (_b = storePerson === null || storePerson === void 0 ? void 0 : storePerson.firstName) !== null && _b !== void 0 ? _b : fallback === null || fallback === void 0 ? void 0 : fallback.firstName,
        lastName: (_c = storePerson === null || storePerson === void 0 ? void 0 : storePerson.lastName) !== null && _c !== void 0 ? _c : fallback === null || fallback === void 0 ? void 0 : fallback.lastName,
        fullName: (_d = storePerson === null || storePerson === void 0 ? void 0 : storePerson.name) !== null && _d !== void 0 ? _d : fallback === null || fallback === void 0 ? void 0 : fallback.fullName
    });
    var avatarUrl = (_f = (_e = storePerson === null || storePerson === void 0 ? void 0 : storePerson.avatarUrl) !== null && _e !== void 0 ? _e : fallback === null || fallback === void 0 ? void 0 : fallback.avatarUrl) !== null && _f !== void 0 ? _f : undefined;
    if (!storePerson && !fallback) {
        return <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} path={undefined}/>;
    }
    return (<react_1.HStack className={(0, react_1.cn)("min-w-0 gap-2 no-underline hover:no-underline", rowClassName !== null && rowClassName !== void 0 ? rowClassName : "items-center", className)}>
      <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} path={avatarUrl} name={displayName} {...props}/>
      {withName && (<span className="min-w-0 break-words text-sm font-medium leading-5">
          {displayName || "—"}
        </span>)}
    </react_1.HStack>);
};
exports.default = EmployeeAvatar;
