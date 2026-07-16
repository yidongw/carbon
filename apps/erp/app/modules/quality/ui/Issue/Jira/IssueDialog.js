"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraIssueDialog = void 0;
var jira_1 = require("@carbon/ee/jira");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var pi_1 = require("react-icons/pi");
var react_router_1 = require("react-router");
var Icons_1 = require("~/components/Icons");
var useAsyncFetcher_1 = require("~/hooks/useAsyncFetcher");
var path_1 = require("~/utils/path");
var CreateIssue_1 = require("./CreateIssue");
var LinkIssue_1 = require("./LinkIssue");
var JiraIssueDialog = function (_a) {
    var _b;
    var task = _a.task;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_2.useState)("link"), tab = _c[0], setTab = _c[1];
    var revalidator = (0, react_router_1.useRevalidator)();
    var disclosure = (0, react_1.useDisclosure)({
        onClose: function () {
            setTab("link");
            revalidator.revalidate();
        }
    });
    var linked = jira_1.JiraIssueMappingSchema.safeParse(task.jiraIssue).data;
    var fetcher = (0, useAsyncFetcher_1.useAsyncFetcher)();
    var onUnlink = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetcher.submit({ actionId: task.id }, { method: "DELETE", action: path_1.path.to.api.jiraLinkExistingIssue })];
                case 1:
                    _a.sent();
                    disclosure.onClose();
                    return [2 /*return*/];
            }
        });
    }); };
    var isAlreadyLinked = !!(linked === null || linked === void 0 ? void 0 : linked.id);
    return (<react_1.Modal open={disclosure.isOpen} onOpenChange={function (open) {
            if (!open) {
                disclosure.onClose();
            }
        }}>
      <react_1.ModalTrigger onClick={function () { return disclosure.onToggle(); }}>
        {linked ? (<react_1.Button leftIcon={<Icons_1.JiraIcon className={"size-4"}/>} variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Update Jira issue"], ["Update Jira issue"])))}>
            {linked.key}
          </react_1.Button>) : (<react_1.IconButton icon={<Icons_1.JiraIcon className={"size-4 grayscale"}/>} variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Connect Jira issue"], ["Connect Jira issue"])))}/>)}
      </react_1.ModalTrigger>
      <react_1.ModalContent size={"large"}>
        <react_1.Tabs value={tab} onValueChange={setTab} defaultValue="link">
          <react_1.ModalHeader className="mb-1 flex-row justify-between py-3 pr-10">
            <div className="space-y-1">
              <react_1.ModalTitle>
                <macro_1.Trans>Link Jira Issue</macro_1.Trans>
              </react_1.ModalTitle>
              <react_1.ModalDescription>
                <macro_1.Trans>Search for existing or create a new one</macro_1.Trans>
              </react_1.ModalDescription>
            </div>

            <react_1.TabsList className="max-w-max mb-4">
              <react_1.TabsTrigger value="link" disabled={isAlreadyLinked}>
                Link Existing
              </react_1.TabsTrigger>
              <react_1.TabsTrigger value="create" disabled={isAlreadyLinked}>
                Create New
              </react_1.TabsTrigger>
            </react_1.TabsList>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            {linked && (<div className={(0, react_1.cn)("w-full rounded-lg p-3 mb-3 text-left transition-colors block h-auto border border-secondary")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 justify-between">
                      <react_router_1.Link to={linked.url} target="_blank" rel="noreferrer" className="flex items-center">
                        <span className="mr-2 text-foreground flex items-center">
                          {linked.summary}
                          <lu_1.LuExternalLink className="size-4 ml-2 text-primary"/>
                        </span>
                      </react_router_1.Link>

                      <div className="flex items-center gap-2">
                        <react_1.Badge variant={"outline"} className="font-normal font-mono text-muted-foreground flex items-center">
                          {linked.key}
                        </react_1.Badge>
                        <Icons_1.JiraIssueStatusBadge status={linked.status} className="size-3.5"/>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground flex justify-between items-center">
                      <span>
                        {((_b = linked.assignee) === null || _b === void 0 ? void 0 : _b.displayName)
                ? "Assigned to ".concat(linked.assignee.displayName)
                : "Unassigned"}
                      </span>

                      <react_1.Button onClick={onUnlink} isLoading={fetcher.state === "submitting"} leftIcon={<pi_1.PiLinkBreak />} size="sm" variant={"destructive"}>
                        <macro_1.Trans>Unlink</macro_1.Trans>
                      </react_1.Button>
                    </div>
                  </div>
                </div>
              </div>)}

            <react_1.TabsContent value="link" hidden={isAlreadyLinked} className="relative mt-0">
              <LinkIssue_1.LinkIssue task={task} onClose={disclosure.onClose} linked={linked}/>
            </react_1.TabsContent>
            <react_1.TabsContent value="create" className="relative mt-0">
              <CreateIssue_1.CreateIssue task={task} onClose={disclosure.onClose}/>
            </react_1.TabsContent>
          </react_1.ModalBody>
        </react_1.Tabs>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.JiraIssueDialog = JiraIssueDialog;
var templateObject_1, templateObject_2;
