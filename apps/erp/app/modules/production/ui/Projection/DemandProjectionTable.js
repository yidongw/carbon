"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Location_1 = require("~/components/Form/Location");
var ItemThumbnail_1 = require("~/components/ItemThumbnail");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var defaultColumnPinning = {
    left: ["readableIdWithRevision"],
    right: ["actions"]
};
var DemandProjectionsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, locationId = _a.locationId, periods = _a.periods;
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        month: "short",
        day: "numeric"
    });
    var params = (0, react_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var locations = (0, Location_1.useLocations)();
    var _b = (0, react_2.useState)(null), selectedItem = _b[0], setSelectedItem = _b[1];
    var columns = (0, react_2.useMemo)(function () {
        var periodColumns = periods.map(function (period, index) {
            var isCurrentWeek = index === 0;
            var weekNumber = index + 1;
            var weekKey = "week".concat(weekNumber);
            var startDate = (0, date_1.parseDate)(period.startDate).toDate((0, date_1.getLocalTimeZone)());
            var endDate = (0, date_1.parseDate)(period.endDate).toDate((0, date_1.getLocalTimeZone)());
            return {
                accessorKey: weekKey,
                header: function () { return (<react_1.VStack spacing={0}>
                <div>
                  {isCurrentWeek ? "Present Week" : "Week ".concat(weekNumber)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dateFormatter.format(startDate)} -{" "}
                  {dateFormatter.format(endDate)}
                </div>
              </react_1.VStack>); },
                cell: function (_a) {
                    var row = _a.row;
                    var value = row.getValue(weekKey);
                    if (value === undefined || value === null || value === 0)
                        return "-";
                    return <span>{numberFormatter.format(value)}</span>;
                }
            };
        });
        return __spreadArray(__spreadArray([
            {
                accessorKey: "readableIdWithRevision",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Part ID"], ["Part ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.demandProjection(row.original.id, locationId)}>
              <react_1.HStack className="py-1 cursor-pointer">
                <ItemThumbnail_1.default size="sm" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-ignore
                    type={row.original.type}/>

                <react_1.VStack spacing={0} className="font-medium">
                  {row.original.readableIdWithRevision}
                  <div className="w-full truncate text-muted-foreground text-xs">
                    {row.original.name}
                  </div>
                </react_1.VStack>
              </react_1.HStack>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            }
        ], periodColumns, true), [
            {
                id: "actions",
                header: "",
                cell: function (_a) {
                    var row = _a.row;
                    var canDelete = permissions.can("delete", "production");
                    if (!canDelete)
                        return null;
                    return (<div className="flex justify-end">
                <react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Actions"], ["Actions"])))} variant="secondary" icon={<lu_1.LuEllipsisVertical />}/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent align="end">
                    <react_1.DropdownMenuItem asChild>
                      <react_router_1.Link to={path_1.path.to.demandProjection(row.original.id, locationId)}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                        Edit
                      </react_router_1.Link>
                    </react_1.DropdownMenuItem>
                    <react_1.DropdownMenuItem onSelect={function () { return setSelectedItem(row.original); }} destructive>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTrash2 />}/>
                      Delete
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
              </div>);
                }
            }
        ], false);
    }, [periods, dateFormatter, numberFormatter, locationId, permissions, t]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} defaultColumnPinning={defaultColumnPinning} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Demand Projections"], ["Demand Projections"])))} table="production-planning" withSavedView withSelectableRows withSimpleSorting primaryAction={<div className="flex items-center gap-2">
              <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = getLocationPath(selected);
            }}/>
              {permissions.can("create", "production") && (<components_1.New label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Part"], ["Part"])))} to={"new?".concat(params.toString())}/>)}
            </div>}/>

        {selectedItem && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteDemandProjections(selectedItem.id, locationId)} name={"".concat(selectedItem.readableIdWithRevision, " projections")} text={"Are you sure you want to delete all projections for ".concat(selectedItem.readableIdWithRevision, "? This action cannot be undone.")} onCancel={function () { return setSelectedItem(null); }} onSubmit={function () { return setSelectedItem(null); }}/>)}
      </>);
});
DemandProjectionsTable.displayName = "DemandProjectionsTable";
exports.default = DemandProjectionsTable;
function getLocationPath(locationId) {
    return "".concat(path_1.path.to.demandProjections, "?location=").concat(locationId);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
