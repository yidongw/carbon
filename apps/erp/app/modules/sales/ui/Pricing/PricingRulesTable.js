"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var CustomerType_1 = require("~/components/Form/CustomerType");
var ItemPostingGroup_1 = require("~/components/Form/ItemPostingGroup");
var hooks_1 = require("~/hooks");
var customers_1 = require("~/stores/customers");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var defaultColumnVisibility = {
    customerIds: false,
    customerTypeIds: false,
    itemIds: false,
    itemPostingGroupId: false
};
var PricingRulesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var canCreate = permissions.can("create", "sales");
    var canUpdate = permissions.can("update", "sales");
    var canDelete = permissions.can("delete", "sales");
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var fetcher = (0, react_router_1.useFetcher)();
    var customers = (0, customers_1.useCustomers)()[0];
    var customerTypes = (0, CustomerType_1.useCustomerTypes)();
    var itemPostingGroups = (0, ItemPostingGroup_1.useItemPostingGroups)();
    var items = (0, items_1.useItems)()[0];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={"".concat(path_1.path.to.pricingRule(row.original.id), "?").concat(params.toString())}>
            {row.original.name}
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "ruleType",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var _b = row.original, amount = _b.amount, amountType = _b.amountType, ruleType = _b.ruleType;
                    return (<react_1.Badge variant={ruleType === "Discount" ? "red" : "green"} className=" items-center gap-1">
              {amountType === "Percentage" ? (<span>{percentFormatter.format(amount)}</span>) : (<span>{currencyFormatter.format(amount)}</span>)}
              {ruleType === "Discount" ? <lu_1.LuArrowDown /> : <lu_1.LuArrowUp />}
            </react_1.Badge>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: sales_models_1.pricingRuleTypes.map(function (type) { return ({
                            value: type,
                            label: type
                        }); })
                    },
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "customerIds",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Customers"], ["Customers"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    if (!((_b = row.original.customerIds) === null || _b === void 0 ? void 0 : _b.length))
                        return null;
                    return (<div className="flex flex-col items-start gap-1">
              {row.original.customerIds.map(function (id) { return (<components_1.CustomerAvatar key={id} customerId={id}/>); })}
            </div>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: customers === null || customers === void 0 ? void 0 : customers.map(function (c) { return ({
                            value: c.id,
                            label: c.name
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuSquareUser />
                }
            },
            {
                accessorKey: "customerTypeIds",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer Type"], ["Customer Type"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    if (!((_b = row.original.customerTypeIds) === null || _b === void 0 ? void 0 : _b.length))
                        return null;
                    return (<div className="flex flex-col items-start gap-1">
              {row.original.customerTypeIds.map(function (id) {
                            var _a, _b;
                            var label = (_b = (_a = customerTypes === null || customerTypes === void 0 ? void 0 : customerTypes.find(function (ct) { return ct.value === id; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "Type";
                            return <Enumerable_1.Enumerable key={id} value={label}/>;
                        })}
            </div>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: customerTypes === null || customerTypes === void 0 ? void 0 : customerTypes.map(function (ct) { return ({
                            value: ct.value,
                            label: <Enumerable_1.Enumerable value={ct.label}/>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuUsers />
                }
            },
            {
                accessorKey: "itemIds",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Items"], ["Items"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    if (!((_b = row.original.itemIds) === null || _b === void 0 ? void 0 : _b.length))
                        return null;
                    return (<div className="flex flex-col items-start gap-1">
              {row.original.itemIds.map(function (id) {
                            var _a;
                            var item = items === null || items === void 0 ? void 0 : items.find(function (i) { return i.id === id; });
                            return (<react_1.Badge key={id} variant="outline">
                    {(_a = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _a !== void 0 ? _a : id}
                  </react_1.Badge>);
                        })}
            </div>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: items === null || items === void 0 ? void 0 : items.map(function (item) { return ({
                            value: item.id,
                            label: item.readableIdWithRevision
                        }); }),
                        isArray: true
                    },
                    pluralHeader: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Items"], ["Items"]))),
                    icon: <lu_1.LuPackage />
                }
            },
            {
                accessorKey: "itemPostingGroupId",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Item Group"], ["Item Group"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    if (!row.original.itemPostingGroupId)
                        return null;
                    var label = (_c = (_b = itemPostingGroups === null || itemPostingGroups === void 0 ? void 0 : itemPostingGroups.find(function (g) { return g.value === row.original.itemPostingGroupId; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : "Item Group";
                    return <Enumerable_1.Enumerable value={label}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: itemPostingGroups === null || itemPostingGroups === void 0 ? void 0 : itemPostingGroups.map(function (g) { return ({
                            value: g.value,
                            label: <Enumerable_1.Enumerable value={g.label}/>
                        }); })
                    },
                    icon: <lu_1.LuBoxes />
                }
            },
            {
                id: "customerScope",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Customers"], ["Customers"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    var rule = row.original;
                    var parts = [];
                    if ((_b = rule.customerIds) === null || _b === void 0 ? void 0 : _b.length) {
                        rule.customerIds.forEach(function (id) {
                            parts.push(<components_1.CustomerAvatar key={"c-".concat(id)} customerId={id}/>);
                        });
                    }
                    if ((_c = rule.customerTypeIds) === null || _c === void 0 ? void 0 : _c.length) {
                        rule.customerTypeIds.forEach(function (id) {
                            var _a, _b;
                            var label = (_b = (_a = customerTypes === null || customerTypes === void 0 ? void 0 : customerTypes.find(function (ct) { return ct.value === id; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "Type";
                            parts.push(<Enumerable_1.Enumerable key={"ct-".concat(id)} value={label}/>);
                        });
                    }
                    if (parts.length === 0) {
                        return (<span className="text-muted-foreground text-sm">{t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["All"], ["All"])))}</span>);
                    }
                    return <div className="flex flex-col items-start gap-1">{parts}</div>;
                },
                meta: {
                    icon: <lu_1.LuSquareUser />
                }
            },
            {
                id: "itemScope",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Items"], ["Items"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e;
                    var row = _a.row;
                    var rule = row.original;
                    var groupLabel = rule.itemPostingGroupId
                        ? ((_c = (_b = itemPostingGroups === null || itemPostingGroups === void 0 ? void 0 : itemPostingGroups.find(function (g) { return g.value === rule.itemPostingGroupId; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : "Item Group")
                        : null;
                    var itemIds = (_d = rule.itemIds) !== null && _d !== void 0 ? _d : [];
                    var firstItem = itemIds[0]
                        ? items === null || items === void 0 ? void 0 : items.find(function (i) { return i.id === itemIds[0]; })
                        : null;
                    var remainingItems = itemIds.slice(1);
                    if (!groupLabel && itemIds.length === 0) {
                        return (<span className="text-muted-foreground text-sm">{t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["All"], ["All"])))}</span>);
                    }
                    return (<react_1.HStack spacing={1} className="flex-wrap">
              {groupLabel && <Enumerable_1.Enumerable value={groupLabel}/>}
              {itemIds[0] && (<react_1.Badge variant="outline">
                  {(_e = firstItem === null || firstItem === void 0 ? void 0 : firstItem.readableIdWithRevision) !== null && _e !== void 0 ? _e : itemIds[0]}
                </react_1.Badge>)}
              {remainingItems.length > 0 && (<react_1.HoverCard>
                  <react_1.HoverCardTrigger>
                    <react_1.Badge variant="secondary" className="cursor-pointer">
                      +{remainingItems.length}
                    </react_1.Badge>
                  </react_1.HoverCardTrigger>
                  <react_1.HoverCardContent className="w-[260px]">
                    <div className="flex flex-col items-start gap-1 text-sm">
                      {remainingItems.map(function (id) {
                                var _a;
                                var item = items === null || items === void 0 ? void 0 : items.find(function (i) { return i.id === id; });
                                return (<react_1.Badge key={"i-".concat(id)} variant="outline">
                            {(_a = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _a !== void 0 ? _a : id}
                          </react_1.Badge>);
                            })}
                    </div>
                  </react_1.HoverCardContent>
                </react_1.HoverCard>)}
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuPackage />
                }
            },
            {
                id: "dates",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Dates"], ["Dates"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var _b = row.original, validFrom = _b.validFrom, validTo = _b.validTo;
                    if (!validFrom && !validTo) {
                        return (<span className="text-muted-foreground text-sm">{t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Always"], ["Always"])))}</span>);
                    }
                    var from = validFrom ? formatDate(validFrom) : "…";
                    var to = validTo ? formatDate(validTo) : "…";
                    return <span className="text-sm">{"".concat(from, " \u2013 ").concat(to)}</span>;
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.Badge variant={row.original.active ? "green" : "gray"}>
            {row.original.active ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Active"], ["Active"]))) : t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Inactive"], ["Inactive"])))}
          </react_1.Badge>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Active"], ["Active"]))) },
                            { value: "false", label: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Inactive"], ["Inactive"]))) }
                        ]
                    },
                    icon: <lu_1.LuToggleLeft />
                }
            }
        ];
        return defaultColumns;
    }, [
        currencyFormatter,
        customers,
        customerTypes,
        itemPostingGroups,
        items,
        params,
        percentFormatter,
        t,
        formatDate
    ]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!canUpdate} onClick={function () {
                navigate("".concat(path_1.path.to.pricingRule(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            {t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Edit Pricing Rule"], ["Edit Pricing Rule"])))}
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!canCreate} onClick={function () {
                fetcher.submit({ intent: "duplicate" }, {
                    method: "POST",
                    action: path_1.path.to.pricingRule(row.id)
                });
            }}>
            <react_1.MenuIcon icon={<lu_1.LuCopy />}/>
            {t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Duplicate Pricing Rule"], ["Duplicate Pricing Rule"])))}
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!canDelete} onClick={function () {
                navigate("".concat(path_1.path.to.deletePricingRule(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            {t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Delete Pricing Rule"], ["Delete Pricing Rule"])))}
          </react_1.MenuItem>
        </>);
    }, [canCreate, canDelete, canUpdate, fetcher, navigate, params, t]);
    return (<components_1.Table data={data} columns={columns} count={count} defaultColumnVisibility={defaultColumnVisibility} primaryAction={canCreate && (<components_1.New label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Pricing Rule"], ["Pricing Rule"])))} to={"".concat(path_1.path.to.newPricingRule, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Pricing Rules"], ["Pricing Rules"])))}/>);
});
PricingRulesTable.displayName = "PricingRulesTable";
exports.default = PricingRulesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23;
