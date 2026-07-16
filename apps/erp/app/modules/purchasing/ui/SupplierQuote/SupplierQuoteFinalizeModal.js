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
var Form_1 = require("~/components/Form");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var purchasing_models_1 = require("../../purchasing.models");
var SupplierQuoteFinalizeModal = function (_a) {
    var _b, _c;
    var quote = _a.quote, onClose = _a.onClose, fetcher = _a.fetcher, action = _a.action;
    var t = (0, macro_1.useLingui)().t;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var _d = (0, react_2.useState)(canEmail ? "Email" : "None"), notificationType = _d[0], setNotificationType = _d[1];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={purchasing_models_1.supplierQuoteFinalizeValidator} action={action} onSuccess={onClose} defaultValues={{
            // @ts-expect-error TS2322 - TODO: fix type
            notification: notificationType,
            supplierContact: (_b = quote === null || quote === void 0 ? void 0 : quote.supplierContactId) !== null && _b !== void 0 ? _b : undefined
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>Send {quote === null || quote === void 0 ? void 0 : quote.supplierQuoteId}</react_1.ModalTitle>
            <react_1.ModalDescription>
              Send the supplier quote to the supplier via email.
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
              {notificationType === "Email" && (<Form_1.SupplierContact name="supplierContact" supplier={(_c = quote === null || quote === void 0 ? void 0 : quote.supplierId) !== null && _c !== void 0 ? _c : undefined}/>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="submit">
              <macro_1.Trans>Send</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = SupplierQuoteFinalizeModal;
var templateObject_1, templateObject_2, templateObject_3;
