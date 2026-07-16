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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var tb_1 = require("react-icons/tb");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var ItemPostingGroup_1 = require("~/components/Form/ItemPostingGroup");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
// All Consumables inline edits go through the shared items bulk-update action.
var ITEM_UPDATE = {
    action: path_1.path.to.bulkUpdateItems,
    idKey: "items"
};
var ConsumablesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, tags = _a.tags;
    var t = (0, macro_1.useLingui)().t;
    var translateMethodType = (0, react_2.useCallback)(function (v) {
        return v === "Purchase to Order"
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : v === "Pull from Inventory"
            ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Make to Order"], ["Make to Order"])));
    }, [t]);
    var translateTrackingType = (0, react_2.useCallback)(function (v) {
        return v === "Inventory"
            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : v === "Non-Inventory"
            ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : v === "Serial"
            ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Batch"], ["Batch"])));
    }, [t]);
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var deleteItemModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(null), selectedItem = _b[0], setSelectedItem = _b[1];
    var people = (0, stores_1.usePeople)()[0];
    var itemPostingGroups = (0, ItemPostingGroup_1.useItemPostingGroups)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("consumable");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "id",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Consumable ID"], ["Consumable ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="py-1 min-w-[200px] truncate">
              <components_1.ItemThumbnail thumbnailPath={row.original.thumbnailPath} type="Consumable"/>
              <components_1.Hyperlink to={path_1.path.to.consumableDetails(row.original.id)}>
                <react_1.VStack spacing={0}>
                  {row.original.readableIdWithRevision}
                  <div className="w-full truncate text-muted-foreground text-xs">
                    {row.original.name}
                  </div>
                </react_1.VStack>
              </components_1.Hyperlink>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "description",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Description"], ["Description"]))),
                cell: function (item) { return (<div className="max-w-[320px] truncate">
              {item.getValue()}
            </div>); },
                meta: {
                    icon: <lu_1.LuAlignJustify />
                }
            },
            {
                accessorKey: "itemPostingGroupId",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Item Group"], ["Item Group"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "itemPostingGroupId",
                    update: ITEM_UPDATE,
                    value: function (r) { return r.itemPostingGroupId; },
                    clearable: true,
                    options: itemPostingGroups
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: itemPostingGroups.map(function (group) { return ({
                            value: group.value,
                            label: <Enumerable_1.Enumerable value={group.label}/>
                        }); })
                    },
                    icon: <lu_1.LuGroup />
                }
            },
            {
                accessorKey: "defaultMethodType",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Default Method"], ["Default Method"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "defaultMethodType",
                    update: ITEM_UPDATE,
                    value: function (r) { return r.defaultMethodType; },
                    // Consumables are never made — offer only the non-Make methods.
                    options: shared_1.methodType
                        .filter(function (type) { return type !== "Make to Order"; })
                        .map(function (type) { return ({
                        value: type,
                        label: (<span className="flex items-center gap-2">
                    <components_1.MethodIcon type={type}/>
                    {translateMethodType(type)}
                  </span>)
                    }); }),
                    renderInline: function (v) { return (<react_1.Badge variant="secondary">
                <components_1.MethodIcon type={v} className="mr-2"/>
                <span>{translateMethodType(v)}</span>
              </react_1.Badge>); }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: shared_1.methodType.map(function (value) { return ({
                            value: value,
                            label: (<react_1.Badge variant="secondary">
                    <components_1.MethodIcon type={value} className="mr-2"/>
                    <span>{translateMethodType(value)}</span>
                  </react_1.Badge>)
                        }); })
                    },
                    icon: <rx_1.RxCodesandboxLogo />
                }
            },
            {
                accessorKey: "itemTrackingType",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Tracking"], ["Tracking"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "itemTrackingType",
                    update: ITEM_UPDATE,
                    value: function (r) { return r.itemTrackingType; },
                    options: items_models_1.itemTrackingTypes.map(function (v) { return ({
                        value: v,
                        label: (<span className="flex items-center gap-2">
                  <components_1.TrackingTypeIcon type={v} className="mr-2"/>
                  {translateTrackingType(v)}
                </span>)
                    }); }),
                    renderInline: function (v) { return (<react_1.Badge variant="secondary">
                <components_1.TrackingTypeIcon type={v} className="mr-2"/>
                <span>{translateTrackingType(v)}</span>
              </react_1.Badge>); }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: items_models_1.itemTrackingTypes.map(function (type) { return ({
                            value: type,
                            label: (<react_1.Badge variant="secondary">
                    <components_1.TrackingTypeIcon type={type} className="mr-2"/>
                    <span>{translateTrackingType(type)}</span>
                  </react_1.Badge>)
                        }); })
                    },
                    icon: <tb_1.TbTargetArrow />
                }
            },
            {
                accessorKey: "tags",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<InlineEditor_1.TagsCell row={row.original} table="consumable" availableTags={tags}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: tags.map(function (tag) { return ({
                            value: tag.name,
                            label: <react_1.Badge variant="secondary">{tag.name}</react_1.Badge>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "boolean",
                    field: "active",
                    update: ITEM_UPDATE,
                    value: function (r) { return r.active; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Active"], ["Active"]))) },
                            { value: "false", label: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Inactive"], ["Inactive"]))) }
                        ]
                    },
                    pluralHeader: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Active Statuses"], ["Active Statuses"]))),
                    icon: <lu_1.LuCheck />
                }
            },
            // {
            //   id: "assignee",
            //   header: t`Assignee`,
            //   cell: ({ row }) => (
            //     <EmployeeAvatar employeeId={row.original.assignee} />
            //   ),
            //   meta: {
            //     filter: {
            //       type: "static",
            //       options: people.map((employee) => ({
            //         value: employee.id,
            //         label: employee.name,
            //       })),
            //     },
            //   },
            // },
            {
                id: "createdBy",
                header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "updatedAt",
                header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        tags,
        people,
        customColumns,
        itemPostingGroups,
        t,
        translateMethodType,
        translateTrackingType,
        formatDate
    ]);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onBulkUpdate = (0, react_2.useCallback)(function (selectedRows, field, value) {
        var formData = new FormData();
        selectedRows.forEach(function (row) {
            if (row.id)
                formData.append("items", row.id);
        });
        formData.append("field", field);
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateItems
        });
    }, []);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) {
        return (<react_1.DropdownMenuContent align="end" className="min-w-[200px]">
            <react_1.DropdownMenuLabel>
              <macro_1.Trans>Update</macro_1.Trans>
            </react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuGroup>
              <react_1.DropdownMenuSub>
                <react_1.DropdownMenuSubTrigger>
                  <macro_1.Trans>Item Group</macro_1.Trans>
                </react_1.DropdownMenuSubTrigger>
                <react_1.DropdownMenuPortal>
                  <react_1.DropdownMenuSubContent>
                    {itemPostingGroups.map(function (group) { return (<react_1.DropdownMenuItem key={group.value} onClick={function () {
                    return onBulkUpdate(selectedRows, "itemPostingGroupId", group.value);
                }}>
                        <Enumerable_1.Enumerable value={group.label}/>
                      </react_1.DropdownMenuItem>); })}
                  </react_1.DropdownMenuSubContent>
                </react_1.DropdownMenuPortal>
              </react_1.DropdownMenuSub>
              <react_1.DropdownMenuSub>
                <react_1.DropdownMenuSubTrigger>
                  <macro_1.Trans>Default Method Type</macro_1.Trans>
                </react_1.DropdownMenuSubTrigger>
                <react_1.DropdownMenuPortal>
                  <react_1.DropdownMenuSubContent>
                    {shared_1.methodType.map(function (type) { return (<react_1.DropdownMenuItem key={type} onClick={function () {
                    return onBulkUpdate(selectedRows, "defaultMethodType", type);
                }}>
                        <react_1.DropdownMenuIcon icon={<components_1.MethodIcon type={type}/>}/>
                        <span>{translateMethodType(type)}</span>
                      </react_1.DropdownMenuItem>); })}
                  </react_1.DropdownMenuSubContent>
                </react_1.DropdownMenuPortal>
              </react_1.DropdownMenuSub>
              <react_1.DropdownMenuSub>
                <react_1.DropdownMenuSubTrigger>
                  <macro_1.Trans>Tracking Type</macro_1.Trans>
                </react_1.DropdownMenuSubTrigger>
                <react_1.DropdownMenuPortal>
                  <react_1.DropdownMenuSubContent>
                    {items_models_1.itemTrackingTypes.map(function (type) { return (<react_1.DropdownMenuItem key={type} onClick={function () {
                    return onBulkUpdate(selectedRows, "itemTrackingType", type);
                }}>
                        <react_1.DropdownMenuIcon icon={<components_1.TrackingTypeIcon type={type}/>}/>
                        <span>{translateTrackingType(type)}</span>
                      </react_1.DropdownMenuItem>); })}
                  </react_1.DropdownMenuSubContent>
                </react_1.DropdownMenuPortal>
              </react_1.DropdownMenuSub>
            </react_1.DropdownMenuGroup>
          </react_1.DropdownMenuContent>);
    }, [
        onBulkUpdate,
        itemPostingGroups,
        translateMethodType,
        translateTrackingType
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
          <react_1.MenuItem onClick={function () { return navigate(path_1.path.to.consumable(row.id)); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Consumable
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "parts")} destructive onClick={function () {
                setSelectedItem(row);
                deleteItemModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Consumable
          </react_1.MenuItem>
        </>); };
    }, [deleteItemModal, navigate, permissions]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["id"]
        }} defaultColumnVisibility={{
            description: false,
            active: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
        }} importCSV={[
            {
                table: "consumable",
                label: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Consumables"], ["Consumables"])))
            }
        ]} primaryAction={permissions.can("create", "parts") && (<div className="flex items-center gap-2">
                <react_1.Button variant="secondary" leftIcon={<lu_1.LuGroup />} asChild>
                  <react_router_1.Link to={path_1.path.to.itemPostingGroups}>
                    <macro_1.Trans>Item Groups</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>
                <components_1.New label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Consumable"], ["Consumable"])))} to={path_1.path.to.newConsumable}/>
              </div>)} renderActions={renderActions} renderContextMenu={renderContextMenu} title={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Consumables"], ["Consumables"])))} table="consumable" withSavedView withSelectableRows/>
        {selectedItem && selectedItem.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteItem(selectedItem.id)} isOpen={deleteItemModal.isOpen} name={selectedItem.readableIdWithRevision} text={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), selectedItem.readableIdWithRevision)} onCancel={function () {
                deleteItemModal.onClose();
                setSelectedItem(null);
            }} onSubmit={function () {
                deleteItemModal.onClose();
                setSelectedItem(null);
            }}/>)}
      </>);
});
ConsumablesTable.displayName = "ConsumableTable";
exports.default = ConsumablesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25;
