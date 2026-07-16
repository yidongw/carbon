"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIssueVars = buildIssueVars;
/** Merge-field variable map for an Issue. */
function buildIssueVars(data) {
    var _a, _b, _c;
    var nc = data.nonConformance;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "issue.number": str(nc === null || nc === void 0 ? void 0 : nc.nonConformanceId),
        "issue.name": str(nc === null || nc === void 0 ? void 0 : nc.name),
        "issue.status": str(nc === null || nc === void 0 ? void 0 : nc.status),
        "issue.openDate": str(nc === null || nc === void 0 ? void 0 : nc.openDate),
        "issue.closeDate": str(nc === null || nc === void 0 ? void 0 : nc.closeDate),
        "company.name": str((_a = data.company) === null || _a === void 0 ? void 0 : _a.name),
        "company.city": str((_b = data.company) === null || _b === void 0 ? void 0 : _b.city),
        "company.country": str((_c = data.company) === null || _c === void 0 ? void 0 : _c.countryCode)
    };
}
