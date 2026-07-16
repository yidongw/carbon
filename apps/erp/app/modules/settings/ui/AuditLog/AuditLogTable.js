"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var audit_config_1 = require("@carbon/database/audit.config");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var operationConfig = {
    INSERT: {
        variant: "green",
        icon: <lu_1.LuFilePlus className="size-3"/>,
        label: "Created"
    },
    UPDATE: {
        variant: "blue",
        icon: <lu_1.LuFilePen className="size-3"/>,
        label: "Updated"
    },
    DELETE: {
        variant: "red",
        icon: <lu_1.LuFileX className="size-3"/>,
        label: "Deleted"
    }
};
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
function getEntityPath(entityId) {
    var prefix = entityId.split("_")[0];
    if (!prefix || prefix === entityId)
        return null;
    var map = {
        pi: path_1.path.to.purchaseInvoice,
        si: path_1.path.to.salesInvoice,
        po: path_1.path.to.purchaseOrder,
        so: path_1.path.to.salesOrder,
        cust: path_1.path.to.customer,
        sup: path_1.path.to.supplier,
        item: path_1.path.to.part,
        job: path_1.path.to.job,
        quote: path_1.path.to.quote,
        emp: path_1.path.to.employeeAccount,
        nc: path_1.path.to.issue,
        sh: path_1.path.to.shipment,
        rec: path_1.path.to.receipt,
        g: path_1.path.to.gauge,
        sq: path_1.path.to.supplierQuote,
        wc: path_1.path.to.workCenter,
        main: path_1.path.to.maintenanceDispatch
    };
    var pathFn = map[prefix];
    return pathFn ? pathFn(entityId) : null;
}
var InlineDiff = (0, react_2.memo)(function (_a) {
    var fieldName = _a.fieldName, oldValue = _a.oldValue, newValue = _a.newValue;
    return (<div className="flex items-center gap-2 font-mono text-sm py-1">
      <span className="text-muted-foreground font-medium min-w-[120px]">
        {fieldName}:
      </span>
      {oldValue !== undefined && (<span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500">
          {formatValue(oldValue)}
        </span>)}
      {oldValue !== undefined && newValue !== undefined && (<span className="text-muted-foreground">→</span>)}
      {newValue !== undefined && (<span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500">
          {formatValue(newValue)}
        </span>)}
    </div>);
});
InlineDiff.displayName = "InlineDiff";
// Hide globally-skipped columns (and any nested suffix) from the rendered
// diff. Defense-in-depth — backend strips skipFields too, but legacy entries
// or newly-added skipFields can slip through.
function isSkippedDiffKey(key) {
    console.log(key, "KEY");
    var skip = audit_config_1.auditConfig.skipFields;
    for (var i = 0; i < skip.length; i++) {
        var s = skip[i];
        if (key === s || key.endsWith(".".concat(s)))
            return true;
    }
    return false;
}
function visibleDiffEntries(diff) {
    console.log(diff);
    if (!diff)
        return [];
    return Object.entries(diff).filter(function (_a) {
        var k = _a[0];
        return !isSkippedDiffKey(k);
    });
}
var ExpandedRowContent = (0, react_2.memo)(function (_a) {
    var _b;
    var entry = _a.entry;
    var visibleEntries = visibleDiffEntries(entry.diff);
    var hasDiff = visibleEntries.length > 0;
    return (<div className="px-6 py-4">
      <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <span className="text-muted-foreground">Source</span>
          <div className="text-xs font-medium">
            {(0, audit_config_1.getTableLabel)(entry.tableName)}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Event ID</span>
          <div className="font-mono text-xs">{entry.id}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Actor ID</span>
          <div className="font-mono text-xs">{(_b = entry.actorId) !== null && _b !== void 0 ? _b : "System"}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Timestamp</span>
          <div className="font-mono text-xs">{entry.createdAt}</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Changes</h4>
        {hasDiff ? (<div className="space-y-1">
            {visibleEntries.map(function (_a) {
                var fieldName = _a[0], change = _a[1];
                return (<InlineDiff key={fieldName} fieldName={fieldName} oldValue={change.old} newValue={change.new}/>);
            })}
          </div>) : (<p className="text-sm text-muted-foreground italic">
            {entry.operation === "INSERT"
                ? "New record created"
                : entry.operation === "DELETE"
                    ? "Record deleted"
                    : "No changes recorded"}
          </p>)}
      </div>
    </div>);
});
ExpandedRowContent.displayName = "ExpandedRowContent";
var AuditLogTable = (0, react_2.memo)(function (_a) {
    var entries = _a.entries, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "entityType",
            header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Entity"], ["Entity"]))),
            cell: function (_a) {
                var row = _a.row;
                var entry = row.original;
                var entityPath = getEntityPath(entry.entityId);
                return (<div>
              <div className="font-medium">
                {(0, audit_config_1.getEntityLabel)(entry.entityType)}
              </div>
              {entityPath ? (<react_router_1.Link to={entityPath} className="text-xs text-primary font-mono truncate max-w-[200px] block hover:underline">
                  {entry.entityId}
                </react_router_1.Link>) : (<div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                  {entry.entityId}
                </div>)}
            </div>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: (0, audit_config_1.getEntityTypes)().map(function (entityType) { return ({
                        label: (0, audit_config_1.getEntityLabel)(entityType),
                        value: entityType
                    }); })
                },
                pluralHeader: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Entities"], ["Entities"])))
            }
        },
        {
            accessorKey: "operation",
            header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Operation"], ["Operation"]))),
            cell: function (_a) {
                var _b, _c;
                var row = _a.row;
                var config = operationConfig[row.original.operation];
                return (<react_1.Badge variant={(_b = config === null || config === void 0 ? void 0 : config.variant) !== null && _b !== void 0 ? _b : "secondary"} className="shrink-0">
              <react_1.HStack className="gap-1">
                {config === null || config === void 0 ? void 0 : config.icon}
                <span>{(_c = config === null || config === void 0 ? void 0 : config.label) !== null && _c !== void 0 ? _c : row.original.operation}</span>
              </react_1.HStack>
            </react_1.Badge>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: [
                        { label: "Created", value: "INSERT" },
                        { label: "Updated", value: "UPDATE" },
                        { label: "Deleted", value: "DELETE" }
                    ]
                }
            }
        },
        {
            accessorKey: "actorId",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Changed By"], ["Changed By"]))),
            cell: function (_a) {
                var row = _a.row;
                var entry = row.original;
                return entry.actorId ? (<react_router_1.Link to={path_1.path.to.employeeAccount(entry.actorId)} className="hover:underline">
              <components_1.EmployeeAvatar employeeId={entry.actorId}/>
            </react_router_1.Link>) : (<span className="text-muted-foreground text-sm">System</span>);
            }
        },
        {
            id: "changes",
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Changes"], ["Changes"]))),
            cell: function (_a) {
                var row = _a.row;
                var entry = row.original;
                var visibleCount = visibleDiffEntries(entry.diff).length;
                return (<span className="text-sm text-muted-foreground">
              {visibleCount > 0
                        ? "".concat(visibleCount, " change").concat(visibleCount !== 1 ? "s" : "")
                        : "-"}
            </span>);
            }
        },
        {
            accessorKey: "createdAt",
            header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["When"], ["When"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<span className="text-sm text-muted-foreground">
            {formatDateTime(row.original.createdAt)}
          </span>);
            }
        }
    ]; }, [t, formatDateTime]);
    var renderExpandedRow = (0, react_2.useCallback)(function (entry) { return <ExpandedRowContent entry={entry}/>; }, []);
    return (<components_1.Table data={entries} columns={columns} count={count} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Audit Log"], ["Audit Log"])))} table="auditLog" withSearch withPagination renderExpandedRow={renderExpandedRow}/>);
});
AuditLogTable.displayName = "AuditLogTable";
exports.default = AuditLogTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
