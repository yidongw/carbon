"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkIssue = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var Icons_1 = require("~/components/Icons");
var useAsyncFetcher_1 = require("~/hooks/useAsyncFetcher");
var path_1 = require("~/utils/path");
var linkIssueValidator = zod_1.default.object({
    actionId: zod_1.default.string(),
    issueId: zod_1.default.string()
});
var LinkIssue = function (props) {
    var t = (0, macro_1.useLingui)().t;
    var id = (0, react_2.useId)();
    var _a = (0, react_2.useState)(), issueId = _a[0], setIssueId = _a[1];
    var _b = useLinearIssues(), issues = _b.issues, fetcher = _b.fetcher;
    var onSearch = (0, react_1.useDebounce)(function (e) {
        if (!e.target.value || e.target.value.trim().length < 3)
            return;
        fetcher.load(path_1.path.to.api.linearLinkExistingIssue +
            "?actionId=".concat(props.task.id, "&search=").concat(e.target.value));
    }, 300);
    var isSearching = fetcher.state === "loading";
    return (<form_1.ValidatedForm id={id} method="post" action={path_1.path.to.api.linearLinkExistingIssue} validator={linkIssueValidator} 
    // @ts-expect-error TS2322 - TODO: fix type
    fetcher={fetcher} resetAfterSubmit onAfterSubmit={function () { return props.onClose(); }}>
      <form_1.Hidden name="actionId" value={props.task.id}/>
      <form_1.Hidden name="issueId" value={issueId}/>
      <react_1.VStack spacing={4}>
        <div className="w-full flex items-center gap-x-2 relative">
          <react_1.Input name="query" type="search" className="w-full" autoComplete="off" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search by linear issue title..."], ["Search by linear issue title..."])))} onChange={onSearch} disabled={isSearching}/>
          {isSearching && (<react_1.Spinner className="w-5 h-5 absolute right-3.5  text-primary animate-spin"/>)}
        </div>
        <react_1.ToggleGroup orientation="vertical" onValueChange={setIssueId} value={issueId} type="single" className="w-full flex-col gap-y-2">
          {issues.map(function (issue) {
            var _a, _b, _c;
            return (<react_1.ToggleGroupItem key={issue.id} name="issueId" value={issue.id} disabled={issue.id === ((_a = props.linked) === null || _a === void 0 ? void 0 : _a.id)} variant={"outline"} className={(0, react_1.cn)("w-full rounded-lg p-3 text-left transition-colors hover:bg-transparent block h-auto data-[state=on]:bg-transparent hover:data-[state=on]:bg-transparent data-[state=on]:border-primary hover:data-[state=on]:border-primary")}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-between">
                    <react_router_1.Link to={issue.url} target="_blank" rel="noreferrer" className="flex items-center">
                      <span className="mr-2 text-foreground flex items-center">
                        {issue.title}
                        <lu_1.LuExternalLink className="size-4 ml-2 text-primary"/>
                      </span>
                    </react_router_1.Link>

                    <div className="flex items-center gap-2">
                      <react_1.Badge variant={"outline"} className="font-normal font-mono text-muted-foreground flex items-center">
                        {issue.identifier}
                      </react_1.Badge>
                      <Icons_1.LinearIssueStateBadge state={issue.state} className="size-3.5"/>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground flex justify-between items-center">
                    <span>
                      {((_b = issue.assignee) === null || _b === void 0 ? void 0 : _b.email)
                    ? "Assigned to ".concat((_c = issue.assignee) === null || _c === void 0 ? void 0 : _c.email)
                    : "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>
            </react_1.ToggleGroupItem>);
        })}

          {issues.length === 0 && !isSearching && (<p className="text-sm text-muted-foreground">
              No Linear issues found
            </p>)}
        </react_1.ToggleGroup>
      </react_1.VStack>
      <react_1.ModalFooter>
        <react_1.Button variant="secondary" onClick={function () {
            props.onClose();
        }}>
          <macro_1.Trans>Cancel</macro_1.Trans>
        </react_1.Button>
        <form_1.Submit>
          <macro_1.Trans>Save</macro_1.Trans>
        </form_1.Submit>
      </react_1.ModalFooter>
    </form_1.ValidatedForm>);
};
exports.LinkIssue = LinkIssue;
exports.LinkIssue.displayName = "LinkIssue";
var useLinearIssues = function () {
    var _a, _b;
    var fetcher = (0, useAsyncFetcher_1.useAsyncFetcher)();
    return {
        issues: ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.issues) || [],
        linked: ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.linked) || null,
        fetcher: fetcher
    };
};
var templateObject_1;
