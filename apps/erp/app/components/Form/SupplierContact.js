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
var hooks_1 = require("~/hooks");
var Supplier_1 = require("~/modules/purchasing/ui/Supplier");
var path_1 = require("~/utils/path");
var SupplierContactPreview = function (value, options) {
    var contact = options.find(function (o) { return o.value === value; });
    if (!contact)
        return null;
    return (<react_1.HStack>
      <react_1.Avatar size="xs" name={typeof contact.label === "string" ? contact.label : undefined}/>
      <span>{contact.label}</span>
    </react_1.HStack>);
};
var SupplierContact = function (props) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var supplierContactsFetcher = (0, react_router_1.useFetcher)();
    var newContactModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var _c = created.split(" "), firstName = _c[0], lastName = _c.slice(1);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (props === null || props === void 0 ? void 0 : props.supplier) {
            supplierContactsFetcher.load(path_1.path.to.api.supplierContacts(props.supplier));
        }
    }, [props.supplier]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = supplierContactsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) {
            var _a, _b, _c, _d;
            return ({
                value: c.id,
                label: formatPersonName({
                    firstName: (_a = c.contact) === null || _a === void 0 ? void 0 : _a.firstName,
                    lastName: (_b = c.contact) === null || _b === void 0 ? void 0 : _b.lastName,
                    fullName: (_c = c.contact) === null || _c === void 0 ? void 0 : _c.fullName
                }) ||
                    ((_d = c.contact) === null || _d === void 0 ? void 0 : _d.email) ||
                    "Unknown"
            });
        })) !== null && _c !== void 0 ? _c : [];
    }, [formatPersonName, supplierContactsFetcher.data]);
    var onChange = function (newValue) {
        var _a, _b, _c, _d;
        var contact = (_c = (_b = (_a = supplierContactsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (contact) { return contact.id === (newValue === null || newValue === void 0 ? void 0 : newValue.value); })) !== null && _c !== void 0 ? _c : null;
        (_d = props.onChange) === null || _d === void 0 ? void 0 : _d.call(props, contact !== null && contact !== void 0 ? contact : null);
    };
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select Contact"], ["Select Contact"])))} inline={props.inline ? SupplierContactPreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Supplier Contact"], ["Supplier Contact"])))} onChange={onChange} onCreateOption={function (option) {
            newContactModal.onOpen();
            setCreated(option);
        }}/>
      {newContactModal.isOpen && (<Supplier_1.SupplierContactForm supplierId={props.supplier} type="modal" onClose={function () {
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
exports.default = SupplierContact;
var templateObject_1, templateObject_2;
