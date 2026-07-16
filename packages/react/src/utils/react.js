"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactNodeToString = void 0;
exports.getValidChildren = getValidChildren;
exports.assignRef = assignRef;
exports.mergeRefs = mergeRefs;
var react_1 = require("react");
/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
function getValidChildren(children) {
    return react_1.Children.toArray(children).filter(function (child) {
        return (0, react_1.isValidElement)(child);
    });
}
var reactNodeToString = function (reactNode) {
    var string = "";
    if (typeof reactNode === "string") {
        string = reactNode;
    }
    else if (typeof reactNode === "number") {
        string = reactNode.toString();
    }
    else if (reactNode instanceof Array) {
        reactNode.forEach(function (child) {
            string += (0, exports.reactNodeToString)(child);
        });
    }
    else if ((0, react_1.isValidElement)(reactNode)) {
        if (reactNode.props.value) {
            // for Enumerable component
            string += reactNode.props.value;
        }
        else if (reactNode.props.status) {
            // for Status components
            string += reactNode.props.status;
        }
        else {
            string += (0, exports.reactNodeToString)(reactNode.props.children);
        }
    }
    return string;
};
exports.reactNodeToString = reactNodeToString;
function assignRef(ref, value) {
    if (ref == null)
        return;
    if (typeof ref === "function") {
        ref(value);
        return;
    }
    try {
        ref.current = value;
        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    }
    catch (error) {
        throw new Error("Cannot assign value '".concat(value, "' to ref '").concat(ref, "'"));
    }
}
function mergeRefs() {
    var refs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        refs[_i] = arguments[_i];
    }
    return function (node) {
        refs.forEach(function (ref) {
            assignRef(ref, node);
        });
    };
}
