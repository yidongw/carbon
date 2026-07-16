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
exports.JobTravelerPageContent = void 0;
var renderer_1 = require("@react-pdf/renderer");
var react_1 = require("react");
var template_1 = require("../template");
var jobTraveler_1 = require("./blocks/jobTraveler");
var tw_1 = require("./blocks/jobTraveler/tw");
var components_1 = require("./components");
/** Build the data bag every Job Traveler block renderer reads from. */
function buildData(props, template) {
    var _a, _b;
    var _c = props.sections, sections = _c === void 0 ? {} : _c;
    var vars = (0, jobTraveler_1.buildJobTravelerVars)(props);
    var headerOptions = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (template.headerSectionId
        ? ((_b = (_a = sections[template.headerSectionId]) === null || _a === void 0 ? void 0 : _a.config) !== null && _b !== void 0 ? _b : {})
        : {}));
    return {
        company: props.company,
        locale: props.locale,
        job: props.job,
        jobOperations: props.jobOperations,
        customer: props.customer,
        item: props.item,
        batchNumber: props.batchNumber,
        bomId: props.bomId,
        notes: props.notes,
        thumbnail: props.thumbnail,
        methodRevision: props.methodRevision,
        theme: template.theme,
        sections: sections,
        vars: vars,
        headerOptions: headerOptions
    };
}
/**
 * Block-driven page body (no Document/Template wrapper) so the multi-make-method
 * route can render one of these per `<Page>`. Resolves the stored template and
 * maps each visible block through the registry.
 */
var JobTravelerPageContent = function (props) {
    var _a;
    var resolved = (0, template_1.resolveTemplate)("jobTraveler", (_a = props.template) !== null && _a !== void 0 ? _a : null);
    var data = buildData(props, resolved);
    var showHeader = resolved.headerSectionId !== null;
    var visibleBlocks = resolved.blocks.filter(function (block) { return block.visible && !(block.type === "header" && !showHeader); });
    return (<renderer_1.View style={(0, tw_1.tw)("flex flex-col")}>
      {visibleBlocks.map(function (block) {
            var render = jobTraveler_1.jobTravelerBlockRegistry[block.type];
            if (!render)
                return null;
            return <react_1.Fragment key={block.id}>{render({ block: block, data: data })}</react_1.Fragment>;
        })}
    </renderer_1.View>);
};
exports.JobTravelerPageContent = JobTravelerPageContent;
var JobTravelerPDF = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var company = _a.company, job = _a.job, jobMakeMethod = _a.jobMakeMethod, jobOperations = _a.jobOperations, customer = _a.customer, item = _a.item, batchNumber = _a.batchNumber, bomId = _a.bomId, locale = _a.locale, meta = _a.meta, notes = _a.notes, thumbnail = _a.thumbnail, _h = _a.title, title = _h === void 0 ? "Job Traveler" : _h, template = _a.template, _j = _a.sections, sections = _j === void 0 ? {} : _j;
    var resolved = (0, template_1.resolveTemplate)("jobTraveler", template !== null && template !== void 0 ? template : null);
    var vars = (0, jobTraveler_1.buildJobTravelerVars)({ job: job, item: item, customer: customer, company: company });
    var headerSection = resolved.headerSectionId
        ? (_b = sections[resolved.headerSectionId]) === null || _b === void 0 ? void 0 : _b.content
        : undefined;
    var footerSection = resolved.footerSectionId
        ? (_c = sections[resolved.footerSectionId]) === null || _c === void 0 ? void 0 : _c.content
        : undefined;
    var headerContent = headerSection
        ? (0, template_1.interpolateContent)(headerSection, vars)
        : undefined;
    var footerContent = footerSection
        ? (0, template_1.interpolateContent)(footerSection, vars)
        : undefined;
    return (<components_1.Template theme={resolved.theme} title={title} meta={{
            author: (_d = meta === null || meta === void 0 ? void 0 : meta.author) !== null && _d !== void 0 ? _d : "Carbon",
            keywords: (_e = meta === null || meta === void 0 ? void 0 : meta.keywords) !== null && _e !== void 0 ? _e : "job traveler, manufacturing",
            subject: (_f = meta === null || meta === void 0 ? void 0 : meta.subject) !== null && _f !== void 0 ? _f : "Job Traveler"
        }} footerDocumentId={job === null || job === void 0 ? void 0 : job.jobId} showFooter={resolved.footerSectionId !== null} showPageNumbers={resolved.settings.showPageNumbers} pageNumberFormat={resolved.settings.pageNumberFormat} showRegistrationLine={resolved.settings.showRegistrationLine} fontFamily={resolved.settings.fontFamily} headerContent={headerContent} footerContent={footerContent}>
      <exports.JobTravelerPageContent company={company} job={job} jobOperations={jobOperations} customer={customer} item={item} batchNumber={batchNumber} bomId={bomId} locale={locale} notes={notes} thumbnail={thumbnail} methodRevision={(_g = jobMakeMethod === null || jobMakeMethod === void 0 ? void 0 : jobMakeMethod.version) === null || _g === void 0 ? void 0 : _g.toString()} template={template} sections={sections}/>
    </components_1.Template>);
};
exports.default = JobTravelerPDF;
