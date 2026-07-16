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
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var hooks_1 = require("~/hooks");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var stores_1 = require("~/stores");
var items_1 = require("~/stores/items");
var people_1 = require("~/stores/people");
var path_1 = require("~/utils/path");
var defaultColumnVisibility = {
    createdBy: false,
    supplierName: false,
    createdAt: false,
    updatedBy: false,
    updatedAt: false
};
var KanbansTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, locationId = _a.locationId, kanbanOutput = _a.kanbanOutput;
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var people = (0, people_1.usePeople)()[0];
    var items = (0, items_1.useItems)()[0];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var locations = (0, Location_1.useLocations)();
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "itemId",
            header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item"], ["Item"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack className="py-1">
              <components_1.ItemThumbnail size="sm" thumbnailPath={row.original.thumbnailPath}/>

              <components_1.Hyperlink to={"".concat(path_1.path.to.kanban(row.original.id), "?").concat(params)}>
                <react_1.VStack spacing={0}>
                  <div className="flex gap-1 items-center">
                    <span>{row.original.name}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {row.original.readableIdWithRevision}
                  </div>
                </react_1.VStack>
              </components_1.Hyperlink>
            </react_1.HStack>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: items === null || items === void 0 ? void 0 : items.map(function (item) { return ({
                        value: item.id,
                        label: item.readableIdWithRevision
                    }); })
                },
                icon: <lu_1.LuPackage />
            }
        },
        {
            id: "job",
            header: "",
            cell: function (_a) {
                var row = _a.row;
                if (!row.original.jobReadableId || !row.original.jobId)
                    return null;
                return (<react_1.Badge variant="outline">
                <react_router_1.Link to={path_1.path.to.job(row.original.jobId)} className="flex flex-row items-center gap-1">
                  {row.original.jobReadableId}
                  <react_1.PulsingDot />
                </react_router_1.Link>
              </react_1.Badge>);
            }
        },
        {
            id: "links",
            header: "",
            cell: function (_a) {
                var row = _a.row;
                return (<>
              {kanbanOutput === "label" && (<react_1.HStack>
                  <react_1.Tooltip>
                    <react_1.TooltipTrigger>
                      <a href={path_1.path.to.file.kanbanLabelsPdf([row.original.id], "order")} target="_blank" rel="noreferrer">
                        <react_1.Badge variant="outline" className="flex flex-row items-center gap-1">
                          <lu_1.LuTag />
                          <macro_1.Trans>Create</macro_1.Trans>
                        </react_1.Badge>
                      </a>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Label to create a ", " for this kanban"], ["Label to create a ", " for this kanban"])), row.original.replenishmentSystem === "Make" ? "Job" : "Order")}
                    </react_1.TooltipContent>
                  </react_1.Tooltip>
                  {row.original.replenishmentSystem === "Make" && (<>
                      <react_1.Tooltip>
                        <react_1.TooltipTrigger>
                          <a href={path_1.path.to.file.kanbanLabelsPdf([row.original.id], "start")} target="_blank" rel="noreferrer">
                            <react_1.Badge variant="outline" className="flex flex-row items-center gap-1">
                              <lu_1.LuTag />
                              <macro_1.Trans>Start</macro_1.Trans>
                            </react_1.Badge>
                          </a>
                        </react_1.TooltipTrigger>
                        <react_1.TooltipContent>
                          <macro_1.Trans>
                            Label to start the next operation for this kanban
                          </macro_1.Trans>
                        </react_1.TooltipContent>
                      </react_1.Tooltip>

                      <react_1.Tooltip>
                        <react_1.TooltipTrigger>
                          <a href={path_1.path.to.file.kanbanLabelsPdf([row.original.id], "complete")} target="_blank" rel="noreferrer">
                            <react_1.Badge variant="outline" className="flex flex-row items-center gap-1">
                              <lu_1.LuTag />
                              <macro_1.Trans>Complete</macro_1.Trans>
                            </react_1.Badge>
                          </a>
                        </react_1.TooltipTrigger>
                        <react_1.TooltipContent>
                          <macro_1.Trans>
                            Label to complete the current operation for this
                            kanban
                          </macro_1.Trans>
                        </react_1.TooltipContent>
                      </react_1.Tooltip>
                    </>)}
                </react_1.HStack>)}
              {kanbanOutput === "qrcode" && (<react_1.HStack>
                  <react_1.HoverCard>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger>
                        <react_1.HoverCardTrigger>
                          <react_1.Badge variant="outline" className="flex flex-row items-center gap-1 cursor-pointer">
                            <lu_1.LuQrCode />
                            <macro_1.Trans>Create</macro_1.Trans>
                          </react_1.Badge>
                        </react_1.HoverCardTrigger>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent>
                        {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["QR Code to create a ", " for this kanban"], ["QR Code to create a ", " for this kanban"])), row.original.replenishmentSystem === "Make" ? "Job" : "Order")}
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                    <react_1.HoverCardContent align="center" className="size-[236px] overflow-hidden z-[100] bg-white p-4">
                      <iframe seamless title={"Kanban QR Code"} width="198" height="198" src={path_1.path.to.file.kanbanQrCode(row.original.id, "order")}/>
                    </react_1.HoverCardContent>
                  </react_1.HoverCard>
                  {row.original.replenishmentSystem === "Make" && (<>
                      <react_1.HoverCard>
                        <react_1.Tooltip>
                          <react_1.TooltipTrigger>
                            <react_1.HoverCardTrigger>
                              <react_1.Badge variant="outline" className="flex flex-row items-center gap-1 cursor-pointer">
                                <lu_1.LuQrCode />
                                <macro_1.Trans>Start</macro_1.Trans>
                              </react_1.Badge>
                            </react_1.HoverCardTrigger>
                          </react_1.TooltipTrigger>
                          <react_1.TooltipContent>
                            <macro_1.Trans>
                              QR Code to start the next operation for this
                              kanban
                            </macro_1.Trans>
                          </react_1.TooltipContent>
                        </react_1.Tooltip>
                        <react_1.HoverCardContent align="center" className="size-[236px] overflow-hidden z-[100] bg-white p-4">
                          <iframe seamless title={"Kanban QR Code"} width="198" height="198" src={path_1.path.to.file.kanbanQrCode(row.original.id, "start")}/>
                        </react_1.HoverCardContent>
                      </react_1.HoverCard>

                      <react_1.HoverCard>
                        <react_1.Tooltip>
                          <react_1.TooltipTrigger>
                            <react_1.HoverCardTrigger>
                              <react_1.Badge variant="outline" className="flex flex-row items-center gap-1 cursor-pointer">
                                <lu_1.LuQrCode />
                                Complete
                              </react_1.Badge>
                            </react_1.HoverCardTrigger>
                          </react_1.TooltipTrigger>
                          <react_1.TooltipContent>
                            QR Code to complete the current operation for this
                            kanban
                          </react_1.TooltipContent>
                        </react_1.Tooltip>
                        <react_1.HoverCardContent align="center" className="size-[236px] overflow-hidden z-[100] bg-white p-4">
                          <iframe seamless title={"Kanban QR Code"} width="198" height="198" src={path_1.path.to.file.kanbanQrCode(row.original.id, "complete")}/>
                        </react_1.HoverCardContent>
                      </react_1.HoverCard>
                    </>)}
                </react_1.HStack>)}
              {kanbanOutput === "url" && (<react_1.HStack>
                  <CopyBadge text="Create" url={path_1.path.to.api.kanban(row.original.id)} tooltip={"Copy link to create a ".concat(row.original.replenishmentSystem === "Make"
                            ? "Job"
                            : "Order", " for this kanban")}/>
                  {row.original.replenishmentSystem === "Make" && (<>
                      <CopyBadge text="Start" url={path_1.path.to.api.kanbanStart(row.original.id)} tooltip={"Copy link to start the next operation for this kanban"}/>

                      <CopyBadge text="Complete" url={path_1.path.to.api.kanbanComplete(row.original.id)} tooltip={"Copy link to complete the current operation for this kanban"}/>
                    </>)}
                </react_1.HStack>)}
            </>);
            }
        },
        {
            accessorKey: "quantity",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Reorder Qty."], ["Reorder Qty."]))),
            cell: function (_a) {
                var row = _a.row;
                var _b = row.original, quantity = _b.quantity, purchaseUnitOfMeasureCode = _b.purchaseUnitOfMeasureCode;
                var baseQuantity = quantity || 0;
                return (<span>
                {baseQuantity}
                {purchaseUnitOfMeasureCode && " ".concat(purchaseUnitOfMeasureCode)}
              </span>);
            },
            meta: {
                icon: <lu_1.LuHash />
            }
        },
        {
            accessorKey: "replenishmentSystem",
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Replenishment"], ["Replenishment"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<Enumerable_1.Enumerable value={row.original.replenishmentSystem}/>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: ["Buy", "Make"].map(function (type) { return ({
                        value: type,
                        label: <Enumerable_1.Enumerable value={type}/>
                    }); })
                },
                icon: <lu_1.LuRefreshCw />
            }
        },
        {
            accessorKey: "supplierId",
            header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.SupplierAvatar supplierId={row.original.supplierId}/>);
            },
            meta: {
                icon: <lu_1.LuContainer />,
                filter: {
                    type: "static",
                    options: suppliers.map(function (supplier) { return ({
                        value: supplier.id,
                        label: supplier.name
                    }); })
                }
            }
        },
        {
            accessorKey: "storageUnitName",
            header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"]))),
            cell: function (_a) {
                var row = _a.row;
                return row.original.storageUnitName || "";
            },
            meta: {
                icon: <lu_1.LuMapPin />
            }
        },
        {
            accessorKey: "autoRelease",
            header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Release"], ["Release"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return row.original.replenishmentSystem === "Make" ? (<div className="flex w-full items-center justify-center">
                <react_1.Checkbox isChecked={(_b = row.original.autoRelease) !== null && _b !== void 0 ? _b : false}/>
              </div>) : null;
            },
            meta: {
                icon: <lu_1.LuCheck />,
                filter: {
                    type: "static",
                    options: [
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" }
                    ]
                }
            }
        },
        {
            accessorKey: "autoStartJob",
            header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Start"], ["Start"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return row.original.replenishmentSystem === "Make" ? (<div className="flex w-full items-center justify-center">
                <react_1.Checkbox isChecked={(_b = row.original.autoRelease) !== null && _b !== void 0 ? _b : false}/>
              </div>) : null;
            },
            meta: {
                icon: <lu_1.LuCheck />,
                filter: {
                    type: "static",
                    options: [
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" }
                    ]
                }
            }
        },
        {
            accessorKey: "createdBy",
            header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Created By"], ["Created By"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: people.map(function (employee) { return ({
                        value: employee.id,
                        label: <Enumerable_1.Enumerable value={employee.name}/>
                    }); })
                },
                icon: <lu_1.LuUser />
            }
        },
        {
            accessorKey: "createdAt",
            header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Created At"], ["Created At"]))),
            cell: function (_a) {
                var row = _a.row;
                return (0, utils_1.formatDate)(row.original.createdAt);
            },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        },
        {
            accessorKey: "updatedBy",
            header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: people.map(function (employee) { return ({
                        value: employee.id,
                        label: <Enumerable_1.Enumerable value={employee.name}/>
                    }); })
                },
                icon: <lu_1.LuUser />
            }
        },
        {
            accessorKey: "updatedAt",
            header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
            cell: function (_a) {
                var row = _a.row;
                return (0, utils_1.formatDate)(row.original.updatedAt);
            },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        }
    ]; }, [items, kanbanOutput, params, people, suppliers, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        var canUpdate = permissions.can("update", "inventory");
        var canDelete = permissions.can("delete", "inventory");
        var canViewItems = permissions.can("view", "inventory");
        return (<>
            {canUpdate && (<react_1.MenuItem asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.kanban(row.id), "?").concat(params)}>
                  <lu_1.LuPencil className="mr-2 size-4"/>
                  <macro_1.Trans>Edit</macro_1.Trans>
                </react_router_1.Link>
              </react_1.MenuItem>)}
            {canViewItems &&
                row.itemId &&
                (function () {
                    var item = items.find(function (i) { return i.id === row.itemId; });
                    var itemType = item === null || item === void 0 ? void 0 : item.type;
                    // Only show link for supported types (Service and Fixture not yet supported)
                    if (itemType === "Service" ||
                        itemType === "Fixture" ||
                        !itemType)
                        return null;
                    return (<react_1.MenuItem asChild>
                    <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(itemType, row.itemId)}>
                      <components_1.MethodItemTypeIcon type={itemType} className="mr-2 size-4"/>
                      View Item Master
                    </react_router_1.Link>
                  </react_1.MenuItem>);
                })()}
            {canDelete && (<react_1.MenuItem destructive asChild>
                <react_router_1.Link to={"".concat(path_1.path.to.deleteKanban(row.id), "?").concat(params)}>
                  <lu_1.LuTrash className="mr-2 size-4"/>
                  Delete
                </react_router_1.Link>
              </react_1.MenuItem>)}
          </>);
    }, [params, permissions, items.find]);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) {
        var handlePrintLabels = function () {
            var selectedIds = selectedRows
                .map(function (row) { return row.id; })
                .filter(Boolean);
            if (selectedIds.length > 0) {
                window.open(path_1.path.to.file.kanbanLabelsPdf(selectedIds, "order"), "_blank");
            }
        };
        return (<react_1.DropdownMenuContent align="end" className="min-w-[200px]">
          <react_1.DropdownMenuLabel>
            <macro_1.Trans>Actions</macro_1.Trans>
          </react_1.DropdownMenuLabel>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuGroup>
            <react_1.DropdownMenuItem onClick={handlePrintLabels}>
              <lu_1.LuPrinter className="mr-2 size-4"/>
              Print Labels ({selectedRows.length})
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuGroup>
        </react_1.DropdownMenuContent>);
    }, []);
    return (<components_1.Table count={count} columns={columns} data={data} defaultColumnVisibility={defaultColumnVisibility} primaryAction={<div className="flex items-center gap-2">
            <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = getLocationPath(selected);
            }}/>
            <react_1.Button variant="secondary" asChild leftIcon={<lu_1.LuSettings />}>
              <react_router_1.Link to={path_1.path.to.inventorySettings}>Settings</react_router_1.Link>
            </react_1.Button>
            {permissions.can("create", "inventory") && (<components_1.New label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Kanban"], ["Kanban"])))} to={path_1.path.to.newKanban}/>)}
          </div>} renderActions={renderActions} renderContextMenu={renderContextMenu} title={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Kanbans"], ["Kanbans"])))} table="kanban" withSavedView withSelectableRows/>);
});
KanbansTable.displayName = "KanbansTable";
exports.default = KanbansTable;
function getLocationPath(locationId) {
    return "".concat(path_1.path.to.kanbans, "?location=").concat(locationId);
}
function CopyBadge(_a) {
    var text = _a.text, url = _a.url, tooltip = _a.tooltip;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(false), isCopied = _b[0], setIsCopied = _b[1];
    var handleCopy = function () {
        (0, react_1.copyToClipboard)(window.location.origin + url);
        setIsCopied(true);
        react_1.toast.success(t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Copied link to clipboard"], ["Copied link to clipboard"]))));
        setTimeout(function () { return setIsCopied(false); }, 1500);
    };
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger>
        <react_1.Badge variant="outline" className="flex flex-row items-center gap-1 cursor-pointer" onClick={handleCopy}>
          {isCopied ? <lu_1.LuCheck className="text-emerald-500"/> : <lu_1.LuLink />}
          {text}
        </react_1.Badge>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>{tooltip}</react_1.TooltipContent>
    </react_1.Tooltip>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
