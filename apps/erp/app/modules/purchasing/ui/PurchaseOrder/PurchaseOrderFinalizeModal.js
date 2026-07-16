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
var AttachmentsList_1 = require("~/components/AttachmentsList");
var Form_1 = require("~/components/Form");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var PurchaseOrderFinalizeModal = function (_a) {
    var _b, _c, _d;
    var purchaseOrder = _a.purchaseOrder, onClose = _a.onClose, fetcher = _a.fetcher, _e = _a.defaultCc, defaultCc = _e === void 0 ? [] : _e, _f = _a.resolvedAttachments, resolvedAttachments = _f === void 0 ? [] : _f;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("orderId not found");
    var t = (0, macro_1.useLingui)().t;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var _g = (0, react_2.useState)(canEmail ? "Email" : "Download"), notificationType = _g[0], setNotificationType = _g[1];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={purchasing_models_1.purchaseOrderFinalizeValidator} action={path_1.path.to.purchaseOrderFinalize(orderId)} onSuccess={onClose} defaultValues={{
            notification: notificationType,
            supplierContact: (_b = purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.supplierContactId) !== null && _b !== void 0 ? _b : undefined,
            cc: defaultCc
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{"Finalize ".concat(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchaseOrderId)}</react_1.ModalTitle>
            <react_1.ModalDescription>
              Are you sure you want to finalize the purchase order? Finalizing
              the order will affect on order quantities used to calculate supply
              and demand.
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              {canEmail && (<Form_1.SelectControlled label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Send Via"], ["Send Via"])))} name="notification" options={[
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
              {notificationType === "Email" && (<>
                  <Form_1.SupplierContact isOptional={false} name="supplierContact" supplier={(_c = purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.supplierId) !== null && _c !== void 0 ? _c : undefined}/>
                  <Form_1.EmailRecipients name="cc" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["CC"], ["CC"])))} type="supplier" helperText={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type an email and press Enter to add an external recipient"], ["Type an email and press Enter to add an external recipient"])))}/>
                  <AttachmentsList_1.default supplierInteractionId={(_d = purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.supplierInteractionId) !== null && _d !== void 0 ? _d : null} attachments={resolvedAttachments}/>
                </>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="submit">
              <macro_1.Trans>Finalize</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = PurchaseOrderFinalizeModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
