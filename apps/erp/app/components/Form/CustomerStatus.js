"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomerStatuses = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var CustomerStatusForm_1 = require("~/modules/sales/ui/CustomerStatuses/CustomerStatusForm");
var path_1 = require("~/utils/path");
var CustomerStatus = function (props) {
    var _a, _b;
    var _c = (0, macro_1.useLingui)(), i18n = _c.i18n, t = _c.t;
    var newCustomerStatusModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(""), created = _d[0], setCreated = _d[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useCustomerStatuses)();
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={(_a = options.map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={i18n._(o.label)}/>
        }); })) !== null && _a !== void 0 ? _a : []} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customer Status"], ["Customer Status"])))} onCreateOption={function (option) {
            newCustomerStatusModal.onOpen();
            setCreated(option);
        }}/>
      {newCustomerStatusModal.isOpen && (<CustomerStatusForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newCustomerStatusModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created
            }}/>)}
    </>);
};
CustomerStatus.displayName = "CustomerStatus";
exports.default = CustomerStatus;
var useCustomerStatuses = function () {
    var _a;
    var customerStatusFetcher = (0, react_router_1.useFetcher)();
    var sharedCustomerData = (0, hooks_1.useRouteData)(path_1.path.to.customerRoot);
    var hasCustomerData = sharedCustomerData === null || sharedCustomerData === void 0 ? void 0 : sharedCustomerData.customerStatuses;
    (0, react_1.useMount)(function () {
        if (!hasCustomerData)
            customerStatusFetcher.load(path_1.path.to.api.customerStatuses);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        var dataSource = (_b = (hasCustomerData
            ? sharedCustomerData.customerStatuses
            : (_a = customerStatusFetcher.data) === null || _a === void 0 ? void 0 : _a.data)) !== null && _b !== void 0 ? _b : [];
        return dataSource.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); });
    }, [
        (_a = customerStatusFetcher.data) === null || _a === void 0 ? void 0 : _a.data,
        hasCustomerData,
        sharedCustomerData === null || sharedCustomerData === void 0 ? void 0 : sharedCustomerData.customerStatuses
    ]);
    return options;
};
exports.useCustomerStatuses = useCustomerStatuses;
var templateObject_1;
