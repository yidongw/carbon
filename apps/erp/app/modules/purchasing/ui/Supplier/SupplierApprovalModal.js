"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var path_1 = require("~/utils/path");
var SupplierApprovalModal = function (_a) {
    var supplierName = _a.supplierName, approvalRequestId = _a.approvalRequestId, decision = _a.decision, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("supplierId not found");
    var isApproving = decision === "Approved";
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={purchasing_1.supplierApprovalDecisionValidator} action={path_1.path.to.supplierApproval(supplierId)} onSuccess={onClose} defaultValues={{
            approvalRequestId: approvalRequestId,
            decision: decision,
            notes: undefined
        }}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              {isApproving ? "Approve" : "Reject"} {supplierName}
            </react_1.ModalTitle>
            <react_1.ModalDescription>
              {isApproving
            ? "Are you sure you want to approve this supplier? This will make it active."
            : "Are you sure you want to reject this supplier?"}
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="approvalRequestId"/>
            <form_1.Hidden name="decision"/>
            <form_1.TextArea name="notes" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes (optional)"], ["Notes (optional)"])))} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add any notes about your decision..."], ["Add any notes about your decision..."])))}/>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="submit" variant={isApproving ? "primary" : "destructive"}>
              {isApproving ? "Approve" : "Reject"}
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = SupplierApprovalModal;
var templateObject_1, templateObject_2;
