"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierProcessPreview = exports.useSupplierProcessesBySupplier = exports.useSupplierProcesses = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Supplier_1 = require("~/modules/purchasing/ui/Supplier");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var SupplierProcess = function (_a) {
    var _b;
    var processId = _a.processId, props = __rest(_a, ["processId"]);
    var newSupplierProcessModal = (0, react_1.useDisclosure)();
    var triggerRef = (0, react_2.useRef)(null);
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var options = (0, exports.useSupplierProcesses)({
        processId: processId
    }).map(function (supplierProcess) {
        var _a;
        var supplier = suppliers.find(function (supplier) { return supplier.id === supplierProcess.supplierId; });
        return {
            label: (_a = supplier === null || supplier === void 0 ? void 0 : supplier.name) !== null && _a !== void 0 ? _a : "Unknown Supplier",
            value: supplierProcess.id
        };
    });
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} 
    // @ts-ignore
    label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Work Center"} onCreateOption={function (option) {
            newSupplierProcessModal.onOpen();
        }}/>
      {newSupplierProcessModal.isOpen && processId && (<Supplier_1.SupplierProcessForm type="modal" onClose={function () {
                var _a;
                newSupplierProcessModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                processId: processId,
                supplierId: "",
                minimumCost: 0,
                unitCost: 0,
                leadTime: 0
            }}/>)}
    </>);
};
SupplierProcess.displayName = "SupplierProcess";
exports.default = SupplierProcess;
var useSupplierProcesses = function (args) {
    var processId = args.processId;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        if (!processId)
            return;
        fetcher.load(path_1.path.to.api.supplierProcesses(processId));
    }, [processId, fetcher.load]);
    var supplierProcesses = (0, react_2.useMemo)(function () { var _a, _b; return (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data) ? (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.data : []); }, [fetcher.data]);
    return supplierProcesses;
};
exports.useSupplierProcesses = useSupplierProcesses;
var useSupplierProcessesBySupplier = function (args) {
    var supplierId = args.supplierId;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        if (!supplierId)
            return;
        fetcher.load(path_1.path.to.api.supplierProcessesBySupplier(supplierId));
    }, [supplierId, fetcher.load]);
    var supplierProcesses = (0, react_2.useMemo)(function () { var _a, _b; return (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data) ? (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.data : []); }, [fetcher.data]);
    return supplierProcesses;
};
exports.useSupplierProcessesBySupplier = useSupplierProcessesBySupplier;
var SupplierProcessPreview = function (_a) {
    var _b;
    var processId = _a.processId, supplierProcessId = _a.supplierProcessId;
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var supplierProcess = (0, exports.useSupplierProcesses)({ processId: processId });
    if (!supplierProcessId)
        return null;
    var supplierId = (_b = supplierProcess.find(function (supplierProcess) { return supplierProcess.id === supplierProcessId; })) === null || _b === void 0 ? void 0 : _b.supplierId;
    if (!supplierId)
        return null;
    var supplier = suppliers.find(function (supplier) { return supplier.id === supplierId; });
    return (<span className="text-xs text-muted-foreground">{supplier === null || supplier === void 0 ? void 0 : supplier.name}</span>);
};
exports.SupplierProcessPreview = SupplierProcessPreview;
