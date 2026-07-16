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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combobox = void 0;
var macro_1 = require("@lingui/react/macro");
var react_virtual_1 = require("@tanstack/react-virtual");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Command_1 = require("./Command");
var HStack_1 = require("./HStack");
var IconButton_1 = require("./IconButton");
var Popover_1 = require("./Popover");
var Spinner_1 = require("./Spinner");
var TruncatedTooltipText_1 = require("./TruncatedTooltipText");
var cn_1 = require("./utils/cn");
var react_2 = require("./utils/react");
var Combobox = (0, react_1.forwardRef)(function (_a, ref) {
    var asButton = _a.asButton, size = _a.size, value = _a.value, options = _a.options, isClearable = _a.isClearable, isLoading = _a.isLoading, isReadOnly = _a.isReadOnly, placeholder = _a.placeholder, defaultOpen = _a.defaultOpen, onClose = _a.onClose, onChange = _a.onChange, inline = _a.inline, _b = _a.itemHeight, itemHeight = _b === void 0 ? 40 : _b, props = __rest(_a, ["asButton", "size", "value", "options", "isClearable", "isLoading", "isReadOnly", "placeholder", "defaultOpen", "onClose", "onChange", "inline", "itemHeight"]);
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_1.useState)(defaultOpen !== null && defaultOpen !== void 0 ? defaultOpen : false), open = _c[0], setOpen = _c[1];
    // Route every open-state change through here so `onClose` fires on
    // selection, escape, and outside-click alike.
    var setOpenAndNotify = function (next) {
        setOpen(next);
        if (!next)
            onClose === null || onClose === void 0 ? void 0 : onClose();
    };
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

        <Popover_1.Popover open={open} onOpenChange={setOpenAndNotify}>
          <Popover_1.PopoverTrigger disabled={isReadOnly} asChild>
            {inline ? (<IconButton_1.IconButton size={size !== null && size !== void 0 ? size : "sm"} variant="secondary" aria-label={value ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit"], ["Edit"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add"], ["Add"])))} icon={value ? <lu_1.LuSettings2 /> : <lu_1.LuPlus />} isDisabled={isReadOnly} disabled={isReadOnly} ref={ref} onClick={function () {
                if (!isReadOnly)
                    setOpenAndNotify(true);
            }}/>) : (<Command_1.CommandTrigger asButton={asButton} size={size} role="combobox" className={(0, cn_1.cn)("min-w-[160px]", !value && "text-muted-foreground")} icon={isLoading ? <Spinner_1.Spinner className="size-3"/> : undefined} ref={ref} {...props} disabled={isReadOnly} onClick={function () { return setOpenAndNotify(true); }}>
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
            <VirtualizedCommand options={options} value={value} onChange={onChange} itemHeight={itemHeight} setOpen={setOpenAndNotify}/>
          </Popover_1.PopoverContent>
        </Popover_1.Popover>
        {isClearable && !isReadOnly && value && (<IconButton_1.IconButton variant={isInlinePreview ? "secondary" : "ghost"} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Clear"], ["Clear"])))} icon={<lu_1.LuX />} onClick={function () { return onChange === null || onChange === void 0 ? void 0 : onChange(""); }} size={isInlinePreview ? "sm" : size === "sm" ? "md" : size}/>)}
      </HStack_1.HStack>);
});
exports.Combobox = Combobox;
Combobox.displayName = "Combobox";
function VirtualizedCommand(_a) {
    var options = _a.options, value = _a.value, onChange = _a.onChange, itemHeight = _a.itemHeight, setOpen = _a.setOpen;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_1.useState)(""), search = _b[0], setSearch = _b[1];
    var parentRef = (0, react_1.useRef)(null);
    var filteredOptions = (0, react_1.useMemo)(function () {
        return search
            ? options.filter(function (option) {
                var value = typeof option.label === "string"
                    ? "".concat(option.label, " ").concat(option.helper)
                    : (0, react_2.reactNodeToString)(option.label);
                return value.toLowerCase().includes(search.toLowerCase());
            })
            : options;
    }, [options, search]);
    var virtualizer = (0, react_virtual_1.useVirtualizer)({
        count: filteredOptions.length,
        getScrollElement: function () { return parentRef.current; },
        estimateSize: function () { return itemHeight; },
        overscan: 5
    });
    var items = virtualizer.getVirtualItems();
    return (<Command_1.Command shouldFilter={false}>
      <Command_1.CommandInput value={search} onValueChange={setSearch} placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
      <Command_1.CommandEmpty>{t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["No option found."], ["No option found."])))}</Command_1.CommandEmpty>
      <div ref={parentRef} className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent pt-1" style={{
            height: "".concat(Math.min(filteredOptions.length, 6) * itemHeight + 4, "px")
        }}>
        <Command_1.CommandGroup style={{
            height: "".concat(virtualizer.getTotalSize(), "px"),
            width: "100%",
            position: "relative"
        }}>
          {items.map(function (virtualRow) {
            var _a, _b;
            var item = filteredOptions[virtualRow.index];
            var itemValue = typeof item.label === "string"
                ? CSS.escape(item.label) + CSS.escape((_a = item.helper) !== null && _a !== void 0 ? _a : "")
                : (0, react_2.reactNodeToString)(item.label);
            var itemHoverText = typeof item.label === "string"
                ? [item.label, item.helper].filter(Boolean).join(" - ")
                : [(0, react_2.reactNodeToString)(item.label), item.helper]
                    .filter(Boolean)
                    .join(" - ");
            return (<Command_1.CommandItem key={item.value} value={typeof item.label === "string"
                    ? CSS.escape(item.label) + CSS.escape((_b = item.helper) !== null && _b !== void 0 ? _b : "")
                    : (0, react_2.reactNodeToString)(item.label)} onSelect={function () {
                    onChange === null || onChange === void 0 ? void 0 : onChange(item.value);
                    setSearch("");
                    setOpen(false);
                }} style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "".concat(itemHeight, "px"),
                    transform: "translateY(".concat(virtualRow.start, "px)")
                }}>
                {item.helper ? (<div className={(0, cn_1.cn)("flex flex-col min-w-0 flex-1", itemValue === value && "pr-2")}>
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
                <lu_1.LuCheck className={(0, cn_1.cn)("ml-auto h-4 w-4", itemValue === value ? "opacity-100" : "opacity-0 hidden")}/>
              </Command_1.CommandItem>);
        })}
        </Command_1.CommandGroup>
      </div>
    </Command_1.Command>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
