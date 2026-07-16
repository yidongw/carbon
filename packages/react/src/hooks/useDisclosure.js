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
exports.default = useDisclosure;
var react_1 = require("react");
var useCallbackRef_1 = require("./useCallbackRef");
/**
 * `useDisclosure` is a custom hook used to help handle common open, close, or toggle scenarios.
 * It can be used to control feedback component such as `Modal`, `AlertDialog`, `Drawer`, etc.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-disclosure
 */
function useDisclosure(props) {
    if (props === void 0) { props = {}; }
    var onCloseProp = props.onClose, onOpenProp = props.onOpen, isOpenProp = props.isOpen, idProp = props.id;
    var handleOpen = (0, useCallbackRef_1.default)(onOpenProp);
    var handleClose = (0, useCallbackRef_1.default)(onCloseProp);
    var _a = (0, react_1.useState)(props.defaultIsOpen || false), isOpenState = _a[0], setIsOpen = _a[1];
    var isOpen = isOpenProp !== undefined ? isOpenProp : isOpenState;
    var isControlled = isOpenProp !== undefined;
    var uid = (0, react_1.useId)();
    var id = idProp !== null && idProp !== void 0 ? idProp : "disclosure-".concat(uid);
    var onClose = (0, react_1.useCallback)(function () {
        if (!isControlled) {
            setIsOpen(false);
        }
        handleClose === null || handleClose === void 0 ? void 0 : handleClose();
    }, [isControlled, handleClose]);
    var onOpen = (0, react_1.useCallback)(function () {
        if (!isControlled) {
            setIsOpen(true);
        }
        handleOpen === null || handleOpen === void 0 ? void 0 : handleOpen();
    }, [isControlled, handleOpen]);
    var onToggle = (0, react_1.useCallback)(function () {
        if (isOpen) {
            onClose();
        }
        else {
            onOpen();
        }
    }, [isOpen, onOpen, onClose]);
    function getButtonProps(props) {
        if (props === void 0) { props = {}; }
        return __assign(__assign({}, props), { "aria-expanded": isOpen, "aria-controls": id, onClick: function (event) {
                var _a;
                (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
                onToggle();
            } });
    }
    function getDisclosureProps(props) {
        if (props === void 0) { props = {}; }
        return __assign(__assign({}, props), { hidden: !isOpen, id: id });
    }
    return {
        isOpen: isOpen,
        onOpen: onOpen,
        onClose: onClose,
        onToggle: onToggle,
        isControlled: isControlled,
        getButtonProps: getButtonProps,
        getDisclosureProps: getDisclosureProps
    };
}
