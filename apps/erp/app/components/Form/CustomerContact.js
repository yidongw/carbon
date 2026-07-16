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
var CustomerContactForm_1 = require("~/modules/sales/ui/Customer/CustomerContactForm");
var path_1 = require("~/utils/path");
var CustomerContactPreview = function (value, options) {
    var contact = options.find(function (o) { return o.value === value; });
    if (!contact)
        return null;
    return (<react_1.HStack>
      <react_1.Avatar size="xs" name={typeof contact.label === "string" ? contact.label : undefined}/>
      <span>{contact.label}</span>
    </react_1.HStack>);
};
var CustomerContact = function (props) {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var newContactModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var _d = created.split(" "), firstName = _d[0], lastName = _d.slice(1);
    var _e = useCustomerContacts(props.customer), options = _e.options, data = _e.data;
    var onChange = function (newValue) {
        var _a, _b, _c;
        var contact = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.find(function (contact) { return contact.id === (newValue === null || newValue === void 0 ? void 0 : newValue.value); })) !== null && _b !== void 0 ? _b : null;
        (_c = props.onChange) === null || _c === void 0 ? void 0 : _c.call(props, contact !== null && contact !== void 0 ? contact : null);
    };
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} placeholder={(_a = props === null || props === void 0 ? void 0 : props.placeholder) !== null && _a !== void 0 ? _a : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select Contact"], ["Select Contact"])))} inline={props.inline ? CustomerContactPreview : undefined} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Customer Contact"], ["Customer Contact"])))} onChange={onChange} onCreateOption={function (option) {
            newContactModal.onOpen();
            setCreated(option);
        }}/>
      {newContactModal.isOpen && (<CustomerContactForm_1.default customerId={props.customer} type="modal" onClose={function () {
                var _a;
                setCreated("");
                newContactModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                email: "",
                firstName: firstName,
                lastName: lastName.join(" ")
            }}/>)}
    </>);
};
exports.default = CustomerContact;
function useCustomerContacts(customerId) {
    var customerContactsFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (customerId) {
            customerContactsFetcher.load(path_1.path.to.api.customerContacts(customerId));
        }
    }, [customerId]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = customerContactsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) {
            var _a, _b, _c, _d;
            return ({
                value: c.id,
                label: (_d = (_b = (_a = c.contact) === null || _a === void 0 ? void 0 : _a.fullName) !== null && _b !== void 0 ? _b : (_c = c.contact) === null || _c === void 0 ? void 0 : _c.email) !== null && _d !== void 0 ? _d : "Unknown"
            });
        })) !== null && _c !== void 0 ? _c : [];
    }, [customerContactsFetcher.data]);
    return { options: options, data: customerContactsFetcher.data };
}
var templateObject_1, templateObject_2;
