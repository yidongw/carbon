"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.CreatableMultiSelect = void 0;
var macro_1 = require("@lingui/react/macro");
var react_virtual_1 = require("@tanstack/react-virtual");
var cmdk_1 = require("cmdk");
var react_1 = require("react");
var fa6_1 = require("react-icons/fa6");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var Badge_1 = require("./Badge");
var Button_1 = require("./Button");
var Command_1 = require("./Command");
var HStack_1 = require("./HStack");
var IconButton_1 = require("./IconButton");
var Popover_1 = require("./Popover");
var TruncatedTooltipText_1 = require("./TruncatedTooltipText");
var cn_1 = require("./utils/cn");
var react_2 = require("./utils/react");
var CreatableMultiSelect = (0, react_1.forwardRef)(function (_a, ref) {
    var size = _a.size, value = _a.value, options = _a.options, selected = _a.selected, isReadOnly = _a.isReadOnly, placeholder = _a.placeholder, label = _a.label, createLabel = _a.createLabel, className = _a.className, _b = _a.itemHeight, itemHeight = _b === void 0 ? 40 : _b, maxPreview = _a.maxPreview, _c = _a.showCreateOptionOnEmpty, showCreateOptionOnEmpty = _c === void 0 ? true : _c, inline = _a.inline, inlineIcon = _a.inlineIcon, onChange = _a.onChange, onCreateOption = _a.onCreateOption, props = __rest(_a, ["size", "value", "options", "selected", "isReadOnly", "placeholder", "label", "createLabel", "className", "itemHeight", "maxPreview", "showCreateOptionOnEmpty", "inline", "inlineIcon", "onChange", "onCreateOption"]);
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_1.useState)(false), open = _d[0], setOpen = _d[1];
    var _e = (0, react_1.useState)(""), search = _e[0], setSearch = _e[1];
    var id = (0, react_1.useId)();
    var handleUnselect = function (item) {
        onChange(value.filter(function (i) { return i !== item; }));
    };
    var hasSelections = value.length > 0;
    var isInlinePreview = !!inline;
    var dropdownContentWidthCh = (0, react_1.useMemo)(function () {
        var maxOptionChars = options.reduce(function (longest, option) {
            var combined = [option.label, option.helper]
                .filter(Boolean)
                .join(" ");
            return Math.max(longest, combined.length);
        }, 0);
        // Always keep a usable floor (even with no options) so the popover never
        // collapses to the trigger width — the inline variant's trigger is a tiny
        // icon button, which otherwise renders the dropdown as a narrow sliver.
        return Math.min(72, Math.max(36, maxOptionChars + 8));
    }, [options]);
    return (<HStack_1.HStack className={(0, cn_1.cn)(isInlinePreview ? "w-full" : "min-w-0 flex-grow")} spacing={1}>
        {isInlinePreview && Array.isArray(value) && value.length > 0 && (<span className="flex flex-grow line-clamp-1 items-center cursor-pointer" onClick={function () { return setOpen(true); }}>
            {inline(value, options, maxPreview)}
          </span>)}

        <Popover_1.Popover open={open} onOpenChange={setOpen}>
          <Popover_1.PopoverTrigger asChild>
            {inline ? (<IconButton_1.IconButton size={size !== null && size !== void 0 ? size : "sm"} variant="secondary" aria-label={hasSelections ? "Edit" : "Add"} icon={inlineIcon ? (inlineIcon) : hasSelections ? (<lu_1.LuSettings2 />) : (<lu_1.LuCirclePlus />)} ref={ref} isDisabled={isReadOnly} onClick={function () { return setOpen(true); }}/>) : (<Button_1.Button aria-controls={id} aria-expanded={open} role="combobox" tabIndex={0} variant="secondary" className={(0, cn_1.cn)((0, Command_1.multiSelectTriggerVariants)({ size: size, hasSelections: hasSelections }), "bg-transparent px-2", className)} isDisabled={isReadOnly} onClick={function () {
                if (!isReadOnly)
                    setOpen(!open);
            }} onKeyDown={function (e) {
                if ((e.key === "Enter" || e.key === " ") && !isReadOnly) {
                    setOpen(!open);
                }
            }} asChild>
                <div>
                  {hasSelections ? (<div className="flex gap-1 flex-wrap">
                      {value.map(function (item) { return (<SelectedOption key={item.toString()} item={item} options={options} onUnselect={handleUnselect}/>); })}
                    </div>) : (<span className="text-muted-foreground">
                      {placeholder !== null && placeholder !== void 0 ? placeholder : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))}
                    </span>)}

                  <rx_1.RxMagnifyingGlass className="h-4 w-4 shrink-0 opacity-50"/>
                </div>
              </Button_1.Button>)}
          </Popover_1.PopoverTrigger>
          <Popover_1.PopoverContent align="end" className="min-w-[var(--radix-popover-trigger-width)] max-w-[min(560px,calc(100vw-2rem))] p-1" style={{
            width: "min(560px, max(var(--radix-popover-trigger-width), ".concat(dropdownContentWidthCh, "ch))")
        }}>
            <VirtualizedCommand options={options} selected={value} onChange={onChange} onCreateOption={onCreateOption} itemHeight={itemHeight} setOpen={setOpen} label={label} createLabel={createLabel} search={search} setSearch={setSearch} showCreateOptionOnEmpty={showCreateOptionOnEmpty}/>
          </Popover_1.PopoverContent>
        </Popover_1.Popover>
      </HStack_1.HStack>);
});
exports.CreatableMultiSelect = CreatableMultiSelect;
CreatableMultiSelect.displayName = "CreatableMultiSelect";
function VirtualizedCommand(_a) {
    var options = _a.options, selected = _a.selected, onChange = _a.onChange, onCreateOption = _a.onCreateOption, itemHeight = _a.itemHeight, setOpen = _a.setOpen, label = _a.label, createLabel = _a.createLabel, search = _a.search, setSearch = _a.setSearch, _b = _a.showCreateOptionOnEmpty, showCreateOptionOnEmpty = _b === void 0 ? false : _b;
    var t = (0, macro_1.useLingui)().t;
    var parentRef = (0, react_1.useRef)(null);
    var filteredOptions = (0, react_1.useMemo)(function () {
        var filtered = search
            ? options.filter(function (option) {
                var value = typeof option.label === "string"
                    ? "".concat(option.label, " ").concat(option.helper)
                    : (0, react_2.reactNodeToString)(option.label);
                return value.toLowerCase().includes(search.toLowerCase());
            })
            : options;
        var isExactMatch = options.some(function (option) {
            var _a;
            return [option.label.toLowerCase(), (_a = option.helper) === null || _a === void 0 ? void 0 : _a.toLowerCase()].includes(search.toLowerCase());
        });
        var trimmedSearch = search.trim();
        if (isExactMatch || (trimmedSearch === "" && !showCreateOptionOnEmpty)) {
            return filtered;
        }
        return __spreadArray(__spreadArray([], filtered, true), [
            {
                label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New"], ["New"]))),
                value: "create"
            }
        ], false);
    }, [options, search, showCreateOptionOnEmpty, t]);
    var virtualizer = (0, react_virtual_1.useVirtualizer)({
        count: filteredOptions.length,
        getScrollElement: function () { return parentRef.current; },
        estimateSize: function () { return itemHeight; },
        overscan: 5
    });
    var items = virtualizer.getVirtualItems();
    return (<Command_1.Command shouldFilter={false}>
      <Command_1.CommandInput value={search} onValueChange={setSearch} placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
      <div ref={parentRef} className="overflow-auto pt-1" style={{
            height: "".concat(Math.min(filteredOptions.length, 6) * itemHeight + 4, "px")
        }}>
        <cmdk_1.CommandEmpty>{t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["No option found."], ["No option found."])))}</cmdk_1.CommandEmpty>
        <Command_1.CommandGroup style={{
            height: "".concat(virtualizer.getTotalSize(), "px"),
            width: "100%",
            position: "relative"
        }}>
          {items.map(function (virtualRow) {
            var _a;
            var item = filteredOptions[virtualRow.index];
            var isSelected = selected.includes(item.value);
            var isCreateOption = item.value === "create";
            var itemHoverText = [item.label, item.helper]
                .filter(Boolean)
                .join(" - ");
            return (<Command_1.CommandItem key={item.value} value={typeof item.label === "string"
                    ? item.label.replace(/"/g, '\\"') +
                        ((_a = item.helper) === null || _a === void 0 ? void 0 : _a.replace(/"/g, '\\"'))
                    : undefined} onSelect={function () {
                    if (isCreateOption) {
                        onCreateOption === null || onCreateOption === void 0 ? void 0 : onCreateOption(search.trim());
                        setSearch("");
                    }
                    else {
                        onChange(isSelected
                            ? selected.filter(function (value) { return value !== item.value; })
                            : __spreadArray(__spreadArray([], selected, true), [item.value], false));
                    }
                    setOpen(true);
                }} style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "".concat(itemHeight, "px"),
                    transform: "translateY(".concat(virtualRow.start, "px)")
                }}>
                <div className="flex justify-start items-center gap-1 px-2 min-w-0 flex-1">
                  {isCreateOption ? (<>
                      <lu_1.LuCirclePlus className="mr-1.5 flex-shrink-0"/>
                      <span>{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Create ", ""], ["Create ", ""])), search.trim() === "" ? (createLabel !== null && createLabel !== void 0 ? createLabel : label) : search)}</span>
                    </>) : (<>
                      {isSelected ? (<fa6_1.FaSquareCheck className="mr-1.5 text-primary flex-shrink-0"/>) : (<fa6_1.FaRegSquare className="mr-1.5 text-muted-foreground flex-shrink-0"/>)}
                      {item.helper ? (<div className="flex flex-col min-w-0 flex-1">
                          <TruncatedTooltipText_1.TruncatedTooltipText className="block w-full truncate" tooltip={itemHoverText}>
                            {item.label}
                          </TruncatedTooltipText_1.TruncatedTooltipText>
                          <TruncatedTooltipText_1.TruncatedTooltipText className="text-xs text-muted-foreground truncate" tooltip={itemHoverText}>
                            {item.helper}
                          </TruncatedTooltipText_1.TruncatedTooltipText>
                        </div>) : (<TruncatedTooltipText_1.TruncatedTooltipText className="truncate flex-1" tooltip={itemHoverText}>
                          {item.label}
                        </TruncatedTooltipText_1.TruncatedTooltipText>)}
                    </>)}
                </div>
              </Command_1.CommandItem>);
        })}
        </Command_1.CommandGroup>
      </div>
    </Command_1.Command>);
}
function SelectedOption(_a) {
    var _b;
    var isReadOnly = _a.isReadOnly, item = _a.item, options = _a.options, onUnselect = _a.onUnselect;
    return (<Badge_1.Badge key={item} variant="secondary" className="border border-card">
      {(_b = options.find(function (option) { return option.value === item; })) === null || _b === void 0 ? void 0 : _b.label}
      <Badge_1.BadgeCloseButton disabled={isReadOnly} tabIndex={-1} type="button" onKeyDown={function (e) {
            if (e.key === "Enter" && !isReadOnly) {
                onUnselect(item);
            }
        }} onMouseDown={function (e) {
            e.preventDefault();
            e.stopPropagation();
        }} onClick={function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isReadOnly)
                onUnselect(item);
        }}/>
    </Badge_1.Badge>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
