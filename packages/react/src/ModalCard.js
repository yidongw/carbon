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
exports.useModalCardType = exports.ModalCardTypeProvider = exports.ModalCardTypeContext = exports.ModalCardTitle = exports.ModalCardProvider = exports.ModalCardHeader = exports.ModalCardFooter = exports.ModalCardDescription = exports.ModalCardContent = exports.ModalCardBody = exports.ModalCard = void 0;
var react_1 = require("react");
var Card_1 = require("./Card");
var Modal_1 = require("./Modal");
var ModalCardTypeContext = (0, react_1.createContext)("card");
exports.ModalCardTypeContext = ModalCardTypeContext;
var ModalCardTypeProvider = ModalCardTypeContext.Provider;
exports.ModalCardTypeProvider = ModalCardTypeProvider;
var ModalCardProvider = function (_a) {
    var _b = _a.type, type = _b === void 0 ? "card" : _b, props = __rest(_a, ["type"]);
    return <ModalCardTypeProvider value={type} {...props}/>;
};
exports.ModalCardProvider = ModalCardProvider;
var useModalCardType = function () {
    var type = (0, react_1.useContext)(ModalCardTypeContext);
    return type;
};
exports.useModalCardType = useModalCardType;
var ModalCard = (0, react_1.forwardRef)(function (_a, ref) {
    var onClose = _a.onClose, props = __rest(_a, ["onClose"]);
    var type = useModalCardType();
    if (type === "card") {
        return <Card_1.Card {...props} ref={ref}/>;
    }
    return (<Modal_1.Modal {...props} onOpenChange={function (open) {
            if (!open) {
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
        }} open/>);
});
exports.ModalCard = ModalCard;
ModalCard.displayName = "ModalCard";
var ModalCardBody = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalCardType();
    if (type === "card") {
        return <Card_1.CardContent {...props} ref={ref}/>;
    }
    return <Modal_1.ModalBody {...props}/>;
});
exports.ModalCardBody = ModalCardBody;
ModalCardBody.displayName = "ModalCardBody";
var ModalCardContent = (0, react_1.forwardRef)(function (props, ref) {
    // @ts-expect-error
    var size = props.size, rest = __rest(props, ["size"]);
    var type = useModalCardType();
    if (type === "card") {
        return <div {...props} ref={ref}/>;
    }
    return <Modal_1.ModalContent {...rest} size={size !== null && size !== void 0 ? size : "xlarge"} ref={ref}/>;
});
exports.ModalCardContent = ModalCardContent;
ModalCardContent.displayName = "ModalCardContent";
var ModalCardDescription = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalCardType();
    if (type === "card") {
        return <Card_1.CardDescription {...props} ref={ref}/>;
    }
    return <Modal_1.ModalDescription {...props} ref={ref}/>;
});
exports.ModalCardDescription = ModalCardDescription;
ModalCardDescription.displayName = "ModalCardDescription";
var ModalCardFooter = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalCardType();
    if (type === "card") {
        return <Card_1.CardFooter {...props} ref={ref}/>;
    }
    return <Modal_1.ModalFooter {...props}/>;
});
exports.ModalCardFooter = ModalCardFooter;
ModalCardFooter.displayName = "ModalCardFooter";
var ModalCardHeader = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalCardType();
    if (type === "card") {
        return <Card_1.CardHeader {...props} ref={ref}/>;
    }
    return <Modal_1.ModalHeader {...props}/>;
});
exports.ModalCardHeader = ModalCardHeader;
ModalCardHeader.displayName = "ModalCardHeader";
var ModalCardTitle = (0, react_1.forwardRef)(function (props, ref) {
    var type = useModalCardType();
    if (type === "card") {
        return <Card_1.CardTitle {...props} ref={ref}/>;
    }
    return <Modal_1.ModalTitle {...props} ref={ref}/>;
});
exports.ModalCardTitle = ModalCardTitle;
ModalCardTitle.displayName = "ModalCardTitle";
