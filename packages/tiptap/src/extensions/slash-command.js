"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderItems = exports.Command = exports.handleCommandNavigation = exports.createSuggestionItems = void 0;
var core_1 = require("@tiptap/core");
var react_1 = require("@tiptap/react");
var suggestion_1 = require("@tiptap/suggestion");
var tippy_js_1 = require("tippy.js");
var editor_command_1 = require("../components/editor-command");
var Command = core_1.Extension.create({
    name: "slash-command",
    addOptions: function () {
        return {
            suggestion: {
                char: "/",
                command: function (_a) {
                    var editor = _a.editor, range = _a.range, props = _a.props;
                    props.command({ editor: editor, range: range });
                }
            }
        };
    },
    addProseMirrorPlugins: function () {
        return [
            (0, suggestion_1.default)(__assign(__assign({}, this.options.suggestion), { editor: this.editor }))
        ];
    }
});
exports.Command = Command;
var renderItems = function (elementRef) {
    var component = null;
    var popup = null;
    return {
        onStart: function (props) {
            component = new react_1.ReactRenderer(editor_command_1.EditorCommandOut, {
                props: props,
                editor: props.editor
            });
            var selection = props.editor.state.selection;
            var parentNode = selection.$from.node(selection.$from.depth);
            var blockType = parentNode.type.name;
            if (blockType === "codeBlock") {
                return false;
            }
            // @ts-expect-error
            popup = (0, tippy_js_1.default)("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: function () { return (elementRef ? elementRef.current : document.body); },
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start"
            });
        },
        onUpdate: function (props) {
            var _a;
            component === null || component === void 0 ? void 0 : component.updateProps(props);
            (_a = popup === null || popup === void 0 ? void 0 : popup[0]) === null || _a === void 0 ? void 0 : _a.setProps({
                getReferenceClientRect: props.clientRect
            });
        },
        onKeyDown: function (props) {
            var _a, _b;
            if (props.event.key === "Escape") {
                (_a = popup === null || popup === void 0 ? void 0 : popup[0]) === null || _a === void 0 ? void 0 : _a.hide();
                return true;
            }
            // @ts-expect-error
            return (_b = component === null || component === void 0 ? void 0 : component.ref) === null || _b === void 0 ? void 0 : _b.onKeyDown(props);
        },
        onExit: function () {
            var _a;
            (_a = popup === null || popup === void 0 ? void 0 : popup[0]) === null || _a === void 0 ? void 0 : _a.destroy();
            component === null || component === void 0 ? void 0 : component.destroy();
        }
    };
};
exports.renderItems = renderItems;
var createSuggestionItems = function (items) { return items; };
exports.createSuggestionItems = createSuggestionItems;
var handleCommandNavigation = function (event) {
    if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
        var slashCommand = document.querySelector("#slash-command");
        if (slashCommand) {
            return true;
        }
    }
};
exports.handleCommandNavigation = handleCommandNavigation;
