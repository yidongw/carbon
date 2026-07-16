"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedItemProperties = SelectedItemProperties;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Consumables_1 = require("~/modules/items/ui/Consumables");
var Materials_1 = require("~/modules/items/ui/Materials");
var Parts_1 = require("~/modules/items/ui/Parts");
var Tools_1 = require("~/modules/items/ui/Tools");
var path_1 = require("~/utils/path");
function SelectedItemProperties(_a) {
    var _b, _c;
    var topLevelItemId = _a.topLevelItemId, methods = _a.methods;
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var materialId = searchParams.get("materialId");
    var selectedNode = (0, react_2.useMemo)(function () {
        return materialId
            ? methods.find(function (m) { return m.data.methodMaterialId === materialId; })
            : undefined;
    }, [materialId, methods]);
    var selectedItemId = (_b = selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.data.itemId) !== null && _b !== void 0 ? _b : null;
    var selectedItemType = (_c = selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.data.itemType) !== null && _c !== void 0 ? _c : null;
    var isTopLevel = !selectedNode ||
        !!selectedNode.data.isRoot ||
        selectedItemId === topLevelItemId;
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: fetcher identity is stable
    (0, react_2.useEffect)(function () {
        if (isTopLevel || !selectedItemId || !selectedItemType)
            return;
        fetcher.load("".concat(path_1.path.to.itemProperties(selectedItemId), "?type=").concat(selectedItemType));
    }, [selectedItemId, selectedItemType, isTopLevel]);
    var filesPromise = (0, react_2.useMemo)(function () { var _a, _b; return Promise.resolve((_b = (_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []); }, [fetcher.data]);
    var makeMethodsPromise = (0, react_2.useMemo)(function () {
        return Promise.resolve({
            data: fetcher.data && "makeMethods" in fetcher.data
                ? fetcher.data.makeMethods
                : [],
            error: null
        });
    }, [fetcher.data]);
    if (isTopLevel) {
        return <Parts_1.PartProperties key={topLevelItemId}/>;
    }
    var d = fetcher.data;
    var ready = d && d.itemId === selectedItemId;
    if (!ready || fetcher.state === "loading") {
        return (<div className="flex w-96 items-center justify-center bg-card h-full border-l border-border">
        <react_1.Spinner className="h-6 w-6"/>
      </div>);
    }
    var common = {
        itemId: d.itemId,
        locations: d.locations,
        files: filesPromise,
        supplierParts: d.supplierParts,
        pickMethods: d.pickMethods,
        tags: d.tags
    };
    switch (d.type) {
        case "Material":
            return (<Materials_1.MaterialProperties key={d.itemId} data={__assign(__assign({}, common), { materialSummary: d.summary })}/>);
        case "Tool":
            return (<Tools_1.ToolProperties key={d.itemId} data={__assign(__assign({}, common), { makeMethods: makeMethodsPromise, toolSummary: d.summary })}/>);
        case "Consumable":
            return (<Consumables_1.ConsumableProperties key={d.itemId} data={__assign(__assign({}, common), { consumableSummary: d.summary })}/>);
        default:
            return (<Parts_1.PartProperties key={d.itemId} data={__assign(__assign({}, common), { makeMethods: makeMethodsPromise, partSummary: d.summary })}/>);
    }
}
