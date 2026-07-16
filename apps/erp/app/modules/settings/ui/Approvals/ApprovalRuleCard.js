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
var react_router_1 = require("react-router");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var ApprovalRuleDetails_1 = require("./ApprovalRuleDetails");
var ApprovalRuleCard = (0, react_2.memo)(function (_a) {
    var _b, _c;
    var rule = _a.rule, documentType = _a.documentType, _d = _a.upperBound, upperBound = _d === void 0 ? null : _d;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)({
        notation: "compact", // short/compact form
        compactDisplay: "short" // "short" → 1.2M, "long" → 1.2 million
    });
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var canEdit = permissions.can("update", "settings");
    var canDelete = permissions.can("update", "settings");
    var handleEdit = (0, react_2.useCallback)(function () {
        if (!rule.id)
            return;
        navigate("".concat(path_1.path.to.approvalRule(rule.id), "?").concat(params.toString()));
    }, [navigate, params, rule.id]);
    var handleDeleteClick = (0, react_2.useCallback)(function () {
        deleteDisclosure.onOpen();
    }, [deleteDisclosure]);
    var handleDeleteConfirm = (0, react_2.useCallback)(function () {
        deleteDisclosure.onClose();
    }, [deleteDisclosure]);
    if (!rule.id)
        return null;
    return (<>
        <react_1.Card className="p-0 border">
          <react_1.Accordion type="multiple" className="w-full">
            <react_1.AccordionItem value={rule.id} className="border-none">
              <div className="relative">
                <react_1.AccordionTrigger className="px-6 py-8 hover:no-underline w-full">
                  <react_1.HStack spacing={4} className="flex-1 justify-between pr-12">
                    <react_1.Heading size="h4" as="h3">
                      {shared_1.approvalDocumentTypeLabel[documentType]}
                      {shared_1.approvalDocumentTypesWithAmounts.includes(documentType) &&
            (upperBound != null
                ? " ".concat(currencyFormatter.format((_b = rule.lowerBoundAmount) !== null && _b !== void 0 ? _b : 0), " \u2013 ").concat(currencyFormatter.format(upperBound))
                : " over ".concat(currencyFormatter.format((_c = rule.lowerBoundAmount) !== null && _c !== void 0 ? _c : 0)))}
                    </react_1.Heading>
                    <react_1.Status color={rule.enabled ? "green" : "gray"} className="text-xs font-medium">
                      {rule.enabled ? (<macro_1.Trans>Enabled</macro_1.Trans>) : (<macro_1.Trans>Disabled</macro_1.Trans>)}
                    </react_1.Status>
                  </react_1.HStack>
                </react_1.AccordionTrigger>
                <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                  <react_1.DropdownMenu>
                    <react_1.DropdownMenuTrigger asChild>
                      <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost" onClick={function (e) { return e.stopPropagation(); }}/>
                    </react_1.DropdownMenuTrigger>
                    <react_1.DropdownMenuContent align="end">
                      <react_1.DropdownMenuItem disabled={!canEdit} onClick={function (e) {
            e.stopPropagation();
            handleEdit();
        }}>
                        <lu_1.LuPencil className="mr-2 h-4 w-4"/>
                        <macro_1.Trans>Edit Rule</macro_1.Trans>
                      </react_1.DropdownMenuItem>
                      <react_1.DropdownMenuSeparator />
                      <react_1.DropdownMenuItem destructive disabled={!canDelete} onClick={function (e) {
            e.stopPropagation();
            handleDeleteClick();
        }}>
                        <lu_1.LuTrash className="mr-2 h-4 w-4"/>
                        <macro_1.Trans>Delete Rule</macro_1.Trans>
                      </react_1.DropdownMenuItem>
                    </react_1.DropdownMenuContent>
                  </react_1.DropdownMenu>
                </div>
              </div>
              <react_1.AccordionContent className="px-6 pb-5">
                <ApprovalRuleDetails_1.default rule={rule} documentType={documentType} currencyFormatter={currencyFormatter}/>
              </react_1.AccordionContent>
            </react_1.AccordionItem>
          </react_1.Accordion>
        </react_1.Card>
        <ConfirmDelete_1.default action={path_1.path.to.deleteApprovalRule(rule.id)} isOpen={deleteDisclosure.isOpen} name={documentType === "purchaseOrder"
            ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Purchase Order approval rule"], ["Purchase Order approval rule"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quality Document approval rule"], ["Quality Document approval rule"])))} text={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Are you sure you want to delete this approval rule? This cannot be undone."], ["Are you sure you want to delete this approval rule? This cannot be undone."])))} onCancel={deleteDisclosure.onClose} onSubmit={handleDeleteConfirm}/>
      </>);
});
ApprovalRuleCard.displayName = "ApprovalRuleCard";
exports.default = ApprovalRuleCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
