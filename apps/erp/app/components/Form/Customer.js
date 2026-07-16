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
var hooks_1 = require("~/hooks");
var CustomerForm_1 = require("~/modules/sales/ui/Customer/CustomerForm");
var stores_1 = require("~/stores");
var CustomerAvatar_1 = require("../CustomerAvatar");
var CustomerPreview = function (value, options) {
    return <CustomerAvatar_1.default customerId={value}/>;
};
var Customer = function (props) {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var customers = (0, stores_1.useCustomers)()[0];
    var newCustomersModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, react_2.useMemo)(function () {
        var _a;
        var all = customers.map(function (c) { return ({ value: c.id, label: c.name }); });
        return ((_a = props.exclude) === null || _a === void 0 ? void 0 : _a.length)
            ? all.filter(function (o) { return !props.exclude.includes(o.value); })
            : all;
    }, [customers, props.exclude]);
    var company = (0, hooks_1.useUser)().company;
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customer"], ["Customer"])))} placeholder={(_b = props === null || props === void 0 ? void 0 : props.placeholder) !== null && _b !== void 0 ? _b : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select"], ["Select"])))} inline={(props === null || props === void 0 ? void 0 : props.inline) ? CustomerPreview : undefined} onCreateOption={function (option) {
            newCustomersModal.onOpen();
            setCreated(option);
        }}/>
      {newCustomersModal.isOpen && (<CustomerForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newCustomersModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                currencyCode: company.baseCurrencyCode,
                taxPercent: 0
            }}/>)}
    </>);
};
Customer.displayName = "Customer";
exports.default = Customer;
var templateObject_1, templateObject_2;
