"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Selectors_1 = require("~/components/Selectors");
var hooks_1 = require("~/hooks");
var FieldItem = (0, react_2.memo)(function (_a) {
    var Icon = _a.icon, label = _a.label, children = _a.children, className = _a.className;
    return (<react_1.VStack spacing={2} className={(0, react_1.cn)("w-full justify-start", className)}>
      <react_1.HStack spacing={2} className="items-center">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-muted/50 shrink-0">
          <Icon className="h-3.5 w-3.5 text-muted-foreground"/>
        </div>
        <p className="text-xs font-medium text-muted-foreground leading-tight">
          {label}
        </p>
      </react_1.HStack>
      <div className="pl-8 w-full">{children}</div>
    </react_1.VStack>);
});
FieldItem.displayName = "FieldItem";
var ApprovalRuleDetails = (0, react_2.memo)(function (_a) {
    var _b, _c;
    var rule = _a.rule, documentType = _a.documentType, currencyFormatter = _a.currencyFormatter;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    return (<react_1.VStack spacing={4} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {documentType === "purchaseOrder" && (<FieldItem icon={lu_1.LuDollarSign} label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Minimum Amount"], ["Minimum Amount"])))}>
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                {currencyFormatter.format((_b = rule.lowerBoundAmount) !== null && _b !== void 0 ? _b : 0)}
              </p>
            </FieldItem>)}

          {/* Approver Groups */}
          <FieldItem icon={lu_1.LuUsers} label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Who Can Approve"], ["Who Can Approve"])))}>
            {rule.approverGroupIds && rule.approverGroupIds.length > 0 ? (<Selectors_1.UserSelect value={(_c = rule.approverGroupIds) !== null && _c !== void 0 ? _c : []} readOnly isMulti className="w-full"/>) : (<p className="text-sm text-muted-foreground leading-relaxed">
                <macro_1.Trans>No groups assigned</macro_1.Trans>
              </p>)}
          </FieldItem>

          {/* Default Approver */}
          <FieldItem icon={lu_1.LuUser} label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Default Approver"], ["Default Approver"])))}>
            {rule.defaultApproverId ? (<components_1.EmployeeAvatar employeeId={rule.defaultApproverId}/>) : (<p className="text-sm text-muted-foreground leading-relaxed">
                <macro_1.Trans>Not set</macro_1.Trans>
              </p>)}
          </FieldItem>

          {/* Escalation Days */}
          {rule.escalationDays !== null &&
            rule.escalationDays !== undefined && (<FieldItem icon={lu_1.LuCircleCheck} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Escalation"], ["Escalation"])))}>
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {rule.escalationDays === 1 ? (<macro_1.Trans>1 day</macro_1.Trans>) : (<macro_1.Trans>{rule.escalationDays} days</macro_1.Trans>)}
                </p>
              </FieldItem>)}
        </div>

        {/* Metadata Section */}
        <div className="pt-6 border-t border-border w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FieldItem icon={lu_1.LuUser} label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Created By"], ["Created By"])))}>
              <components_1.EmployeeAvatar employeeId={rule.createdBy}/>
            </FieldItem>

            {rule.createdAt && (<FieldItem icon={lu_1.LuCalendar} label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Created At"], ["Created At"])))}>
                <p className="text-sm text-foreground leading-relaxed">
                  {formatDate(rule.createdAt)}
                </p>
              </FieldItem>)}
          </div>
        </div>
      </react_1.VStack>);
});
ApprovalRuleDetails.displayName = "ApprovalRuleDetails";
exports.default = ApprovalRuleDetails;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
