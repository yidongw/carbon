"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJobTravelerVars = buildJobTravelerVars;
/** Merge-field variable map for a Job Traveler. */
function buildJobTravelerVars(data) {
    var _a;
    var job = data.job, item = data.item, customer = data.customer, company = data.company;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "job.number": str(job === null || job === void 0 ? void 0 : job.jobId),
        "job.startDate": str(job === null || job === void 0 ? void 0 : job.startDate),
        "job.dueDate": str(job === null || job === void 0 ? void 0 : job.dueDate),
        "item.readableId": str((_a = job === null || job === void 0 ? void 0 : job.itemReadableIdWithRevision) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.readableIdWithRevision),
        "item.name": str(item === null || item === void 0 ? void 0 : item.name),
        "customer.name": str(customer === null || customer === void 0 ? void 0 : customer.name),
        "company.name": str(company === null || company === void 0 ? void 0 : company.name),
        "company.city": str(company === null || company === void 0 ? void 0 : company.city),
        "company.country": str(company === null || company === void 0 ? void 0 : company.countryCode)
    };
}
