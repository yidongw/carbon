"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewersList = ReviewersList;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var quality_1 = require("~/modules/quality");
var path_1 = require("~/utils/path");
var IssueTask_1 = require("./IssueTask");
function ReviewersList(_a) {
    var _b;
    var reviewers = _a.reviewers, isDisabled = _a.isDisabled;
    var disclosure = (0, react_1.useDisclosure)();
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) && submitted.current) {
            disclosure.onClose();
            submitted.current = false;
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    if (reviewers.length === 0) {
        return <NewApprovalRequirement isDisabled={isDisabled}/>;
    }
    return (<react_1.Card className="w-full" isCollapsible>
      <react_1.HStack className="justify-between w-full">
        <react_1.CardHeader>
          <react_1.CardTitle className="flex items-center gap-2">
            <macro_1.Trans>Approval Requirements</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <IssueTask_1.TaskProgress tasks={reviewers}/>
      </react_1.HStack>
      <react_1.CardContent>
        <react_1.VStack spacing={3}>
          {reviewers.map(function (reviewer) { return (<IssueTask_1.TaskItem key={reviewer.id} task={reviewer} type="review" suppliers={[]} isDisabled={isDisabled}/>); })}
          {disclosure.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    disclosure.onClose();
            }}>
              <react_1.ModalContent>
                <form_1.ValidatedForm method="post" validator={quality_1.nonConformanceReviewerValidator} fetcher={fetcher} onSubmit={function () {
                submitted.current = true;
            }}>
                  <react_1.ModalHeader>
                    <react_1.ModalTitle>
                      <macro_1.Trans>Add Approval Requirement</macro_1.Trans>
                    </react_1.ModalTitle>
                  </react_1.ModalHeader>
                  <react_1.ModalBody>
                    <form_1.Input name="title" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Title"], ["Title"])))}/>
                  </react_1.ModalBody>
                  <react_1.ModalFooter>
                    <react_1.Button isDisabled={fetcher.state === "submitting"} variant="secondary" onClick={disclosure.onClose}>
                      <macro_1.Trans>Cancel</macro_1.Trans>
                    </react_1.Button>
                    <form_1.Submit isLoading={fetcher.state === "submitting"} isDisabled={fetcher.state === "submitting"}>
                      Submit
                    </form_1.Submit>
                  </react_1.ModalFooter>
                </form_1.ValidatedForm>
              </react_1.ModalContent>
            </react_1.Modal>)}
          <react_1.HStack>
            {disclosure.isOpen ? (<react_1.Button variant="secondary" onClick={disclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>) : (<react_1.Button leftIcon={<lu_1.LuCirclePlus />} onClick={disclosure.onOpen}>
                <macro_1.Trans>Add Requirement</macro_1.Trans>
              </react_1.Button>)}
          </react_1.HStack>
        </react_1.VStack>
      </react_1.CardContent>
    </react_1.Card>);
}
function NewApprovalRequirement(_a) {
    var _b;
    var isDisabled = _a.isDisabled;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var _c = (0, react_2.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var _d = (0, react_2.useState)(false), isMRBChecked = _d[0], setIsMRBChecked = _d[1];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.issue(id));
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && fetcher.data) {
            setIsOpen(false);
            setIsMRBChecked(false);
        }
    }, [fetcher.state, fetcher.data]);
    var handleSubmit = (0, react_2.useCallback)(function () {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("field", "approvalRequirements");
        // Get existing approval requirements and add MRB
        var existingApprovals = (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _a === void 0 ? void 0 : _a.approvalRequirements) !== null && _b !== void 0 ? _b : [];
        var newApprovals = __spreadArray(__spreadArray([], existingApprovals, true), ["MRB"], false);
        formData.append("value", newApprovals.join(","));
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateIssue
        });
    }, [id, (_b = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _b === void 0 ? void 0 : _b.approvalRequirements, fetcher]);
    return (<>
      <button className="flex items-center justify-start bg-card border-2 border-dashed border-background w-full hover:bg-background/80 rounded-lg px-10 py-6 text-muted-foreground hover:text-foreground gap-2 transition-colors duration-200 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return setIsOpen(true); }} disabled={isDisabled}>
        <lu_1.LuCirclePlus size={16}/> <span>Add Approval Requirement</span>
      </button>

      <react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open) {
                setIsOpen(false);
                setIsMRBChecked(false);
            }
        }}>
        <react_1.ModalOverlay />
        <react_1.ModalContent>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Add Approval Requirement</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={2}>
              <label htmlFor="mrb-checkbox" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground border border-border cursor-pointer">
                <react_1.Checkbox id="mrb-checkbox" isChecked={isMRBChecked} onCheckedChange={function (checked) { return setIsMRBChecked(!!checked); }}/>
                <span className="text-sm font-medium">MRB</span>
              </label>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={function () {
            setIsOpen(false);
            setIsMRBChecked(false);
        }}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button onClick={handleSubmit} isLoading={fetcher.state === "submitting"} disabled={!isMRBChecked || fetcher.state !== "idle"}>
              {fetcher.state !== "idle" ? (<macro_1.Trans>Adding...</macro_1.Trans>) : (<macro_1.Trans>Add Requirement</macro_1.Trans>)}
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </react_1.Modal>
    </>);
}
var templateObject_1;
