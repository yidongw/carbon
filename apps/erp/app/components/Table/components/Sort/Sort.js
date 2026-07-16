"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var bs_1 = require("react-icons/bs");
var io_1 = require("react-icons/io");
var lu_1 = require("react-icons/lu");
var useSort_1 = require("./useSort");
var Sort = function (_a) {
    var columnAccessors = _a.columnAccessors;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, useSort_1.useSort)(), sorts = _b.sorts, removeSortBy = _b.removeSortBy, reorderSorts = _b.reorderSorts, toggleSortBy = _b.toggleSortBy, toggleSortByDirection = _b.toggleSortByDirection;
    var hasNoSorts = sorts.length === 0;
    return (<react_1.Popover>
      <react_1.Tooltip>
        <react_1.TooltipTrigger asChild>
          <react_1.PopoverTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Sort"], ["Sort"])))} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Sort"], ["Sort"])))} variant={hasNoSorts ? "ghost" : "active"} icon={<lu_1.LuArrowUpDown />} className={(0, react_1.cn)(hasNoSorts && "!border-dashed border-border")}/>
          </react_1.PopoverTrigger>
        </react_1.TooltipTrigger>
        <react_1.TooltipContent>
          <p>
            <macro_1.Trans>Sort by</macro_1.Trans>
          </p>
        </react_1.TooltipContent>
      </react_1.Tooltip>
      <react_1.PopoverContent className="w-[420px]">
        {hasNoSorts && (<react_1.PopoverHeader>
            <p className="text-sm">
              <macro_1.Trans>No sorts applied to this view</macro_1.Trans>
            </p>
            <p className="text-xs text-muted-foreground">
              <macro_1.Trans>Add a column below to sort the view</macro_1.Trans>
            </p>
          </react_1.PopoverHeader>)}

        {!hasNoSorts && (<framer_motion_1.Reorder.Group axis="y" values={sorts} onReorder={reorderSorts} className="space-y-2">
            {sorts.map(function (sort) {
                var _a;
                var _b = sort.split(":"), column = _b[0], direction = _b[1];
                return (<framer_motion_1.Reorder.Item key={sort} value={sort} className="rounded-lg">
                  <react_1.HStack>
                    <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost"/>
                    <span className="text-sm flex-grow">
                      <>{(_a = columnAccessors[column]) !== null && _a !== void 0 ? _a : ""}</>
                    </span>
                    <react_1.Switch checked={direction === "asc"} onCheckedChange={function () { return toggleSortByDirection(column); }}/>
                    <span className="text-sm text-muted-foreground">
                      <macro_1.Trans>Ascending</macro_1.Trans>
                    </span>
                    <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Remove sort by column"], ["Remove sort by column"])))} icon={<io_1.IoMdClose />} onClick={function () { return removeSortBy(sort); }} variant="ghost"/>
                  </react_1.HStack>
                </framer_motion_1.Reorder.Item>);
            })}
          </framer_motion_1.Reorder.Group>)}

        <react_1.PopoverFooter>
          <react_1.DropdownMenu>
            <react_1.DropdownMenuTrigger asChild>
              <react_1.Button rightIcon={<bs_1.BsChevronDown />} variant="secondary">
                <macro_1.Trans>Pick a column to sort by</macro_1.Trans>
              </react_1.Button>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent className="w-48">
              {Object.keys(columnAccessors)
            .filter(function (columnAccessor) {
            return !sorts
                .map(function (sort) { return sort.split(":")[0]; })
                .includes(columnAccessor);
        })
            .map(function (columnAccessor) {
            return (<react_1.DropdownMenuItem key={columnAccessor} onClick={function () { return toggleSortBy(columnAccessor); }}>
                      <react_1.DropdownMenuIcon icon={<bs_1.BsSortUp />}/>
                      {columnAccessors[columnAccessor]}
                    </react_1.DropdownMenuItem>);
        })}
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>
        </react_1.PopoverFooter>
      </react_1.PopoverContent>
    </react_1.Popover>);
};
exports.default = Sort;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
