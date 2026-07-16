"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Supplier_1 = require("~/modules/purchasing/ui/Supplier");
var path_1 = require("~/utils/path");
var SupplierLocationPreview = function (value, options) {
    var location = options.find(function (o) { return o.value === value; });
    if (!location)
        return null;
    return <span>{location.label}</span>;
};
var SupplierLocation = function (props) {
    var _a;
    var newLocationModal = (0, react_1.useDisclosure)();
    // const [created, setCreated] = useState<string>("");
    var triggerRef = (0, react_2.useRef)(null);
    var supplierLocationsFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (props === null || props === void 0 ? void 0 : props.supplier) {
            supplierLocationsFetcher.load(path_1.path.to.api.supplierLocations(props.supplier));
        }
    }, [props.supplier]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = supplierLocationsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) {
            var _a, _b, _c, _d;
            return ({
                value: c.id,
                label: "".concat((0, utils_1.formatAddress)((_a = c.address) === null || _a === void 0 ? void 0 : _a.addressLine1, (_b = c.address) === null || _b === void 0 ? void 0 : _b.addressLine2, (_c = c.address) === null || _c === void 0 ? void 0 : _c.city, (_d = c.address) === null || _d === void 0 ? void 0 : _d.stateProvince), " (").concat(c.name, ")")
            });
        })) !== null && _c !== void 0 ? _c : [];
    }, [supplierLocationsFetcher.data]);
    var onChange = function (newValue) {
        var _a, _b, _c, _d;
        var location = (_c = (_b = (_a = supplierLocationsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (location) { return location.id === (newValue === null || newValue === void 0 ? void 0 : newValue.value); })) !== null && _c !== void 0 ? _c : null;
        (_d = props.onChange) === null || _d === void 0 ? void 0 : _d.call(props, location);
    };
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} inline={(props === null || props === void 0 ? void 0 : props.inline) ? SupplierLocationPreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Supplier Location"} onChange={onChange} onCreateOption={function (option) {
            newLocationModal.onOpen();
            // setCreated(option);
        }}/>
      {newLocationModal.isOpen && (<Supplier_1.SupplierLocationForm supplierId={props.supplier} type="modal" onClose={function () {
                var _a;
                // setCreated("");
                newLocationModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{ name: "" }}/>)}
    </>);
};
exports.default = SupplierLocation;
