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
exports.useModalDrawerType = exports.ModalDrawerTypeProvider = exports.ModalDrawerTypeContext = exports.ModalDrawerTitle = exports.ModalDrawerProvider = exports.ModalDrawerHeader = exports.ModalDrawerFooter = exports.ModalDrawerDescription = exports.ModalDrawerContent = exports.ModalDrawerBody = exports.ModalDrawer = void 0;
var react_1 = require("react");
var Drawer_1 = require("./Drawer");
var Modal_1 = require("./Modal");
var ModalDrawerTypeContext = (0, react_1.createContext)("drawer");
exports.ModalDrawerTypeContext = ModalDrawerTypeContext;
var ModalDrawerTypeProvider = ModalDrawerTypeContext.Provider;
exports.ModalDrawerTypeProvider = ModalDrawerTypeProvider;
var ModalDrawerProvider = function (_a) {
    var _b = _a.type, type = _b === void 0 ? "drawer" : _b, props = __rest(_a, ["type"]);
    return <ModalDrawerTypeProvider value={type} {...props}/>;
};
exports.ModalDrawerProvider = ModalDrawerProvider;
var useModalDrawerType = function () {
    var type = (0, react_1.useContext)(ModalDrawerTypeContext);
    return type;
};
exports.useModalDrawerType = useModalDrawerType;
var ModalDrawer = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalDrawerType();
    if (type === "drawer") {
        return <Drawer_1.Drawer {...props}/>;
    }
    return <Modal_1.Modal {...props}/>;
});
exports.ModalDrawer = ModalDrawer;
ModalDrawer.displayName = "ModalDrawer";
var ModalDrawerBody = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalDrawerType();
    if (type === "drawer") {
        return <Drawer_1.DrawerBody {...props}/>;
    }
    return <Modal_1.ModalBody {...props}/>;
});
exports.ModalDrawerBody = ModalDrawerBody;
ModalDrawerBody.displayName = "ModalDrawerBody";
var ModalDrawerContent = (0, react_1.forwardRef)(function (_a, ref) {
    var size = _a.size, props = __rest(_a, ["size"]);
    var type = useModalDrawerType();
    if (type === "drawer") {
        return <Drawer_1.DrawerContent {...props} size={size} ref={ref}/>;
    }
    return <Modal_1.ModalContent {...props} size="medium" ref={ref}/>;
});
exports.ModalDrawerContent = ModalDrawerContent;
ModalDrawerContent.displayName = "ModalDrawerContent";
var ModalDrawerDescription = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalDrawerType();
    if (type === "drawer") {
        return <Drawer_1.DrawerDescription {...props} ref={ref}/>;
    }
    return <Modal_1.ModalDescription {...props} ref={ref}/>;
});
exports.ModalDrawerDescription = ModalDrawerDescription;
ModalDrawerDescription.displayName = "ModalDrawerDescription";
var ModalDrawerFooter = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalDrawerType();
    if (type === "drawer") {
        return <Drawer_1.DrawerFooter {...props}/>;
    }
    return <Modal_1.ModalFooter {...props}/>;
});
exports.ModalDrawerFooter = ModalDrawerFooter;
ModalDrawerFooter.displayName = "ModalDrawerFooter";
var ModalDrawerHeader = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalDrawerType();
    if (type === "drawer") {
        return <Drawer_1.DrawerHeader {...props}/>;
    }
    return <Modal_1.ModalHeader {...props}/>;
});
exports.ModalDrawerHeader = ModalDrawerHeader;
ModalDrawerHeader.displayName = "ModalDrawerHeader";
var ModalDrawerTitle = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalDrawerType();
    if (type === "drawer") {
        return <Drawer_1.DrawerTitle {...props} ref={ref}/>;
    }
    return <Modal_1.ModalTitle {...props} ref={ref}/>;
});
exports.ModalDrawerTitle = ModalDrawerTitle;
ModalDrawerTitle.displayName = "ModalDrawerTitle";
