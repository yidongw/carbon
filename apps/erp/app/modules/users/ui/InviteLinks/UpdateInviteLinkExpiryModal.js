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
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var toDateTimeLocal = function (value) {
    if (!value)
        return "";
    var date = new Date(value);
    var offset = date.getTimezoneOffset();
    var local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
};
var UpdateInviteLinkExpiryModal = function (_a) {
    var id = _a.id, expiresAt = _a.expiresAt, isOpen = _a.isOpen, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(expiresAt ? "custom" : "none"), expirationOption = _b[0], setExpirationOption = _b[1];
    var getExpirationLabel = function (days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        var formatted = date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
        return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " days (", ")"], ["", " days (", ")"])), days, formatted);
    };
    var expirationOptions = [
        { value: "none", label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No expiration"], ["No expiration"]))) },
        { value: "7", label: getExpirationLabel(7) },
        { value: "30", label: getExpirationLabel(30) },
        { value: "60", label: getExpirationLabel(60) },
        { value: "90", label: getExpirationLabel(90) },
        { value: "custom", label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Custom"], ["Custom"]))) }
    ];
    var calculateExpirationDate = function (days) {
        if (days === "none")
            return "";
        if (days === "custom")
            return toDateTimeLocal(expiresAt);
        var date = new Date();
        date.setDate(date.getDate() + parseInt(days));
        return date.toISOString().slice(0, 16);
    };
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Update Expiration</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <form_1.ValidatedForm method="post" action={path_1.path.to.updateInviteLinkExpiry} validator={users_1.updateInviteLinkExpiryValidator} defaultValues={{
            id: id,
            expiresAt: toDateTimeLocal(expiresAt)
        }} onSuccess={onClose} fetcher={fetcher}>
            <react_1.VStack spacing={4}>
              <form_1.Hidden name="id" value={id} type="hidden"/>
              <Form_1.Select name="expiration" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Expiration"], ["Expiration"])))} options={expirationOptions} value={expirationOption} onChange={function (newValue) {
            if (newValue) {
                setExpirationOption(newValue.value);
            }
        }}/>
              {expirationOption === "custom" && (<Form_1.Input name="expiresAt" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Select date *"], ["Select date *"])))} type="datetime-local" defaultValue={toDateTimeLocal(expiresAt)} helperText={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["The invite link will expire on the selected date"], ["The invite link will expire on the selected date"])))}/>)}
              {expirationOption !== "custom" && (<Form_1.Input name="expiresAt" type="hidden" value={calculateExpirationDate(expirationOption)}/>)}
            </react_1.VStack>
            <react_1.ModalFooter>
              <react_1.HStack>
                <react_1.Button variant="ghost" onClick={onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <react_1.Button type="submit">
                  <macro_1.Trans>Save</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalFooter>
          </form_1.ValidatedForm>
        </react_1.ModalBody>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = UpdateInviteLinkExpiryModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
