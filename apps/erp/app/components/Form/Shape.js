"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShape = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var MaterialShapes_1 = require("~/modules/items/ui/MaterialShapes");
var path_1 = require("~/utils/path");
var Enumerable_1 = require("../Enumerable");
var ShapePreview = function (value, options) {
    var _a;
    var shape = options.find(function (o) { return o.value === value; });
    // @ts-ignore
    return <Enumerable_1.Enumerable value={(_a = shape === null || shape === void 0 ? void 0 : shape.label) !== null && _a !== void 0 ? _a : null}/>;
};
var Shape = function (props) {
    var _a, _b;
    var options = (0, exports.useShape)();
    var permissions = (0, hooks_1.usePermissions)();
    var newShapeModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    return permissions.can("create", "inventory") ? (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} inline={props.inline ? ShapePreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Shape"} onCreateOption={function (option) {
            newShapeModal.onOpen();
            setCreated(option);
        }}/>
      {newShapeModal.isOpen && (<MaterialShapes_1.MaterialShapeForm type="modal" onClose={function () {
                var _a;
                setCreated("");
                newShapeModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                code: created.slice(0, 3).toUpperCase()
            }}/>)}
    </>) : (<form_1.Combobox options={options} {...props} inline={props.inline ? ShapePreview : undefined} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Shape"}/>);
};
Shape.displayName = "Shape";
exports.default = Shape;
var useShape = function () {
    var _a;
    var materialFormsLoader = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        materialFormsLoader.load(path_1.path.to.api.materialForms);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = materialFormsLoader.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: c.name,
            helper: c.companyId === null ? "Standard" : undefined,
            code: c.code
        }); });
    }, [(_a = materialFormsLoader.data) === null || _a === void 0 ? void 0 : _a.data]);
    return options;
};
exports.useShape = useShape;
