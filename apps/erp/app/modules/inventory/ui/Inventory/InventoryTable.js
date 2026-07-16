"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var useFilters_1 = require("~/components/Table/components/Filter/useFilters");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var ItemReorderPolicy_1 = require("~/modules/items/ui/Item/ItemReorderPolicy");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var InventoryTable = (0, react_2.memo)(function (_a) {
    var _b, _c;
    var data = _a.data, count = _a.count, locationId = _a.locationId, forms = _a.forms, substances = _a.substances, tags = _a.tags, storageTypes = _a.storageTypes, storageUnits = _a.storageUnits;
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var translateReplenishment = (0, react_2.useCallback)(function (v) {
        return v === "Buy" ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Buy"], ["Buy"]))) : v === "Make" ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])));
    }, [t]);
    var locations = (0, Location_1.useLocations)();
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var storageUnitNameById = (0, react_2.useMemo)(function () { return new Map(storageUnits.map(function (s) { return [s.id, s.name]; })); }, [storageUnits]);
    var filters = (0, useFilters_1.useFilters)();
    var materialSubstanceId = (_b = filters.getFilter("materialSubstanceId")) === null || _b === void 0 ? void 0 : _b[0];
    var materialFormId = (_c = filters.getFilter("materialFormId")) === null || _c === void 0 ? void 0 : _c[0];
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var formatNumber = numberFormatter.format.bind(numberFormatter);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "readableIdWithRevision",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Item ID"], ["Item ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="py-1">
              <components_1.ItemThumbnail size="sm" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-expect-error
                    type={row.original.type}/>

              <components_1.Hyperlink to={"".concat(path_1.path.to.inventoryItem(row.original.id), "/?").concat(params)}>
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
                accessorKey: "quantityOnHand",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["On Hand"], ["On Hand"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.itemTrackingType === "Non-Inventory" ? (<components_1.TrackingTypeIcon type="Non-Inventory"/>) : (formatNumber(row.original.quantityOnHand));
                },
                meta: {
                    icon: <lu_1.LuPackage />,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "daysRemaining",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Days"], ["Days"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.daysRemaining);
                },
                meta: {
                    icon: <lu_1.LuClock />,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "leadTime",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Lead Time"], ["Lead Time"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.leadTime);
                },
                meta: {
                    icon: <lu_1.LuClock />,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "reorderingPolicy",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Reorder Policy"], ["Reorder Policy"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
                <react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={row.original.reorderingPolicy}/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    {(0, ItemReorderPolicy_1.getReorderPolicyDescription)(row.original)}
                  </react_1.TooltipContent>
                </react_1.Tooltip>
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: items_1.itemReorderingPolicies.map(function (policy) { return ({
                            label: <ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={policy}/>,
                            value: policy
                        }); })
                    },
                    icon: <lu_1.LuCircleCheck />
                }
            },
            {
                accessorKey: "replenishmentSystem",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Replenishment"], ["Replenishment"]))),
                cell: function (item) { return (<Enumerable_1.Enumerable value={translateReplenishment(item.getValue())}/>); },
                meta: {
                    filter: {
                        type: "static",
                        options: items_1.itemReplenishmentSystems.map(function (type) { return ({
                            value: type,
                            label: <Enumerable_1.Enumerable value={translateReplenishment(type)}/>
                        }); })
                    },
                    icon: <lu_1.LuLoaderCircle />
                }
            },
            {
                accessorKey: "usageLast30Days",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Usage/Day (30d)"], ["Usage/Day (30d)"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.usageLast30Days);
                },
                meta: {
                    icon: <lu_1.LuCalculator />,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "usageLast90Days",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Usage/Day (90d)"], ["Usage/Day (90d)"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.usageLast90Days);
                },
                meta: {
                    icon: <lu_1.LuCalculator />,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "quantityOnPurchaseOrder",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["On Purchase Order"], ["On Purchase Order"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.quantityOnPurchaseOrder);
                },
                meta: {
                    icon: <lu_1.LuMoveUp className="text-emerald-500"/>,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "quantityOnProductionOrder",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["On Jobs"], ["On Jobs"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.quantityOnProductionOrder);
                },
                meta: {
                    icon: <lu_1.LuMoveUp className="text-emerald-500"/>,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "quantityOnProductionDemand",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["On Jobs"], ["On Jobs"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.quantityOnProductionDemand);
                },
                meta: {
                    icon: <lu_1.LuMoveDown className="text-red-500"/>,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "quantityOnSalesOrder",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["On Sales Order"], ["On Sales Order"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.quantityOnSalesOrder);
                },
                meta: {
                    icon: <lu_1.LuMoveDown className="text-red-500"/>,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "demandForecast",
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Demand Forecast"], ["Demand Forecast"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatNumber(row.original.demandForecast);
                },
                meta: {
                    icon: <lu_1.LuMoveDown className="text-red-500"/>,
                    renderTotal: true,
                    formatter: formatNumber
                }
            },
            {
                accessorKey: "unitOfMeasureCode",
                header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var unitOfMeasure = unitOfMeasures.find(function (uom) { return uom.value === row.original.unitOfMeasureCode; });
                    return (<Enumerable_1.Enumerable value={(_b = unitOfMeasure === null || unitOfMeasure === void 0 ? void 0 : unitOfMeasure.label) !== null && _b !== void 0 ? _b : row.original.unitOfMeasureCode}/>);
                },
                meta: {
                    icon: <lu_1.LuRuler />
                }
            },
            {
                accessorKey: "materialFormId",
                header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Shape"], ["Shape"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var form = forms.find(function (f) { return f.id === row.original.materialFormId; });
                    return <Enumerable_1.Enumerable value={(_b = form === null || form === void 0 ? void 0 : form.name) !== null && _b !== void 0 ? _b : null}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: forms.map(function (form) { return ({
                            label: <Enumerable_1.Enumerable value={form.name}/>,
                            value: form.id
                        }); })
                    },
                    icon: <lu_1.LuShapes />
                }
            },
            {
                accessorKey: "materialSubstanceId",
                header: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Substance"], ["Substance"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var substance = substances.find(function (s) { return s.id === row.original.materialSubstanceId; });
                    return <Enumerable_1.Enumerable value={(_b = substance === null || substance === void 0 ? void 0 : substance.name) !== null && _b !== void 0 ? _b : null}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: substances.map(function (substance) {
                            var _a;
                            return ({
                                label: <Enumerable_1.Enumerable value={(_a = substance.name) !== null && _a !== void 0 ? _a : null}/>,
                                value: substance.id
                            });
                        })
                    },
                    icon: <lu_1.LuGlassWater />
                }
            },
            {
                accessorKey: "finish",
                header: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Finish"], ["Finish"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuPaintBucket />,
                    filter: {
                        type: "fetcher",
                        endpoint: path_1.path.to.api.materialFinishes(materialSubstanceId),
                        transform: function (data) {
                            var _a;
                            return (_a = data === null || data === void 0 ? void 0 : data.map(function (_a) {
                                var name = _a.name;
                                return ({
                                    value: name,
                                    label: name
                                });
                            })) !== null && _a !== void 0 ? _a : [];
                        }
                    }
                }
            },
            {
                accessorKey: "grade",
                header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Grade"], ["Grade"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuStar />,
                    filter: {
                        type: "fetcher",
                        endpoint: path_1.path.to.api.materialGrades(materialSubstanceId),
                        transform: function (data) {
                            var _a;
                            return (_a = data === null || data === void 0 ? void 0 : data.map(function (_a) {
                                var name = _a.name;
                                return ({
                                    value: name,
                                    label: name
                                });
                            })) !== null && _a !== void 0 ? _a : [];
                        }
                    }
                }
            },
            {
                accessorKey: "dimension",
                header: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Dimension"], ["Dimension"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuExpand />,
                    filter: {
                        type: "fetcher",
                        endpoint: path_1.path.to.api.materialDimensions(materialFormId),
                        transform: function (data) {
                            var _a;
                            return (_a = data === null || data === void 0 ? void 0 : data.map(function (_a) {
                                var name = _a.name;
                                return ({
                                    value: name,
                                    label: name
                                });
                            })) !== null && _a !== void 0 ? _a : [];
                        }
                    }
                }
            },
            {
                accessorKey: "materialType",
                header: t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuPuzzle />,
                    filter: {
                        type: "fetcher",
                        endpoint: path_1.path.to.api.materialTypes(materialSubstanceId, materialFormId),
                        transform: function (data) {
                            var _a;
                            return (_a = data === null || data === void 0 ? void 0 : data.map(function (_a) {
                                var id = _a.id, name = _a.name;
                                return ({
                                    value: id,
                                    label: name
                                });
                            })) !== null && _a !== void 0 ? _a : [];
                        }
                    }
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Item Type"], ["Item Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.type && (<react_1.HStack>
                <components_1.MethodItemTypeIcon type={row.original.type}/>
                <span>{row.original.type}</span>
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_models_1.itemTypes.map(function (type) { return ({
                            label: (<react_1.HStack spacing={2}>
                    <components_1.MethodItemTypeIcon type={type}/>
                    <span>{type}</span>
                  </react_1.HStack>),
                            value: type
                        }); })
                    },
                    icon: <lu_1.LuBox />
                }
            },
            {
                accessorKey: "tags",
                header: t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack spacing={0} className="gap-1">
              {/* @ts-expect-error TS2339 */}
              {(row.original.tags || []).map(function (tag) { return (<react_1.Badge key={tag} variant="secondary">
                  {tag}
                </react_1.Badge>); })}
            </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: tags === null || tags === void 0 ? void 0 : tags.map(function (tag) { return ({
                            value: tag,
                            label: <react_1.Badge variant="secondary">{tag}</react_1.Badge>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "storageTypeIds",
                header: t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Storage Type"], ["Storage Type"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var ids = (_b = row.original.storageTypeIds) !== null && _b !== void 0 ? _b : [];
                    return (<react_1.HStack spacing={0} className="gap-1">
                {ids.map(function (id) {
                            var _a;
                            var st = (storageTypes !== null && storageTypes !== void 0 ? storageTypes : []).find(function (s) { return s.id === id; });
                            return <Enumerable_1.Enumerable key={id} value={(_a = st === null || st === void 0 ? void 0 : st.name) !== null && _a !== void 0 ? _a : null}/>;
                        })}
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: (storageTypes !== null && storageTypes !== void 0 ? storageTypes : []).map(function (st) { return ({
                            value: st.id,
                            label: <Enumerable_1.Enumerable value={st.name}/>
                        }); }),
                        isArray: true
                    },
                    pluralHeader: t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Storage Types"], ["Storage Types"]))),
                    icon: <lu_1.LuWarehouse />
                }
            },
            {
                accessorKey: "storageUnitIds",
                header: t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var ids = (_b = row.original.storageUnitIds) !== null && _b !== void 0 ? _b : [];
                    return (<react_1.HStack spacing={0} className="gap-1">
                {ids.map(function (id) {
                            var _a;
                            return (<Enumerable_1.Enumerable key={id} value={(_a = storageUnitNameById.get(id)) !== null && _a !== void 0 ? _a : id}/>);
                        })}
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "custom",
                        isArray: true,
                        getLabel: function (v) { var _a; return (_a = storageUnitNameById.get(v)) !== null && _a !== void 0 ? _a : v; },
                        render: function (_a) {
                            var values = _a.values, toggle = _a.toggle;
                            var VISIBLE = 3;
                            var visible = values.slice(0, VISIBLE);
                            var overflow = values.length - visible.length;
                            return (<div className="flex flex-col gap-2">
                    {values.length > 0 && (<div className="flex flex-wrap gap-1">
                        {visible.map(function (v) {
                                        var _a;
                                        var label = (_a = storageUnitNameById.get(v)) !== null && _a !== void 0 ? _a : v;
                                        return (<react_1.Badge key={v} variant="secondary" className="cursor-pointer gap-1 max-w-[160px]" onClick={function () { return toggle(v); }}>
                              <span className="truncate">{label}</span>
                              <lu_1.LuX className="h-3 w-3 shrink-0"/>
                            </react_1.Badge>);
                                    })}
                        {overflow > 0 && (<react_1.Badge variant="secondary" className="gap-1">
                            +{overflow} more
                          </react_1.Badge>)}
                      </div>)}
                    <StorageUnit_1.default locationId={locationId} value={null} onChange={function (storageUnit) {
                                    if (storageUnit)
                                        toggle(storageUnit.id);
                                }} allowCreate={false}/>
                  </div>);
                        }
                    },
                    pluralHeader: t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Storage Units"], ["Storage Units"]))),
                    icon: <lu_1.LuBoxes />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" }
                        ]
                    },
                    pluralHeader: t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Active Statuses"], ["Active Statuses"]))),
                    icon: <lu_1.LuCheck />
                }
            }
        ];
    }, [
        forms,
        locationId,
        materialFormId,
        materialSubstanceId,
        formatNumber,
        params,
        substances,
        tags,
        storageTypes,
        storageUnitNameById,
        unitOfMeasures,
        t,
        translateReplenishment
    ]);
    var defaultColumnVisibility = {
        active: false,
        tags: false,
        type: false,
        finish: false,
        grade: false,
        dimension: false,
        materialType: false,
        storageTypeIds: false,
        storageUnitIds: false
    };
    var defaultColumnPinning = {
        left: ["readableIdWithRevision"]
    };
    var mrpFetcher = (0, react_router_1.useFetcher)();
    return (<components_1.Table count={count} columns={columns} data={data} defaultColumnVisibility={defaultColumnVisibility} defaultColumnPinning={defaultColumnPinning} primaryAction={<div className="flex items-center gap-2">
            <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = getLocationPath(selected);
            }}/>
            <mrpFetcher.Form method="post" action={path_1.path.to.api.mrp(locationId)}>
              <react_1.Tooltip>
                <react_1.TooltipTrigger>
                  <react_1.Button type="submit" variant="secondary" rightIcon={<lu_1.LuCirclePlay />} isDisabled={mrpFetcher.state !== "idle"} isLoading={mrpFetcher.state !== "idle"}>
                    <macro_1.Trans>Recalculate</macro_1.Trans>
                  </react_1.Button>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent>
                  {t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["MRP runs automatically every 3 hours, but you can run it manually here."], ["MRP runs automatically every 3 hours, but you can run it manually here."])))}
                </react_1.TooltipContent>
              </react_1.Tooltip>
            </mrpFetcher.Form>
          </div>} title={t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Inventory"], ["Inventory"])))} table="inventory" withSavedView/>);
});
InventoryTable.displayName = "InventoryTable";
exports.default = InventoryTable;
function getLocationPath(locationId) {
    return "".concat(path_1.path.to.inventoryQuantities, "?location=").concat(locationId);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33;
