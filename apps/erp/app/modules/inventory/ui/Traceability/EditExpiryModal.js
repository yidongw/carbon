"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditExpiryModal = EditExpiryModal;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
/**
 * Manual override of a tracked entity's expirationDate. The submission
 * goes through `path.to.trackedEntityExpiry`, which records the prior
 * value, the new value, and the reason on the entity's attributes JSONB
 * (under `expiryOverrides`). The trace popover can surface that history
 * later.
 */
function EditExpiryModal(_a) {
    var trackedEntityId = _a.trackedEntityId, expirationDate = _a.expirationDate, label = _a.label, open = _a.open, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.Modal open={open} onOpenChange={function (v) { return !v && onClose(); }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.trackedEntityExpiry} validator={inventory_1.trackedEntityExpiryValidator} defaultValues={{
            trackedEntityId: trackedEntityId,
            expirationDate: expirationDate !== null && expirationDate !== void 0 ? expirationDate : "",
            reason: ""
        }} onSuccess={onClose}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Edit expiration date</macro_1.Trans>
            </react_1.ModalTitle>
            {label && (<react_1.ModalDescription>
                <macro_1.Trans>Override the expiration on {label}.</macro_1.Trans>
              </react_1.ModalDescription>)}
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="trackedEntityId"/>
            <div className="flex flex-col gap-4">
              <form_1.DatePicker name="expirationDate" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["New expiration date"], ["New expiration date"])))} helperText={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Pick a date or leave blank to clear it."], ["Pick a date or leave blank to clear it."])))}/>
              <form_1.TextArea name="reason" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Reason"], ["Reason"])))} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Why is the expiration being changed?"], ["Why is the expiration being changed?"])))}/>
            </div>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit>
              <macro_1.Trans>Save</macro_1.Trans>
            </form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
