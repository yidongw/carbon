"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Overlay_1 = require("~/components/Overlay");
var TagsPreview = function (value, options, maxPreview) {
    return (<react_1.HStack className="space-x-0 flex-grow gap-1 items-start">
      {maxPreview && value.length > maxPreview ? (<react_1.Badge variant="secondary" className="border dark:border-none dark:shadow-button-base">
          {value.length} tags
        </react_1.Badge>) : (value.map(function (label) { return (<react_1.Badge className="max-w-[160px] truncate border dark:border-none dark:shadow-button-base" key={label} variant="secondary">
            {label}
          </react_1.Badge>); }))}
    </react_1.HStack>);
};
var Tags = function (_a) {
    var _b;
    var table = _a.table, availableTags = _a.availableTags, props = __rest(_a, ["table", "availableTags"]);
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidator = (0, react_router_1.useRevalidator)();
    var _c = (0, form_1.useControlField)(props.name), value = _c[0], setValue = _c[1];
    var options = (0, react_2.useMemo)(function () {
        return availableTags.map(function (c) { return ({
            value: c.name,
            label: c.name
        }); });
    }, [availableTags]);
    return (<form_1.CreatableMultiSelect label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Tag"} options={options} {...props} inline={props.inline ? TagsPreview : undefined} inlineIcon={<lu_1.LuTags />} onCreateOption={function (option) {
            // Open the create-tag overlay, seeding the item type from this field
            // and the name from anything already typed.
            var name = option.trim();
            openOverlay(Overlay_1.overlay.to.newTag({ table: table }, name ? { name: name } : undefined), {
                // Once created, select the new tag onto this record (updates the
                // field and persists via onChange) and revalidate so the option
                // list picks it up.
                onSuccess: function (data) {
                    var _a;
                    var created = data === null || data === void 0 ? void 0 : data.name;
                    if (!created)
                        return;
                    var current = value !== null && value !== void 0 ? value : [];
                    if (current.includes(created))
                        return;
                    var next = __spreadArray(__spreadArray([], current, true), [created], false);
                    setValue(next);
                    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, next);
                },
                onCreated: function () { return revalidator.revalidate(); }
            });
        }}/>);
};
Tags.displayName = "Tags";
exports.default = Tags;
