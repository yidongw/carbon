"use strict";
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
exports.TagsCell = TagsCell;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Overlay_1 = require("~/components/Overlay");
var path_1 = require("~/utils/path");
var useSynced_1 = require("./useSynced");
function TagsPreview(value) {
    return (<react_1.HStack className="space-x-0 flex-grow gap-1 items-start">
      {value.map(function (label) { return (<react_1.Badge key={label} className="max-w-[160px] truncate border dark:border-none dark:shadow-button-base" variant="secondary">
          {label}
        </react_1.Badge>); })}
    </react_1.HStack>);
}
// Item sub-tables (part/tool/material/…) have no separate readableId column —
// their PK `id` IS the readable id, so the tags action's `.in("id", ...)` must be
// fed the row's readableId. Every other entity (customer, supplier, job, …) has a
// UUID `id` PK (readableId, if present, is a distinct display column), so those
// must be fed the row's `id`. Matches how the detail-page tag editors submit.
var READABLE_ID_TABLES = new Set([
    "part",
    "tool",
    "material",
    "consumable",
    "service",
    "fixture"
]);
/**
 * Inline tags editor for a table row. Mirrors the detail-page <Tags> field: a
 * badge preview plus a picker that adds/removes tags and can create a new tag via
 * the shared overlay. Persists to the shared tags action (keyed by the row id +
 * table), which is separate from the module bulk-update action.
 */
function TagsCell(_a) {
    var _b;
    var row = _a.row, table = _a.table, availableTags = _a.availableTags;
    var fetcher = (0, react_router_1.useFetcher)();
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidator = (0, react_router_1.useRevalidator)();
    var _c = (0, useSynced_1.useSynced)((_b = row.tags) !== null && _b !== void 0 ? _b : []), value = _c[0], setValue = _c[1];
    var options = (0, react_2.useMemo)(function () { return availableTags.map(function (t) { return ({ value: t.name, label: t.name }); }); }, [availableTags]);
    var submit = function (next) {
        var _a, _b;
        setValue(next);
        var formData = new FormData();
        var rowId = READABLE_ID_TABLES.has(table)
            ? ((_a = row.readableId) !== null && _a !== void 0 ? _a : row.id)
            : ((_b = row.id) !== null && _b !== void 0 ? _b : row.readableId);
        formData.append("ids", rowId !== null && rowId !== void 0 ? rowId : "");
        formData.append("table", table);
        next.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, { method: "post", action: path_1.path.to.tags });
    };
    return (<react_1.CreatableMultiSelect value={value} options={options} inline={function (v) { return TagsPreview(v); }} inlineIcon={<lu_1.LuTags />} onChange={submit} onCreateOption={function (input) {
            var name = input.trim();
            openOverlay(Overlay_1.overlay.to.newTag({ table: table }, name ? { name: name } : undefined), {
                onSuccess: function (data) {
                    var created = data === null || data === void 0 ? void 0 : data.name;
                    if (!created || value.includes(created))
                        return;
                    submit(__spreadArray(__spreadArray([], value, true), [created], false));
                },
                onCreated: function () { return revalidator.revalidate(); }
            });
        }}/>);
}
