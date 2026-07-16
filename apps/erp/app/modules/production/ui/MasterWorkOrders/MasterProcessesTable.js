"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var stores_1 = require("~/stores");
var productionLabels_1 = require("../../productionLabels");
var MasterProcessesTable = (0, react_1.memo)(function (_a) {
    var data = _a.data, _b = _a.withHeader, withHeader = _b === void 0 ? true : _b;
    var t = (0, macro_1.useLingui)().t;
    var getOperationStatusLabel = (0, productionLabels_1.useJobOperationStatusLabel)();
    var styleProcessLabel = (0, productionLabels_1.useStyleProcessLabel)();
    var people = (0, stores_1.usePeople)()[0];
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        dateStyle: "medium",
        timeStyle: "short"
    });
    var peopleById = (0, react_1.useMemo)(function () { return new Map(people.map(function (p) { return [p.id, p.name]; })); }, [people]);
    var formatDate = function (value) {
        return value ? dateFormatter.format(new Date(value)) : "—";
    };
    // Each bundle row shows this operation's status (Todo / In Progress / Done),
    // mirroring the operations tab — not the bundle work order's lifecycle status.
    var renderOperationStatus = function (value) {
        if (!value)
            return "—";
        var status = value;
        return (<span className="inline-flex items-center gap-1.5">
        <Icons_1.OperationStatusIcon status={status}/>
        {getOperationStatusLabel(status)}
      </span>);
    };
    var columns = (0, react_1.useMemo)(function () {
        return [
            {
                accessorKey: "description",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Process"], ["Process"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return styleProcessLabel(row.original.description, row.original.isCutting);
                },
                meta: { icon: <lu_1.LuClipboardList /> }
            },
            {
                id: "assignee",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var row = _a.row;
                    // Bundle-sourced processes (assembly etc.) show a stacked group of the
                    // distinct bundle assignees; a master-owned process (cutting) shows its
                    // single operation assignee.
                    var employeeIds = row.original.bundleCount > 0
                        ? Array.from(new Set(row.original.bundles
                            .map(function (b) { return b.assignee; })
                            .filter(function (id) { return Boolean(id); })))
                        : row.original.assignee
                            ? [row.original.assignee]
                            : [];
                    if (employeeIds.length === 0)
                        return "—";
                    return <components_1.EmployeeAvatarGroup employeeIds={employeeIds}/>;
                },
                meta: { icon: <lu_1.LuUser /> }
            },
            {
                accessorKey: "bundleCount",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Bundles"], ["Bundles"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.bundleCount;
                },
                meta: { icon: <lu_1.LuPackageOpen /> }
            },
            {
                accessorKey: "quantity",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.quantity;
                },
                meta: { icon: <lu_1.LuHash /> }
            },
            {
                accessorKey: "reportedQuantity",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Reported"], ["Reported"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.reportedQuantity;
                },
                meta: { icon: <lu_1.LuCircleCheckBig /> }
            },
            {
                id: "remaining",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Remaining"], ["Remaining"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return Math.max(0, row.original.quantity - row.original.reportedQuantity);
                },
                meta: { icon: <lu_1.LuCircleDashed /> }
            }
        ];
    }, [t, styleProcessLabel]);
    var renderExpandedRow = function (process) { return (<div className="w-full py-1">
      {/* Desktop: full table */}
      <div className="hidden md:block overflow-x-auto pl-10 pr-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground text-left border-b border-border">
            <th className="py-2 pr-4 font-medium">
              <macro_1.Trans>Bundle</macro_1.Trans>
            </th>
            <th className="py-2 pr-4 font-medium">
              <macro_1.Trans>Color / Size</macro_1.Trans>
            </th>
            <th className="py-2 pr-4 font-medium">
              <macro_1.Trans>Assignee</macro_1.Trans>
            </th>
            <th className="py-2 pr-4 font-medium">
              <macro_1.Trans>Assigned At</macro_1.Trans>
            </th>
            <th className="py-2 pr-4 font-medium text-right">
              <macro_1.Trans>Reported</macro_1.Trans>
            </th>
            <th className="py-2 pr-4 font-medium text-right">
              <macro_1.Trans>Remaining</macro_1.Trans>
            </th>
            <th className="py-2 pr-4 font-medium">
              <macro_1.Trans>Reported At</macro_1.Trans>
            </th>
            <th className="py-2 pr-4 font-medium">
              <macro_1.Trans>Status</macro_1.Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {process.bundles.map(function (bundle) {
            var _a;
            return (<tr key={bundle.bundleWorkOrderId} className="border-b border-border last:border-0">
              <td className="py-2 pr-4 font-medium">{bundle.jobReadableId}</td>
              <td className="py-2 pr-4 text-muted-foreground">
                {[bundle.colorName || bundle.colorCode, bundle.sizeCode]
                    .filter(Boolean)
                    .join(" · ") || "—"}
              </td>
              <td className="py-2 pr-4">
                {bundle.assignee
                    ? ((_a = peopleById.get(bundle.assignee)) !== null && _a !== void 0 ? _a : bundle.assignee)
                    : "—"}
              </td>
              <td className="py-2 pr-4 text-muted-foreground">
                {formatDate(bundle.assignedAt)}
              </td>
              <td className="py-2 pr-4 text-right">
                {bundle.reportedQuantity} / {bundle.quantity}
              </td>
              <td className="py-2 pr-4 text-right">
                {bundle.remainingQuantity}
              </td>
              <td className="py-2 pr-4 text-muted-foreground">
                {formatDate(bundle.lastReportedAt)}
              </td>
              <td className="py-2 pr-4">
                {renderOperationStatus(bundle.operationStatus)}
              </td>
            </tr>);
        })}
        </tbody>
      </table>
      </div>

      {/* Mobile: one stacked card per bundle */}
      <div className="md:hidden flex flex-col gap-2 p-3">
        {process.bundles.map(function (bundle) {
            var _a;
            return (<div key={bundle.bundleWorkOrderId} className="rounded-md border border-border bg-card p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate">
                {bundle.jobReadableId}
              </span>
              {renderOperationStatus(bundle.operationStatus)}
            </div>
            <div className="text-xs text-muted-foreground">
              {[bundle.colorName || bundle.colorCode, bundle.sizeCode].filter(Boolean).join(" · ") ||
                    "—"}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 text-xs">
              <div>
                <dt className="text-muted-foreground">
                  <macro_1.Trans>Assignee</macro_1.Trans>
                </dt>
                <dd>
                  {bundle.assignee
                    ? ((_a = peopleById.get(bundle.assignee)) !== null && _a !== void 0 ? _a : bundle.assignee)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  <macro_1.Trans>Assigned At</macro_1.Trans>
                </dt>
                <dd>{formatDate(bundle.assignedAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  <macro_1.Trans>Reported</macro_1.Trans>
                </dt>
                <dd>
                  {bundle.reportedQuantity} / {bundle.quantity}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  <macro_1.Trans>Remaining</macro_1.Trans>
                </dt>
                <dd>{bundle.remainingQuantity}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  <macro_1.Trans>Reported At</macro_1.Trans>
                </dt>
                <dd>{formatDate(bundle.lastReportedAt)}</dd>
              </div>
            </dl>
          </div>);
        })}
      </div>
    </div>); };
    return (<components_1.Table compact data={data} columns={columns} count={data.length} renderExpandedRow={renderExpandedRow} getRowCanExpand={function (process) { return process.bundleCount > 0; }} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Processes"], ["Processes"])))} withHeader={withHeader}/>);
});
MasterProcessesTable.displayName = "MasterProcessesTable";
exports.default = MasterProcessesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
