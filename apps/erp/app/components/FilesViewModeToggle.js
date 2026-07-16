"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILES_VIEW_MODE_KEY = void 0;
exports.normalizeFilesViewMode = normalizeFilesViewMode;
exports.useFilesViewMode = useFilesViewMode;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var FILES_VIEW_MODE_KEY = "carbon:files-view-mode";
exports.FILES_VIEW_MODE_KEY = FILES_VIEW_MODE_KEY;
function normalizeFilesViewMode(value) {
    if (value === "icons" || value === "gallery")
        return "icons";
    return "list";
}
function useFilesViewMode() {
    var _a = (0, react_1.useLocalStorage)(FILES_VIEW_MODE_KEY, "list"), stored = _a[0], setStored = _a[1];
    var viewMode = normalizeFilesViewMode(stored);
    var setViewMode = (0, react_2.useCallback)(function (mode) { return setStored(mode); }, [setStored]);
    return [viewMode, setViewMode];
}
var FilesViewModeToggle = function (_a) {
    var value = _a.value, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.ToggleGroup type="single" value={value} onValueChange={function (next) {
            if (next === "list" || next === "icons") {
                onChange(next);
            }
        }} size="sm">
      <react_1.ToggleGroupItem value="list" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["List view"], ["List view"])))}>
        <lu_1.LuList className="h-4 w-4"/>
        <span className="sr-only">
          <macro_1.Trans>List</macro_1.Trans>
        </span>
      </react_1.ToggleGroupItem>
      <react_1.ToggleGroupItem value="icons" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Icon view"], ["Icon view"])))}>
        <lu_1.LuLayoutGrid className="h-4 w-4"/>
        <span className="sr-only">
          <macro_1.Trans>Icons</macro_1.Trans>
        </span>
      </react_1.ToggleGroupItem>
    </react_1.ToggleGroup>);
};
exports.default = FilesViewModeToggle;
var templateObject_1, templateObject_2;
