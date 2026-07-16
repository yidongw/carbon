"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTransferWizard = StockTransferWizard;
var auth_1 = require("@carbon/auth");
var storage_rules_1 = require("@carbon/ee/storage-rules");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_table_1 = require("@tanstack/react-table");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var utils_1 = require("~/components/Table/utils");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function StockTransferWizard(_a) {
    var locationId = _a.locationId, onClose = _a.onClose;
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent size="full">
        <react_1.DrawerHeader className="px-4">
          <react_1.DrawerTitle>
            <macro_1.Trans>Stock Transfer Wizard</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody className="w-full h-full p-0">
          <TransferGrid locationId={locationId}/>
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
function TransferGrid(_a) {
    var _this = this;
    var locationId = _a.locationId;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(100), pageSize = _b[0], setPageSize = _b[1];
    var formatter = (0, i18n_1.useNumberFormatter)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var wizard = (0, stores_1.useStockTransferWizard)()[0];
    var _c = (0, react_2.useState)([]), transferTo = _c[0], setTransferTo = _c[1];
    var _d = (0, react_2.useState)([]), allTransferToData = _d[0], setAllTransferToData = _d[1];
    var _e = (0, react_2.useState)(""), transferToSearch = _e[0], setTransferToSearch = _e[1];
    var _f = (0, react_2.useState)(0), transferToOffset = _f[0], setTransferToOffset = _f[1];
    var _g = (0, react_2.useState)(false), transferToIsLoading = _g[0], setTransferToIsLoading = _g[1];
    var _h = (0, react_2.useState)([]), transferFrom = _h[0], setTransferFrom = _h[1];
    var _j = (0, react_2.useState)([]), allTransferFromData = _j[0], setAllTransferFromData = _j[1];
    var _k = (0, react_2.useState)(""), transferFromSearch = _k[0], setTransferFromSearch = _k[1];
    var _l = (0, react_2.useState)(0), transferFromOffset = _l[0], setTransferFromOffset = _l[1];
    var _m = (0, react_2.useState)(false), transferFromIsLoading = _m[0], setTransferFromIsLoading = _m[1];
    var transferToQuery = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, mappedData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    setTransferToIsLoading(true);
                    return [4 /*yield*/, carbon.rpc("get_item_storage_unit_requirements_by_location", {
                            company_id: companyId,
                            location_id: locationId
                        })];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(error.message);
                        setAllTransferToData([]);
                    }
                    else {
                        mappedData = (_b = data === null || data === void 0 ? void 0 : data.map(function (item) { return ({
                            itemId: item.itemId,
                            itemReadableId: item.itemReadableId,
                            description: item.description,
                            thumbnailPath: item.thumbnailPath,
                            quantityOnHand: item.quantityOnHandInStorageUnit,
                            quantityRequired: item.quantityRequiredByStorageUnit,
                            quantityAvailable: item.quantityOnHandInStorageUnit -
                                item.quantityRequiredByStorageUnit,
                            quantityIncoming: item.quantityIncoming,
                            storageUnitId: item.storageUnitId,
                            storageUnitName: item.storageUnitName
                        }); })) !== null && _b !== void 0 ? _b : [];
                        setAllTransferToData(mappedData);
                    }
                    setTransferToIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, companyId, locationId]);
    var transferFromQuery = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var selectedToItems, fromDataPromises, fromDataArrays, flattenedFromData;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon || wizard.selectedToItemStorageUnitIds.size === 0) {
                        setAllTransferFromData([]);
                        return [2 /*return*/];
                    }
                    setTransferFromIsLoading(true);
                    selectedToItems = allTransferToData.filter(function (item) {
                        return wizard.selectedToItemStorageUnitIds.has("".concat(item.itemId, ":").concat(item.storageUnitId));
                    });
                    fromDataPromises = selectedToItems.map(function (toItem) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, data, error;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, carbon.rpc("get_item_storage_unit_requirements_by_location_and_item", {
                                        company_id: companyId,
                                        location_id: locationId,
                                        item_id: toItem.itemId
                                    })];
                                case 1:
                                    _a = _c.sent(), data = _a.data, error = _a.error;
                                    if (error) {
                                        console.error(error);
                                        return [2 /*return*/, []];
                                    }
                                    // Filter out the selected "to" storage unit
                                    return [2 /*return*/, ((_b = data === null || data === void 0 ? void 0 : data.filter(function (item) { return item.storageUnitId !== toItem.storageUnitId; }).map(function (item) { return ({
                                            itemId: item.itemId,
                                            itemReadableId: item.itemReadableId,
                                            description: item.description,
                                            thumbnailPath: item.thumbnailPath,
                                            quantityOnHand: item.quantityOnHandInStorageUnit,
                                            quantityRequired: item.quantityRequiredByStorageUnit,
                                            quantityAvailable: item.quantityOnHandInStorageUnit -
                                                item.quantityRequiredByStorageUnit,
                                            quantityIncoming: item.quantityIncoming,
                                            storageUnitId: item.storageUnitId,
                                            storageUnitName: item.storageUnitName
                                        }); })) !== null && _b !== void 0 ? _b : [])];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(fromDataPromises)];
                case 1:
                    fromDataArrays = _a.sent();
                    flattenedFromData = fromDataArrays.flat();
                    setAllTransferFromData(flattenedFromData);
                    setTransferFromIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [
        carbon,
        companyId,
        locationId,
        wizard.selectedToItemStorageUnitIds,
        allTransferToData
    ]);
    (0, react_1.useMount)(function () {
        transferToQuery();
    });
    // Refresh "from" data when selected "to" items change
    (0, react_2.useEffect)(function () {
        transferFromQuery();
    }, [transferFromQuery]);
    // Reset offsets when page size changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        setTransferToOffset(0);
        setTransferFromOffset(0);
    }, [pageSize]);
    // Deselect active item/storage unit when "to" table page changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        (0, stores_1.clearSelectedToItemStorageUnits)();
    }, [transferToOffset]);
    // Client-side filtering and pagination for "to" table
    (0, react_2.useEffect)(function () {
        var filtered = allTransferToData;
        if (transferToSearch) {
            filtered = filtered.filter(function (item) {
                return item.itemReadableId
                    .toLowerCase()
                    .includes(transferToSearch.toLowerCase());
            });
        }
        setTransferTo(filtered);
        setTransferToOffset(0); // Reset to first page when data changes
    }, [allTransferToData, transferToSearch]);
    // Client-side filtering and pagination for "from" table
    (0, react_2.useEffect)(function () {
        var filtered = allTransferFromData;
        if (transferFromSearch) {
            filtered = filtered.filter(function (item) {
                return item.itemReadableId
                    .toLowerCase()
                    .includes(transferFromSearch.toLowerCase());
            });
        }
        setTransferFrom(filtered);
        setTransferFromOffset(0); // Reset to first page when data changes
    }, [allTransferFromData, transferFromSearch]);
    // Pagination logic for "to" table
    var paginatedTransferTo = (0, react_2.useMemo)(function () { return transferTo.slice(transferToOffset, transferToOffset + pageSize); }, [transferTo, transferToOffset, pageSize]);
    var canPreviousPageTo = transferToOffset > 0;
    var canNextPageTo = transferToOffset + pageSize < transferTo.length;
    var handlePreviousPageTo = (0, react_2.useCallback)(function () {
        setTransferToOffset(function (prev) { return Math.max(0, prev - pageSize); });
    }, [pageSize]);
    var handleNextPageTo = (0, react_2.useCallback)(function () {
        setTransferToOffset(function (prev) {
            var newOffset = prev + pageSize;
            return newOffset < transferTo.length ? newOffset : prev;
        });
    }, [pageSize, transferTo.length]);
    // Pagination logic for "from" table
    var paginatedTransferFrom = (0, react_2.useMemo)(function () { return transferFrom.slice(transferFromOffset, transferFromOffset + pageSize); }, [transferFrom, transferFromOffset, pageSize]);
    var canPreviousPageFrom = transferFromOffset > 0;
    var canNextPageFrom = transferFromOffset + pageSize < transferFrom.length;
    var handlePreviousPageFrom = (0, react_2.useCallback)(function () {
        setTransferFromOffset(function (prev) { return Math.max(0, prev - pageSize); });
    }, [pageSize]);
    var handleNextPageFrom = (0, react_2.useCallback)(function () {
        setTransferFromOffset(function (prev) {
            var newOffset = prev + pageSize;
            return newOffset < transferFrom.length ? newOffset : prev;
        });
    }, [pageSize, transferFrom.length]);
    var columnsTo = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "itemReadableId",
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack spacing={2}>
            <components_1.ItemThumbnail thumbnailPath={row.original.thumbnailPath} type="Part"/>
            <react_1.VStack spacing={0} className="max-w-[200px] truncate">
              <div className="text-sm font-medium text-wrap">
                {row.original.itemReadableId}
              </div>
              <div className="text-xs text-muted-foreground">
                {row.original.description}
              </div>
            </react_1.VStack>
          </react_1.HStack>);
                },
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item ID"], ["Item ID"])))
            },
            {
                accessorKey: "storageUnitName",
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.storageUnitName;
                },
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))
            },
            {
                accessorKey: "quantityOnHand",
                cell: function (_a) {
                    var row = _a.row;
                    // Calculate total quantity being transferred to this specific item/storage unit combination
                    var transferLinesToThisItemStorageUnit = wizard.lines.filter(function (line) {
                        return line.itemId === row.original.itemId &&
                            line.toStorageUnitId === row.original.storageUnitId;
                    });
                    var totalTransferQuantity = transferLinesToThisItemStorageUnit.reduce(function (sum, line) { var _a; return sum + ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0); }, 0);
                    var adjustedQuantity = row.original.quantityOnHand + totalTransferQuantity;
                    return (<div className="flex flex-col">
              <span className={totalTransferQuantity > 0
                            ? "text-muted-foreground line-through text-xs"
                            : ""}>
                {formatter.format(row.original.quantityOnHand)}
              </span>
              {totalTransferQuantity > 0 && (<span className="font-medium">
                  {formatter.format(adjustedQuantity)}
                </span>)}
            </div>);
                },
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["On Storage Unit"], ["On Storage Unit"])))
            },
            {
                accessorKey: "quantityRequired",
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.quantityRequired);
                },
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Required"], ["Required"])))
            },
            {
                accessorKey: "quantityAvailable",
                cell: function (_a) {
                    var row = _a.row;
                    // Calculate total quantity being transferred to this specific item/storage unit combination
                    var transferLinesToThisItemStorageUnit = wizard.lines.filter(function (line) {
                        return line.itemId === row.original.itemId &&
                            line.toStorageUnitId === row.original.storageUnitId;
                    });
                    var totalTransferQuantity = transferLinesToThisItemStorageUnit.reduce(function (sum, line) { var _a; return sum + ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0); }, 0);
                    // Calculate total available including incoming quantities
                    var totalAvailableWithIncoming = row.original.quantityAvailable + row.original.quantityIncoming;
                    var adjustedAvailable = totalAvailableWithIncoming + totalTransferQuantity;
                    // Check if we have enough to cover requirements (including incoming)
                    var hasEnoughWithIncoming = totalAvailableWithIncoming >= row.original.quantityRequired;
                    return (<div className="flex flex-col">
              <span className={totalTransferQuantity > 0
                            ? "text-muted-foreground line-through text-xs"
                            : ""}>
                {!hasEnoughWithIncoming ? (<react_1.HStack>
                    <span className="text-red-500">
                      {formatter.format(row.original.quantityAvailable)}
                    </span>
                    <lu_1.LuFlag className="text-red-500"/>
                  </react_1.HStack>) : (<span>
                    {formatter.format(row.original.quantityAvailable)}
                  </span>)}
              </span>
              {totalTransferQuantity > 0 && (<span className={"font-medium ".concat(adjustedAvailable < 0 ? "text-red-500" : "")}>
                  {adjustedAvailable < 0 ? (<react_1.HStack>
                      <span>{formatter.format(adjustedAvailable)}</span>
                      <lu_1.LuFlag className="text-red-500"/>
                    </react_1.HStack>) : (formatter.format(adjustedAvailable))}
                </span>)}
            </div>);
                },
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Available"], ["Available"])))
            },
            {
                accessorKey: "quantityIncoming",
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.quantityIncoming);
                },
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Incoming"], ["Incoming"])))
            },
            {
                id: "actions",
                cell: function (_a) {
                    var row = _a.row;
                    var isSelected = (0, stores_1.isToItemStorageUnitSelected)(row.original.itemId, row.original.storageUnitId);
                    var hasTransfers = (0, stores_1.hasTransferLinesToItemStorageUnit)(row.original.itemId, row.original.storageUnitId);
                    return (<div className="flex justify-end">
              <react_1.Button variant={isSelected ? "primary" : "secondary"} onClick={function () {
                            if (isSelected) {
                                // If already selected, deselect it
                                (0, stores_1.toggleToItemStorageUnitSelection)(row.original.itemId, row.original.storageUnitId);
                            }
                            else {
                                // If not selected, clear selection and select only this one
                                (0, stores_1.clearSelectedToItemStorageUnits)();
                                (0, stores_1.toggleToItemStorageUnitSelection)(row.original.itemId, row.original.storageUnitId);
                            }
                        }}>
                {hasTransfers ? (<react_1.HStack>
                    <react_1.PulsingDot />
                    <span>Transfer</span>
                  </react_1.HStack>) : ("Transfer")}
              </react_1.Button>
            </div>);
                },
                header: ""
            }
        ];
    }, [formatter, wizard.lines, t]);
    var items = (0, stores_1.useItems)()[0];
    var columnsFrom = (0, react_2.useMemo)(function () {
        return [
            {
                id: "actions",
                cell: function (_a) {
                    var row = _a.row;
                    // Find the corresponding "to" item
                    var toItem = allTransferToData.find(function (item) {
                        return item.itemId === row.original.itemId &&
                            wizard.selectedToItemStorageUnitIds.has("".concat(item.itemId, ":").concat(item.storageUnitId));
                    });
                    if (!toItem)
                        return null;
                    var isLineAdded = (0, stores_1.hasTransferLine)(row.original.itemId, row.original.storageUnitId, toItem.storageUnitId);
                    return (<div className="flex justify-end">
              <react_1.Button leftIcon={<lu_1.LuArrowLeft />} variant={isLineAdded ? "primary" : "secondary"} onClick={function () {
                            var _a;
                            if (isLineAdded) {
                                (0, stores_1.removeTransferLine)(row.original.itemId, row.original.storageUnitId, toItem.storageUnitId);
                            }
                            else {
                                // Calculate default quantity:
                                // Amount needed to bring "to" shelve to 0 available (fulfill requirements)
                                // Capped by what's available in "from" shelve
                                var quantityNeeded = Math.max(0, toItem.quantityRequired - toItem.quantityOnHand);
                                var defaultQuantity = Math.min(quantityNeeded, row.original.quantityAvailable);
                                var item = items.find(function (item) { return item.id === row.original.itemId; });
                                var trackingType = (_a = item === null || item === void 0 ? void 0 : item.itemTrackingType) !== null && _a !== void 0 ? _a : "Inventory";
                                (0, stores_1.addTransferLine)({
                                    itemId: row.original.itemId,
                                    itemReadableId: row.original.itemReadableId,
                                    description: row.original.description,
                                    thumbnailPath: row.original.thumbnailPath,
                                    fromStorageUnitId: row.original.storageUnitId,
                                    fromStorageUnitName: row.original.storageUnitName,
                                    toStorageUnitId: toItem.storageUnitId,
                                    toStorageUnitName: toItem.storageUnitName,
                                    quantityAvailable: row.original.quantityAvailable,
                                    quantity: defaultQuantity,
                                    requiresSerialTracking: trackingType === "Serial",
                                    requiresBatchTracking: trackingType === "Batch"
                                });
                            }
                        }}>
                Transfer
              </react_1.Button>
            </div>);
                },
                header: ""
            },
            {
                id: "quantity",
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    // Find the corresponding "to" item
                    var toItem = allTransferToData.find(function (item) {
                        return item.itemId === row.original.itemId &&
                            wizard.selectedToItemStorageUnitIds.has("".concat(item.itemId, ":").concat(item.storageUnitId));
                    });
                    if (!toItem)
                        return null;
                    var isLineAdded = (0, stores_1.hasTransferLine)(row.original.itemId, row.original.storageUnitId, toItem.storageUnitId);
                    if (!isLineAdded)
                        return null;
                    // Find the line to get the current quantity
                    var line = wizard.lines.find(function (l) {
                        return l.itemId === row.original.itemId &&
                            l.fromStorageUnitId === row.original.storageUnitId &&
                            l.toStorageUnitId === toItem.storageUnitId;
                    });
                    return (<react_1.NumberField value={Math.max(0, (_b = line === null || line === void 0 ? void 0 : line.quantity) !== null && _b !== void 0 ? _b : 0)} minValue={0} onChange={function (value) {
                            if (value !== null && !isNaN(value)) {
                                var clampedValue = Math.min(Math.max(0, value), row.original.quantityAvailable +
                                    row.original.quantityIncoming);
                                (0, stores_1.updateTransferLineQuantity)(row.original.itemId, row.original.storageUnitId, toItem.storageUnitId, clampedValue);
                            }
                        }} className="w-24">
              <react_1.NumberInputGroup>
                <react_1.NumberInput size="sm"/>
              </react_1.NumberInputGroup>
            </react_1.NumberField>);
                },
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quantity"], ["Quantity"])))
            },
            {
                accessorKey: "itemReadableId",
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack spacing={2}>
            <components_1.ItemThumbnail thumbnailPath={row.original.thumbnailPath} type="Part"/>
            <react_1.VStack spacing={0} className="max-w-[200px] truncate">
              <div className="text-sm font-medium text-wrap">
                {row.original.itemReadableId}
              </div>
              <div className="text-xs text-muted-foreground">
                {row.original.description}
              </div>
            </react_1.VStack>
          </react_1.HStack>);
                },
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Item ID"], ["Item ID"])))
            },
            {
                accessorKey: "storageUnitName",
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.storageUnitName;
                },
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))
            },
            {
                accessorKey: "quantityOnHand",
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    // Find the corresponding "to" item
                    var toItem = allTransferToData.find(function (item) {
                        return item.itemId === row.original.itemId &&
                            wizard.selectedToItemStorageUnitIds.has("".concat(item.itemId, ":").concat(item.storageUnitId));
                    });
                    if (!toItem)
                        return formatter.format(row.original.quantityOnHand);
                    // Find the transfer line to get the quantity being transferred
                    var transferLine = wizard.lines.find(function (l) {
                        return l.itemId === row.original.itemId &&
                            l.fromStorageUnitId === row.original.storageUnitId &&
                            l.toStorageUnitId === toItem.storageUnitId;
                    });
                    var transferQuantity = (_b = transferLine === null || transferLine === void 0 ? void 0 : transferLine.quantity) !== null && _b !== void 0 ? _b : 0;
                    var adjustedQuantity = row.original.quantityOnHand - transferQuantity;
                    return (<div className="flex flex-col">
              <span className={transferQuantity > 0
                            ? "text-muted-foreground line-through text-xs"
                            : ""}>
                {formatter.format(row.original.quantityOnHand)}
              </span>
              {transferQuantity > 0 && (<span className="font-medium">
                  {formatter.format(adjustedQuantity)}
                </span>)}
            </div>);
                },
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["On Storage Unit"], ["On Storage Unit"])))
            },
            {
                accessorKey: "quantityAvailable",
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    // Find the corresponding "to" item
                    var toItem = allTransferToData.find(function (item) {
                        return item.itemId === row.original.itemId &&
                            wizard.selectedToItemStorageUnitIds.has("".concat(item.itemId, ":").concat(item.storageUnitId));
                    });
                    // Calculate total available including incoming quantities
                    var totalAvailableWithIncoming = row.original.quantityAvailable + row.original.quantityIncoming;
                    if (!toItem) {
                        // Check if we have enough to cover requirements (including incoming)
                        var hasEnoughWithIncoming_1 = totalAvailableWithIncoming >= row.original.quantityRequired;
                        return !hasEnoughWithIncoming_1 ? (<react_1.HStack>
                <span className="text-red-500">
                  {formatter.format(row.original.quantityAvailable)}
                </span>
                <lu_1.LuFlag className="text-red-500"/>
              </react_1.HStack>) : (<span>{formatter.format(row.original.quantityAvailable)}</span>);
                    }
                    // Find the transfer line to get the quantity being transferred
                    var transferLine = wizard.lines.find(function (l) {
                        return l.itemId === row.original.itemId &&
                            l.fromStorageUnitId === row.original.storageUnitId &&
                            l.toStorageUnitId === toItem.storageUnitId;
                    });
                    var transferQuantity = (_b = transferLine === null || transferLine === void 0 ? void 0 : transferLine.quantity) !== null && _b !== void 0 ? _b : 0;
                    var adjustedAvailable = totalAvailableWithIncoming - transferQuantity;
                    // Check if we have enough to cover requirements (including incoming)
                    var hasEnoughWithIncoming = totalAvailableWithIncoming >= row.original.quantityRequired;
                    return (<div className="flex flex-col">
              <span className={transferQuantity > 0
                            ? "text-muted-foreground line-through text-xs"
                            : ""}>
                {!hasEnoughWithIncoming ? (<react_1.HStack>
                    <span className="text-red-500">
                      {formatter.format(row.original.quantityAvailable)}
                    </span>
                    <lu_1.LuFlag className="text-red-500"/>
                  </react_1.HStack>) : (<span>
                    {formatter.format(row.original.quantityAvailable)}
                  </span>)}
              </span>
              {transferQuantity > 0 && (<span className={"font-medium ".concat(adjustedAvailable < 0 ? "text-red-500" : "")}>
                  {adjustedAvailable < 0 ? (<react_1.HStack>
                      <span>{formatter.format(adjustedAvailable)}</span>
                      <lu_1.LuFlag className="text-red-500"/>
                    </react_1.HStack>) : (formatter.format(adjustedAvailable))}
                </span>)}
            </div>);
                },
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Available"], ["Available"])))
            },
            {
                accessorKey: "quantityRequired",
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.quantityRequired);
                },
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Required"], ["Required"])))
            },
            {
                accessorKey: "quantityIncoming",
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.quantityIncoming);
                },
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Incoming"], ["Incoming"])))
            }
        ];
    }, [
        allTransferToData,
        wizard.selectedToItemStorageUnitIds,
        wizard.lines,
        items,
        formatter,
        t
    ]);
    return (<>
      <div className="grid grid-cols-2 gap-0 h-full w-full">
        <div className="flex flex-col">
          <div className="flex-1 border-r">
            <TransferTable title={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Transfer To"], ["Transfer To"])))} data={paginatedTransferTo} isLoading={transferToIsLoading} columns={columnsTo} count={transferTo.length} offset={transferToOffset} canPreviousPage={canPreviousPageTo} canNextPage={canNextPageTo} handlePreviousPage={handlePreviousPageTo} handleNextPage={handleNextPageTo} pageSize={pageSize} setPageSize={setPageSize} search={transferToSearch} onSearchChange={setTransferToSearch} isRowSelected={function (row) {
            return (0, stores_1.isToItemStorageUnitSelected)(row.itemId, row.storageUnitId);
        }}/>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex-1">
            <TransferTable title={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Transfer From"], ["Transfer From"])))} data={paginatedTransferFrom} isLoading={transferFromIsLoading} columns={columnsFrom} count={transferFrom.length} offset={transferFromOffset} canPreviousPage={canPreviousPageFrom} canNextPage={canNextPageFrom} handlePreviousPage={handlePreviousPageFrom} handleNextPage={handleNextPageFrom} pageSize={pageSize} setPageSize={setPageSize} search={transferFromSearch} onSearchChange={setTransferFromSearch} isRowSelected={function (row) {
            var toItem = allTransferToData.find(function (item) {
                return item.itemId === row.itemId &&
                    wizard.selectedToItemStorageUnitIds.has("".concat(item.itemId, ":").concat(item.storageUnitId));
            });
            return toItem
                ? (0, stores_1.hasTransferLine)(row.itemId, row.storageUnitId, toItem.storageUnitId)
                : false;
        }}/>
          </div>
        </div>
      </div>
      <StockTransferWizardWidget locationId={locationId}/>
    </>);
}
function TransferTable(_a) {
    var title = _a.title, data = _a.data, columns = _a.columns, count = _a.count, isLoading = _a.isLoading, offset = _a.offset, pageSize = _a.pageSize, setPageSize = _a.setPageSize, canPreviousPage = _a.canPreviousPage, canNextPage = _a.canNextPage, handlePreviousPage = _a.handlePreviousPage, handleNextPage = _a.handleNextPage, search = _a.search, onSearchChange = _a.onSearchChange, isRowSelected = _a.isRowSelected;
    var t = (0, macro_1.useLingui)().t;
    var pageSizes = [20, 100, 500, 1000];
    if (!pageSizes.includes(pageSize)) {
        pageSizes.push(pageSize);
        pageSizes.sort();
    }
    var table = (0, react_table_1.useReactTable)({
        data: data,
        columns: columns,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)()
    });
    var rows = table.getRowModel().rows;
    var tableRef = (0, react_2.useRef)(null);
    return (<react_1.VStack spacing={0} className="h-full bg-card flex flex-col w-full px-0">
      <react_1.HStack className="px-4 py-2 justify-between bg-card border-b  w-full">
        <react_1.HStack spacing={4} className="w-full justify-between">
          <react_1.Heading size="h4" className="flex-shrink-0">
            {title}
          </react_1.Heading>
          <div>
            <react_1.InputGroup size="sm">
              <react_1.InputLeftElement>
                <lu_1.LuSearch className="text-muted-foreground w-3.5 h-3.5 mt-[-2px]"/>
              </react_1.InputLeftElement>
              <react_1.Input value={search} onChange={function (e) {
            onSearchChange(e.target.value);
        }} placeholder={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Search"], ["Search"])))} className="w-[100px] sm:w-[200px] text-sm"/>
            </react_1.InputGroup>
          </div>
        </react_1.HStack>
      </react_1.HStack>
      <div id="table-container" className="w-full h-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" style={{ contain: "strict" }}>
        <div className="flex max-w-full h-full">
          {isLoading ? (<div className="flex h-full w-full items-center justify-center">
              <react_1.Spinner className="size-8"/>
            </div>) : rows.length === 0 ? (<div className="flex flex-col w-full h-full items-center justify-center gap-4">
              <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background -mt-[10dvh]">
                <lu_1.LuTriangleAlert className="h-6 w-6 flex-shrink-0"/>
              </div>
              <span className="text-xs font-mono font-light text-foreground uppercase">
                No storage units exist
              </span>
            </div>) : (<react_1.Table ref={tableRef} full className="relative border-collapse border-spacing-0">
              <react_1.Thead className="sticky top-0 z-10">
                {table.getHeaderGroups().map(function (headerGroup) { return (<react_1.Tr key={headerGroup.id} className="h-10">
                    {headerGroup.headers.map(function (header) {
                    var _a;
                    var accessorKey = (0, utils_1.getAccessorKey)(header.column.columnDef);
                    var sortable = accessorKey &&
                        !accessorKey.endsWith(".id") &&
                        header.column.columnDef.enableSorting !== false;
                    return (<react_1.Th key={header.id} colSpan={header.colSpan} id={"header-".concat(header.id)} className={(0, react_1.cn)("px-4 py-3 whitespace-nowrap", sortable && "cursor-pointer")} style={{
                            width: header.getSize()
                        }}>
                          {!header.isPlaceholder && (<div className="flex justify-start items-center gap-2">
                              {(_a = header.column.columnDef.meta) === null || _a === void 0 ? void 0 : _a.icon}
                              {(0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext())}
                            </div>)}
                        </react_1.Th>);
                })}
                  </react_1.Tr>); })}
              </react_1.Thead>
              <react_1.Tbody>
                {rows.map(function (row) {
                var _a;
                var selected = (_a = isRowSelected === null || isRowSelected === void 0 ? void 0 : isRowSelected(row.original)) !== null && _a !== void 0 ? _a : false;
                return (<react_1.Tr key={row.id} className={(0, react_1.cn)("border-b border-border transition-colors", selected && "bg-primary/10 hover:bg-primary/15")}>
                      {row.getVisibleCells().map(function (cell, columnIndex) {
                        return (<react_1.Td key={cell.id} className="relative px-4 py-2 whitespace-nowrap text-sm outline-none">
                            <div>
                              {(0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </react_1.Td>);
                    })}
                    </react_1.Tr>);
            })}
              </react_1.Tbody>
            </react_1.Table>)}
        </div>
      </div>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0"/>
      <react_1.HStack className="text-center bg-card justify-between py-4 w-full z-[1] px-4" spacing={6}>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.Button variant="secondary">{pageSize} rows</react_1.Button>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent align="start" className="w-48">
            <react_1.DropdownMenuLabel>Results per page</react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuRadioGroup value={"".concat(pageSize)}>
              {pageSizes.map(function (size) { return (<react_1.DropdownMenuRadioItem key={"".concat(size)} value={"".concat(size)} onClick={function () {
                setPageSize(size);
            }}>
                  {size}
                </react_1.DropdownMenuRadioItem>); })}
            </react_1.DropdownMenuRadioGroup>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
        <react_1.HStack>
          <PaginationButtons count={count} offset={offset} pageSize={pageSize} canPreviousPage={canPreviousPage} canNextPage={canNextPage} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage}/>
        </react_1.HStack>
      </react_1.HStack>
    </react_1.VStack>);
}
function PaginationButtons(_a) {
    var count = _a.count, offset = _a.offset, pageSize = _a.pageSize, canPreviousPage = _a.canPreviousPage, canNextPage = _a.canNextPage, handlePreviousPage = _a.handlePreviousPage, handleNextPage = _a.handleNextPage;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    return (<>
      <div className="text-foreground text-sm font-medium align-center hidden lg:flex">
        {count > 0 ? offset + 1 : 0} - {Math.min(offset + pageSize, count)} of{" "}
        {count}
      </div>
      <react_1.Tooltip>
        <react_1.TooltipTrigger>
          <react_1.Button variant="secondary" isDisabled={!canPreviousPage} onClick={handlePreviousPage} leftIcon={<bs_1.BsChevronLeft />}>
            Previous
          </react_1.Button>
        </react_1.TooltipTrigger>
        <react_1.TooltipContent>
          <react_1.HStack>{prettifyShortcut("ArrowLeft")}</react_1.HStack>
        </react_1.TooltipContent>
      </react_1.Tooltip>
      <react_1.Tooltip>
        <react_1.TooltipTrigger>
          <react_1.Button variant="secondary" isDisabled={!canNextPage} onClick={handleNextPage} rightIcon={<bs_1.BsChevronRight />}>
            Next
          </react_1.Button>
        </react_1.TooltipTrigger>
        <react_1.TooltipContent>
          <react_1.HStack>{prettifyShortcut("ArrowRight")}</react_1.HStack>
        </react_1.TooltipContent>
      </react_1.Tooltip>
    </>);
}
var StockTransferWizardWidget = function (_a) {
    var locationId = _a.locationId;
    var t = (0, macro_1.useLingui)().t;
    // Item Rule pre-flight on Create Transfer (auto-released → stock-commit
    // gate sits at the wizard click). Modal surfaces violations before the
    // transfer is created.
    var createRules = (0, storage_rules_1.useStorageRuleViolations)({
        action: path_1.path.to.newStockTransfer,
        onSuccess: function () { return (0, stores_1.clearStockTransferWizard)(); }
    });
    var fetcher = createRules.fetcher;
    var wizard = (0, stores_1.useStockTransferWizard)()[0];
    var linesCount = (0, stores_1.useStockTransferWizardLinesCount)();
    var _b = (0, react_2.useState)(false), isExpanded = _b[0], setIsExpanded = _b[1];
    var _c = (0, react_2.useState)(false), isMinimized = _c[0], setIsMinimized = _c[1];
    // Filter out lines with quantity 0
    var activeLines = wizard.lines.filter(function (line) { var _a; return ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0) > 0; });
    var onRemoveItem = function (itemId, fromStorageUnitId, toStorageUnitId) {
        (0, stores_1.removeTransferLine)(itemId, fromStorageUnitId, toStorageUnitId);
    };
    if (linesCount === 0) {
        return null;
    }
    if (isMinimized) {
        return (<div className="fixed bottom-6 right-6 z-50">
        <button onClick={function () { return setIsMinimized(false); }} className="relative flex items-center justify-center w-16 h-16 bg-card border-2 border-border rounded-full shadow-2xl hover:scale-105 transition-transform duration-200">
          <lu_1.LuTruck className="w-6 h-6 text-foreground"/>
          {activeLines.length > 0 && (<react_1.Badge className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0 border-2 border-background">
              {activeLines.length}
            </react_1.Badge>)}
        </button>
      </div>);
    }
    return (<div className="fixed bottom-6 right-6 z-[9999]">
      <div className={"bg-card border-2 border-border rounded-2xl shadow-2xl transition-all duration-300 ease-in-out ".concat(isExpanded ? "w-96 h-[32rem]" : "w-80 h-auto")}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <lu_1.LuCheckCheck className="w-5 h-5 text-primary-foreground"/>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-base">
                Transfer Lines
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeLines.length}{" "}
                {activeLines.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <react_1.IconButton variant="ghost" aria-label={isExpanded ? "Minimize" : "Expand"} icon={isExpanded ? (<lu_1.LuMinus className="size-4"/>) : (<lu_1.LuMaximize2 className="size-4"/>)} onClick={function () { return setIsExpanded(!isExpanded); }}/>
            <react_1.IconButton variant="ghost" aria-label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Close"], ["Close"])))} icon={<lu_1.LuX className="size-4"/>} onClick={function () { return setIsMinimized(true); }}/>
          </div>
        </div>

        {/* Content */}
        {isExpanded ? (<div className="flex flex-col h-[calc(32rem-5rem)]">
            <react_1.ScrollArea className="flex-1 p-4">
              {activeLines.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <lu_1.LuTruck className="w-8 h-8 text-muted-foreground"/>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No transfer lines yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start adding items to transfer
                  </p>
                </div>) : (<div className="space-y-3">
                  {activeLines.map(function (line) {
                    var _a;
                    return (<div key={"".concat(line.itemId, "-").concat(line.fromStorageUnitId, "-").concat(line.toStorageUnitId)} className="group bg-secondary/50 border border-border rounded-lg p-3 hover:bg-secondary transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <components_1.ItemThumbnail thumbnailPath={line.thumbnailPath} type="Part" size="sm"/>
                            <div className="flex-1">
                              <span className="font-mono text-xs font-semibold block">
                                {line.itemReadableId}
                              </span>
                              <p className="text-xs text-muted-foreground truncate">
                                {line.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <react_1.IconButton variant="secondary" aria-label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Remove item"], ["Remove item"])))} icon={<lu_1.LuTrash2 />} size="sm" onClick={function () {
                            return onRemoveItem(line.itemId, line.fromStorageUnitId, line.toStorageUnitId);
                        }}/>
                      </div>
                      <div className="space-y-1 text-xs">
                        <react_1.HStack className="items-center justify-start" spacing={1}>
                          <react_1.Badge variant="outline">
                            {line.fromStorageUnitName}
                          </react_1.Badge>
                          <lu_1.LuArrowRight className="size-4"/>
                          <react_1.Count count={(_a = line.quantity) !== null && _a !== void 0 ? _a : 0}/>
                          <lu_1.LuArrowRight className="size-4"/>
                          <react_1.Badge variant="outline">
                            {line.toStorageUnitName}
                          </react_1.Badge>
                        </react_1.HStack>
                      </div>
                    </div>);
                })}
                </div>)}
            </react_1.ScrollArea>

            {/* Footer */}
            {activeLines.length > 0 && (<div className="p-4 border-t-2 border-border space-y-2">
                <react_1.Button type="button" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} size="lg" className="w-full" onClick={function () {
                    var fd = new FormData();
                    fd.set("locationId", locationId);
                    fd.set("lines", JSON.stringify(activeLines));
                    createRules.submit(fd);
                }}>
                  Create Transfer
                </react_1.Button>
                <react_1.Button variant="ghost" className="w-full" onClick={stores_1.clearStockTransferWizard}>
                  Clear All
                </react_1.Button>
              </div>)}
          </div>) : (<div className="p-4 space-y-4">
            {activeLines.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-2">
                No transfer lines yet
              </p>) : (<div className="space-y-2">
                {activeLines.slice(0, 3).map(function (line) {
                    var _a;
                    return (<div key={"".concat(line.itemId, "-").concat(line.fromStorageUnitId, "-").concat(line.toStorageUnitId)} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs truncate flex-1">
                      {line.itemReadableId}
                    </span>
                    <react_1.HStack spacing={1}>
                      <react_1.Count count={(_a = line.quantity) !== null && _a !== void 0 ? _a : 0}/>
                      <lu_1.LuArrowRight className="size-4"/>
                      <react_1.Badge variant="outline" className="ml-2">
                        {line.toStorageUnitName}
                      </react_1.Badge>
                    </react_1.HStack>
                  </div>);
                })}
                {activeLines.length > 3 && (<p className="text-xs text-muted-foreground text-center pt-1">
                    +{activeLines.length - 3} more
                  </p>)}
              </div>)}
            {activeLines.length > 0 && (<react_1.Button type="button" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} size="lg" className="w-full" onClick={function () {
                    var fd = new FormData();
                    fd.set("locationId", locationId);
                    fd.set("lines", JSON.stringify(activeLines));
                    createRules.submit(fd);
                }}>
                Create Transfer
              </react_1.Button>)}
          </div>)}
      </div>
      <createRules.ViolationModal />
    </div>);
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
