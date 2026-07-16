"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkSelector = void 0;
exports.isValidUrl = isValidUrl;
exports.getUrlFromString = getUrlFromString;
var tiptap_1 = require("@carbon/tiptap");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var IconButton_1 = require("../../IconButton");
var Popover_1 = require("../../Popover");
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    }
    catch (e) {
        return false;
    }
}
function getUrlFromString(str) {
    if (isValidUrl(str))
        return str;
    try {
        if (str.includes(".") && !str.includes(" ")) {
            return new URL("https://".concat(str)).toString();
        }
        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    }
    catch (e) {
        return null;
    }
}
var LinkSelector = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var t = (0, macro_1.useLingui)().t;
    var inputRef = (0, react_1.useRef)(null);
    var editor = (0, tiptap_1.useEditor)().editor;
    // Autofocus on input by default
    (0, react_1.useEffect)(function () {
        var _a;
        inputRef.current && ((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus());
    });
    if (!editor)
        return null;
    return (<Popover_1.Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <Popover_1.PopoverTrigger asChild>
        <IconButton_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Link"], ["Link"])))} icon={<lu_1.LuLink />} variant="ghost"/>
      </Popover_1.PopoverTrigger>
      <Popover_1.PopoverContent align="start" className="w-60 p-0" sideOffset={10}>
        <form onSubmit={function (e) {
            var target = e.currentTarget;
            e.preventDefault();
            var input = target[0];
            var url = getUrlFromString(input.value);
            url && editor.chain().focus().setLink({ href: url }).run();
        }} className="flex  p-1 ">
          <input ref={inputRef} type="text" placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Paste a link"], ["Paste a link"])))} className="flex-1 bg-background p-1 text-sm outline-none" defaultValue={editor.getAttributes("link").href || ""}/>
          {editor.getAttributes("link").href ? (<IconButton_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Remove link"], ["Remove link"])))} icon={<lu_1.LuTrash className="h-4 w-4"/>} variant="secondary" type="button" className="flex h-8 items-center rounded-sm p-1 text-red-600 transition-colors hover:bg-red-100 dark:hover:bg-red-800" onClick={function () {
                editor.chain().focus().unsetLink().run();
            }}/>) : (<span className="h-8">
              <IconButton_1.IconButton icon={<lu_1.LuCheck />} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Linked"], ["Linked"])))}/>
            </span>)}
        </form>
      </Popover_1.PopoverContent>
    </Popover_1.Popover>);
};
exports.LinkSelector = LinkSelector;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
