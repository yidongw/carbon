"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var CustomerForm_1 = require("~/modules/sales/ui/Customer/CustomerForm");
var stores_1 = require("~/stores");
var Customers = function (props) {
    var _a;
    var newCustomerModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var customers = (0, stores_1.useCustomers)()[0];
    var company = (0, hooks_1.useUser)().company;
    var options = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = customers.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); })) !== null && _a !== void 0 ? _a : [];
    }, [customers]);
    return (<>
      <form_1.CreatableMultiSelect ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Customers"} onCreateOption={function (option) {
            newCustomerModal.onOpen();
            setCreated(option);
        }}/>
      {newCustomerModal.isOpen && (<CustomerForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newCustomerModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                currencyCode: company.baseCurrencyCode,
                taxPercent: 0
            }}/>)}
    </>);
};
Customers.displayName = "Customers";
exports.default = Customers;
