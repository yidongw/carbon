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
var ItemPostingGroup_1 = require("~/components/Form/ItemPostingGroup");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var DuplicatePriceListModal_1 = require("./DuplicatePriceListModal");
var PriceListScopeEmpty_1 = require("./PriceListScopeEmpty");
var PriceTracePopover_1 = require("./PriceTracePopover");
var ScopePicker_1 = require("./ScopePicker");
var sourceVariant = {
    Override: "default",
    "Type Override": "secondary",
    "All Override": "outline",
    Rule: "outline",
    Base: "outline"
};
var PriceListTable = (0, react_2.memo)(function (_a) {
    var _b, _c, _d, _e, _f;
    var data = _a.data, count = _a.count, scopeOptions = _a.scopeOptions, hasScope = _a.hasScope;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var navigate = (0, react_router_1.useNavigate)();
    var _g = (0, react_router_1.useSearchParams)(), searchParams = _g[0], setSearchParams = _g[1];
    var previewQuantity = (_c = searchParams.get("quantity")) !== null && _c !== void 0 ? _c : "1";
    var itemPostingGroups = (0, ItemPostingGroup_1.useItemPostingGroups)();
    var _h = (0, react_2.useState)(null), duplicateState = _h[0], setDuplicateState = _h[1];
    var canCreate = permissions.can("create", "sales");
    var canDelete = permissions.can("delete", "sales");
    var currentCustomerId = (_d = searchParams.get("customerId")) !== null && _d !== void 0 ? _d : undefined;
    var currentCustomerTypeId = (_e = searchParams.get("customerTypeId")) !== null && _e !== void 0 ? _e : undefined;
    var scopeId = (_f = currentCustomerId !== null && currentCustomerId !== void 0 ? currentCustomerId : currentCustomerTypeId) !== null && _f !== void 0 ? _f : "";
    var sourceScope = {
        customerId: currentCustomerId,
        customerTypeId: currentCustomerTypeId
    };
    var buildOverrideHref = (0, react_2.useCallback)(function (row) {
        var next = new URLSearchParams(searchParams);
        next.set("itemId", row.itemId);
        if (row.overrideId) {
            return "".concat(path_1.path.to.priceOverride(row.overrideId), "?").concat(next.toString());
        }
        return "".concat(path_1.path.to.newPriceOverride, "?").concat(next.toString());
    }, [searchParams]);
    var handleScopeChange = (0, react_2.useCallback)(function (selectedId) {
        var next = new URLSearchParams(searchParams);
        next.delete("customerId");
        next.delete("customerTypeId");
        if (selectedId) {
            var picked = scopeOptions.find(function (o) { return o.value === selectedId; });
            if (picked) {
                next.set(picked.helper === "Type" ? "customerTypeId" : "customerId", selectedId);
            }
        }
        setSearchParams(next);
    }, [scopeOptions, searchParams, setSearchParams]);
    var columns = (0, react_2.useMemo)(function () {
        var cols = [
            {
                accessorKey: "partId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="min-w-[240px] items-center" spacing={2}>
              <components_1.ItemThumbnail size="md" thumbnailPath={row.original.thumbnailPath} type="Part"/>
              <react_1.VStack spacing={0} className="leading-tight justify-center">
                {hasScope ? (<components_1.Hyperlink to={buildOverrideHref(row.original)}>
                    {row.original.partId}
                  </components_1.Hyperlink>) : (<span className="truncate font-medium">
                    {row.original.partId}
                  </span>)}
                <div className="w-full truncate text-muted-foreground text-xs">
                  {row.original.itemName}
                </div>
              </react_1.VStack>
            </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuBookMarked /> }
            },
            {
                accessorKey: "itemPostingGroupId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Item Group"], ["Item Group"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var id = row.original.itemPostingGroupId;
                    if (!id)
                        return null;
                    var group = itemPostingGroups.find(function (g) { return g.value === id; });
                    return group ? <Enumerable_1.Enumerable value={group.label}/> : null;
                },
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
                accessorKey: "basePrice",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Base Price"], ["Base Price"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="text-muted-foreground">
              {currencyFormatter.format(row.original.basePrice)}
            </span>);
                },
                meta: { icon: <lu_1.LuCircleDollarSign /> }
            }
        ];
        if (hasScope) {
            cols.push({
                accessorKey: "resolvedPrice",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Resolved Price"], ["Resolved Price"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack spacing={2} className="items-center">
                <span>
                  {currencyFormatter.format(row.original.resolvedPrice)}
                </span>
                {row.original.isOverridden && (<react_1.Tooltip>
                    <react_1.TooltipTrigger asChild>
                      <lu_1.LuCircleOff className="size-3 text-muted-foreground"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>This price is overridden.</react_1.TooltipContent>
                  </react_1.Tooltip>)}
                <PriceTracePopover_1.PriceTracePopover trace={row.original.trace} currencyCode={baseCurrency}/>
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuCircleDollarSign /> }
            }, {
                accessorKey: "source",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Source"], ["Source"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.Badge variant={(_b = sourceVariant[row.original.source]) !== null && _b !== void 0 ? _b : "outline"}>
                {row.original.source}
              </react_1.Badge>);
                },
                meta: { icon: <lu_1.LuTag /> }
            }, {
                id: "validity",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Valid Period"], ["Valid Period"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var _b = row.original, overrideValidFrom = _b.overrideValidFrom, overrideValidTo = _b.overrideValidTo, isOverridden = _b.isOverridden;
                    if (!isOverridden) {
                        return <span className="text-muted-foreground">—</span>;
                    }
                    if (!overrideValidFrom && !overrideValidTo) {
                        return (<span className="text-muted-foreground text-sm">{t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Always"], ["Always"])))}</span>);
                    }
                    var from = overrideValidFrom
                        ? formatDate(overrideValidFrom)
                        : "…";
                    var to = overrideValidTo ? formatDate(overrideValidTo) : "…";
                    return <span className="text-sm">{"".concat(from, " \u2013 ").concat(to)}</span>;
                },
                meta: { icon: <lu_1.LuCalendar /> }
            });
        }
        return cols;
    }, [
        baseCurrency,
        buildOverrideHref,
        currencyFormatter,
        hasScope,
        itemPostingGroups,
        t,
        formatDate
    ]);
    var handleQuantityCommit = (0, react_2.useCallback)(function (raw) {
        var parsed = Number(raw);
        var next = new URLSearchParams(searchParams);
        if (Number.isFinite(parsed) && parsed > 1) {
            next.set("quantity", String(parsed));
        }
        else {
            next.delete("quantity");
        }
        setSearchParams(next);
    }, [searchParams, setSearchParams]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        var canUpdate = permissions.can("update", "sales");
        return (<>
            <react_1.MenuItem disabled={!(row.overrideId ? canUpdate : canCreate) || !hasScope} onClick={function () {
                navigate(buildOverrideHref(row));
            }}>
              <react_1.MenuIcon icon={row.overrideId ? <lu_1.LuPencil /> : <lu_1.LuPlus />}/>
              {row.overrideId ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Edit Pricing"], ["Edit Pricing"]))) : t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Set Pricing"], ["Set Pricing"])))}
            </react_1.MenuItem>
            {row.overrideId && (<react_1.MenuItem disabled={!canCreate} onClick={function () {
                    setDuplicateState({ overrideIds: [row.overrideId] });
                }}>
                <react_1.MenuIcon icon={<lu_1.LuCopy />}/>
                {t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Duplicate to..."], ["Duplicate to..."])))}
              </react_1.MenuItem>)}
            {row.overrideId && (<react_1.MenuItem destructive disabled={!canDelete} onClick={function () {
                    navigate("".concat(path_1.path.to.deletePriceOverride(row.overrideId), "?").concat(searchParams.toString()));
                }}>
                <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
                {t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Remove from Price List"], ["Remove from Price List"])))}
              </react_1.MenuItem>)}
          </>);
    }, [
        buildOverrideHref,
        canCreate,
        canDelete,
        hasScope,
        navigate,
        searchParams,
        t,
        permissions.can
    ]);
    if (!hasScope) {
        return (<PriceListScopeEmpty_1.PriceListScopeEmpty scopeOptions={scopeOptions} value={scopeId} onChange={handleScopeChange}/>);
    }
    return (<>
        <components_1.Table data={data} columns={columns} count={count} primaryAction={<div className="flex items-center gap-2">
              <ScopePicker_1.ScopePicker size="sm" value={scopeId} options={scopeOptions} onChange={handleScopeChange}/>
              <react_1.Popover>
                <react_1.PopoverTrigger asChild>
                  <react_1.Button variant="secondary" rightIcon={<lu_1.LuChevronsUpDown />}>
                    {Number(previewQuantity) || 1}
                  </react_1.Button>
                </react_1.PopoverTrigger>
                <react_1.PopoverContent className="w-auto p-2" align="end">
                  <react_1.Label>
                    <macro_1.Trans>Quantity</macro_1.Trans>
                  </react_1.Label>
                  <react_1.NumberField value={Number(previewQuantity) || 1} minValue={1} onChange={function (value) {
                if (Number.isFinite(value) && value >= 1) {
                    handleQuantityCommit(String(value));
                }
            }} aria-label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Preview Quantity"], ["Preview Quantity"])))} className="w-24">
                    <react_1.NumberInputGroup className="relative">
                      <react_1.NumberInput size="sm" min={1}/>
                      <react_1.NumberInputStepper>
                        <react_1.NumberIncrementStepper>
                          <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
                        </react_1.NumberIncrementStepper>
                        <react_1.NumberDecrementStepper>
                          <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
                        </react_1.NumberDecrementStepper>
                      </react_1.NumberInputStepper>
                    </react_1.NumberInputGroup>
                  </react_1.NumberField>
                </react_1.PopoverContent>
              </react_1.Popover>
              {data.length > 0 && canCreate && (<react_1.Button variant="secondary" leftIcon={<lu_1.LuCopy />} onClick={function () { return setDuplicateState({}); }}>
                  <macro_1.Trans>Duplicate</macro_1.Trans>
                </react_1.Button>)}
              {canCreate && (<components_1.New label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Item"], ["Item"])))} to={"".concat(path_1.path.to.newPriceOverride, "?").concat(searchParams.toString())}/>)}
            </div>} renderContextMenu={renderContextMenu} title={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Price List"], ["Price List"])))}/>
        {duplicateState !== null && (<DuplicatePriceListModal_1.DuplicatePriceListModal sourceScope={sourceScope} overrideIds={duplicateState.overrideIds} onClose={function () { return setDuplicateState(null); }}/>)}
      </>);
});
PriceListTable.displayName = "PriceListTable";
exports.default = PriceListTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
