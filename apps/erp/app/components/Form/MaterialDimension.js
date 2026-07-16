"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var MaterialDimensionForm_1 = require("~/modules/items/ui/MaterialDimensions/MaterialDimensionForm");
var path_1 = require("~/utils/path");
var MaterialDimensionPreview = function (value, options) {
    var dimension = options.find(function (o) { return o.value === value; });
    if (!dimension)
        return null;
    return <span>{dimension.label}</span>;
};
var MaterialDimension = function (props) {
    var _a, _b, _c;
    var materialDimensionsLoader = (0, react_router_1.useFetcher)();
    var newDimensionModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(""), created = _d[0], setCreated = _d[1];
    var triggerRef = (0, react_2.useRef)(null);
    (0, react_1.useMount)(function () {
        if (props.formId) {
            materialDimensionsLoader.load(path_1.path.to.api.materialDimensions(props.formId));
        }
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (props.formId) {
            materialDimensionsLoader.load(path_1.path.to.api.materialDimensions(props.formId));
        }
    }, [props.formId]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = materialDimensionsLoader.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: c.name,
            helper: c.companyId === null ? "Standard" : undefined
        }); });
    }, [(_a = materialDimensionsLoader.data) === null || _a === void 0 ? void 0 : _a.data]);
    var onChange = function (newValue) {
        var _a, _b, _c, _d;
        var dimension = (_c = (_b = (_a = materialDimensionsLoader.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (dimension) { return dimension.id === (newValue === null || newValue === void 0 ? void 0 : newValue.value); })) !== null && _c !== void 0 ? _c : null;
        (_d = props.onChange) === null || _d === void 0 ? void 0 : _d.call(props, dimension);
    };
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} disabled={props.disabled || !props.formId} inline={(props === null || props === void 0 ? void 0 : props.inline) ? MaterialDimensionPreview : undefined} isOptional={(_b = props === null || props === void 0 ? void 0 : props.isOptional) !== null && _b !== void 0 ? _b : true} label={(_c = props === null || props === void 0 ? void 0 : props.label) !== null && _c !== void 0 ? _c : "Dimensions"} onChange={onChange} onCreateOption={function (option) {
            newDimensionModal.onOpen();
            setCreated(option);
        }}/>
      {newDimensionModal.isOpen && (<MaterialDimensionForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newDimensionModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{ name: created, materialFormId: props.formId }}/>)}
    </>);
};
exports.default = MaterialDimension;
