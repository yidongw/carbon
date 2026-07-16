"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestionItems = void 0;
var tiptap_1 = require("@carbon/tiptap");
var lu_1 = require("react-icons/lu");
var getSuggestionItems = function (uploadFn) {
    return (0, tiptap_1.createSuggestionItems)([
        {
            title: "Text",
            description: "Just start typing with plain text.",
            searchTerms: ["p", "paragraph"],
            icon: <lu_1.LuText size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode("paragraph", "paragraph")
                    .run();
            }
        },
        {
            title: "To-do List",
            description: "Track tasks with a to-do list.",
            searchTerms: ["todo", "task", "list", "check", "checkbox"],
            icon: <lu_1.LuSquareCheck size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            }
        },
        {
            title: "Heading 1",
            description: "Big section heading.",
            searchTerms: ["title", "big", "large"],
            icon: <lu_1.LuHeading1 size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run();
            }
        },
        {
            title: "Heading 2",
            description: "Medium section heading.",
            searchTerms: ["subtitle", "medium"],
            icon: <lu_1.LuHeading2 size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run();
            }
        },
        {
            title: "Heading 3",
            description: "Small section heading.",
            searchTerms: ["subtitle", "small"],
            icon: <lu_1.LuHeading3 size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 3 })
                    .run();
            }
        },
        {
            title: "Bullet List",
            description: "Create a simple bullet list.",
            searchTerms: ["unordered", "point"],
            icon: <lu_1.LuList size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            }
        },
        {
            title: "Numbered List",
            description: "Create a list with numbering.",
            searchTerms: ["ordered"],
            icon: <lu_1.LuListOrdered size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            }
        },
        // {
        //   title: "Code",
        //   description: "Capture a code snippet.",
        //   searchTerms: ["codeblock"],
        //   icon: <LuCode size={18} />,
        //   command: ({ editor, range }) =>
        //     editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
        // },
        {
            title: "Image",
            description: "Upload an image from your computer.",
            searchTerms: ["photo", "picture", "media"],
            icon: <lu_1.LuImage size={18}/>,
            command: function (_a) {
                var editor = _a.editor, range = _a.range;
                editor.chain().focus().deleteRange(range).run();
                // upload image
                var input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var file, pos;
                    var _a;
                    return __generator(this, function (_b) {
                        if ((_a = input.files) === null || _a === void 0 ? void 0 : _a.length) {
                            file = input.files[0];
                            pos = editor.view.state.selection.from;
                            uploadFn(file, editor.view, pos);
                        }
                        return [2 /*return*/];
                    });
                }); };
                input.click();
            }
        }
    ]);
};
exports.getSuggestionItems = getSuggestionItems;
