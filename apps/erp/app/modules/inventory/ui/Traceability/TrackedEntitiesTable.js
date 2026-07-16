"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var EditExpiryModal_1 = require("./EditExpiryModal");
var ExpiryTracePopover_1 = require("./ExpiryTracePopover");
var TrackedEntityStatus_1 = require("./TrackedEntityStatus");
var TrackedEntitiesTable = (0, react_2.memo)(function (_a) {
    var _b, _c;
    var data = _a.data, count = _a.count, nearExpiryWarningDays = _a.nearExpiryWarningDays, shelfLifePolicies = _a.shelfLifePolicies;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var permissions = (0, hooks_1.usePermissions)();
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var items = (0, items_1.useItems)()[0];
    // Edit-expiry modal state. Holds the entity being edited so the modal
    // can pre-fill its form. Lives at table level so the row context-menu
    // action can open it.
    var _d = (0, react_2.useState)(null), editingExpiry = _d[0], setEditingExpiry = _d[1];
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "sourceDocumentId",
            header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Entity"], ["Entity"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.Hyperlink to={"".concat(path_1.path.to.traceabilityGraph, "?trackedEntityId=").concat(row.original.id)}>
              <div className="flex flex-col items-start gap-0">
                <span>{row.original.sourceDocumentReadableId}</span>
                <span className="text-xs text-muted-foreground">
                  {row.original.id}
                </span>
              </div>
            </components_1.Hyperlink>);
            },
            meta: {
                icon: <lu_1.LuBookMarked />,
                filter: {
                    type: "static",
                    options: items.map(function (i) { return ({
                        label: i.readableIdWithRevision,
                        value: i.id
                    }); })
                }
            }
        },
        {
            accessorKey: "readableId",
            header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Serial/Batch #"], ["Serial/Batch #"]))),
            cell: function (_a) {
                var row = _a.row;
                return row.original.readableId ? (<react_1.Badge variant="secondary" className="items-center gap-1">
                <lu_1.LuQrCode />
                {row.original.readableId}
              </react_1.Badge>) : null;
            },
            meta: {
                icon: <lu_1.LuHash />
            }
        },
        {
            accessorKey: "quantity",
            header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<span>{numberFormatter.format(row.original.quantity)}</span>);
            },
            meta: {
                icon: <lu_1.LuHash />,
                renderTotal: true
            }
        },
        {
            accessorKey: "status",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<TrackedEntityStatus_1.default status={row.original.status}/>);
            },
            meta: {
                icon: <lu_1.LuCheck />,
                filter: {
                    type: "static",
                    options: inventory_1.trackedEntityStatus
                        .filter(function (v) { return v !== "Reserved"; })
                        .map(function (v) { return ({
                        label: <TrackedEntityStatus_1.default status={v}/>,
                        value: v
                    }); })
                }
            }
        },
        {
            id: "expirationDate",
            accessorKey: "expirationDate",
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Expiry"], ["Expiry"]))),
            cell: function (_a) {
                var _b, _c;
                var row = _a.row;
                var expiry = (_b = row.original.expirationDate) !== null && _b !== void 0 ? _b : undefined;
                if (!expiry)
                    return null;
                var status = row.original.status;
                var formatted = formatDate(expiry);
                // Use @internationalized/date so the comparison runs in the
                // operator's local calendar, not UTC. Avoids the off-by-one
                // around midnight that pure UTC `Date` arithmetic causes.
                var todayLocal = (0, date_1.today)((0, date_1.getLocalTimeZone)());
                var expiryDate = (0, date_1.parseDate)(expiry);
                var daysLeft = expiryDate.compare(todayLocal);
                var inner = status === "Consumed" ? (<react_1.Badge variant="secondary" className="gap-1">
                  {daysLeft < 0 ? "".concat(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Expired"], ["Expired"]))), " \u00B7 ").concat(formatted) : formatted}
                </react_1.Badge>) : daysLeft < 0 ? (<react_1.Badge variant="red" className="gap-1">
                  <lu_1.LuTriangleAlert className="size-3"/>
                  {t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Expired"], ["Expired"])))} · {formatted}
                </react_1.Badge>) : nearExpiryWarningDays !== null &&
                    daysLeft <= nearExpiryWarningDays ? (<react_1.Badge variant="yellow" className="gap-1">
                  <lu_1.LuTriangleAlert className="size-3"/>
                  {formatted}
                </react_1.Badge>) : (<span className="text-sm text-muted-foreground">
                  {formatted}
                </span>);
                var itemId = row.original.itemId;
                var policy = itemId ? shelfLifePolicies === null || shelfLifePolicies === void 0 ? void 0 : shelfLifePolicies[itemId] : undefined;
                return (<ExpiryTracePopover_1.ExpiryTracePopover entity={row.original} policy={policy
                        ? {
                            mode: policy.mode,
                            days: policy.days,
                            calculateFromBom: (_c = policy.calculateFromBom) !== null && _c !== void 0 ? _c : false
                        }
                        : null}>
                {inner}
              </ExpiryTracePopover_1.ExpiryTracePopover>);
            },
            meta: {
                icon: <lu_1.LuCalendarClock />
            }
        },
        {
            accessorKey: "sourceDocument",
            header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Source Document"], ["Source Document"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<SourceDocumentLink data={row.original} items={items}/>);
            },
            meta: {
                icon: <lu_1.LuFile />
            }
        }
    ]; }, [
        numberFormatter,
        items,
        t,
        nearExpiryWarningDays,
        shelfLifePolicies,
        formatDate
    ]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "inventory")} onClick={function () {
                navigate("".concat(path_1.path.to.traceabilityGraph, "?trackedEntityId=").concat(row.id));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuNetwork />}/>
              <macro_1.Trans>View Traceability Graph</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!permissions.can("update", "inventory") ||
                row.status === "Consumed"} onClick={function () { return setEditingExpiry(row); }}>
              <react_1.MenuIcon icon={<lu_1.LuCalendarCog />}/>
              <macro_1.Trans>Edit Expiry</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, permissions]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} renderContextMenu={renderContextMenu} title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Tracked Entities"], ["Tracked Entities"])))}/>
        {editingExpiry && editingExpiry.status !== "Consumed" && (<EditExpiryModal_1.EditExpiryModal open={!!editingExpiry} onClose={function () { return setEditingExpiry(null); }} trackedEntityId={editingExpiry.id} expirationDate={(_b = editingExpiry.expirationDate) !== null && _b !== void 0 ? _b : null} label={(_c = editingExpiry.sourceDocumentReadableId) !== null && _c !== void 0 ? _c : editingExpiry.id}/>)}
      </>);
});
function SourceDocumentLink(_a) {
    var data = _a.data, items = _a.items;
    switch (data.sourceDocument) {
        case "Item":
            var item = items.find(function (item) { return item.id === data.sourceDocumentId; });
            if (!item)
                return <Enumerable_1.Enumerable value={data.sourceDocument}/>;
            return (
            // @ts-ignore
            <components_1.Hyperlink to={(0, ItemForm_1.getLinkToItemDetails)(item.type, item.id)}>
          <Enumerable_1.Enumerable value={data.sourceDocument}/>
        </components_1.Hyperlink>);
        default:
            return <Enumerable_1.Enumerable value={data.sourceDocument}/>;
    }
}
TrackedEntitiesTable.displayName = "TrackedEntitiesTable";
exports.default = TrackedEntitiesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
