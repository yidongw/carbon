"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var data_1 = require("@emoji-mart/data");
var react_2 = require("@emoji-mart/react");
var react_3 = require("react");
var lu_1 = require("react-icons/lu");
var EmojiPicker = function (_a) {
    var name = _a.name;
    var error = (0, form_1.useField)(name).error;
    var _b = (0, form_1.useControlField)(name), value = _b[0], setValue = _b[1];
    var _c = (0, react_3.useState)(false), open = _c[0], setOpen = _c[1];
    var mode = (0, react_1.useMode)();
    var pickerTheme = mode;
    var onEmojiSelect = function (emoji) {
        setValue(emoji.native);
        setOpen(false);
    };
    var onRemove = function () {
        setValue("");
        setOpen(false);
    };
    return (<react_1.FormControl>
      <input type="hidden" name={name} value={value !== null && value !== void 0 ? value : ""}/>
      <react_1.Popover open={open} onOpenChange={setOpen}>
        <react_1.PopoverTrigger asChild>
          {value ? (<button type="button" className="inline-flex items-center justify-center rounded-md h-16 w-16 text-5xl hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              {value}
            </button>) : (<div>
              <react_1.Button type="button" variant="ghost" leftIcon={<lu_1.LuSmilePlus />}>
                Add icon
              </react_1.Button>
            </div>)}
        </react_1.PopoverTrigger>
        <react_1.PopoverContent className="w-auto p-0 border-0" align="start" sideOffset={8}>
          <react_2.default data={data_1.default} onEmojiSelect={onEmojiSelect} theme={pickerTheme} previewPosition="none" skinTonePosition="none" navPosition="bottom" perLine={8}/>
          {value && (<react_1.PopoverFooter className="flex justify-center">
              <react_1.Button variant="destructive" onClick={onRemove} leftIcon={<lu_1.LuTrash className="h-4 w-4 mr-2"/>}>
                Remove icon
              </react_1.Button>
            </react_1.PopoverFooter>)}
        </react_1.PopoverContent>
      </react_1.Popover>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = EmojiPicker;
