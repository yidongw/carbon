"use strict";
// `<StorageUnit>` — the storage-unit (bin) picker. One component, two modes:
// - with `name`    -> form-bound (`@carbon/form` CreatableCombobox)
// - without `name` -> controlled (`value` + `onChange`) for table cells
//
// Options are the *leaf* storage units (the storable bins), each with a helper
// showing on-hand quantity (when `itemId` is given) or its hierarchy path.
// Built on the canonical `CreatableCombobox`, like every other entity picker.
//
// Choosing where a unit sits in the tree (a non-leaf target) is a different,
// single-purpose interaction handled by `StorageUnitParentSelect`, local to the
// Storage Unit form.
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
exports.useStorageUnitsTree = useStorageUnitsTree;
exports.useStorageUnits = useStorageUnits;
exports.useStorageUnitLeafOptions = useStorageUnitLeafOptions;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var StorageUnitForm_1 = require("~/modules/inventory/ui/StorageUnits/StorageUnitForm");
var path_1 = require("~/utils/path");
/**
 * Recursive storage-unit tree for a single location. One round-trip per
 * locationId change; consumers cache by reference identity. Also used by the
 * parent picker and storage-rule value inputs.
 */
function useStorageUnitsTree(locationId) {
    var _a, _b;
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: fetcher identity changes every render
    (0, react_2.useEffect)(function () {
        if (locationId)
            fetcher.load(path_1.path.to.api.storageUnitsTree(locationId));
    }, [locationId]);
    return (_b = (_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
}
/**
 * Flat storage-unit list for a location, optionally with per-item quantity
 * helpers. Kept for non-leaf-aware callsites that pull their own options.
 */
function useStorageUnits(locationId, itemId) {
    var storageUnitsFetcher = (0, react_router_1.useFetcher)();
    var storageUnitsWithQuantitiesFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (locationId) {
            if (itemId) {
                storageUnitsWithQuantitiesFetcher.load(path_1.path.to.api.storageUnitsWithQuantities(locationId, itemId));
            }
            storageUnitsFetcher.load(path_1.path.to.api.storageUnits(locationId));
        }
    }, [locationId, itemId]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f;
        if (itemId && ((_a = storageUnitsWithQuantitiesFetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            var storageUnitsWithQuantities = storageUnitsWithQuantitiesFetcher.data.data;
            var allStorageUnits = (_c = (_b = storageUnitsFetcher.data) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : [];
            var storageUnitIdsWithQuantities_1 = new Set(storageUnitsWithQuantities.map(function (s) { return s.id; }));
            var storageUnitsWithoutQuantities = allStorageUnits.filter(function (storageUnit) { return !storageUnitIdsWithQuantities_1.has(storageUnit.id); });
            return __spreadArray(__spreadArray([], storageUnitsWithQuantities.map(function (c) { return ({
                value: c.id,
                label: c.name,
                helper: "Qty: ".concat(c.quantity)
            }); }), true), storageUnitsWithoutQuantities.map(function (c) { return ({
                value: c.id,
                label: c.name
            }); }), true);
        }
        return ((_f = (_e = (_d = storageUnitsFetcher.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.map(function (c) { return (__assign({ value: c.id, label: c.name }, (c.quantity !== undefined && { helper: "Qty: ".concat(c.quantity) }))); })) !== null && _f !== void 0 ? _f : []);
    }, [
        storageUnitsFetcher.data,
        storageUnitsWithQuantitiesFetcher.data,
        itemId
    ]);
    return { options: options, data: storageUnitsFetcher.data };
}
/**
 * Per-unit on-hand quantities for `itemId`, keyed by storage-unit id. Only
 * fetches when both ids are present, so item-less pickers don't pay for it.
 */
function useStorageUnitQuantities(locationId, itemId) {
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: fetcher identity changes every render
    (0, react_2.useEffect)(function () {
        if (locationId && itemId) {
            fetcher.load(path_1.path.to.api.storageUnitsWithQuantities(locationId, itemId));
        }
    }, [locationId, itemId]);
    return (0, react_2.useMemo)(function () {
        var _a, _b;
        var m = new Map();
        for (var _i = 0, _c = (_b = (_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
            var s = _c[_i];
            m.set(s.id, s.quantity);
        }
        return m;
    }, [fetcher.data]);
}
/**
 * Options for the leaf bins in a location (nodes with no children — the
 * storable locations). `helper` shows the on-hand quantity when `itemId` is
 * given, otherwise the hierarchy path to disambiguate same-named bins.
 */
function useStorageUnitLeafOptions(locationId, itemId) {
    var rows = useStorageUnitsTree(locationId);
    var quantities = useStorageUnitQuantities(locationId, itemId);
    return (0, react_2.useMemo)(function () {
        var byId = new Map(rows.map(function (r) { return [r.id, r]; }));
        var parentIds = new Set(rows.map(function (r) { return r.parentId; }).filter(function (id) { return Boolean(id); }));
        return rows
            .filter(function (r) { return !parentIds.has(r.id); })
            .map(function (r) {
            var _a, _b;
            var ancestorPath = ((_a = r.ancestorPath) !== null && _a !== void 0 ? _a : [])
                .slice(0, -1)
                .map(function (id) { var _a; return (_a = byId.get(id)) === null || _a === void 0 ? void 0 : _a.name; })
                .filter(Boolean)
                .join(" / ");
            return {
                value: r.id,
                label: r.name,
                helper: itemId
                    ? "Qty: ".concat((_b = quantities.get(r.id)) !== null && _b !== void 0 ? _b : 0)
                    : ancestorPath || undefined
            };
        })
            .sort(function (a, b) { return a.label.localeCompare(b.label); });
    }, [rows, quantities, itemId]);
}
// ---------------------------------------------------------------------------
// Create-new-unit flow
// ---------------------------------------------------------------------------
/**
 * Shared "+ New storage unit" flow. `onCreateOption` seeds the form with the
 * typed text; closing the modal re-clicks the trigger so the combobox reopens
 * with the freshly created unit selectable.
 */
function useNewStorageUnitModal(locationId) {
    var modal = (0, react_1.useDisclosure)();
    var _a = (0, react_2.useState)(""), created = _a[0], setCreated = _a[1];
    var triggerRef = (0, react_2.useRef)(null);
    var node = modal.isOpen && locationId ? (<StorageUnitForm_1.default type="modal" locationId={locationId} onClose={function () {
            var _a;
            setCreated("");
            modal.onClose();
            (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }} initialValues={{ name: created, locationId: locationId, storageTypeIds: [] }}/>) : null;
    var onCreateOption = function (value) {
        setCreated(value);
        modal.onOpen();
    };
    return { triggerRef: triggerRef, onCreateOption: onCreateOption, node: node };
}
var storageUnitPreview = function (value, options) {
    var _a;
    var match = options.find(function (o) { return o.value === value; });
    return <span className="text-sm">{(_a = match === null || match === void 0 ? void 0 : match.label) !== null && _a !== void 0 ? _a : ""}</span>;
};
var labelToString = function (label) {
    return typeof label === "string" ? label : "";
};
var toListItem = function (id, options) {
    var _a, _b;
    return ({
        id: id,
        name: labelToString((_b = (_a = options.find(function (o) { return o.value === id; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "")
    });
};
function StorageUnit(_a) {
    var name = _a.name, value = _a.value, label = _a.label, helperText = _a.helperText, _b = _a.placeholder, placeholder = _b === void 0 ? "Select storage unit" : _b, isReadOnly = _a.isReadOnly, isOptional = _a.isOptional, disabled = _a.disabled, className = _a.className, onClick = _a.onClick, locationId = _a.locationId, itemId = _a.itemId, inline = _a.inline, _c = _a.allowCreate, allowCreate = _c === void 0 ? true : _c, onChange = _a.onChange;
    var options = useStorageUnitLeafOptions(locationId, itemId);
    var _d = useNewStorageUnitModal(locationId), triggerRef = _d.triggerRef, onCreateOption = _d.onCreateOption, node = _d.node;
    var readOnly = isReadOnly || disabled;
    if (name) {
        return (<>
        <form_1.CreatableCombobox ref={triggerRef} name={name} value={value !== null && value !== void 0 ? value : undefined} options={options} label={label !== null && label !== void 0 ? label : "Storage Unit"} helperText={helperText} placeholder={placeholder} isReadOnly={readOnly} isOptional={isOptional} className={className} onClick={onClick} inline={inline ? storageUnitPreview : undefined} onCreateOption={allowCreate ? onCreateOption : undefined} onChange={function (option) {
                return onChange === null || onChange === void 0 ? void 0 : onChange(option
                    ? { id: option.value, name: labelToString(option.label) }
                    : null);
            }}/>
        {node}
      </>);
    }
    if (!locationId)
        return null;
    return (<>
      <react_1.CreatableCombobox ref={triggerRef} options={options} value={value !== null && value !== void 0 ? value : undefined} isReadOnly={readOnly} isClearable placeholder={placeholder} className={className} onClick={onClick} onCreateOption={allowCreate ? onCreateOption : undefined} onChange={function (selected) {
            return onChange === null || onChange === void 0 ? void 0 : onChange(selected ? toListItem(selected, options) : null);
        }}/>
      {node}
    </>);
}
StorageUnit.displayName = "StorageUnit";
exports.default = StorageUnit;
