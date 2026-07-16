"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuggestionDetails;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var data_1 = require("@emoji-mart/data");
var react_2 = require("@emoji-mart/react");
var macro_1 = require("@lingui/react/macro");
var react_3 = require("react");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var useTags_1 = require("~/hooks/useTags");
var path_1 = require("~/utils/path");
function SuggestionDetails(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var suggestion = _a.suggestion, tags = _a.tags;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var fetcher = (0, react_router_1.useFetcher)();
    var _l = (0, react_3.useState)(false), emojiPickerOpen = _l[0], setEmojiPickerOpen = _l[1];
    var mode = (0, react_1.useMode)();
    var pickerTheme = mode;
    var onUpdateTags = (0, useTags_1.useTags)({
        id: (_b = suggestion.id) !== null && _b !== void 0 ? _b : "",
        table: "suggestion"
    }).onUpdateTags;
    var onUpdateEmoji = (0, react_3.useCallback)(function (emojiData) {
        if (!suggestion.id)
            return;
        var formData = new FormData();
        formData.append("emoji", emojiData.native);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.suggestion(suggestion.id)
        });
        setEmojiPickerOpen(false);
    }, [suggestion.id, fetcher]);
    // Use optimistic emoji value
    var currentEmoji = (_f = (_e = (_d = (_c = fetcher.formData) === null || _c === void 0 ? void 0 : _c.get("emoji")) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : suggestion.emoji) !== null && _f !== void 0 ? _f : "💡";
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>Suggestion</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody>
          <react_1.VStack spacing={4}>
            <react_1.VStack spacing={2} className="w-full">
              <h3 className="text-xs text-muted-foreground">
                <macro_1.Trans>Emoji</macro_1.Trans>
              </h3>
              <react_1.Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                <react_1.PopoverTrigger asChild>
                  <button type="button" className="inline-flex items-center justify-center rounded-md h-12 w-12 text-3xl hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {currentEmoji}
                  </button>
                </react_1.PopoverTrigger>
                <react_1.PopoverContent className="w-auto p-0 border-0" align="start" sideOffset={8}>
                  <react_2.default data={data_1.default} onEmojiSelect={onUpdateEmoji} theme={pickerTheme} previewPosition="none" skinTonePosition="none" navPosition="bottom" perLine={8}/>
                </react_1.PopoverContent>
              </react_1.Popover>
            </react_1.VStack>

            <react_1.VStack spacing={2} className="w-full">
              <h3 className="text-xs text-muted-foreground">
                <macro_1.Trans>Suggestion</macro_1.Trans>
              </h3>
              <div className="whitespace-pre-wrap text-sm">
                {suggestion.suggestion}
              </div>
            </react_1.VStack>

            <react_1.VStack spacing={2} className="w-full">
              <h3 className="text-xs text-muted-foreground">
                <macro_1.Trans>Submitted By</macro_1.Trans>
              </h3>
              <react_1.HStack spacing={2}>
                <react_1.Avatar size="sm" name={(_g = suggestion.employeeName) !== null && _g !== void 0 ? _g : undefined} src={(_h = suggestion.employeeAvatarUrl) !== null && _h !== void 0 ? _h : undefined}/>
                <span>{(_j = suggestion.employeeName) !== null && _j !== void 0 ? _j : "Anonymous"}</span>
              </react_1.HStack>
            </react_1.VStack>

            <react_1.VStack spacing={2} className="w-full">
              <h3 className="text-xs text-muted-foreground">
                <macro_1.Trans>Date</macro_1.Trans>
              </h3>
              <span>{formatDate(suggestion.createdAt)}</span>
            </react_1.VStack>

            <react_1.VStack spacing={2} className="w-full">
              <h3 className="text-xs text-muted-foreground">
                <macro_1.Trans>Path</macro_1.Trans>
              </h3>
              <span className="text-sm font-mono">{suggestion.path}</span>
            </react_1.VStack>

            {suggestion.attachmentPath && (<react_1.VStack spacing={2} className="w-full">
                <h3 className="text-xs text-muted-foreground">
                  <macro_1.Trans>Attachment</macro_1.Trans>
                </h3>
                <a href={"/file/preview/private/".concat(suggestion.attachmentPath)} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
                  <macro_1.Trans>View Attachment</macro_1.Trans>
                </a>
              </react_1.VStack>)}

            <form_1.ValidatedForm defaultValues={{
            tags: (_k = suggestion.tags) !== null && _k !== void 0 ? _k : []
        }} validator={zod_1.default.object({
            tags: zod_1.default.array(zod_1.default.string()).optional()
        })} className="w-full">
              <Form_1.Tags availableTags={tags} label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="suggestion" inline onChange={onUpdateTags}/>
            </form_1.ValidatedForm>
          </react_1.VStack>
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
var templateObject_1;
