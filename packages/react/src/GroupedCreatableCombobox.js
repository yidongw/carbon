"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.GroupedCreatableCombobox = void 0;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Command_1 = require("./Command");
var HStack_1 = require("./HStack");
var IconButton_1 = require("./IconButton");
var Popover_1 = require("./Popover");
var TruncatedTooltipText_1 = require("./TruncatedTooltipText");
var cn_1 = require("./utils/cn");
var react_2 = require("./utils/react");
var CREATE_PREFIX = "__create__:";
function optionSearchText(option) {
    var labelText = typeof option.label === "string"
        ? option.label
        : (0, react_2.reactNodeToString)(option.label);
    return [labelText, option.helper, option.helperRight]
        .filter(Boolean)
        .join(" ");
}
function matchesSearch(text, search) {
    return text.toLowerCase().includes(search.toLowerCase());
}
var GroupedCreatableCombobox = (0, react_1.forwardRef)(function (_a, ref) {
    var size = _a.size, value = _a.value, groups = _a.groups, isClearable = _a.isClearable, isReadOnly = _a.isReadOnly, placeholder = _a.placeholder, onChange = _a.onChange, inline = _a.inline, inlineAddLabel = _a.inlineAddLabel, _b = _a.itemHeight, itemHeight = _b === void 0 ? 40 : _b, props = __rest(_a, ["size", "value", "groups", "isClearable", "isReadOnly", "placeholder", "onChange", "inline", "inlineAddLabel", "itemHeight"]);
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_1.useState)(false), open = _c[0], setOpen = _c[1];
    var _d = (0, react_1.useState)(""), search = _d[0], setSearch = _d[1];
    var isInlinePreview = !!inline;
    var flatOptions = (0, react_1.useMemo)(function () { return groups.flatMap(function (group) { return group.options; }); }, [groups]);
    var selectedOption = (0, react_1.useMemo)(function () { return flatOptions.find(function (option) { return option.value === value; }); }, [flatOptions, value]);
    var selectedOptionText = (0, react_1.useMemo)(function () {
        if (!selectedOption)
            return undefined;
        return optionSearchText(selectedOption);
    }, [selectedOption]);
    var filteredGroups = (0, react_1.useMemo)(function () {
        var trimmed = search.trim();
        return groups
            .map(function (group) {
            var options = trimmed
                ? group.options.filter(function (option) {
                    return matchesSearch(optionSearchText(option), trimmed);
                })
                : group.options;
            var showCreate = !!group.onCreateOption &&
                (!trimmed ||
                    matchesSearch(typeof group.heading === "string"
                        ? group.heading
                        : (0, react_2.reactNodeToString)(group.heading), trimmed) ||
                    matchesSearch(typeof group.createLabel === "string"
                        ? group.createLabel
                        : group.createLabel
                            ? (0, react_2.reactNodeToString)(group.createLabel)
                            : "Create ".concat(typeof group.heading === "string" ? group.heading : ""), trimmed));
            return __assign(__assign({}, group), { options: options, showCreate: showCreate });
        })
            .filter(function (group) { return group.options.length > 0 || group.showCreate; });
    }, [groups, search]);
    var dropdownContentWidthCh = (0, react_1.useMemo)(function () {
        var allOptions = groups.flatMap(function (g) { return g.options; });
        if (allOptions.length === 0)
            return undefined;
        var maxOptionChars = allOptions.reduce(function (longest, option) {
            return Math.max(longest, optionSearchText(option).length);
        }, 0);
        return Math.min(72, Math.max(36, maxOptionChars + 8));
    }, [groups]);
    return (<HStack_1.HStack className={(0, cn_1.cn)(isInlinePreview ? "w-full" : "w-full min-w-0 shrink-0")} spacing={1}>
        {isInlinePreview && value && (<span className="flex flex-grow line-clamp-1 items-center">
            {inline(value, flatOptions)}
          </span>)}

        <Popover_1.Popover open={open} onOpenChange={setOpen}>
          <Popover_1.PopoverTrigger disabled={isReadOnly} asChild>
            {inline ? (<HStack_1.HStack>
                <IconButton_1.IconButton size={size !== null && size !== void 0 ? size : "sm"} variant="secondary" aria-label={value ? "Edit" : "Add"} icon={value ? <lu_1.LuSettings2 /> : <lu_1.LuPlus />} ref={ref} isDisabled={isReadOnly} disabled={isReadOnly} onClick={function () {
                if (!isReadOnly)
                    setOpen(true);
            }} className="transition-transform active:scale-[0.96]"/>
                {!value && inlineAddLabel && (<span className="text-muted-foreground text-sm">
                    {inlineAddLabel}
                  </span>)}
              </HStack_1.HStack>) : (<Command_1.CommandTrigger size={size} role="combobox" className={(0, cn_1.cn)("min-w-[160px]", !value && "text-muted-foreground truncate")} ref={ref} {...props} disabled={isReadOnly} onClick={function () { return setOpen(true); }}>
                {value ? (<TruncatedTooltipText_1.TruncatedTooltipText className="block min-w-0 flex-1 truncate text-left" tooltip={selectedOptionText}>
                    {selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label}
                  </TruncatedTooltipText_1.TruncatedTooltipText>) : (<span className="!text-muted-foreground">
                    {placeholder !== null && placeholder !== void 0 ? placeholder : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select"], ["Select"])))}
                  </span>)}
              </Command_1.CommandTrigger>)}
          </Popover_1.PopoverTrigger>
          <Popover_1.PopoverContent align="start" onWheel={function (e) { return e.stopPropagation(); }} onTouchMove={function (e) { return e.stopPropagation(); }} className="min-w-[--radix-popover-trigger-width] max-w-[min(560px,calc(100vw-2rem))] p-1" style={{
            width: dropdownContentWidthCh
                ? "min(560px, max(var(--radix-popover-trigger-width), ".concat(dropdownContentWidthCh, "ch))")
                : "var(--radix-popover-trigger-width)"
        }}>
            <Command_1.Command shouldFilter={false}>
              <Command_1.CommandInput value={search} onValueChange={setSearch} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
              <Command_1.CommandList className="max-h-[min(320px,50vh)] overflow-y-auto overscroll-contain" onWheel={function (e) { return e.stopPropagation(); }}>
                {filteredGroups.length === 0 ? (<Command_1.CommandEmpty>{t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["No results found."], ["No results found."])))}</Command_1.CommandEmpty>) : (filteredGroups.map(function (group, groupIndex) {
            var _a;
            var createValue = "".concat(CREATE_PREFIX).concat(group.id);
            var createLabel = (_a = group.createLabel) !== null && _a !== void 0 ? _a : (typeof group.heading === "string"
                ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Create ", ""], ["Create ", ""])), group.heading) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Create"], ["Create"]))));
            return (<div key={group.id}>
                        {groupIndex > 0 && <Command_1.CommandSeparator />}
                        <Command_1.CommandGroup heading={group.heading} className="overflow-visible">
                          {group.options.map(function (item) {
                    var itemHoverText = optionSearchText(item);
                    var isSelected = item.value === value;
                    return (<Command_1.CommandItem key={item.value} value={item.value} onSelect={function () {
                            onChange === null || onChange === void 0 ? void 0 : onChange(item.value);
                            setSearch("");
                            setOpen(false);
                        }} style={{ minHeight: "".concat(itemHeight, "px") }} className="flex items-center justify-between min-w-0">
                                {item.helper ? (<div className={(0, cn_1.cn)("flex flex-col min-w-0 flex-1", isSelected && "pr-2")}>
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
                                <lu_1.LuCheck className={(0, cn_1.cn)("ml-auto h-4 w-4 flex-shrink-0", isSelected ? "opacity-100" : "opacity-0")}/>
                              </Command_1.CommandItem>);
                })}
                          {group.showCreate && (<Command_1.CommandItem key={createValue} value={createValue} onSelect={function () {
                        var _a;
                        (_a = group.onCreateOption) === null || _a === void 0 ? void 0 : _a.call(group);
                        setSearch("");
                        setOpen(false);
                    }} style={{ minHeight: "".concat(itemHeight, "px") }} className="flex items-center gap-2 text-muted-foreground">
                              <lu_1.LuPlus className="h-4 w-4 shrink-0"/>
                              <span>{createLabel}</span>
                            </Command_1.CommandItem>)}
                        </Command_1.CommandGroup>
                      </div>);
        }))}
              </Command_1.CommandList>
            </Command_1.Command>
          </Popover_1.PopoverContent>
        </Popover_1.Popover>
        {isClearable && !isReadOnly && value && (<IconButton_1.IconButton variant={isInlinePreview ? "secondary" : "ghost"} aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Clear"], ["Clear"])))} icon={<lu_1.LuX />} onClick={function () { return onChange === null || onChange === void 0 ? void 0 : onChange(""); }} size={isInlinePreview ? "sm" : size} className="transition-transform active:scale-[0.96]"/>)}
      </HStack_1.HStack>);
});
exports.GroupedCreatableCombobox = GroupedCreatableCombobox;
GroupedCreatableCombobox.displayName = "GroupedCreatableCombobox";
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
