"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnitOfMeasure = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var UnitOfMeasureForm_1 = require("~/modules/items/ui/UnitOfMeasure/UnitOfMeasureForm");
var path_1 = require("~/utils/path");
var seedDataDisplayName_1 = require("~/utils/seedDataDisplayName");
var Enumerable_1 = require("../Enumerable");
var UnitOfMeasurePreview = function (value, options) {
    var _a;
    var uom = options.find(function (o) { return o.value === value; });
    // @ts-expect-error TS2322 - TODO: fix type
    return <Enumerable_1.Enumerable value={(_a = uom === null || uom === void 0 ? void 0 : uom.label) !== null && _a !== void 0 ? _a : null}/>;
};
var UnitOfMeasure = function (props) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var options = (0, exports.useUnitOfMeasure)();
    var newUnitOfMeasureModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} inline={props.inline ? UnitOfMeasurePreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} onCreateOption={function (option) {
            newUnitOfMeasureModal.onOpen();
            setCreated(option);
        }}/>
      {newUnitOfMeasureModal.isOpen && (<UnitOfMeasureForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newUnitOfMeasureModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                code: ""
            }}/>)}
    </>);
};
UnitOfMeasure.displayName = "UnitOfMeasure";
exports.default = UnitOfMeasure;
var useUnitOfMeasure = function () {
    var _a, _b;
    var i18n = (0, macro_1.useLingui)().i18n;
    var uomFetcher = (0, react_router_1.useFetcher)();
    var sharedPartData = (0, hooks_1.useRouteData)(path_1.path.to.partRoot);
    var hasSharedPartData = (_a = sharedPartData === null || sharedPartData === void 0 ? void 0 : sharedPartData.unitOfMeasures) === null || _a === void 0 ? void 0 : _a.length;
    (0, react_1.useMount)(function () {
        if (!hasSharedPartData)
            uomFetcher.load(path_1.path.to.api.unitOfMeasures);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        var dataSource = (_b = (hasSharedPartData
            ? sharedPartData === null || sharedPartData === void 0 ? void 0 : sharedPartData.unitOfMeasures
            : (_a = uomFetcher.data) === null || _a === void 0 ? void 0 : _a.data)) !== null && _b !== void 0 ? _b : [];
        return dataSource.map(function (c) { return ({
            value: c.code,
            label: (0, seedDataDisplayName_1.translateSeedDisplayName)(c.name, i18n)
        }); });
    }, [
        hasSharedPartData,
        sharedPartData === null || sharedPartData === void 0 ? void 0 : sharedPartData.unitOfMeasures,
        (_b = uomFetcher.data) === null || _b === void 0 ? void 0 : _b.data,
        i18n
    ]);
    return options;
};
exports.useUnitOfMeasure = useUnitOfMeasure;
var templateObject_1;
