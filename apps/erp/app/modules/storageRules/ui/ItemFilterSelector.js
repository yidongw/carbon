"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemFilterSelector;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var ItemPostingGroup_1 = require("~/components/Form/ItemPostingGroup");
var inventory_models_1 = require("~/modules/inventory/inventory.models");
var ITEM_TYPE_ICON = {
    Part: <lu_1.LuBox />,
    Material: <lu_1.LuLayers />,
    Tool: <lu_1.LuWrench />,
    Consumable: <lu_1.LuDroplet />
};
var ITEM_TYPE_OPTIONS = inventory_models_1.itemTypes.map(function (t) { return ({
    value: t,
    title: t,
    icon: ITEM_TYPE_ICON[t]
}); });
function ItemTypesField() {
    var t = (0, macro_1.useLingui)().t;
    var name = "filteredItemTypes";
    var error = (0, form_1.useField)(name).error;
    var _a = (0, form_1.useControlField)(name), value = _a[0], setValue = _a[1];
    var selected = value !== null && value !== void 0 ? value : [];
    return (<react_1.FormControl isInvalid={!!error}>
      <react_1.FormLabel htmlFor={name}>
        <macro_1.Trans>Item types</macro_1.Trans>
      </react_1.FormLabel>

      {selected.map(function (v, index) { return (<input key={v} type="hidden" name={"".concat(name, "[").concat(index, "]")} value={v}/>); })}

      <react_1.ChoiceSelect multiple value={selected} onChange={function (next) { return setValue(next); }} options={ITEM_TYPE_OPTIONS} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Any item type"], ["Any item type"])))} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Item types"], ["Item types"])))}/>

      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
}
// Two-segment AND/OR switch. Submits checkbox-style: a hidden input is present
// only for AND (true), matching `zfd.checkbox()` server-side.
function MatchModeToggle() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, form_1.useControlField)("filteredItemMatchAll"), value = _a[0], setValue = _a[1];
    var matchAll = value !== null && value !== void 0 ? value : false;
    return (<div className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          <macro_1.Trans>Combine filters</macro_1.Trans>
        </span>
        <span className="text-pretty text-xs text-muted-foreground">
          {matchAll ? (<macro_1.Trans>Item must match a selected type AND a selected group</macro_1.Trans>) : (<macro_1.Trans>Item must match a selected type OR a selected group</macro_1.Trans>)}
        </span>
      </div>

      {matchAll ? (<input type="hidden" name="filteredItemMatchAll" value="on"/>) : null}

      <react_1.ToggleGroup type="single" variant="outline" size="sm" value={matchAll ? "all" : "any"} 
    // Radix single-toggle can fire "" when clicking the active item; ignore
    // that so the operator can never become unset.
    onValueChange={function (next) {
            if (next)
                setValue(next === "all");
        }}>
        <react_1.ToggleGroupItem value="any" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Match any (OR)"], ["Match any (OR)"])))} className="transition-[transform,color,box-shadow] active:scale-[0.96]">
          <macro_1.Trans>OR</macro_1.Trans>
        </react_1.ToggleGroupItem>
        <react_1.ToggleGroupItem value="all" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Match all (AND)"], ["Match all (AND)"])))} className="transition-[transform,color,box-shadow] active:scale-[0.96]">
          <macro_1.Trans>AND</macro_1.Trans>
        </react_1.ToggleGroupItem>
      </react_1.ToggleGroup>
    </div>);
}
function useFilterCounts() {
    var _a, _b, _c, _d;
    var types = (0, form_1.useControlField)("filteredItemTypes")[0];
    var groups = (0, form_1.useControlField)("filteredItemGroupIds")[0];
    return {
        types: (_a = types === null || types === void 0 ? void 0 : types.length) !== null && _a !== void 0 ? _a : 0,
        groups: (_b = groups === null || groups === void 0 ? void 0 : groups.length) !== null && _b !== void 0 ? _b : 0,
        total: ((_c = types === null || types === void 0 ? void 0 : types.length) !== null && _c !== void 0 ? _c : 0) + ((_d = groups === null || groups === void 0 ? void 0 : groups.length) !== null && _d !== void 0 ? _d : 0)
    };
}
function ItemFilterSelector() {
    var t = (0, macro_1.useLingui)().t;
    var groupOptions = (0, ItemPostingGroup_1.useItemPostingGroups)();
    var counts = useFilterCounts();
    var filterCount = counts.total;
    // OR vs AND only matters when both dimensions constrain the set.
    var showMatchMode = counts.types > 0 && counts.groups > 0;
    return (<div className="w-full rounded-lg border border-border bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <lu_1.LuFilter className="h-3.5 w-3.5 text-muted-foreground"/>
          <macro_1.Trans>Item filters</macro_1.Trans>
          {filterCount > 0 ? (<react_1.Badge variant="secondary" className="ml-1 tabular-nums">
              {filterCount}
            </react_1.Badge>) : null}
        </div>
        <span className="text-xs text-muted-foreground">
          <macro_1.Trans>Empty = match every item</macro_1.Trans>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ItemTypesField />

        <Form_1.MultiSelect name="filteredItemGroupIds" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Item groups"], ["Item groups"])))} options={groupOptions} placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Any item group"], ["Any item group"])))}/>
      </div>

      <framer_motion_1.AnimatePresence initial={false}>
        {showMatchMode && (<framer_motion_1.motion.div key="match-mode" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ type: "spring", duration: 0.3, bounce: 0 }} className="mt-3 border-t border-border pt-3">
            <MatchModeToggle />
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
