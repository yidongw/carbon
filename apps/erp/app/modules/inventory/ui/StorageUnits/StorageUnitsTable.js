"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var ui_1 = require("@carbon/printing/ui");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var StorageTypes_1 = require("~/components/Form/StorageTypes");
var components_2 = require("~/components/Table/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var StorageUnitsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, serverLocations = _a.locations, locationId = _a.locationId, serverStorageTypes = _a.storageTypes, parentIdsWithChildren = _a.parentIdsWithChildren, initialExpanded = _a.initialExpanded;
    var params = (0, hooks_1.useUrlParams)()[0];
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    // Locations come from the server loader so the Location column resolves
    // names on first paint. Fall back to the client-side useLocations() hook
    // only if the server payload is somehow missing.
    var clientLocations = (0, Location_1.useLocations)();
    var locations = (0, react_2.useMemo)(function () {
        if (serverLocations && serverLocations.length > 0) {
            return serverLocations.map(function (l) { return ({ value: l.id, label: l.name }); });
        }
        return clientLocations;
    }, [serverLocations, clientLocations]);
    // Storage types come from the server loader so the Storage Types column
    // resolves names on first paint. Fall back to the client-side
    // useStorageTypes() hook only if the server payload is somehow missing.
    var clientStorageTypes = (0, StorageTypes_1.useStorageTypes)();
    var storageTypes = (0, react_2.useMemo)(function () {
        if (serverStorageTypes && serverStorageTypes.length > 0) {
            return serverStorageTypes.map(function (st) { return ({
                value: st.id,
                label: st.name
            }); });
        }
        return clientStorageTypes;
    }, [serverStorageTypes, clientStorageTypes]);
    var hasChildrenSet = (0, react_2.useMemo)(function () { return new Set(parentIdsWithChildren); }, [parentIdsWithChildren]);
    // Partition `data` into children-by-parentId. In root-mode (no search)
    // every row is a root and this map is empty. In search-mode it contains
    // the ancestor chains for each match so the tree can render without
    // additional fetches.
    var initialChildrenCache = (0, react_2.useMemo)(function () {
        var _a;
        var _b;
        var map = {};
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            if (row.parentId) {
                ((_a = map[_b = row.parentId]) !== null && _a !== void 0 ? _a : (map[_b] = [])).push(row);
            }
        }
        return map;
    }, [data]);
    var _b = (0, react_2.useState)(initialChildrenCache), childrenCache = _b[0], setChildrenCache = _b[1];
    var _c = (0, react_2.useState)(function () { return new Set(initialExpanded); }), expandedIds = _c[0], setExpandedIds = _c[1];
    var _d = (0, react_2.useState)(new Set()), loadingIds = _d[0], setLoadingIds = _d[1];
    var _e = (0, react_2.useState)(new Set()), selectedIds = _e[0], setSelectedIds = _e[1];
    // Reset tree state only when the loader payload MEANINGFULLY changes
    // (location switch, search, pagination). Keying on object identity would
    // also fire on every revalidation (e.g. after a fetcher POST or opening
    // a drawer route), collapsing the tree and wiping the selection.
    var dataSignature = (0, react_2.useMemo)(function () {
        return "".concat(locationId, "::").concat(data.map(function (r) { return r.id; }).join(","), "::").concat(initialExpanded.join(","));
    }, [locationId, data, initialExpanded]);
    var prevSignature = (0, react_2.useRef)(dataSignature);
    (0, react_2.useEffect)(function () {
        if (prevSignature.current === dataSignature)
            return;
        prevSignature.current = dataSignature;
        setChildrenCache(initialChildrenCache);
        setExpandedIds(new Set(initialExpanded));
        setLoadingIds(new Set());
        setSelectedIds(new Set());
    }, [dataSignature, initialChildrenCache, initialExpanded]);
    // Keep a ref to the cache so the recursive descendant walk always sees
    // the latest children without stale-closure issues.
    var childrenCacheRef = (0, react_2.useRef)(childrenCache);
    childrenCacheRef.current = childrenCache;
    var collectDescendantIds = (0, react_2.useCallback)(function (id) {
        var cache = childrenCacheRef.current;
        var out = [];
        var walk = function (parentId) {
            var _a;
            for (var _i = 0, _b = (_a = cache[parentId]) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
                var kid = _b[_i];
                out.push(kid.id);
                walk(kid.id);
            }
        };
        walk(id);
        return out;
    }, []);
    var toggleExpand = (0, react_2.useCallback)(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var isExpanding, res, body, kids_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setExpandedIds(function (prev) {
                        var next = new Set(prev);
                        if (next.has(id))
                            next.delete(id);
                        else
                            next.add(id);
                        return next;
                    });
                    isExpanding = !expandedIds.has(id);
                    if (!isExpanding)
                        return [2 /*return*/];
                    if (childrenCache[id])
                        return [2 /*return*/];
                    setLoadingIds(function (prev) { return new Set(prev).add(id); });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, fetch(path_1.path.to.api.storageUnitChildren(id))];
                case 2:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    body = (_b.sent());
                    kids_1 = (_a = body.data) !== null && _a !== void 0 ? _a : [];
                    setChildrenCache(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[id] = kids_1, _a)));
                    });
                    // Newly loaded children inherit a selected parent's selection
                    setSelectedIds(function (prev) {
                        if (!prev.has(id))
                            return prev;
                        var next = new Set(prev);
                        for (var _i = 0, kids_2 = kids_1; _i < kids_2.length; _i++) {
                            var kid = kids_2[_i];
                            next.add(kid.id);
                        }
                        return next;
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingIds(function (prev) {
                        var next = new Set(prev);
                        next.delete(id);
                        return next;
                    });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [expandedIds, childrenCache]);
    // Checking a unit cascades to all loaded descendants; unchecking removes
    // them. A parent with some (but not all of) its subtree selected renders
    // as indeterminate.
    var toggleSelected = (0, react_2.useCallback)(function (id) {
        setSelectedIds(function (prev) {
            var next = new Set(prev);
            var isSelecting = !next.has(id);
            if (isSelecting) {
                next.add(id);
                for (var _i = 0, _a = collectDescendantIds(id); _i < _a.length; _i++) {
                    var descId = _a[_i];
                    next.add(descId);
                }
            }
            else {
                next.delete(id);
                for (var _b = 0, _c = collectDescendantIds(id); _b < _c.length; _b++) {
                    var descId = _c[_b];
                    next.delete(descId);
                }
            }
            return next;
        });
    }, [collectDescendantIds]);
    // Build the displayed flat-row list by walking roots and recursing into
    // expanded subtrees. Roots = depth-1 rows in `data` (true for both
    // root-mode and search-mode payloads).
    var displayRows = (0, react_2.useMemo)(function () {
        var out = [];
        var roots = data.filter(function (r) { var _a; return ((_a = r.depth) !== null && _a !== void 0 ? _a : 1) === 1; });
        var walk = function (node) {
            out.push(node);
            if (!expandedIds.has(node.id))
                return;
            var kids = childrenCache[node.id];
            if (!kids)
                return;
            for (var _i = 0, kids_3 = kids; _i < kids_3.length; _i++) {
                var kid = kids_3[_i];
                walk(kid);
            }
        };
        for (var _i = 0, roots_1 = roots; _i < roots_1.length; _i++) {
            var root = roots_1[_i];
            walk(root);
        }
        return out;
    }, [data, expandedIds, childrenCache]);
    var allSelected = displayRows.length > 0 && displayRows.every(function (r) { return selectedIds.has(r.id); });
    var someSelected = selectedIds.size > 0 && !allSelected;
    var toggleAllSelected = (0, react_2.useCallback)(function () {
        setSelectedIds(function (prev) {
            var visible = displayRows.map(function (r) { return r.id; });
            var everyVisibleSelected = visible.length > 0 && visible.every(function (id) { return prev.has(id); });
            return everyVisibleSelected ? new Set() : new Set(visible);
        });
    }, [displayRows]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                // The id "Select" opts into the Table's compact checkbox-column
                // styling (px-2, shrink-to-fit width).
                id: "Select",
                size: 50,
                minSize: 1,
                header: function () { return (<components_2.IndeterminateCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAllSelected}/>); },
                cell: function (_a) {
                    var row = _a.row;
                    var id = row.original.id;
                    var isChecked = selectedIds.has(id);
                    var isIndeterminate = !isChecked &&
                        collectDescendantIds(id).some(function (descId) {
                            return selectedIds.has(descId);
                        });
                    return (<components_2.IndeterminateCheckbox checked={isChecked} indeterminate={isIndeterminate} onChange={function () { return toggleSelected(id); }}/>);
                }
            },
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var depth = Math.max(0, ((_b = row.original.depth) !== null && _b !== void 0 ? _b : 1) - 1);
                    var isExpanded = expandedIds.has(row.original.id);
                    var isLoading = loadingIds.has(row.original.id);
                    var hasChildren = hasChildrenSet.has(row.original.id);
                    return (<div className="flex flex-1">
                {Array.from({ length: depth }).map(function (_, i) { return (<div key={i} aria-hidden className="w-5 shrink-0 border-l border-border -my-2"/>); })}
                <div className="w-5 shrink-0 flex items-center justify-center self-center">
                  {hasChildren ? (isLoading ? (<react_1.Spinner className="size-3"/>) : (<button type="button" aria-label={isExpanded ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Collapse subtree"], ["Collapse subtree"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Expand subtree"], ["Expand subtree"])))} className="text-muted-foreground hover:text-foreground shrink-0" onClick={function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                toggleExpand(row.original.id);
                            }}>
                        {isExpanded ? (<lu_1.LuChevronDown className="size-4"/>) : (<lu_1.LuChevronRight className="size-4"/>)}
                      </button>)) : null}
                </div>
                <div className="flex items-center py-1">
                  <components_1.Hyperlink to={"".concat(path_1.path.to.storageUnit(row.original.id), "?").concat(params)}>
                    <span className={depth === 0 ? "font-medium" : "text-foreground/90"}>
                      {row.original.name}
                    </span>
                  </components_1.Hyperlink>
                </div>
              </div>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var location = locations.find(function (l) { return l.value === row.original.locationId; });
                    return (<Enumerable_1.Enumerable value={(_b = location === null || location === void 0 ? void 0 : location.label) !== null && _b !== void 0 ? _b : row.original.locationId}/>);
                },
                meta: {
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                accessorKey: "storageTypeIds",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Storage Types"], ["Storage Types"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    if (!((_b = row.original.storageTypeIds) === null || _b === void 0 ? void 0 : _b.length))
                        return null;
                    return (<react_1.HStack spacing={1}>
                {row.original.storageTypeIds.map(function (id) {
                            var _a, _b;
                            var label = (_b = (_a = storageTypes === null || storageTypes === void 0 ? void 0 : storageTypes.find(function (st) { return st.value === id; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : id;
                            return <Enumerable_1.Enumerable key={id} value={label}/>;
                        })}
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: storageTypes === null || storageTypes === void 0 ? void 0 : storageTypes.map(function (st) { return ({
                            value: st.value,
                            label: <Enumerable_1.Enumerable value={st.label}/>
                        }); }),
                        isArray: true
                    },
                    pluralHeader: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Storage Types"], ["Storage Types"]))),
                    icon: <lu_1.LuLayers />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" }
                        ]
                    },
                    pluralHeader: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Active Statuses"], ["Active Statuses"]))),
                    icon: <lu_1.LuCheck />
                }
            }
        ];
    }, [
        locations,
        params,
        storageTypes,
        t,
        expandedIds,
        loadingIds,
        hasChildrenSet,
        toggleExpand,
        selectedIds,
        allSelected,
        someSelected,
        toggleAllSelected,
        toggleSelected,
        collectDescendantIds
    ]);
    /* Bulk printing */
    var _f = (0, hooks_1.usePrinting)(), printerRoutes = _f.printerRoutes, resolvePrinterRoute = _f.resolvePrinterRoute;
    var printerModal = (0, react_1.useDisclosure)();
    var downloadModal = (0, react_1.useDisclosure)();
    var defaultPrinter = resolvePrinterRoute(locationId, "inventory");
    var _g = (0, react_2.useState)(""), selectedPrinterId = _g[0], setSelectedPrinterId = _g[1];
    var _h = (0, react_2.useState)(false), isPrinting = _h[0], setIsPrinting = _h[1];
    var handlePrintLabels = (0, react_2.useCallback)(function () {
        var _a, _b, _c;
        if (printerRoutes.length > 0) {
            setSelectedPrinterId((_c = (_a = defaultPrinter === null || defaultPrinter === void 0 ? void 0 : defaultPrinter.id) !== null && _a !== void 0 ? _a : (_b = printerRoutes[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "");
            printerModal.onOpen();
        }
        else {
            downloadModal.onOpen();
        }
    }, [printerRoutes, defaultPrinter === null || defaultPrinter === void 0 ? void 0 : defaultPrinter.id, printerModal, downloadModal]);
    // Raw fetch (not a fetcher): parallel submissions don't abort each other
    // and nothing revalidates, so the tree and selection stay intact.
    var handleConfirmPrint = (0, react_2.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var ids, results, failed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ids = Array.from(selectedIds);
                    if (ids.length === 0 || !selectedPrinterId)
                        return [2 /*return*/];
                    setIsPrinting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, Promise.allSettled(ids.map(function (id) {
                            return fetch(path_1.path.to.manualPrint, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    sourceDocument: "StorageUnit",
                                    sourceDocumentId: id,
                                    locationId: locationId,
                                    printerRouteId: selectedPrinterId
                                })
                            });
                        }))];
                case 2:
                    results = _a.sent();
                    failed = results.filter(function (r) { return r.status === "rejected" || !r.value.ok; }).length;
                    if (failed > 0) {
                        react_1.toast.error("".concat(failed, " of ").concat(ids.length, " print job").concat(ids.length === 1 ? "" : "s", " failed"));
                    }
                    else {
                        react_1.toast.success("Queued ".concat(ids.length, " label").concat(ids.length === 1 ? "" : "s", " for printing"));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    setIsPrinting(false);
                    printerModal.onClose();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [selectedIds, selectedPrinterId, locationId, printerModal]);
    var defaultColumnVisibility = {
        active: false
    };
    var defaultColumnPinning = {
        left: ["Select", "name"]
    };
    var actions = (0, react_2.useMemo)(function () {
        return (<div className="flex items-center gap-2">
          {selectedIds.size > 0 && (<react_1.Button variant="secondary" leftIcon={<lu_1.LuPrinter />} onClick={handlePrintLabels}>
              <macro_1.Trans>Print {selectedIds.size} Labels</macro_1.Trans>
            </react_1.Button>)}
          <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
                window.location.href = getLocationPath(selected);
            }}/>

          <components_1.New label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} to={"".concat(path_1.path.to.newStorageUnit, "?location=").concat(locationId)}/>
        </div>);
    }, [locationId, locations, t, selectedIds.size, handlePrintLabels]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "inventory")} onClick={function () {
                navigate("".concat(path_1.path.to.storageUnit(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Storage Unit</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!permissions.can("create", "inventory")} onClick={function () {
                var newParams = new URLSearchParams(params);
                newParams.set("parentId", row.id);
                if (row.locationId)
                    newParams.set("location", row.locationId);
                navigate("".concat(path_1.path.to.newStorageUnit, "?").concat(newParams.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPlus />}/>
              <macro_1.Trans>Add Child Storage Unit</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!permissions.can("delete", "inventory")} destructive onClick={function () {
                navigate("".concat(path_1.path.to.deleteStorageUnit(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Storage Unit</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<>
        <components_1.Table count={count} columns={columns} data={displayRows} defaultColumnVisibility={defaultColumnVisibility} defaultColumnPinning={defaultColumnPinning} primaryAction={actions} renderContextMenu={renderContextMenu} title={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Storage Units"], ["Storage Units"])))} table="storageUnit" withSavedView/>
        {printerModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    printerModal.onClose();
            }}>
            <react_1.ModalContent>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Select Printer</macro_1.Trans>
                </react_1.ModalTitle>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <div className="flex flex-col gap-1">
                  {printerRoutes.map(function (route) { return (<button type="button" key={route.id} className={"flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ".concat(selectedPrinterId === route.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted")} onClick={function () { return setSelectedPrinterId(route.id); }}>
                      <lu_1.LuPrinter className="size-4 text-muted-foreground shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">
                          {route.name}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2 uppercase">
                          {route.format}
                        </span>
                        {route.mediaSizeId && (<span className="text-xs text-muted-foreground ml-2">
                            {route.mediaSizeId}
                          </span>)}
                      </div>
                      {selectedPrinterId === route.id && (<lu_1.LuCheck className="size-4 text-primary shrink-0"/>)}
                    </button>); })}
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <div className="flex gap-2">
                  <react_1.Button variant="primary" leftIcon={<lu_1.LuPrinter />} disabled={!selectedPrinterId || isPrinting} onClick={handleConfirmPrint}>
                    <macro_1.Trans>Print {selectedIds.size} Labels</macro_1.Trans>
                  </react_1.Button>
                  <react_1.Button variant="solid" onClick={printerModal.onClose}>
                    <macro_1.Trans>Cancel</macro_1.Trans>
                  </react_1.Button>
                </div>
              </react_1.ModalFooter>
            </react_1.ModalContent>
          </react_1.Modal>)}
        {downloadModal.isOpen && selectedIds.size > 0 && (<StorageUnitDownloadModal ids={Array.from(selectedIds)} isOpen={downloadModal.isOpen} onClose={downloadModal.onClose}/>)}
      </>);
});
StorageUnitsTable.displayName = "StorageUnitsTable";
exports.default = StorageUnitsTable;
function StorageUnitDownloadModal(_a) {
    var ids = _a.ids, isOpen = _a.isOpen, onClose = _a.onClose;
    return (<ui_1.LabelDownloadModal sourceDocumentId="" fileRoutes={{
            pdf: function (_id, opts) {
                return path_1.path.to.file.storageUnitLabelsPdf(ids, opts);
            },
            zpl: function (_id, opts) {
                return path_1.path.to.file.storageUnitLabelsZpl(ids, opts);
            }
        }} isOpen={isOpen} onClose={onClose}/>);
}
function getLocationPath(locationId) {
    return "".concat(path_1.path.to.storageUnits, "?location=").concat(locationId);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
