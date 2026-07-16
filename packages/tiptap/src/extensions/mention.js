"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mention = void 0;
exports.createMentionSuggestion = createMentionSuggestion;
exports.createMentionExtension = createMentionExtension;
var extension_mention_1 = require("@tiptap/extension-mention");
exports.Mention = extension_mention_1.default;
var react_1 = require("@tiptap/react");
var tippy_js_1 = require("tippy.js");
var mention_list_1 = require("../components/mention-list");
function createMentionSuggestion(_a) {
    var char = _a.char, items = _a.items, elementRef = _a.elementRef;
    return {
        char: char,
        items: function (_a) {
            var query = _a.query;
            var itemList = typeof items === "function" ? items() : items;
            return itemList.filter(function (item) {
                return item.label.toLowerCase().startsWith(query.toLowerCase());
            });
        },
        render: function () {
            var component = null;
            var popup = null;
            return {
                onStart: function (props) {
                    component = new react_1.ReactRenderer(mention_list_1.MentionList, {
                        props: props,
                        editor: props.editor
                    });
                    if (!props.clientRect) {
                        return;
                    }
                    popup = (0, tippy_js_1.default)("body", {
                        getReferenceClientRect: props.clientRect,
                        appendTo: function () { var _a; return (_a = elementRef === null || elementRef === void 0 ? void 0 : elementRef.current) !== null && _a !== void 0 ? _a : document.body; },
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
                    if (!props.clientRect) {
                        return;
                    }
                    (_a = popup === null || popup === void 0 ? void 0 : popup[0]) === null || _a === void 0 ? void 0 : _a.setProps({
                        getReferenceClientRect: props.clientRect
                    });
                },
                onKeyDown: function (props) {
                    var _a, _b, _c;
                    if (props.event.key === "Escape") {
                        (_a = popup === null || popup === void 0 ? void 0 : popup[0]) === null || _a === void 0 ? void 0 : _a.hide();
                        return true;
                    }
                    return (_c = (_b = component === null || component === void 0 ? void 0 : component.ref) === null || _b === void 0 ? void 0 : _b.onKeyDown(props)) !== null && _c !== void 0 ? _c : false;
                },
                onExit: function () {
                    var _a;
                    (_a = popup === null || popup === void 0 ? void 0 : popup[0]) === null || _a === void 0 ? void 0 : _a.destroy();
                    component === null || component === void 0 ? void 0 : component.destroy();
                }
            };
        }
    };
}
/**
 * Creates a configured mention extension for a specific type of mention.
 *
 * @example
 * // Create an items mention with @ trigger
 * const ItemMention = createMentionExtension({
 *   name: "item-mention",
 *   char: "@",
 *   items: [
 *     { id: "1", label: "Widget A" },
 *     { id: "2", label: "Widget B" },
 *   ],
 * });
 *
 * @example
 * // Create a customer mention with # trigger
 * const CustomerMention = createMentionExtension({
 *   name: "customer-mention",
 *   char: "#",
 *   items: [
 *     { id: "c1", label: "Acme Corp" },
 *     { id: "c2", label: "Global Inc" },
 *   ],
 * });
 */
function createMentionExtension(_a) {
    var name = _a.name, char = _a.char, items = _a.items, elementRef = _a.elementRef;
    return extension_mention_1.default.configure({
        HTMLAttributes: {
            class: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400",
            "data-mention-type": name
        },
        suggestion: createMentionSuggestion({ char: char, items: items, elementRef: elementRef })
    }).extend({
        name: name
    });
}
