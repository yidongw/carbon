"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_table_1 = require("@tanstack/react-table");
var react_2 = require("react");
var react_router_1 = require("react-router");
var useSwipeReveal_1 = require("~/hooks/useSwipeReveal");
var CardFieldChip_1 = require("./CardFieldChip");
var cardCell_1 = require("./cardCell");
var SYSTEM_COLUMN_IDS = new Set(["Select", "Actions", "Expand"]);
function isEmptyRawValue(value) {
    if (value == null || value === "")
        return true;
    if (Array.isArray(value) && value.length === 0)
        return true;
    return false;
}
function hasAccessor(column) {
    var def = column.columnDef;
    return def.accessorKey != null || def.accessorFn != null;
}
function isPlaceholderDisplay(rendered) {
    if (rendered == null || rendered === false)
        return true;
    if (typeof rendered === "string") {
        var text = rendered.trim();
        return text === "" || text === "—" || text === "-";
    }
    if (typeof rendered === "number")
        return false;
    if ((0, react_2.isValidElement)(rendered) && rendered.type === "span") {
        var children = rendered.props.children;
        if (children === "—" || children === "-")
            return true;
        if (typeof children === "string") {
            var text = children.trim();
            return text === "" || text === "—" || text === "-";
        }
    }
    return false;
}
function getCellRawValue(row, cell) {
    try {
        var fromCell = cell.getValue();
        if (fromCell !== undefined)
            return fromCell;
    }
    catch (_a) {
        // columns without accessor may throw
    }
    return row.original[cell.column.id];
}
function hasCellDisplayValue(row, cell, rendered) {
    var _a, _b;
    if ((_b = (_a = cell.column.columnDef.meta) === null || _a === void 0 ? void 0 : _a.isEmpty) === null || _b === void 0 ? void 0 : _b.call(_a, row.original))
        return false;
    if (isPlaceholderDisplay(rendered))
        return false;
    var raw = getCellRawValue(row, cell);
    if (hasAccessor(cell.column) || cell.column.id in row.original) {
        if (isEmptyRawValue(raw))
            return false;
    }
    return true;
}
function FieldIcon(_a) {
    var children = _a.children, _b = _a.size, size = _b === void 0 ? "sm" : _b;
    return (<span className={(0, react_1.cn)("flex-shrink-0 text-muted-foreground", size === "md"
            ? "[&>svg]:h-4 [&>svg]:w-4"
            : "[&>svg]:h-3.5 [&>svg]:w-3.5")}>
      {children}
    </span>);
}
function FieldChip(_a) {
    var header = _a.header, icon = _a.icon, children = _a.children, variant = _a.variant, rowNav = _a.rowNav, rowNavLabel = _a.rowNavLabel, onRowNav = _a.onRowNav;
    if (variant === "featured") {
        return (<CardFieldChip_1.CardFieldChip variant="featured">
        <CardFieldChip_1.CardFieldChipBody rowNav={rowNav} rowNavLabel={rowNavLabel} onRowNav={onRowNav}>
          <div className="flex items-center gap-1.5">
            {icon && <FieldIcon size="md">{icon}</FieldIcon>}
            <span className="card-action-label text-sm font-medium text-foreground">
              {header}
            </span>
          </div>
          <div className="min-w-0 text-base font-medium leading-snug text-foreground [&_.tabular-nums]:tabular-nums">
            {children}
          </div>
        </CardFieldChip_1.CardFieldChipBody>
      </CardFieldChip_1.CardFieldChip>);
    }
    return (<CardFieldChip_1.CardFieldChip variant="inline">
      <CardFieldChip_1.CardFieldChipBody rowNav={rowNav} rowNavLabel={rowNavLabel} onRowNav={onRowNav}>
        {icon && <FieldIcon>{icon}</FieldIcon>}
        <span className="card-action-label text-muted-foreground">
          {header}
        </span>
        <span className="min-w-0 font-medium text-foreground">{children}</span>
      </CardFieldChip_1.CardFieldChipBody>
    </CardFieldChip_1.CardFieldChip>);
}
function renderFieldColumn(row, column, cell, variant, _a, onRowNav) {
    var _b, _c, _d;
    var rowHref = _a.rowHref, defaultRowNavLabel = _a.defaultRowNavLabel, pinnedColumnIds = _a.pinnedColumnIds;
    var header = typeof column.columnDef.header === "string"
        ? column.columnDef.header
        : null;
    if (!header)
        return null;
    var rendered = (0, react_table_1.flexRender)(column.columnDef.cell, cell.getContext());
    if (!hasCellDisplayValue(row, cell, rendered))
        return null;
    var isRowNav = (0, cardCell_1.resolveCardRowNav)(column, rowHref, pinnedColumnIds);
    var rowNavLabel = (_c = (_b = column.columnDef.meta) === null || _b === void 0 ? void 0 : _b.cardRowNavLabel) !== null && _c !== void 0 ? _c : defaultRowNavLabel;
    return (<FieldChip key={column.id} header={header} icon={(_d = column.columnDef.meta) === null || _d === void 0 ? void 0 : _d.icon} variant={variant} rowNav={isRowNav} rowNavLabel={rowNavLabel} onRowNav={isRowNav && rowHref ? onRowNav(rowHref) : undefined}>
      {rendered}
    </FieldChip>);
}
function TableCardRow(_a) {
    var row = _a.row, pinnedColumns = _a.pinnedColumns, centerColumns = _a.centerColumns, featuredColumns = _a.featuredColumns, getRowHref = _a.getRowHref, renderContextMenu = _a.renderContextMenu;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var rowHref = getRowHref === null || getRowHref === void 0 ? void 0 : getRowHref(row.original);
    var defaultRowNavLabel = t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Open"], ["Open"])));
    var onRowNav = (0, react_2.useCallback)(function (href) { return function (event) {
        event.stopPropagation();
        navigate(href);
    }; }, [navigate]);
    var contextMenu = renderContextMenu === null || renderContextMenu === void 0 ? void 0 : renderContextMenu(row.original);
    var _b = (0, react_2.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var openMenu = (0, react_2.useCallback)(function () { return setMenuOpen(true); }, []);
    var _c = (0, useSwipeReveal_1.useSwipeReveal)({ onOpen: openMenu }), isDragging = _c.isDragging, swipeOffset = _c.offset, onTouchCancel = _c.onTouchCancel, onTouchEnd = _c.onTouchEnd, onTouchMove = _c.onTouchMove, onTouchStart = _c.onTouchStart;
    var cellMap = Object.fromEntries(row.getAllCells().map(function (cell) { return [cell.column.id, cell]; }));
    var cardLeft = pinnedColumns.filter(function (c) { return !SYSTEM_COLUMN_IDS.has(c.id); });
    var pinnedColumnIds = cardLeft.map(function (column) { return column.id; });
    var cardRight = centerColumns.filter(function (c) { return !SYSTEM_COLUMN_IDS.has(c.id) && featuredColumns.has(c.id); });
    var userCenter = centerColumns.filter(function (c) { return !SYSTEM_COLUMN_IDS.has(c.id) && !featuredColumns.has(c.id); });
    var featuredNodes = cardRight
        .map(function (column) {
        var cell = cellMap[column.id];
        if (!cell)
            return null;
        return renderFieldColumn(row, column, cell, "featured", {
            rowHref: rowHref,
            defaultRowNavLabel: defaultRowNavLabel,
            pinnedColumnIds: pinnedColumnIds
        }, onRowNav);
    })
        .filter(Boolean);
    var metadataNodes = userCenter
        .map(function (column) {
        var cell = cellMap[column.id];
        if (!cell)
            return null;
        return renderFieldColumn(row, column, cell, "metadata", {
            rowHref: rowHref,
            defaultRowNavLabel: defaultRowNavLabel,
            pinnedColumnIds: pinnedColumnIds
        }, onRowNav);
    })
        .filter(Boolean);
    var hasPinned = cardLeft.length > 0 || featuredNodes.length > 0;
    var hasUnpinned = metadataNodes.length > 0;
    var card = (<react_1.Card className={(0, react_1.cn)(
        // Flat container — only the primary field chip (e.g. the Job ID) navigates,
        // via its own overlay button. The card surface highlights on hover but is
        // not itself a tap target, matching the desktop table where only the
        // identifier link is clickable.
        "w-full cursor-default overflow-hidden border-0 shadow-none", "bg-muted/50 dark:bg-card", "transition-colors duration-150 ease-out", "hover:bg-muted dark:hover:bg-muted/70")}>
      {hasPinned && (<div className="flex items-start justify-between gap-3 p-3.5">
          {cardLeft.length > 0 && (<react_1.VStack spacing={2} className="min-w-0 flex-1">
              {cardLeft.map(function (column) {
                    var _a, _b;
                    var cell = cellMap[column.id];
                    if (!cell)
                        return null;
                    var isRowNav = (0, cardCell_1.resolveCardRowNav)(column, rowHref, pinnedColumnIds);
                    var rowNavLabel = (_b = (_a = column.columnDef.meta) === null || _a === void 0 ? void 0 : _a.cardRowNavLabel) !== null && _b !== void 0 ? _b : defaultRowNavLabel;
                    return (<CardFieldChip_1.CardFieldChip key={column.id} variant="pinned">
                    <CardFieldChip_1.CardFieldChipBody rowNav={isRowNav} rowNavLabel={rowNavLabel} onRowNav={isRowNav && rowHref ? onRowNav(rowHref) : undefined}>
                      <div className={(0, react_1.cn)(cardCell_1.CARD_PINNED_VALUE_CLASS, "min-w-0 w-fit max-w-full")}>
                        {(0, react_table_1.flexRender)(column.columnDef.cell, cell.getContext())}
                      </div>
                    </CardFieldChip_1.CardFieldChipBody>
                  </CardFieldChip_1.CardFieldChip>);
                })}
            </react_1.VStack>)}

          {featuredNodes.length > 0 && (<div className="flex w-full max-w-[52%] flex-shrink-0 flex-col gap-2 min-w-0">
              {featuredNodes}
            </div>)}
        </div>)}

      {hasPinned && hasUnpinned && <react_1.Separator className="bg-border/50"/>}

      {hasUnpinned && (<div className={(0, react_1.cn)("flex flex-wrap gap-1.5 px-3.5 pb-3.5", hasPinned ? "pt-2.5" : "pt-3.5")}>
          {metadataNodes}
        </div>)}

      {!hasPinned && !hasUnpinned && (<div className="p-3.5 text-xs text-muted-foreground">—</div>)}
    </react_1.Card>);
    if (!contextMenu)
        return card;
    return (<div className="relative overflow-hidden rounded-lg">
      <react_1.Menu type="dropdown">
        <react_1.DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
          <react_1.DropdownMenuTrigger asChild>
            <button type="button" tabIndex={-1} aria-hidden className="pointer-events-none absolute right-3 top-1/2 z-10 h-px w-px -translate-y-1/2 opacity-0"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent align="end" className="w-56">
            {contextMenu}
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </react_1.Menu>
      <div className="relative touch-pan-y" onTouchCancel={onTouchCancel} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} style={{
            transform: "translateX(".concat(swipeOffset, "px)"),
            transition: isDragging ? undefined : "transform 200ms ease-out"
        }}>
        {card}
      </div>
    </div>);
}
exports.default = TableCardRow;
var templateObject_1;
