"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubstance = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var MaterialSubstances_1 = require("~/modules/items/ui/MaterialSubstances");
var path_1 = require("~/utils/path");
var Enumerable_1 = require("../Enumerable");
var SubstancePreview = function (value, options) {
    var _a;
    var substance = options.find(function (o) { return o.value === value; });
    // @ts-ignore
    return <Enumerable_1.Enumerable value={(_a = substance === null || substance === void 0 ? void 0 : substance.label) !== null && _a !== void 0 ? _a : null}/>;
};
var Substance = function (props) {
    var _a, _b;
    var options = (0, exports.useSubstance)();
    var permissions = (0, hooks_1.usePermissions)();
    var newSubstanceModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    return permissions.can("create", "inventory") ? (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} inline={props.inline ? SubstancePreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Substance"} onCreateOption={function (option) {
            newSubstanceModal.onOpen();
            setCreated(option);
        }}/>
      {newSubstanceModal.isOpen && (<MaterialSubstances_1.MaterialSubstanceForm type="modal" onClose={function () {
                var _a;
                setCreated("");
                newSubstanceModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                code: created.slice(0, 3).toUpperCase()
            }}/>)}
    </>) : (<form_1.Combobox options={options} {...props} inline={props.inline ? SubstancePreview : undefined} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Substance"}/>);
};
Substance.displayName = "Substance";
exports.default = Substance;
var useSubstance = function () {
    var _a;
    var materialSubstances = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        materialSubstances.load(path_1.path.to.api.materialSubstances);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = materialSubstances.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: c.name,
            helper: c.companyId === null ? "Standard" : undefined,
            code: c.code
        }); });
    }, [(_a = materialSubstances.data) === null || _a === void 0 ? void 0 : _a.data]);
    return options;
};
exports.useSubstance = useSubstance;
