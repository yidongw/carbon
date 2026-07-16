"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShippingMethod = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
var ShippingMethod = function (props) {
    var _a, _b;
    var options = (0, exports.useShippingMethod)();
    var permissions = (0, hooks_1.usePermissions)();
    var newShippingMethodModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    return permissions.can("create", "inventory") ? (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Shipping Method"} onCreateOption={function (option) {
            newShippingMethodModal.onOpen();
            setCreated(option);
        }}/>
      {newShippingMethodModal.isOpen && (<inventory_1.ShippingMethodForm type="modal" onClose={function () {
                var _a;
                setCreated("");
                newShippingMethodModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                carrier: ""
            }}/>)}
    </>) : (<form_1.Combobox options={options} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Shipping Method"}/>);
};
ShippingMethod.displayName = "ShippingMethod";
exports.default = ShippingMethod;
var useShippingMethod = function () {
    var _a;
    var shippingMethodFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        shippingMethodFetcher.load(path_1.path.to.api.shippingMethods);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = shippingMethodFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: c.name
        }); });
    }, [(_a = shippingMethodFetcher.data) === null || _a === void 0 ? void 0 : _a.data]);
    return options;
};
exports.useShippingMethod = useShippingMethod;
