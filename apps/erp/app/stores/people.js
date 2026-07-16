"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePeople = void 0;
var nanostores_1 = require("nanostores");
var react_1 = require("react");
var hooks_1 = require("~/hooks");
var $peopleStore = (0, nanostores_1.atom)([]);
var usePeople = function () {
    var _a = (0, hooks_1.useNanoStore)($peopleStore, "people"), people = _a[0], setPeople = _a[1];
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var formattedPeople = (0, react_1.useMemo)(function () {
        return people.map(function (person) { return (__assign(__assign({}, person), { name: formatPersonName({
                firstName: person.firstName,
                lastName: person.lastName,
                fullName: person.name
            }) || person.name })); });
    }, [people, formatPersonName]);
    return [formattedPeople, setPeople];
};
exports.usePeople = usePeople;
