"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var CustomerLocationForm_1 = require("~/modules/sales/ui/Customer/CustomerLocationForm");
var path_1 = require("~/utils/path");
var CustomerLocationPreview = function (value, options) {
    var location = options.find(function (o) { return o.value === value; });
    if (!location)
        return null;
    return <span>{location.label}</span>;
};
var CustomerLocation = function (props) {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var customerLocationsFetcher = (0, react_router_1.useFetcher)();
    var newLocationModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (props === null || props === void 0 ? void 0 : props.customer) {
            customerLocationsFetcher.load(path_1.path.to.api.customerLocations(props.customer));
        }
    }, [props.customer]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = customerLocationsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) {
            var _a, _b, _c, _d;
            return ({
                value: c.id,
                label: "".concat((0, utils_1.formatAddress)((_a = c.address) === null || _a === void 0 ? void 0 : _a.addressLine1, (_b = c.address) === null || _b === void 0 ? void 0 : _b.addressLine2, (_c = c.address) === null || _c === void 0 ? void 0 : _c.city, (_d = c.address) === null || _d === void 0 ? void 0 : _d.stateProvince), " (").concat(c.name, ")")
            });
        })) !== null && _c !== void 0 ? _c : [];
    }, [customerLocationsFetcher.data]);
    var onChange = function (newValue) {
        var _a, _b, _c, _d;
        var location = (_c = (_b = (_a = customerLocationsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (location) { return location.id === (newValue === null || newValue === void 0 ? void 0 : newValue.value); })) !== null && _c !== void 0 ? _c : null;
        (_d = props.onChange) === null || _d === void 0 ? void 0 : _d.call(props, location);
    };
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} inline={(props === null || props === void 0 ? void 0 : props.inline) ? CustomerLocationPreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customer Location"], ["Customer Location"])))} placeholder={(_b = props === null || props === void 0 ? void 0 : props.placeholder) !== null && _b !== void 0 ? _b : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select"], ["Select"])))} onChange={onChange} onCreateOption={function (option) {
            newLocationModal.onOpen();
            setCreated(option);
        }}/>
      {newLocationModal.isOpen && (<CustomerLocationForm_1.default customerId={props.customer} type="modal" onClose={function () {
                var _a;
                setCreated("");
                newLocationModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{ name: created }}/>)}
    </>);
};
exports.default = CustomerLocation;
var templateObject_1, templateObject_2;
