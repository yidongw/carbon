"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIssue = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var zod_1 = require("zod");
var useAsyncFetcher_1 = require("~/hooks/useAsyncFetcher");
var path_1 = require("~/utils/path");
var createIssueValidator = zod_1.default.object({
    actionId: zod_1.default.string(),
    projectKey: zod_1.default.string().min(1, "Project is required"),
    issueTypeId: zod_1.default.string().min(1, "Issue type is required"),
    title: zod_1.default.string().min(1, "Title is required"),
    description: zod_1.default.string().optional()
});
var CreateIssue = function (props) {
    var t = (0, macro_1.useLingui)().t;
    var id = (0, react_2.useId)();
    var _a = (0, react_2.useState)(), projectKey = _a[0], setProjectKey = _a[1];
    var _b = useJiraProjects(projectKey), projects = _b.projects, issueTypes = _b.issueTypes, members = _b.members, fetcher = _b.fetcher;
    var projectOptions = (0, react_2.useMemo)(function () {
        return projects.map(function (p) { return ({ label: "".concat(p.key, " - ").concat(p.name), value: p.key }); });
    }, [projects]);
    var issueTypeOptions = (0, react_2.useMemo)(function () { return issueTypes.map(function (t) { return ({ label: t.name, value: t.id }); }); }, [issueTypes]);
    var memberOptions = (0, react_2.useMemo)(function () {
        return members.map(function (m) { return ({
            label: m.displayName,
            value: m.accountId
        }); });
    }, [members]);
    var isLoading = fetcher.state === "loading";
    return (<form_1.ValidatedForm id={id} method="post" action={path_1.path.to.api.jiraCreateIssue} validator={createIssueValidator} 
    // @ts-expect-error TS2322 - TODO: fix type
    fetcher={fetcher} resetAfterSubmit onAfterSubmit={function () { return props.onClose(); }}>
      <react_1.VStack spacing={4}>
        <form_1.Hidden name="actionId" value={props.task.id}/>
        <form_1.Select isLoading={isLoading} label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Project"], ["Project"])))} name="projectKey" placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select a project"], ["Select a project"])))} value={projectKey} onChange={function (e) { return setProjectKey(e === null || e === void 0 ? void 0 : e.value); }} options={projectOptions}/>
        <form_1.Select isLoading={isLoading} label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Issue Type"], ["Issue Type"])))} name="issueTypeId" placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Select an issue type"], ["Select an issue type"])))} options={issueTypeOptions} isDisabled={!projectKey || issueTypes.length === 0}/>
        <form_1.Input label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Title"], ["Title"])))} name="title" placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Issue title"], ["Issue title"])))} required/>
        <form_1.TextArea label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Description"], ["Description"])))} name="description" placeholder={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Issue description"], ["Issue description"])))}/>
        <form_1.Select label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Assign To"], ["Assign To"])))} name="assignee" placeholder={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Select an assignee"], ["Select an assignee"])))} isOptional options={memberOptions} isDisabled={!projectKey || members.length === 0}/>
      </react_1.VStack>
      <react_1.ModalFooter className="px-0 pb-0">
        <react_1.Button variant="secondary" onClick={function () {
            props.onClose();
        }}>
          <macro_1.Trans>Cancel</macro_1.Trans>
        </react_1.Button>
        <form_1.Submit>
          <macro_1.Trans>Create</macro_1.Trans>
        </form_1.Submit>
      </react_1.ModalFooter>
    </form_1.ValidatedForm>);
};
exports.CreateIssue = CreateIssue;
exports.CreateIssue.displayName = "CreateIssue";
var useJiraProjects = function (projectKey) {
    var _a, _b, _c;
    var fetcher = (0, useAsyncFetcher_1.useAsyncFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: not necessary
    (0, react_2.useEffect)(function () {
        fetcher.load(path_1.path.to.api.jiraCreateIssue +
            (projectKey ? "?projectKey=".concat(projectKey) : ""));
    }, [projectKey]);
    return {
        projects: ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.projects) || [],
        issueTypes: ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.issueTypes) || [],
        members: ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.members) || [],
        fetcher: fetcher
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
