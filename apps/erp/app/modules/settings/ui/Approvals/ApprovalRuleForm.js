"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var ApprovalRuleForm = function (_a) {
    var _b, _c, _d, _e;
    var rule = _a.rule, documentType = _a.documentType, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var baseCurrencyCode = (0, hooks_1.useUser)().company.baseCurrencyCode;
    var isEditing = !!(rule === null || rule === void 0 ? void 0 : rule.id);
    var isDisabled = !permissions.can("update", "settings");
    var effectiveDocumentType = (rule === null || rule === void 0 ? void 0 : rule.documentType) || documentType;
    var defaultValues = rule
        ? {
            id: rule.id,
            documentType: rule.documentType,
            enabled: (_b = rule.enabled) !== null && _b !== void 0 ? _b : false,
            approverGroupIds: Array.isArray(rule.approverGroupIds)
                ? rule.approverGroupIds
                : [],
            defaultApproverId: (_c = rule.defaultApproverId) !== null && _c !== void 0 ? _c : undefined,
            lowerBoundAmount: (_d = rule.lowerBoundAmount) !== null && _d !== void 0 ? _d : 0,
            escalationDays: (_e = rule.escalationDays) !== null && _e !== void 0 ? _e : undefined
        }
        : {
            name: "",
            documentType: documentType || undefined,
            enabled: true,
            approverGroupIds: [],
            lowerBoundAmount: 0,
            escalationDays: undefined
        };
    return (<react_1.Drawer open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={shared_1.approvalRuleValidator} method="post" action={isEditing
            ? path_1.path.to.approvalRule(rule.id)
            : path_1.path.to.newApprovalRule()} defaultValues={defaultValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? (<macro_1.Trans>Edit Approval Rule</macro_1.Trans>) : (<macro_1.Trans>New Approval Rule</macro_1.Trans>)}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <react_1.VStack spacing={4} className="items-stretch">
              {isEditing && (rule === null || rule === void 0 ? void 0 : rule.id) && <form_1.Hidden name="id" value={rule.id}/>}

              {effectiveDocumentType && (<form_1.Hidden name="documentType" value={effectiveDocumentType}/>)}

              {/* Purchase Order Specific Fields */}
              {effectiveDocumentType &&
            shared_1.approvalDocumentTypesWithAmounts.includes(effectiveDocumentType) && (<form_1.Number name="lowerBoundAmount" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Minimum Amount"], ["Minimum Amount"])))} helperText={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Approval is required at or above this amount, up to the next rule's minimum"], ["Approval is required at or above this amount, up to the next rule's minimum"])))} formatOptions={{
                style: "currency",
                currency: baseCurrencyCode
            }}/>)}

              <Form_1.Users name="approverGroupIds" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Who Can Approve"], ["Who Can Approve"])))} type="employee" placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Select groups or individuals"], ["Select groups or individuals"])))} helperText={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["All members of selected groups and selected individuals will be able to approve requests"], ["All members of selected groups and selected individuals will be able to approve requests"])))}/>

              <Form_1.Employee name="defaultApproverId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Default Approver"], ["Default Approver"])))} placeholder={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Select a default approver"], ["Select a default approver"])))}/>

              <form_1.Boolean name="enabled" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Enabled"], ["Enabled"])))} helperText={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Enable this rule to automatically require approval for matching documents"], ["Enable this rule to automatically require approval for matching documents"])))} variant="large"/>
              {/* <FormNumber
          name="escalationDays"
          label={t`Escalation Days`}
          helperText="Automatically escalate approval requests after this many days. Leave empty to disable escalation."
        /> */}
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <form_1.Submit isDisabled={isDisabled}>
                {isEditing ? (<macro_1.Trans>Update Rule</macro_1.Trans>) : (<macro_1.Trans>Create Rule</macro_1.Trans>)}
              </form_1.Submit>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = ApprovalRuleForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
