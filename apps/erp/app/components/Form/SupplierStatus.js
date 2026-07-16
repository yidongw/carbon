"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var purchasing_1 = require("~/modules/purchasing");
var SupplierStatusIndicator_1 = require("~/modules/purchasing/ui/Supplier/SupplierStatusIndicator");
var SupplierStatus = function (props) {
    var _a;
    var options = purchasing_1.supplierStatusType.map(function (status) { return ({
        value: status,
        label: <SupplierStatusIndicator_1.SupplierStatusIndicator status={status}/>
    }); });
    return (<form_1.Combobox options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Supplier Status"}/>);
};
SupplierStatus.displayName = "SupplierStatus";
exports.default = SupplierStatus;
