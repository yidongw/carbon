"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var quality_models_1 = require("~/modules/quality/quality.models");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
function getStatusVariant(status) {
    if (status === "Passed")
        return "green";
    if (status === "Failed")
        return "red";
    if (status === "Partial")
        return "yellow";
    if (status === "In Progress")
        return "blue";
    return "secondary";
}
function computeProgress(row) {
    var _a, _b;
    // The list loader selects `inboundInspectionSample(status)` as an array of
    // child rows; count the non-Pending ones.
    var samples = (_a = row.inboundInspectionSample) !== null && _a !== void 0 ? _a : [];
    var inspected = samples.filter(function (s) { return s.status !== "Pending"; }).length;
    return { inspected: inspected, total: (_b = row.sampleSize) !== null && _b !== void 0 ? _b : 0 };
}
var InboundInspectionsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var params = (0, hooks_1.useUrlParams)()[0];
    var items = (0, items_1.useItems)()[0];
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "inboundInspectionId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Inspection"], ["Inspection"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={"".concat(path_1.path.to.inboundInspection(row.original.id), "?").concat(params.toString())}>
              {row.original.inboundInspectionId}
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "itemId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var _b, _c, _d;
                    var row = _a.row;
                    return (<div className="flex flex-col gap-0">
              <span className="text-sm font-medium">
                {(_c = (_b = (0, utils_1.getItemReadableId)(items, row.original.itemId)) !== null && _b !== void 0 ? _b : row.original.itemReadableId) !== null && _c !== void 0 ? _c : ""}
              </span>
              <span className="text-xs text-muted-foreground">
                {(_d = row.original.item) === null || _d === void 0 ? void 0 : _d.name}
              </span>
            </div>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />,
                    filter: {
                        type: "static",
                        options: items.map(function (item) { return ({
                            value: item.id,
                            label: item.readableIdWithRevision
                        }); })
                    }
                }
            },
            {
                id: "receipt",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Receipt"], ["Receipt"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<div className="flex flex-col gap-0 text-sm">
              <span>{(_b = row.original.receipt) === null || _b === void 0 ? void 0 : _b.receiptId}</span>
              <span className="text-xs text-muted-foreground">
                {(_c = row.original.supplier) === null || _c === void 0 ? void 0 : _c.name}
              </span>
            </div>);
                },
                meta: { icon: <lu_1.LuTruck /> }
            },
            {
                accessorKey: "lotSize",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Lot Size"], ["Lot Size"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="text-sm">
              {(_b = row.original.lotSize) !== null && _b !== void 0 ? _b : 0}
            </span>);
                },
                meta: { icon: <lu_1.LuPackage /> }
            },
            {
                accessorKey: "sampleSize",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Sample"], ["Sample"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var p = computeProgress(row.original);
                    return (<span className="text-sm">
                {p.inspected} / {p.total}
              </span>);
                },
                meta: { icon: <lu_1.LuHash /> }
            },
            {
                accessorKey: "status",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.Badge variant={getStatusVariant(row.original.status)}>
              {row.original.status}
            </react_1.Badge>);
                },
                meta: {
                    icon: <lu_1.LuClipboardCheck />,
                    filter: {
                        type: "static",
                        options: quality_models_1.inboundInspectionStatus.map(function (s) { return ({
                            value: s,
                            label: <react_1.Badge variant={getStatusVariant(s)}>{s}</react_1.Badge>
                        }); })
                    }
                }
            },
            {
                accessorKey: "createdBy",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Received By"], ["Received By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: { icon: <lu_1.LuPackage /> }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Received At"], ["Received At"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.createdAt ? formatDate(row.original.createdAt) : "";
                },
                meta: { icon: <lu_1.LuCalendar /> }
            }
        ];
    }, [items, t, params, formatDate]);
    return (<components_1.Table data={data} columns={columns} count={count !== null && count !== void 0 ? count : 0} title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Inbound Inspections"], ["Inbound Inspections"])))} table="inboundInspection" withSavedView/>);
});
InboundInspectionsTable.displayName = "InboundInspectionsTable";
exports.default = InboundInspectionsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
