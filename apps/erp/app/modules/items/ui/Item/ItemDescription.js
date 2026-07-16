"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var zod_1 = require("zod");
var descriptionValidator = zod_1.z.object({
    description: zod_1.z.string().optional()
});
/**
 * Inline long description for item Properties panels. Textarea-based so the
 * multi-line content reads naturally: while not editing it shows a clamped
 * preview (line-clamp-3) that reveals the full text on hover via
 * TruncatedTooltipText; clicking the edit button swaps in a textarea that
 * persists onBlur through the same bulkUpdateItems path. Controlled `value`
 * keeps the field in sync (no stale text).
 */
var ItemDescription = function (_a) {
    var value = _a.value, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(false), isEditing = _b[0], setIsEditing = _b[1];
    if (isEditing) {
        return (<form_1.ValidatedForm defaultValues={{ description: value !== null && value !== void 0 ? value : undefined }} validator={descriptionValidator} className="w-full">
        <form_1.TextAreaControlled autoFocus label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Long Description"], ["Long Description"])))} name="description" rows={3} value={value !== null && value !== void 0 ? value : ""} onBlur={function (e) {
                var _a;
                onChange((_a = e.target.value) !== null && _a !== void 0 ? _a : null);
                setIsEditing(false);
            }} className="text-muted-foreground"/>
      </form_1.ValidatedForm>);
    }
    return (<react_1.VStack spacing={1} className="w-full">
      <span className="text-xs text-muted-foreground">{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Long Description"], ["Long Description"])))}</span>
      <react_1.HStack spacing={0} className="w-full justify-between items-start">
        {value && (<react_1.TruncatedTooltipText className="flex-grow text-sm line-clamp-3 text-muted-foreground" tooltip={value}>
            {value}
          </react_1.TruncatedTooltipText>)}
        <react_1.IconButton icon={value ? <lu_1.LuSettings2 /> : <lu_1.LuPlus />} aria-label={value ? "Edit" : "Add"} size="sm" variant="secondary" onClick={function () { return setIsEditing(true); }}/>
      </react_1.HStack>
    </react_1.VStack>);
};
exports.default = ItemDescription;
var templateObject_1, templateObject_2;
