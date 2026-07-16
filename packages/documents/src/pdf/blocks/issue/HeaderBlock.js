"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderBlock = HeaderBlock;
var components_1 = require("../../components");
/** Company logo + "Issue Report" title + issue id. */
function HeaderBlock(_a) {
    var data = _a.data;
    return (<components_1.Header company={data.company} title="Issue Report" documentId={data.nonConformance.nonConformanceId} date={data.nonConformance.openDate} locale={data.locale} options={data.headerOptions}/>);
}
