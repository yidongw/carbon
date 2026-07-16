"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomerTypes = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var CustomerTypes_1 = require("~/modules/sales/ui/CustomerTypes");
var path_1 = require("~/utils/path");
var seedDataDisplayName_1 = require("~/utils/seedDataDisplayName");
var CustomerType = function (props) {
    var _a, _b;
    var newCustomerTypeModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useCustomerTypes)();
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={(((_a = props.exclude) === null || _a === void 0 ? void 0 : _a.length)
            ? options.filter(function (o) { return !props.exclude.includes(o.value); })
            : options).map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={o.label}/>
        }); })} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "CustomerType"} onCreateOption={function (option) {
            newCustomerTypeModal.onOpen();
            setCreated(option);
        }}/>
      {newCustomerTypeModal.isOpen && (<CustomerTypes_1.CustomerTypeForm type="modal" onClose={function () {
                var _a;
                setCreated("");
                newCustomerTypeModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created
            }}/>)}
    </>);
};
CustomerType.displayName = "CustomerType";
exports.default = CustomerType;
var useCustomerTypes = function () {
    var _a;
    var i18n = (0, macro_1.useLingui)().i18n;
    var customerTypeFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        customerTypeFetcher.load(path_1.path.to.api.customerTypes);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        var dataSource = (_b = (_a = customerTypeFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
        return dataSource.map(function (c) { return ({
            value: c.id,
            label: (0, seedDataDisplayName_1.translateSeedDisplayName)(c.name, i18n)
        }); });
    }, [(_a = customerTypeFetcher.data) === null || _a === void 0 ? void 0 : _a.data, i18n]);
    return options;
};
exports.useCustomerTypes = useCustomerTypes;
