"use strict";
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
exports.Popover = Popover;
var react_1 = require("react");
var hooks_1 = require("../../hooks");
function Popover(props) {
    var ref = (0, react_1.useRef)();
    var _a = props.popoverRef, popoverRef = _a === void 0 ? ref : _a, onClose = props.onClose, children = props.children, rest = __rest(props, ["popoverRef", "onClose", "children"]);
    (0, hooks_1.useEscape)(onClose);
    (0, hooks_1.useOutsideClick)({
        ref: popoverRef,
        handler: onClose
    });
    return (<div {...rest} className="absolute rounded-md z-[10] top-[100%] shadow-lg mt-1 p-6 outline-none bg-popover">
      {children}
    </div>);
}
