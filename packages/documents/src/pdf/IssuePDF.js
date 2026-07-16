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
var react_1 = require("react");
var template_1 = require("../template");
var issue_1 = require("./blocks/issue");
var components_1 = require("./components");
var IssuePDF = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var company = _a.company, meta = _a.meta, nonConformance = _a.nonConformance, nonConformanceTypes = _a.nonConformanceTypes, actionTasks = _a.actionTasks, requiredActions = _a.requiredActions, reviewers = _a.reviewers, items = _a.items, associations = _a.associations, _j = _a.assignees, assignees = _j === void 0 ? {} : _j, _k = _a.jobOperationStepRecords, jobOperationStepRecords = _k === void 0 ? [] : _k, _l = _a.operationToJobId, operationToJobId = _l === void 0 ? {} : _l, locale = _a.locale, _m = _a.title, title = _m === void 0 ? "Issue Report" : _m, template = _a.template, _o = _a.sections, sections = _o === void 0 ? {} : _o;
    var resolved = (0, template_1.resolveTemplate)("issue", template !== null && template !== void 0 ? template : null);
    var vars = (0, issue_1.buildIssueVars)({ nonConformance: nonConformance, company: company });
    var headerOptions = __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (resolved.headerSectionId
        ? ((_c = (_b = sections[resolved.headerSectionId]) === null || _b === void 0 ? void 0 : _b.config) !== null && _c !== void 0 ? _c : {})
        : {}));
    var data = {
        company: company,
        locale: locale,
        nonConformance: nonConformance,
        nonConformanceTypes: nonConformanceTypes,
        actionTasks: actionTasks,
        requiredActions: requiredActions,
        reviewers: reviewers,
        items: items,
        associations: associations,
        assignees: assignees,
        jobOperationStepRecords: jobOperationStepRecords,
        operationToJobId: operationToJobId,
        theme: resolved.theme,
        sections: sections,
        vars: vars,
        headerOptions: headerOptions
    };
    var headerSection = resolved.headerSectionId
        ? (_d = sections[resolved.headerSectionId]) === null || _d === void 0 ? void 0 : _d.content
        : undefined;
    var footerSection = resolved.footerSectionId
        ? (_e = sections[resolved.footerSectionId]) === null || _e === void 0 ? void 0 : _e.content
        : undefined;
    var headerContent = headerSection
        ? (0, template_1.interpolateContent)(headerSection, vars)
        : undefined;
    var footerContent = footerSection
        ? (0, template_1.interpolateContent)(footerSection, vars)
        : undefined;
    var showHeader = resolved.headerSectionId !== null;
    var visibleBlocks = resolved.blocks.filter(function (block) { return block.visible && !(block.type === "header" && !showHeader); });
    return (<components_1.Template theme={resolved.theme} title={title} meta={{
            author: (_f = meta === null || meta === void 0 ? void 0 : meta.author) !== null && _f !== void 0 ? _f : "Carbon",
            keywords: (_g = meta === null || meta === void 0 ? void 0 : meta.keywords) !== null && _g !== void 0 ? _g : "issue report",
            subject: (_h = meta === null || meta === void 0 ? void 0 : meta.subject) !== null && _h !== void 0 ? _h : "Issue Report"
        }} footerLabel={"Issue #".concat(nonConformance.nonConformanceId)} showFooter={resolved.footerSectionId !== null} showPageNumbers={resolved.settings.showPageNumbers} pageNumberFormat={resolved.settings.pageNumberFormat} showRegistrationLine={resolved.settings.showRegistrationLine} fontFamily={resolved.settings.fontFamily} headerContent={headerContent} footerContent={footerContent}>
      {visibleBlocks.map(function (block) {
            var render = issue_1.issueBlockRegistry[block.type];
            if (!render)
                return null;
            return <react_1.Fragment key={block.id}>{render({ block: block, data: data })}</react_1.Fragment>;
        })}
    </components_1.Template>);
};
exports.default = IssuePDF;
