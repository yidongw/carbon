"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityIssueModal = QualityIssueModal;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
var path_1 = require("~/utils/path");
function QualityIssueModal(_a) {
    var _b, _c, _d, _e;
    var operationId = _a.operationId, trackedEntityId = _a.trackedEntityId, isOpen = _a.isOpen, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var issueTypeFetcher = (0, react_router_1.useFetcher)();
    var issueTypes = (_c = (_b = issueTypeFetcher.data) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : [];
    (0, react_2.useEffect)(function () {
        if (isOpen) {
            issueTypeFetcher.load(path_1.path.to.api.qualityIssueTypes);
        }
    }, [isOpen, issueTypeFetcher.load]);
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.state === "idle" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success)) {
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quality issue created"], ["Quality issue created"]))));
            onClose();
        }
    }, [fetcher.state, fetcher.data, onClose, t]);
    if (!isOpen)
        return null;
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.qualityIssueNew} validator={models_1.qualityIssueValidator} defaultValues={{
            jobOperationId: operationId,
            description: "",
            nonConformanceTypeId: (_e = (_d = issueTypes[0]) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : "",
            priority: "Medium",
            trackedEntityId: trackedEntityId !== null && trackedEntityId !== void 0 ? trackedEntityId : ""
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Create Quality Issue</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="jobOperationId" value={operationId}/>
            {trackedEntityId && (<form_1.Hidden name="trackedEntityId" value={trackedEntityId}/>)}
            <react_1.VStack spacing={4}>
              <form_1.Select name="nonConformanceTypeId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Issue Type"], ["Issue Type"])))} size="lg" options={issueTypes.map(function (type) { return ({
            value: type.id,
            label: type.name
        }); })}/>
              <form_1.Select name="priority" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Priority"], ["Priority"])))} size="lg" options={models_1.qualityIssuePriority.map(function (p) { return ({
            value: p,
            label: p
        }); })}/>
              <form_1.TextArea name="description" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Description"], ["Description"])))} placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Describe the problem..."], ["Describe the problem..."])))} size="lg"/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <react_1.Button variant="secondary" size="lg" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <form_1.Submit size="lg" isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Create Issue</macro_1.Trans>
              </form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
