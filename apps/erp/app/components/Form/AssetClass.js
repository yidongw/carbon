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
exports.useAssetClasses = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var AssetClassForm_1 = require("~/modules/accounting/ui/FixedAssets/AssetClassForm");
var path_1 = require("~/utils/path");
var Enumerable_1 = require("../Enumerable");
var AssetClassPreview = function (value, options) {
    var _a;
    var assetClass = options.find(function (o) { return o.value === value; });
    // @ts-expect-error TS2322 - TODO: fix type
    return <Enumerable_1.Enumerable value={(_a = assetClass === null || assetClass === void 0 ? void 0 : assetClass.label) !== null && _a !== void 0 ? _a : null}/>;
};
var AssetClass = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var _m = _a.inline, inline = _m === void 0 ? false : _m, props = __rest(_a, ["inline"]);
    var newAssetClassModal = (0, react_1.useDisclosure)();
    var _o = (0, react_2.useState)(""), created = _o[0], setCreated = _o[1];
    var triggerRef = (0, react_2.useRef)(null);
    var defaultsFetcher = (0, react_router_1.useFetcher)();
    var options = (0, exports.useAssetClasses)().options;
    var defaults = (_b = defaultsFetcher.data) === null || _b === void 0 ? void 0 : _b.defaults;
    var taxDepreciationEnabled = (_d = (_c = defaultsFetcher.data) === null || _c === void 0 ? void 0 : _c.taxDepreciationEnabled) !== null && _d !== void 0 ? _d : false;
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options.map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={o.label}/>
        }); })} {...props} label={(_e = props === null || props === void 0 ? void 0 : props.label) !== null && _e !== void 0 ? _e : "Asset Class"} inline={inline ? AssetClassPreview : undefined} onCreateOption={function (option) {
            defaultsFetcher.load(path_1.path.to.newAssetClass);
            newAssetClassModal.onOpen();
            setCreated(option);
        }}/>
      {newAssetClassModal.isOpen && (<AssetClassForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newAssetClassModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} taxDepreciationEnabled={taxDepreciationEnabled} initialValues={{
                name: created,
                description: "",
                depreciationMethod: "Straight Line",
                usefulLifeMonths: 60,
                residualValuePercent: 0,
                assetAccountId: (_f = defaults === null || defaults === void 0 ? void 0 : defaults.assetAquisitionCostAccount) !== null && _f !== void 0 ? _f : "",
                accumulatedDepreciationAccountId: (_g = defaults === null || defaults === void 0 ? void 0 : defaults.accumulatedDepreciationAccount) !== null && _g !== void 0 ? _g : "",
                depreciationExpenseAccountId: (_h = defaults === null || defaults === void 0 ? void 0 : defaults.assetDepreciationExpenseAccount) !== null && _h !== void 0 ? _h : "",
                writeOffAccountId: (_j = defaults === null || defaults === void 0 ? void 0 : defaults.assetGainsAndLossesAccount) !== null && _j !== void 0 ? _j : "",
                writeDownAccountId: (_k = defaults === null || defaults === void 0 ? void 0 : defaults.assetGainsAndLossesAccount) !== null && _k !== void 0 ? _k : "",
                disposalAccountId: (_l = defaults === null || defaults === void 0 ? void 0 : defaults.assetGainsAndLossesAccount) !== null && _l !== void 0 ? _l : ""
            }}/>)}
    </>);
};
AssetClass.displayName = "AssetClass";
exports.default = AssetClass;
var useAssetClasses = function () {
    var assetClassFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        assetClassFetcher.load(path_1.path.to.api.assetClasses);
    });
    var assetClasses = (0, react_2.useMemo)(function () { var _a, _b; return (_b = (_a = assetClassFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []; }, [assetClassFetcher.data]);
    var options = (0, react_2.useMemo)(function () {
        return assetClasses.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); });
    }, [assetClasses]);
    return { options: options, assetClasses: assetClasses };
};
exports.useAssetClasses = useAssetClasses;
