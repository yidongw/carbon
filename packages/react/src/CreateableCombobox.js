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
exports.CreatableCombobox = void 0;
var macro_1 = require("@lingui/react/macro");
var react_virtual_1 = require("@tanstack/react-virtual");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Command_1 = require("./Command");
var HStack_1 = require("./HStack");
var IconButton_1 = require("./IconButton");
var Popover_1 = require("./Popover");
var TruncatedTooltipText_1 = require("./TruncatedTooltipText");
var cn_1 = require("./utils/cn");
var react_2 = require("./utils/react");
var CreatableCombobox = (0, react_1.forwardRef)(function (_a, ref) {
    var size = _a.size, value = _a.value, options = _a.options, selected = _a.selected, isClearable = _a.isClearable, isReadOnly = _a.isReadOnly, placeholder = _a.placeholder, onChange = _a.onChange, label = _a.label, _b = _a.itemHeight, itemHeight = _b === void 0 ? 40 : _b, inline = _a.inline, inlineAddLabel = _a.inlineAddLabel, onCreateOption = _a.onCreateOption, props = __rest(_a, ["size", "value", "options", "selected", "isClearable", "isReadOnly", "placeholder", "onChange", "label", "itemHeight", "inline", "inlineAddLabel", "onCreateOption"]);
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_1.useState)(false), open = _c[0], setOpen = _c[1];
    var _d = (0, react_1.useState)(""), search = _d[0], setSearch = _d[1];
    var isInlinePreview = !!inline;
    var selectedOption = (0, react_1.useMemo)(function () { return options.find(function (option) { return option.value === value; }); }, [options, value]);
    var selectedOptionText = (0, react_1.useMemo)(function () {
        if (!selectedOption)
            return undefined;
        var labelText = typeof selectedOption.label === "string"
            ? selectedOption.label
            : (0, react_2.reactNodeToString)(selectedOption.label);
        return [labelText, selectedOption.helper].filter(Boolean).join(" - ");
    }, [selectedOption]);
    var dropdownContentWidthCh = (0, react_1.useMemo)(function () {
        if (options.length === 0)
            return undefined;
        var maxOptionChars = options.reduce(function (longest, option) {
            var labelText = typeof option.label === "string"
                ? option.label
                : (0, react_2.reactNodeToString)(option.label);
            var combined = [labelText, option.helper, option.helperRight]
                .filter(Boolean)
                .join(" ");
            return Math.max(longest, combined.length);
        }, 0);
        return Math.min(72, Math.max(36, maxOptionChars + 8));
    }, [options]);
    return (<HStack_1.HStack className={(0, cn_1.cn)(isInlinePreview ? "w-full" : "min-w-0 flex-grow")} spacing={1}>
        {isInlinePreview && value && (<span className="flex flex-grow line-clamp-1 items-center">
            {inline(value, options)}
          </span>)}

        <Popover_1.Popover open={open} onOpenChange={setOpen}>
          <Popover_1.PopoverTrigger disabled={isReadOnly} asChild>
            {inline ? (<HStack_1.HStack>
                <IconButton_1.IconButton size={size !== null && size !== void 0 ? size : "sm"} variant="secondary" aria-label={value ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit"], ["Edit"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add"], ["Add"])))} icon={value ? <lu_1.LuSettings2 /> : <lu_1.LuPlus />} ref={ref} isDisabled={isReadOnly} disabled={isReadOnly} onClick={function () {
                if (!isReadOnly)
                    setOpen(true);
            }}/>
                {!value && inlineAddLabel && (<span className="text-muted-foreground text-sm">
                    {inlineAddLabel}
                  </span>)}
              </HStack_1.HStack>) : (<Command_1.CommandTrigger size={size} role="combobox" className={(0, cn_1.cn)("min-w-[160px]", !value && "text-muted-foreground truncate")} ref={ref} {...props} disabled={isReadOnly} onClick={function () { return setOpen(true); }}>
                {value ? (<TruncatedTooltipText_1.TruncatedTooltipText className="block min-w-0 flex-1 truncate text-left" tooltip={selectedOptionText}>
                    {selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label}
                  </TruncatedTooltipText_1.TruncatedTooltipText>) : (<span className="!text-muted-foreground">
                    {placeholder !== null && placeholder !== void 0 ? placeholder : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Select"], ["Select"])))}
                  </span>)}
              </Command_1.CommandTrigger>)}
          </Popover_1.PopoverTrigger>
          <Popover_1.PopoverContent align="start" className="min-w-[var(--radix-popover-trigger-width)] max-w-[min(560px,calc(100vw-2rem))] p-1" style={{
            width: dropdownContentWidthCh
                ? "min(560px, max(var(--radix-popover-trigger-width), ".concat(dropdownContentWidthCh, "ch))")
                : "var(--radix-popover-trigger-width)"
        }}>
            <VirtualizedCommand label={label} options={options} selected={selected} value={value} itemHeight={itemHeight} search={search} onChange={onChange} onCreateOption={onCreateOption} setOpen={setOpen} setSearch={setSearch}/>
          </Popover_1.PopoverContent>
        </Popover_1.Popover>
        {isClearable && !isReadOnly && value && (<IconButton_1.IconButton variant={isInlinePreview ? "secondary" : "ghost"} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Clear"], ["Clear"])))} icon={<lu_1.LuX />} onClick={function () { return onChange === null || onChange === void 0 ? void 0 : onChange(""); }} size={isInlinePreview ? "sm" : size}/>)}
      </HStack_1.HStack>);
});
exports.CreatableCombobox = CreatableCombobox;
CreatableCombobox.displayName = "CreatableCombobox";
function VirtualizedCommand(_a) {
    var options = _a.options, label = _a.label, selected = _a.selected, value = _a.value, itemHeight = _a.itemHeight, search = _a.search, setSearch = _a.setSearch, onChange = _a.onChange, onCreateOption = _a.onCreateOption, setOpen = _a.setOpen;
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
            var labelValue = typeof option.label === "string"
                ? option.label
                : (0, react_2.reactNodeToString)(option.label);
            return [labelValue.toLowerCase(), (_a = option.helper) === null || _a === void 0 ? void 0 : _a.toLowerCase()].includes(search.toLowerCase());
        });
        return isExactMatch
            ? filtered
            : __spreadArray(__spreadArray([], filtered, true), [
                {
                    label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["New"], ["New"]))),
                    value: "create"
                }
            ], false);
    }, [options, search, t]);
    var virtualizer = (0, react_virtual_1.useVirtualizer)({
        count: filteredOptions.length,
        getScrollElement: function () { return parentRef.current; },
        estimateSize: function () { return itemHeight; },
        overscan: 5
    });
    var items = virtualizer.getVirtualItems();
    return (<Command_1.Command shouldFilter={false}>
      <Command_1.CommandInput value={search} onValueChange={setSearch} placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
      <Command_1.CommandGroup>
        <div ref={parentRef} className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" style={{
            height: "".concat(Math.min(filteredOptions.length, 6) * itemHeight + 4, "px")
        }}>
          <div style={{
            height: "".concat(virtualizer.getTotalSize(), "px"),
            width: "100%",
            position: "relative"
        }}>
            {items.map(function (virtualRow) {
            var _a;
            var item = filteredOptions[virtualRow.index];
            var itemHoverText = typeof item.label === "string"
                ? [item.label, item.helper].filter(Boolean).join(" - ")
                : [(0, react_2.reactNodeToString)(item.label), item.helper]
                    .filter(Boolean)
                    .join(" - ");
            var isSelected = !!(selected === null || selected === void 0 ? void 0 : selected.includes(item.value));
            var isCreateOption = item.value === "create";
            return (<Command_1.CommandItem key={item.value} value={typeof item.label === "string"
                    ? CSS.escape(item.label) + CSS.escape((_a = item.helper) !== null && _a !== void 0 ? _a : "")
                    : undefined} onSelect={function () {
                    if (isCreateOption) {
                        onCreateOption === null || onCreateOption === void 0 ? void 0 : onCreateOption(search);
                    }
                    else if (!isSelected) {
                        onChange === null || onChange === void 0 ? void 0 : onChange(item.value);
                        setSearch("");
                    }
                    setOpen(false);
                }} style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "".concat(itemHeight, "px"),
                    transform: "translateY(".concat(virtualRow.start, "px)")
                }} className="flex items-center justify-between min-w-0">
                  {isCreateOption ? (<div className="flex items-center min-w-0 flex-1">
                      <span>
                        {t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Create ", ""], ["Create ", ""])), search.trim() === "" ? label : search)}
                      </span>
                    </div>) : item.helper ? (<div className={(0, cn_1.cn)("flex flex-col min-w-0 flex-1", isSelected || (item.value === value && "pr-2"))}>
                      <TruncatedTooltipText_1.TruncatedTooltipText className="block w-full truncate" tooltip={itemHoverText}>
                        {item.label}
                      </TruncatedTooltipText_1.TruncatedTooltipText>
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <TruncatedTooltipText_1.TruncatedTooltipText className="truncate flex-1" tooltip={itemHoverText}>
                          {item.helper}
                        </TruncatedTooltipText_1.TruncatedTooltipText>
                        {item.helperRight && (<span className="flex-shrink-0">
                            {item.helperRight}
                          </span>)}
                      </div>
                    </div>) : (<TruncatedTooltipText_1.TruncatedTooltipText className="truncate flex-1" tooltip={itemHoverText}>
                      {item.label}
                    </TruncatedTooltipText_1.TruncatedTooltipText>)}
                  {!isCreateOption && (<lu_1.LuCheck className={(0, cn_1.cn)("ml-auto h-4 w-4 flex-shrink-0", isSelected || item.value === value
                        ? "opacity-100"
                        : "opacity-0 hidden")}/>)}
                </Command_1.CommandItem>);
        })}
          </div>
        </div>
      </Command_1.CommandGroup>
    </Command_1.Command>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
