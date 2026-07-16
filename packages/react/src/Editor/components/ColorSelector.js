"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorSelector = void 0;
var tiptap_1 = require("@carbon/tiptap");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var Button_1 = require("../../Button");
var Popover_1 = require("../../Popover");
var TEXT_COLORS = [
    {
        name: "Default",
        color: "var(--novel-black)"
    },
    {
        name: "Purple",
        color: "#9333EA"
    },
    {
        name: "Red",
        color: "#E00000"
    },
    {
        name: "Yellow",
        color: "#EAB308"
    },
    {
        name: "Blue",
        color: "#2563EB"
    },
    {
        name: "Green",
        color: "#008A00"
    },
    {
        name: "Orange",
        color: "#FFA500"
    },
    {
        name: "Pink",
        color: "#BA4081"
    },
    {
        name: "Gray",
        color: "#A8A29E"
    }
];
var HIGHLIGHT_COLORS = [
    {
        name: "Default",
        color: "var(--novel-highlight-default)"
    },
    {
        name: "Purple",
        color: "var(--novel-highlight-purple)"
    },
    {
        name: "Red",
        color: "var(--novel-highlight-red)"
    },
    {
        name: "Yellow",
        color: "var(--novel-highlight-yellow)"
    },
    {
        name: "Blue",
        color: "var(--novel-highlight-blue)"
    },
    {
        name: "Green",
        color: "var(--novel-highlight-green)"
    },
    {
        name: "Orange",
        color: "var(--novel-highlight-orange)"
    },
    {
        name: "Pink",
        color: "var(--novel-highlight-pink)"
    },
    {
        name: "Gray",
        color: "var(--novel-highlight-gray)"
    }
];
var ColorSelector = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var editor = (0, tiptap_1.useEditor)().editor;
    if (!editor)
        return null;
    var activeColorItem = TEXT_COLORS.find(function (_a) {
        var color = _a.color;
        return editor.isActive("textStyle", { color: color });
    });
    var activeHighlightItem = HIGHLIGHT_COLORS.find(function (_a) {
        var color = _a.color;
        return editor.isActive("highlight", { color: color });
    });
    return (<Popover_1.Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <Popover_1.PopoverTrigger asChild>
        <Button_1.Button variant="ghost" rightIcon={<lu_1.LuChevronDown className="h-4 w-4"/>} style={{
            color: activeColorItem === null || activeColorItem === void 0 ? void 0 : activeColorItem.color,
            backgroundColor: activeHighlightItem === null || activeHighlightItem === void 0 ? void 0 : activeHighlightItem.color
        }}>
          <ri_1.RiPaintFill />
        </Button_1.Button>
      </Popover_1.PopoverTrigger>

      <Popover_1.PopoverContent sideOffset={5} className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl " align="start">
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-medium text-muted-foreground">
            Color
          </div>
          {TEXT_COLORS.map(function (_a, index) {
            var name = _a.name, color = _a.color;
            return (<tiptap_1.EditorBubbleItem key={index} onSelect={function () {
                    editor.commands.unsetColor();
                    name !== "Default" &&
                        editor
                            .chain()
                            .focus()
                            .setColor(color || "")
                            .run();
                }} className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent">
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2 py-px font-medium" style={{ color: color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </tiptap_1.EditorBubbleItem>);
        })}
        </div>
        <div>
          <div className="my-1 px-2 text-sm font-medium text-muted-foreground">
            Background
          </div>
          {HIGHLIGHT_COLORS.map(function (_a, index) {
            var name = _a.name, color = _a.color;
            return (<tiptap_1.EditorBubbleItem key={index} onSelect={function () {
                    editor.commands.unsetHighlight();
                    name !== "Default" && editor.commands.setHighlight({ color: color });
                }} className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent">
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2 py-px font-medium" style={{ backgroundColor: color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
              {editor.isActive("highlight", { color: color }) && (<lu_1.LuCheck className="h-4 w-4"/>)}
            </tiptap_1.EditorBubbleItem>);
        })}
        </div>
      </Popover_1.PopoverContent>
    </Popover_1.Popover>);
};
exports.ColorSelector = ColorSelector;
