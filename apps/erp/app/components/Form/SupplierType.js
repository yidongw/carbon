"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSupplierTypes = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var SupplierTypeForm_1 = require("~/modules/purchasing/ui/SupplierTypes/SupplierTypeForm");
var path_1 = require("~/utils/path");
var seedDataDisplayName_1 = require("~/utils/seedDataDisplayName");
var SupplierType = function (props) {
    var _a, _b;
    var newSupplierTypeModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useSupplierTypes)();
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={(_a = options.map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={o.label}/>
        }); })) !== null && _a !== void 0 ? _a : []} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "SupplierType"} onCreateOption={function (option) {
            newSupplierTypeModal.onOpen();
            setCreated(option);
        }}/>
      {newSupplierTypeModal.isOpen && (<SupplierTypeForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newSupplierTypeModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created
            }}/>)}
    </>);
};
SupplierType.displayName = "SupplierType";
exports.default = SupplierType;
var useSupplierTypes = function () {
    var _a;
    var i18n = (0, macro_1.useLingui)().i18n;
    var supplierTypeFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        supplierTypeFetcher.load(path_1.path.to.api.supplierTypes);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        var dataSource = (_b = (_a = supplierTypeFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
        return dataSource.map(function (c) { return ({
            value: c.id,
            label: (0, seedDataDisplayName_1.translateSeedDisplayName)(c.name, i18n)
        }); });
    }, [(_a = supplierTypeFetcher.data) === null || _a === void 0 ? void 0 : _a.data, i18n]);
    return options;
};
exports.useSupplierTypes = useSupplierTypes;
