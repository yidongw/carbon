"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Supplier_1 = require("~/modules/purchasing/ui/Supplier");
var stores_1 = require("~/stores");
var Suppliers = function (props) {
    var _a;
    var newSupplierModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var options = (0, react_2.useMemo)(function () {
        var _a;
        return ((_a = suppliers.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); })) !== null && _a !== void 0 ? _a : []);
    }, [suppliers]);
    return (<>
      <form_1.CreatableMultiSelect ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Work Center"} onCreateOption={function (option) {
            newSupplierModal.onOpen();
            setCreated(option);
        }}/>
      {newSupplierModal.isOpen && (<Supplier_1.SupplierForm type="modal" onClose={function () {
                var _a;
                setCreated("");
                newSupplierModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created
            }}/>)}
    </>);
};
Suppliers.displayName = "Supplier";
exports.default = Suppliers;
