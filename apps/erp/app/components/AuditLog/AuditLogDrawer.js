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
exports.AuditLogEntryCard = void 0;
var audit_config_1 = require("@carbon/database/audit.config");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var operationLabels = {
    INSERT: {
        label: "Created",
        variant: "green",
        icon: <lu_1.LuFilePlus className="size-3"/>
    },
    UPDATE: {
        label: "Updated",
        variant: "blue",
        icon: <lu_1.LuFilePen className="size-3"/>
    },
    DELETE: {
        label: "Deleted",
        variant: "red",
        icon: <lu_1.LuFileX className="size-3"/>
    }
};
var AuditLogDrawer = (0, react_2.memo)(function (_a) {
    var _b, _c, _d;
    var isOpen = _a.isOpen, onClose = _a.onClose, entityType = _a.entityType, entityId = _a.entityId, companyId = _a.companyId, title = _a.title, recordId = _a.recordId, _e = _a.planRestricted, planRestricted = _e === void 0 ? false : _e;
    var fetcher = (0, react_router_1.useFetcher)();
    var lastLoadedRef = (0, react_2.useRef)(null);
    var loadKey = "".concat(entityType, ":").concat(entityId, ":").concat(companyId, ":").concat(recordId !== null && recordId !== void 0 ? recordId : "");
    var rootRouteData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var auditLogEnabled = (_b = rootRouteData === null || rootRouteData === void 0 ? void 0 : rootRouteData.auditLogEnabled) !== null && _b !== void 0 ? _b : false;
    var can = (0, hooks_1.usePermissions)().can;
    // Load audit log data when drawer opens or entity changes
    (0, react_2.useEffect)(function () {
        if (planRestricted ||
            !auditLogEnabled ||
            !isOpen ||
            !entityType ||
            !entityId ||
            fetcher.state !== "idle" ||
            lastLoadedRef.current === loadKey) {
            return;
        }
        lastLoadedRef.current = loadKey;
        var params = new URLSearchParams({
            entityType: entityType,
            entityId: entityId,
            companyId: companyId
        });
        if (recordId)
            params.set("recordId", recordId);
        fetcher.load("/api/audit-log?".concat(params.toString()));
    }, [
        isOpen,
        entityType,
        entityId,
        companyId,
        recordId,
        loadKey,
        fetcher,
        planRestricted,
        auditLogEnabled
    ]);
    // Reset tracking when drawer closes so it re-fetches on next open
    (0, react_2.useEffect)(function () {
        if (!isOpen) {
            lastLoadedRef.current = null;
        }
    }, [isOpen]);
    var entries = (_d = (_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.entries) !== null && _d !== void 0 ? _d : [];
    var isLoading = fetcher.state === "loading";
    var drawerBody = planRestricted ? (<UpgradeOverlay_1.UpgradeOverlayInline>
        <UpgradeOverlay_1.UpgradeOverlayIcon>
          <lu_1.LuHistory className="size-6 text-muted-foreground"/>
        </UpgradeOverlay_1.UpgradeOverlayIcon>
        <UpgradeOverlay_1.UpgradeOverlayContent>
          <UpgradeOverlay_1.UpgradeOverlayTitle>
            <macro_1.Trans>Upgrade to unlock audit history</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayTitle>
          <UpgradeOverlay_1.UpgradeOverlayDescription>
            <macro_1.Trans>
              Track every change to your orders, invoices, customers, and more.
            </macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayDescription>
        </UpgradeOverlay_1.UpgradeOverlayContent>
        <UpgradeOverlay_1.UpgradeOverlayActions>
          <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
        </UpgradeOverlay_1.UpgradeOverlayActions>
      </UpgradeOverlay_1.UpgradeOverlayInline>) : !auditLogEnabled ? (<div className="flex flex-col items-center justify-start flex-1 w-full pt-[15dvh] text-center gap-4 px-4 h-full">
        <div className="rounded-full bg-muted p-3">
          <lu_1.LuHistory className="size-6 text-muted-foreground"/>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            <macro_1.Trans>Audit logging is not enabled</macro_1.Trans>
          </h3>
          <p className="text-sm text-muted-foreground text-balance">
            <macro_1.Trans>
              Enable audit logging in settings to start tracking changes to your
              data.
            </macro_1.Trans>
          </p>
        </div>
        {can("update", "settings") ? (<react_1.Button variant="secondary" leftIcon={<lu_1.LuSettings />} asChild>
            <react_router_1.Link to={path_1.path.to.auditLog}>
              <macro_1.Trans>Enable in Settings</macro_1.Trans>
            </react_router_1.Link>
          </react_1.Button>) : (<span className="text-sm text-muted-foreground">
            <macro_1.Trans>
              Please contact your administrator to enable audit logging.
            </macro_1.Trans>
          </span>)}
      </div>) : isLoading ? (<react_1.VStack spacing={3}>
        <react_1.Skeleton className="w-full h-[151px]"/>
        <react_1.Skeleton className="w-full h-[151px]"/>
      </react_1.VStack>) : entries.length === 0 ? (<components_1.Empty />) : (<react_1.VStack spacing={3}>
        {entries.map(function (entry) { return (<AuditLogEntryCard key={entry.id} entry={entry}/>); })}
      </react_1.VStack>);
    return (<react_1.Drawer open={isOpen} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
        <react_1.DrawerContent size="lg" position="left">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle className="flex items-center gap-2">
              <lu_1.LuHistory className="size-5"/>
              {title !== null && title !== void 0 ? title : <macro_1.Trans>History</macro_1.Trans>}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>{drawerBody}</react_1.DrawerBody>
        </react_1.DrawerContent>
      </react_1.Drawer>);
});
AuditLogDrawer.displayName = "AuditLogDrawer";
exports.default = AuditLogDrawer;
var AuditLogEntryCard = (0, react_2.memo)(function (_a) {
    var _b;
    var entry = _a.entry;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var opInfo = (_b = operationLabels[entry.operation]) !== null && _b !== void 0 ? _b : {
        label: entry.operation,
        variant: "secondary",
        icon: null
    };
    // Belt-and-suspenders filter — backend strips skipFields too, but if a
    // legacy entry slipped through (or a new skipField was added since the
    // entry was written), keep the noise out of the rendered diff.
    var diffKeys = entry.diff
        ? Object.keys(entry.diff).filter(function (k) { return !isSkippedDiffKey(k); })
        : [];
    return (<div className="border bg-muted/40 rounded-lg p-4 w-full">
      <react_1.HStack className="justify-between items-start mb-3">
        <react_1.VStack spacing={1}>
          {entry.actorId ? (<components_1.EmployeeAvatar employeeId={entry.actorId}/>) : (<span className="font-medium">
              <macro_1.Trans>System</macro_1.Trans>
            </span>)}
          <span className={(0, react_1.cn)("text-xs text-muted-foreground", entry.actorId && "pl-8")}>
            {formatDateTime(entry.createdAt)}
          </span>
        </react_1.VStack>
        <react_1.VStack spacing={1} className="items-end">
          <react_1.Badge variant={opInfo.variant} className="flex-shrink-0">
            <react_1.HStack className="gap-1">
              {opInfo.icon}
              <span>{opInfo.label}</span>
            </react_1.HStack>
          </react_1.Badge>
          <span className="text-xs text-muted-foreground">
            {(0, audit_config_1.getTableLabel)(entry.tableName)}
          </span>
        </react_1.VStack>
      </react_1.HStack>

      <div className="mt-3 pt-3 border-t">
        <p className="text-sm font-medium mb-2">
          <macro_1.Trans>Changes</macro_1.Trans>
        </p>
        {diffKeys.length > 0 ? (<div className="space-y-1">
            {diffKeys.map(function (key) { return (<ChangeRow key={key} columnKey={key} change={entry.diff[key]}/>); })}
          </div>) : (<p className="text-sm text-muted-foreground italic">
            {entry.operation === "INSERT" ? (<macro_1.Trans>New record created</macro_1.Trans>) : entry.operation === "DELETE" ? (<macro_1.Trans>Record deleted</macro_1.Trans>) : (<macro_1.Trans>No changes recorded</macro_1.Trans>)}
          </p>)}
      </div>
    </div>);
});
exports.AuditLogEntryCard = AuditLogEntryCard;
AuditLogEntryCard.displayName = "AuditLogEntryCard";
// Hide globally-skipped columns (and any nested suffix path) from the
// rendered diff. Mirrors the writer/reader filter so vector / metadata
// noise stays out of the UI even if it sneaks past the API layer.
function isSkippedDiffKey(key) {
    var skip = audit_config_1.auditConfig.skipFields;
    for (var i = 0; i < skip.length; i++) {
        var s = skip[i];
        if (key === s || key.endsWith(".".concat(s)))
            return true;
    }
    return false;
}
function formatValue(value) {
    if (value === null)
        return "null";
    if (value === undefined)
        return "undefined";
    if (typeof value === "string")
        return value;
    if (typeof value === "number" || typeof value === "boolean")
        return String(value);
    return JSON.stringify(value);
}
// Convert a column name into a Linear-style human label. When a snapshot
// exists, strip the trailing `Id` so a FK column reads as its referenced
// entity (e.g. `triggerProcessId` → `Trigger Process`). Without a
// snapshot, preserve the column name as-is so the raw column is still
// recognizable for forensic queries.
function humanizeColumnKey(key, hasSnapshot) {
    var normalized = hasSnapshot && key.endsWith("Id") ? key.slice(0, -2) : key;
    return normalized
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, function (c) { return c.toUpperCase(); })
        .trim();
}
// Pick the snapshot value for a given snapshot column from old or new sides.
function snapshotValue(snapshot, col) {
    return snapshot && col in snapshot ? snapshot[col] : undefined;
}
// Linear-style pill: when a display value is present, show that as primary
// sans-serif text and stash the underlying raw value on the title attribute
// (hover to inspect). When no display value is supplied, fall back to
// mono-rendering the raw value — appropriate for IDs, booleans, numbers.
function ChangePill(_a) {
    var value = _a.value, display = _a.display, variant = _a.variant;
    var hasDisplay = display !== undefined && display !== null;
    var text = hasDisplay ? formatValue(display) : formatValue(value);
    var className = (0, react_1.cn)("px-2 py-0.5 rounded", !hasDisplay && "font-mono", variant === "old"
        ? "bg-red-500/10 text-red-500"
        : "bg-green-500/10 text-green-500");
    var tooltip = hasDisplay && typeof value === "string" ? value : undefined;
    return (<span className={className} title={tooltip}>
      {text}
    </span>);
}
// One labeled side-by-side row: "label  [old]  →  [new]". Used for both
// the top-level column rows and the indented sub-rows under a multi-field
// snapshot header.
function ChangeLine(_a) {
    var label = _a.label, oldValue = _a.oldValue, newValue = _a.newValue, oldDisplay = _a.oldDisplay, newDisplay = _a.newDisplay, indent = _a.indent;
    return (<div className={(0, react_1.cn)("flex items-center gap-2 text-sm py-1", indent && "pl-4")}>
      <span className="text-muted-foreground font-medium min-w-[120px]">
        {label}
      </span>
      {oldValue !== undefined && (<ChangePill value={oldValue} display={oldDisplay} variant="old"/>)}
      {oldValue !== undefined && newValue !== undefined && (<span className="text-muted-foreground">→</span>)}
      {newValue !== undefined && (<ChangePill value={newValue} display={newDisplay} variant="new"/>)}
    </div>);
}
// Renders one row of the diff. Branches on snapshot key count:
//   • no snapshot       → raw column name + mono pill (numbers, booleans, ids)
//   • single-key snap   → humanized FK label + Linear pill (name primary,
//                         id on hover)
//   • multi-key snap    → humanized FK header + indented sub-rows per
//                         snapshot column, with the raw id shown last as a
//                         muted forensic anchor
function ChangeRow(_a) {
    var _b, _c;
    var columnKey = _a.columnKey, change = _a.change;
    var oldSnap = (_b = change.snapshot) === null || _b === void 0 ? void 0 : _b.old;
    var newSnap = (_c = change.snapshot) === null || _c === void 0 ? void 0 : _c.new;
    var snapKeys = new Set(__spreadArray(__spreadArray([], Object.keys(oldSnap !== null && oldSnap !== void 0 ? oldSnap : {}), true), Object.keys(newSnap !== null && newSnap !== void 0 ? newSnap : {}), true));
    var hasSnapshot = snapKeys.size > 0;
    var label = humanizeColumnKey(columnKey, hasSnapshot);
    // Path 1 — no snapshot. Same as before: one row, raw value pill.
    if (!hasSnapshot) {
        return (<ChangeLine label={label} oldValue={change.old} newValue={change.new}/>);
    }
    // Path 2 — single snapshot column. Inline Linear pill, id on hover.
    if (snapKeys.size === 1) {
        var col = Array.from(snapKeys)[0];
        return (<ChangeLine label={label} oldValue={change.old} newValue={change.new} oldDisplay={snapshotValue(oldSnap, col)} newDisplay={snapshotValue(newSnap, col)}/>);
    }
    // Path 3 — multi-column snapshot. The snapshot fields disambiguate, so
    // the raw FK id is demoted to a hover tooltip on the section header —
    // Linear-style. Power users still see the id transition without crowding
    // the visual flow.
    var idTooltip = (function () {
        if (typeof change.old !== "string" && typeof change.new !== "string") {
            return undefined;
        }
        var oldId = typeof change.old === "string" ? change.old : "—";
        var newId = typeof change.new === "string" ? change.new : "—";
        return "".concat(oldId, " \u2192 ").concat(newId);
    })();
    return (<div className="py-1">
      <div className="text-sm text-muted-foreground font-medium" title={idTooltip}>
        {label}
      </div>
      <div className="space-y-1 mt-1">
        {Array.from(snapKeys).map(function (col) { return (<ChangeLine key={col} label={humanizeColumnKey(col, false)} oldValue={snapshotValue(oldSnap, col)} newValue={snapshotValue(newSnap, col)} indent/>); })}
      </div>
    </div>);
}
