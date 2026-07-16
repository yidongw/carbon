"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShelfLifeStartTiming = exports.ShelfLifeStartProcess = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var Process_1 = require("./Process");
var ShelfLifeStartProcess = function (_a) {
    var processName = _a.processName, label = _a.label, itemId = _a.itemId;
    var allowed = useItemRecipeProcessIds(itemId);
    var allProcesses = (0, Process_1.useProcesses)();
    var filteredOptions = (0, react_2.useMemo)(function () {
        if (!itemId || allowed === undefined)
            return undefined;
        var set = new Set(allowed);
        return allProcesses.filter(function (p) { return set.has(p.value); });
    }, [itemId, allowed, allProcesses]);
    var recipeEmpty = !!itemId && allowed !== undefined && allowed.length === 0;
    return (<react_1.FormControl>
      <react_1.FormLabel isOptional>{label}</react_1.FormLabel>
      <Process_1.default name={processName} label="" options={filteredOptions} isReadOnly={recipeEmpty}/>
      {recipeEmpty && (<react_1.FormHelperText>Define a manufacturing operation first.</react_1.FormHelperText>)}
    </react_1.FormControl>);
};
exports.ShelfLifeStartProcess = ShelfLifeStartProcess;
var ShelfLifeStartTiming = function (_a) {
    var timingName = _a.timingName, label = _a.label;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, form_1.useControlField)(timingName), timing = _b[0], setTiming = _b[1];
    // Default the cards to "After" (process end) — the more common case.
    var current = timing !== null && timing !== void 0 ? timing : "After";
    return (<react_1.FormControl>
      <react_1.FormLabel>{label}</react_1.FormLabel>
      <react_1.ChoiceCardGroup value={current} onChange={setTiming} direction="row" options={[
            {
                value: "Before",
                title: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Start expiration on process start"], ["Start expiration on process start"]))),
                description: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Expiry begins when the selected process starts."], ["Expiry begins when the selected process starts."]))),
                icon: <lu_1.LuCalendarArrowUp />
            },
            {
                value: "After",
                title: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Start expiration on process end"], ["Start expiration on process end"]))),
                description: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Expiry begins when the selected process completes."], ["Expiry begins when the selected process completes."]))),
                icon: <lu_1.LuCalendarArrowDown />
            }
        ]}/>
      <input type="hidden" name={timingName} value={current}/>
    </react_1.FormControl>);
};
exports.ShelfLifeStartTiming = ShelfLifeStartTiming;
// Returns the processIds referenced by the item's active recipe, or
// `undefined` while loading. Empty array = item has no recipe operations.
function useItemRecipeProcessIds(itemId) {
    var _a;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        if (itemId) {
            fetcher.load(path_1.path.to.api.itemRecipeProcesses(itemId));
        }
    });
    if (!itemId)
        return [];
    if (fetcher.state !== "idle" || !fetcher.data)
        return undefined;
    return (_a = fetcher.data.data) !== null && _a !== void 0 ? _a : [];
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
