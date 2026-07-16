"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var CustomerTypes_1 = require("~/modules/sales/ui/CustomerTypes");
var CustomerType_1 = require("./CustomerType");
var CustomerTypes = function (props) {
    var _a;
    var newCustomerTypeModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, CustomerType_1.useCustomerTypes)();
    return (<>
      <form_1.CreatableMultiSelect ref={triggerRef} options={options !== null && options !== void 0 ? options : []} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Customer Types"} onCreateOption={function (option) {
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
CustomerTypes.displayName = "CustomerTypes";
exports.default = CustomerTypes;
