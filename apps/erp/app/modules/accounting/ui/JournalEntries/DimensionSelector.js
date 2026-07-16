"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Icons_1 = require("~/components/Icons");
var path_1 = require("~/utils/path");
var entityTypeColors = {
    Department: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400 border-red-500/20",
    Employee: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-400 border-indigo-500/20",
    CustomerType: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400 border-yellow-500/20",
    SupplierType: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20",
    Location: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400 border-blue-500/20",
    CostCenter: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-400 border-orange-500/20",
    ItemPostingGroup: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-400 border-violet-500/20",
    WorkCenter: "bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-400 border-teal-500/20",
    Process: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-400 border-cyan-500/20",
    Custom: ""
};
function getColor(entityType) {
    var _a;
    return (_a = entityTypeColors[entityType]) !== null && _a !== void 0 ? _a : "";
}
var DimensionSelector = function (_a) {
    var journalLineId = _a.journalLineId, availableDimensions = _a.availableDimensions, currentDimensions = _a.currentDimensions, onChange = _a.onChange, _b = _a.autoSave, autoSave = _b === void 0 ? false : _b;
    var fetcher = (0, react_router_1.useFetcher)();
    var valueByDimension = new Map(currentDimensions.map(function (d) { return [d.dimensionId, d.valueId]; }));
    var persistDimensions = (0, react_2.useCallback)(function (dims) {
        if (!autoSave)
            return;
        fetcher.submit({
            dimensions: dims.map(function (d) { return ({
                dimensionId: d.dimensionId,
                valueId: d.valueId
            }); })
        }, {
            method: "post",
            action: path_1.path.to.journalLineDimensions(journalLineId),
            encType: "application/json"
        });
    }, [autoSave, fetcher, journalLineId]);
    function handleValueChange(dim, valueId) {
        var val = dim.values.find(function (v) { return v.id === valueId; });
        if (!val)
            return;
        var updated = __spreadArray(__spreadArray([], currentDimensions.filter(function (d) { return d.dimensionId !== dim.dimensionId; }), true), [
            {
                dimensionId: dim.dimensionId,
                dimensionName: dim.dimensionName,
                valueId: val.id,
                valueName: val.name
            }
        ], false);
        onChange(updated);
        persistDimensions(updated);
    }
    function handleRemove(dimensionId) {
        var updated = currentDimensions.filter(function (d) { return d.dimensionId !== dimensionId; });
        onChange(updated);
        persistDimensions(updated);
    }
    var dimensionEntityTypeMap = new Map(availableDimensions.map(function (d) { return [d.dimensionId, d.entityType]; }));
    return (<div className="flex flex-wrap items-center gap-1.5">
      {availableDimensions.length > 0 && (<react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.Badge variant="secondary" className="inline-flex items-center cursor-pointer gap-1">
              <span>Dimension</span>
              <lu_1.LuPlus />
            </react_1.Badge>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent align="start" className="w-56">
            <react_1.DropdownMenuLabel>Dimensions</react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />
            {availableDimensions.map(function (dim) {
                var _a;
                return dim.values.length === 0 ? (<react_1.DropdownMenuLabel key={dim.dimensionId} className="flex items-center gap-2 text-muted-foreground font-normal text-sm flex-nowrap">
                  <Icons_1.DimensionEntityTypeIcon entityType={dim.entityType}/>
                  {dim.dimensionName}
                </react_1.DropdownMenuLabel>) : (<react_1.DropdownMenuSub key={dim.dimensionId}>
                  <react_1.DropdownMenuSubTrigger>
                    <react_1.DropdownMenuIcon icon={<Icons_1.DimensionEntityTypeIcon entityType={dim.entityType}/>}/>
                    {dim.dimensionName}
                  </react_1.DropdownMenuSubTrigger>
                  <react_1.DropdownMenuSubContent>
                    <react_1.DropdownMenuRadioGroup value={(_a = valueByDimension.get(dim.dimensionId)) !== null && _a !== void 0 ? _a : ""} onValueChange={function (valueId) {
                        return handleValueChange(dim, valueId);
                    }}>
                      {dim.values.map(function (val) { return (<react_1.DropdownMenuRadioItem key={val.id} value={val.id}>
                          {val.name}
                        </react_1.DropdownMenuRadioItem>); })}
                    </react_1.DropdownMenuRadioGroup>
                  </react_1.DropdownMenuSubContent>
                </react_1.DropdownMenuSub>);
            })}
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>)}
      {currentDimensions.map(function (dim) {
            var _a;
            return (<react_1.Badge key={dim.dimensionId} role="group" tabIndex={0} variant="outline" className={(0, react_1.cn)(getColor((_a = dimensionEntityTypeMap.get(dim.dimensionId)) !== null && _a !== void 0 ? _a : ""), "inline-flex items-center gap-1")}>
          <Icons_1.DimensionEntityTypeIcon entityType={dimensionEntityTypeMap.get(dim.dimensionId)} className="size-3"/>
          <span>{dim.valueName}</span>
          <react_1.BadgeCloseButton tabIndex={0} onClick={function () { return handleRemove(dim.dimensionId); }} aria-label={"Remove ".concat(dim.valueName)}/>
        </react_1.Badge>);
        })}
    </div>);
};
exports.default = DimensionSelector;
