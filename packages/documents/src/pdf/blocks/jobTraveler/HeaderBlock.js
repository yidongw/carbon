"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderBlock = HeaderBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("./tw");
/** Company logo + "Job Traveler" title + job id (and SO sub-id). */
function HeaderBlock(_a) {
    var data = _a.data;
    var company = data.company, job = data.job, locale = data.locale, headerOptions = data.headerOptions;
    return (<renderer_1.View style={(0, tw_1.tw)("mb-6")}>
      <components_1.Header company={company} title="Job Traveler" documentId={job.jobId} documentSubId={job.salesOrderReadableId
            ? "SO# ".concat(job.salesOrderReadableId)
            : undefined} date={job.startDate} locale={locale} options={headerOptions}/>
    </renderer_1.View>);
}
