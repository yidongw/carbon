"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var Supplier_1 = require("~/modules/purchasing/ui/Supplier");
var stores_1 = require("~/stores");
var SupplierAvatar_1 = require("../SupplierAvatar");
var SupplierPreview = function (value, options) {
    return <SupplierAvatar_1.default supplierId={value}/>;
};
var Supplier = function (_a) {
    var _b;
    var allowedSuppliers = _a.allowedSuppliers, onlyApproved = _a.onlyApproved, props = __rest(_a, ["allowedSuppliers", "onlyApproved"]);
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var newSuppliersModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = suppliers
            .filter(function (s) { return !allowedSuppliers || allowedSuppliers.includes(s.id); })
            .filter(function (s) { return !onlyApproved || s.supplierStatus === "Active"; })
            .map(function (c) { return ({
            value: c.id,
            label: c.name
        }); })) !== null && _a !== void 0 ? _a : [];
    }, [suppliers, allowedSuppliers, onlyApproved]);
    var company = (0, hooks_1.useUser)().company;
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Supplier"} inline={(props === null || props === void 0 ? void 0 : props.inline) ? SupplierPreview : undefined} onCreateOption={function (option) {
            newSuppliersModal.onOpen();
            setCreated(option);
        }}/>
      {newSuppliersModal.isOpen && (<Supplier_1.SupplierForm type="modal" onClose={function () {
                var _a;
                setCreated("");
                newSuppliersModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                currencyCode: company.baseCurrencyCode,
                supplierStatus: supplierApprovalRequired ? "Pending" : undefined
            }}/>)}
    </>);
};
Supplier.displayName = "Supplier";
exports.default = Supplier;
