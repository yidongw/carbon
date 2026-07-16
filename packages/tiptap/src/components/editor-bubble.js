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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorBubble = void 0;
var react_1 = require("@tiptap/react");
var react_2 = require("react");
exports.EditorBubble = (0, react_2.forwardRef)(function (_a, ref) {
    var children = _a.children, tippyOptions = _a.tippyOptions, rest = __rest(_a, ["children", "tippyOptions"]);
    var currentEditor = (0, react_1.useCurrentEditor)().editor;
    var instanceRef = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        var _a;
        if (!instanceRef.current || !(tippyOptions === null || tippyOptions === void 0 ? void 0 : tippyOptions.placement))
            return;
        instanceRef.current.setProps({ placement: tippyOptions.placement });
        (_a = instanceRef.current.popperInstance) === null || _a === void 0 ? void 0 : _a.update();
    }, [tippyOptions === null || tippyOptions === void 0 ? void 0 : tippyOptions.placement]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var bubbleMenuProps = (0, react_2.useMemo)(function () {
        var shouldShow = function (_a) {
            var editor = _a.editor, state = _a.state;
            var selection = state.selection;
            var empty = selection.empty;
            // don't show bubble menu if:
            // - the editor is not editable
            // - the selected node is an image
            // - the selection is empty
            // - the selection is a node selection (for drag handles)
            if (!editor.isEditable ||
                editor.isActive("image") ||
                empty ||
                (0, react_1.isNodeSelection)(selection)) {
                return false;
            }
            return true;
        };
        return __assign({ shouldShow: shouldShow, tippyOptions: __assign({ onCreate: function (val) {
                    var _a;
                    instanceRef.current = val;
                    (_a = instanceRef.current.popper.firstChild) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    });
                }, moveTransition: "transform 0.15s ease-out" }, tippyOptions), editor: currentEditor }, rest);
        // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    }, [rest, tippyOptions]);
    if (!currentEditor)
        return null;
    return (
    // We need to add this because of https://github.com/ueberdosis/tiptap/issues/2658
    <div ref={ref}>
        <react_1.BubbleMenu {...bubbleMenuProps}>{children}</react_1.BubbleMenu>
      </div>);
});
exports.EditorBubble.displayName = "EditorBubble";
exports.default = exports.EditorBubble;
