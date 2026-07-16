"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var fa_1 = require("react-icons/fa");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var provider_1 = require("../provider");
var useUserSelect_1 = require("../useUserSelect");
var UserTreeSelect = function () {
    var _a = (0, provider_1.default)(), listBoxProps = _a.aria.listBoxProps, groups = _a.groups, isMulti = _a.innerProps.isMulti, loading = _a.loading, onMouseOver = _a.onMouseOver, listBoxRef = _a.refs.listBoxRef;
    return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: suppressed due to migration
    <div {...listBoxProps} aria-multiselectable={isMulti} ref={listBoxRef} onMouseOver={onMouseOver} className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent max-h-[300px] my-1 flex flex-col gap-1">
      {loading ? (<div className="flex items-center justify-center py-4">
          <react_1.Spinner />
        </div>) : groups.length > 0 ? (groups.map(function (group) { return <Group key={group.uid} group={group}/>; })) : (<p className="text-center text-sm text-muted-foreground py-4">
          No options found
        </p>)}
    </div>);
};
var ExpandIcon = function (_a) {
    var isExpanded = _a.isExpanded;
    return (<fa_1.FaChevronRight className={(0, react_1.cn)("h-3 w-3 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-90")}/>);
};
var Group = function (_a) {
    var group = _a.group;
    var _b = (0, provider_1.default)(), alwaysSelected = _b.innerProps.alwaysSelected, onGroupCollapse = _b.onGroupCollapse, onGroupExpand = _b.onGroupExpand, prefetchGroup = _b.prefetchGroup, focusedId = _b.focusedId, onSelect = _b.onSelect, onDeselect = _b.onDeselect, selectionItemsById = _b.selectionItemsById, loadingGroups = _b.loadingGroups;
    var isFocused = group.uid === focusedId;
    var isExpanded = group.expanded && group.items.length > 0;
    var groupId = group.uid.split("_")[1];
    var isLoading = groupId ? loadingGroups === null || loadingGroups === void 0 ? void 0 : loadingGroups[groupId] : false;
    return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: suppressed due to migration
    <div id={group.uid} tabIndex={0} className="rounded-md outline-none" aria-expanded={isExpanded}>
      {/* Group Header */}
      <div role="treeitem" aria-selected={isExpanded ? "true" : "false"} onClick={function () {
            return group.expanded ? onGroupCollapse(group.uid) : onGroupExpand(group.uid);
        }} onMouseEnter={function () {
            if (!group.expanded)
                prefetchGroup(group.uid);
        }} className={(0, react_1.cn)("flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/50 text-sm", isFocused && "bg-muted/50")}>
        <ExpandIcon isExpanded={isExpanded}/>
        <span className="flex-1 truncate">{group.name}</span>
        {isLoading ? (<react_1.Spinner className="h-3 w-3"/>) : (<span className="text-[10px] font-normal">{group.items.length}</span>)}
      </div>

      {/* Group Items */}
      {isExpanded && (<ul role="group" className="flex flex-col gap-0.5 py-1 pl-2">
          {group.items.map(function (item) {
                var _a;
                var isDisabled = (_a = alwaysSelected === null || alwaysSelected === void 0 ? void 0 : alwaysSelected.includes(item.id)) !== null && _a !== void 0 ? _a : false;
                var isFocused = item.uid === focusedId;
                var isSelected = item.id in selectionItemsById;
                return (<Option key={item.uid} id={item.uid} item={item} isDisabled={isDisabled} isFocused={isFocused} isSelected={isSelected} onClick={!alwaysSelected.includes(item.id)
                        ? function () { return (isSelected ? onDeselect(item) : onSelect(item)); }
                        : undefined}/>);
            })}
        </ul>)}
    </div>);
};
var Option = function (_a) {
    var _b, _c, _d, _e;
    var id = _a.id, item = _a.item, isDisabled = _a.isDisabled, isFocused = _a.isFocused, isSelected = _a.isSelected, onClick = _a.onClick;
    var name = item.label;
    var itemIsGroup = (0, useUserSelect_1.isGroup)(item);
    var memberCount = itemIsGroup && "users" in item
        ? ((_c = (_b = item.users) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) +
            ("children" in item ? ((_e = (_d = item.children) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) : 0)
        : 0;
    // Get avatar info for individuals
    var avatarUrl = "avatarUrl" in item ? item.avatarUrl : null;
    var fullName = "fullName" in item ? item.fullName : null;
    return (<li id={id} className={(0, react_1.cn)("relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors", "hover:bg-accent/50", isFocused && "bg-accent/50", isSelected && "bg-accent", isDisabled && "opacity-50 pointer-events-none")} tabIndex={0} aria-selected={isSelected} aria-disabled={isDisabled} role="treeitem" onClick={onClick}>
      {/* Selection indicator */}
      <div className={(0, react_1.cn)("flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors", isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 bg-background")}>
        {isSelected && <lu_1.LuCheck className="h-3 w-3"/>}
      </div>

      {/* Avatar or Group Icon */}
      {itemIsGroup ? (<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <lu_1.LuUsers className="h-3.5 w-3.5 text-muted-foreground"/>
        </div>) : (<components_1.Avatar name={fullName !== null && fullName !== void 0 ? fullName : name} path={avatarUrl} size="sm"/>)}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{name}</span>
        {itemIsGroup && memberCount > 0 && (<span className="text-xs text-muted-foreground">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>)}
      </div>

      {/* Group indicator badge */}
      {itemIsGroup && (<span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
          Group
        </span>)}
    </li>);
};
exports.default = UserTreeSelect;
