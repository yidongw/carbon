"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var PurchaseOrderApprovalModal = function (_a) {
    var _b, _c;
    var purchaseOrder = _a.purchaseOrder, approvalRequestId = _a.approvalRequestId, decision = _a.decision, onClose = _a.onClose, fetcher = _a.fetcher, _d = _a.defaultCc, defaultCc = _d === void 0 ? [] : _d;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("orderId not found");
    var t = (0, macro_1.useLingui)().t;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var isApproving = decision === "Approved";
    var _e = (0, react_2.useState)(canEmail && isApproving ? "Email" : "None"), notificationType = _e[0], setNotificationType = _e[1];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={purchasing_models_1.purchaseOrderApprovalValidator} action={path_1.path.to.purchaseOrder(orderId)} onSuccess={onClose} defaultValues={{
            approvalRequestId: approvalRequestId,
            decision: decision,
            notification: notificationType,
            supplierContact: (_b = purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.supplierContactId) !== null && _b !== void 0 ? _b : undefined,
            cc: defaultCc
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              {isApproving ? "Approve" : "Reject"}{" "}
              {purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchaseOrderId}
            </react_1.ModalTitle>
            <react_1.ModalDescription>
              {isApproving
            ? "Are you sure you want to approve this purchase order? This will allow the order to proceed."
            : "Are you sure you want to reject this purchase order? The requester will be notified."}
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="approvalRequestId"/>
            <form_1.Hidden name="decision"/>
            <react_1.VStack spacing={4}>
              {isApproving && canEmail && (<Form_1.SelectControlled label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Send Via"], ["Send Via"])))} name="notification" options={[
                {
                    label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["None"], ["None"]))),
                    value: "None"
                },
                {
                    label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Email"], ["Email"]))),
                    value: "Email"
                }
            ]} value={notificationType} onChange={function (t) {
                if (t)
                    setNotificationType(t.value);
            }}/>)}
              {isApproving && notificationType === "Email" && (<>
                  <Form_1.SupplierContact name="supplierContact" supplier={(_c = purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.supplierId) !== null && _c !== void 0 ? _c : undefined}/>
                  <Form_1.EmailRecipients name="cc" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["CC"], ["CC"])))} type="employee"/>
                </>)}
            </react_1.VStack>
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
exports.default = PurchaseOrderApprovalModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
