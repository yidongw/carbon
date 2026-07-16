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
    teamId: zod_1.default.string(),
    title: zod_1.default.string().min(1, "Title is required"),
    description: zod_1.default.string().min(1, "Description is required")
});
var CreateIssue = function (props) {
    var t = (0, macro_1.useLingui)().t;
    var id = (0, react_2.useId)();
    var _a = (0, react_2.useState)(), team = _a[0], setTeam = _a[1];
    var _b = useLinearTeams(team), teams = _b.teams, members = _b.members, fetcher = _b.fetcher;
    var teamOptions = (0, react_2.useMemo)(function () { return teams.map(function (el) { return ({ label: el.name, value: el.id }); }); }, [teams]);
    var membersOptions = (0, react_2.useMemo)(function () { return members.map(function (el) { return ({ label: el.email, value: el.id }); }); }, [members]);
    var isSearching = fetcher.state === "loading";
    return (<form_1.ValidatedForm id={id} method="post" action={path_1.path.to.api.linearCreateIssue} validator={createIssueValidator} 
    // @ts-expect-error TS2322 - TODO: fix type
    fetcher={fetcher} resetAfterSubmit onAfterSubmit={function () { return props.onClose(); }}>
      <react_1.VStack spacing={4}>
        <form_1.Hidden name="actionId" value={props.task.id}/>
        <form_1.Select isLoading={isSearching} label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Linear Team"], ["Linear Team"])))} name="teamId" placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select a team"], ["Select a team"])))} value={team} onChange={function (e) { return setTeam(e === null || e === void 0 ? void 0 : e.value); }} options={teamOptions}/>
        <form_1.Input label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Title"], ["Title"])))} name="title" placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Issue title"], ["Issue title"])))} required/>
        <form_1.TextArea label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Description"], ["Description"])))} name="description" placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Issue description"], ["Issue description"])))} required/>
        <form_1.Select label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Assign To"], ["Assign To"])))} name="assignee" placeholder={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Select a assignee"], ["Select a assignee"])))} isOptional options={membersOptions}/>
      </react_1.VStack>
      <react_1.ModalFooter>
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
var useLinearTeams = function (teamId) {
    var _a, _b;
    var fetcher = (0, useAsyncFetcher_1.useAsyncFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        fetcher.load(path_1.path.to.api.linearCreateIssue + (teamId ? "?teamId=".concat(teamId) : ""));
    }, [teamId]);
    return {
        teams: ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.teams) || [],
        members: ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.members) || [],
        fetcher: fetcher
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
