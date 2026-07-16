"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMaterialTypes = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var MaterialTypeForm_1 = require("~/modules/items/ui/MaterialTypes/MaterialTypeForm");
var path_1 = require("~/utils/path");
var MaterialTypePreview = function (value, options) {
    var materialType = options.find(function (o) { return o.value === value; });
    if (!materialType)
        return null;
    return <span>{materialType.label}</span>;
};
var MaterialType = function (props) {
    var _a, _b;
    var newTypeModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useMaterialTypes)(props.substanceId, props.formId);
    var onChange = function (newValue) {
        var _a, _b;
        var materialType = (_a = options.find(function (materialType) { return materialType.value === (newValue === null || newValue === void 0 ? void 0 : newValue.value); })) !== null && _a !== void 0 ? _a : null;
        (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, materialType);
    };
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} disabled={props.disabled || !props.substanceId || !props.formId} inline={(props === null || props === void 0 ? void 0 : props.inline) ? MaterialTypePreview : undefined} isOptional={(_a = props === null || props === void 0 ? void 0 : props.isOptional) !== null && _a !== void 0 ? _a : true} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Type"} onChange={onChange} onCreateOption={function (option) {
            newTypeModal.onOpen();
            setCreated(option);
        }}/>
      {newTypeModal.isOpen && (<MaterialTypeForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newTypeModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                materialSubstanceId: props.substanceId,
                materialFormId: props.formId,
                code: created
            }}/>)}
    </>);
};
var useMaterialTypes = function (substanceId, formId) {
    var _a;
    var materialTypes = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        if (substanceId && formId) {
            materialTypes.load(path_1.path.to.api.materialTypes(substanceId, formId));
        }
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (substanceId && formId) {
            materialTypes.load(path_1.path.to.api.materialTypes(substanceId, formId));
        }
    }, [substanceId, formId]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = materialTypes.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: c.name,
            helper: c.companyId === null ? "Standard" : undefined,
            code: c.code
        }); });
    }, [(_a = materialTypes.data) === null || _a === void 0 ? void 0 : _a.data]);
    return options;
};
exports.useMaterialTypes = useMaterialTypes;
exports.default = MaterialType;
