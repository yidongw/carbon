"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePaymentTerm = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var PaymentTermForm_1 = require("~/modules/accounting/ui/PaymentTerms/PaymentTermForm");
var path_1 = require("~/utils/path");
var seedDataDisplayName_1 = require("~/utils/seedDataDisplayName");
var PaymentTermPreview = function (value, options) {
    var paymentTerm = options.find(function (o) { return o.value === value; });
    if (!paymentTerm)
        return null;
    return <span>{paymentTerm.label}</span>;
};
var PaymentTerm = function (props) {
    var _a, _b;
    var options = (0, exports.usePaymentTerm)();
    var permissions = (0, hooks_1.usePermissions)();
    var newPaymentTermModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    return permissions.can("create", "accounting") ? (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} inline={props.inline ? PaymentTermPreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Payment Term"} onCreateOption={function (option) {
            newPaymentTermModal.onOpen();
            setCreated(option);
        }}/>
      {newPaymentTermModal.isOpen && (<PaymentTermForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newPaymentTermModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                calculationMethod: "Net",
                daysDue: 0,
                discountPercentage: 0,
                daysDiscount: 0
            }}/>)}
    </>) : (<form_1.Combobox options={options} {...props} inline={props.inline ? PaymentTermPreview : undefined} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Payment Term"}/>);
};
PaymentTerm.displayName = "PaymentTerm";
exports.default = PaymentTerm;
var usePaymentTerm = function () {
    var _a;
    var i18n = (0, macro_1.useLingui)().i18n;
    var paymentTermFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        paymentTermFetcher.load(path_1.path.to.api.paymentTerms);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = paymentTermFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: (0, seedDataDisplayName_1.translateSeedDisplayName)(c.name, i18n)
        }); });
    }, [(_a = paymentTermFetcher.data) === null || _a === void 0 ? void 0 : _a.data, i18n]);
    return options;
};
exports.usePaymentTerm = usePaymentTerm;
