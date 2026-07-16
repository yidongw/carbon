"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStorageTypes = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var StorageTypeForm_1 = require("~/modules/inventory/ui/StorageTypes/StorageTypeForm");
var path_1 = require("~/utils/path");
var StorageTypes = function (props) {
    var _a;
    var newTypeModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useStorageTypes)();
    return (<>
      <form_1.CreatableMultiSelect ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Storage Types"} onCreateOption={function (option) {
            newTypeModal.onOpen();
            setCreated(option);
        }}/>
      {newTypeModal.isOpen && (<StorageTypeForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newTypeModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{ name: created }}/>)}
    </>);
};
var useStorageTypes = function () {
    var _a;
    var storageTypes = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        storageTypes.load(path_1.path.to.api.storageTypes);
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        storageTypes.load(path_1.path.to.api.storageTypes);
    }, []);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = storageTypes.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: c.name
        }); });
    }, [(_a = storageTypes.data) === null || _a === void 0 ? void 0 : _a.data]);
    return options;
};
exports.useStorageTypes = useStorageTypes;
exports.default = StorageTypes;
