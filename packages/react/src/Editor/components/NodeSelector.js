"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSelector = void 0;
var tiptap_1 = require("@carbon/tiptap");
var react_popover_1 = require("@radix-ui/react-popover");
var lu_1 = require("react-icons/lu");
var Button_1 = require("../../Button");
var Popover_1 = require("../../Popover");
var items = [
    {
        name: "Text",
        icon: lu_1.LuText,
        command: function (editor) { return editor.chain().focus().clearNodes().run(); },
        // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
        isActive: function (editor) {
            return editor.isActive("paragraph") &&
                !editor.isActive("bulletList") &&
                !editor.isActive("orderedList");
        }
    },
    {
        name: "Heading 1",
        icon: lu_1.LuHeading1,
        command: function (editor) {
            return editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run();
        },
        isActive: function (editor) { return editor.isActive("heading", { level: 1 }); }
    },
    {
        name: "Heading 2",
        icon: lu_1.LuHeading2,
        command: function (editor) {
            return editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run();
        },
        isActive: function (editor) { return editor.isActive("heading", { level: 2 }); }
    },
    {
        name: "Heading 3",
        icon: lu_1.LuHeading3,
        command: function (editor) {
            return editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run();
        },
        isActive: function (editor) { return editor.isActive("heading", { level: 3 }); }
    },
    {
        name: "To-do List",
        icon: lu_1.LuSquareCheck,
        command: function (editor) {
            return editor.chain().focus().clearNodes().toggleTaskList().run();
        },
        isActive: function (editor) { return editor.isActive("taskItem"); }
    },
    {
        name: "Bullet List",
        icon: lu_1.LuListOrdered,
        command: function (editor) {
            return editor.chain().focus().clearNodes().toggleBulletList().run();
        },
        isActive: function (editor) { return editor.isActive("bulletList"); }
    },
    {
        name: "Numbered List",
        icon: lu_1.LuListOrdered,
        command: function (editor) {
            return editor.chain().focus().clearNodes().toggleOrderedList().run();
        },
        isActive: function (editor) { return editor.isActive("orderedList"); }
    }
    // {
    //   name: "Code",
    //   icon: LuCode,
    //   command: (editor) =>
    //     editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    //   isActive: (editor) => editor.isActive("codeBlock"),
    // },
];
var NodeSelector = function (_a) {
    var _b;
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var editor = (0, tiptap_1.useEditor)().editor;
    if (!editor)
        return null;
    var activeItem = (_b = items.filter(function (item) { return item.isActive(editor); }).pop()) !== null && _b !== void 0 ? _b : {
        name: "Multiple"
    };
    return (<react_popover_1.Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <Popover_1.PopoverTrigger asChild>
        <Button_1.Button variant="ghost" rightIcon={<lu_1.LuChevronDown />}>
          {activeItem.name}
        </Button_1.Button>
      </Popover_1.PopoverTrigger>
      <Popover_1.PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map(function (item, index) { return (<tiptap_1.EditorBubbleItem key={index} onSelect={function (editor) {
                item.command(editor);
                onOpenChange(false);
            }} className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent">
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">
                <item.icon className="h-3 w-3"/>
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <lu_1.LuCheck className="h-4 w-4"/>}
          </tiptap_1.EditorBubbleItem>); })}
      </Popover_1.PopoverContent>
    </react_popover_1.Popover>);
};
exports.NodeSelector = NodeSelector;
