"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPersonName = formatPersonName;
function formatPersonName(person, lastNameFirst) {
    var _a, _b, _c, _d, _e, _f;
    if (lastNameFirst === void 0) { lastNameFirst = false; }
    var firstName = (_b = (_a = person.firstName) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    var lastName = (_d = (_c = person.lastName) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
    if (firstName || lastName) {
        var parts = lastNameFirst ? [lastName, firstName] : [firstName, lastName];
        return parts.filter(Boolean).join(" ");
    }
    return (_f = (_e = person.fullName) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : "";
}
