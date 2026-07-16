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
exports.MessageAvatar = exports.MessageContent = exports.Message = void 0;
var react_1 = require("@carbon/react");
var Message = function (_a) {
    var className = _a.className, from = _a.from, props = __rest(_a, ["className", "from"]);
    return (<div className={(0, react_1.cn)("group flex w-full items-end justify-end gap-2 py-4", from === "user" ? "is-user" : "is-assistant flex-row-reverse justify-end", "[&>div]:max-w-[80%]", className)} {...props}/>);
};
exports.Message = Message;
var MessageContent = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return (<div className={(0, react_1.cn)("flex flex-col gap-2 overflow-hidden rounded-lg px-4 py-3 text-foreground text-sm bg-card", "group-[.is-user]:!bg-muted group-[.is-user]:!text-foreground group-[.is-user]:!px-4 group-[.is-user]:!py-2 group-[.is-user]:max-w-fit group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-none", "group-[.is-assistant]:!bg-transparent group-[.is-assistant]:!shadow-none group-[.is-assistant]:!border-none group-[.is-assistant]:!px-0 group-[.is-assistant]:!py-0 group-[.is-assistant]:!rounded-none group-[.is-assistant]:!text-muted-foreground", className)} {...props}>
    {children}
  </div>);
};
exports.MessageContent = MessageContent;
var MessageAvatar = function (_a) {
    var props = __rest(_a, []);
    return (<react_1.Avatar {...props}/>);
};
exports.MessageAvatar = MessageAvatar;
