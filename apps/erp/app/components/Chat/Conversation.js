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
exports.ConversationScrollButton = exports.ConversationEmptyState = exports.ConversationContent = exports.Conversation = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var use_stick_to_bottom_1 = require("use-stick-to-bottom");
var Conversation = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<use_stick_to_bottom_1.StickToBottom className={(0, react_1.cn)("relative flex-1 overflow-y-auto", className)} initial="smooth" resize="smooth" role="log" {...props}/>);
};
exports.Conversation = Conversation;
var ConversationContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<use_stick_to_bottom_1.StickToBottom.Content className={(0, react_1.cn)("p-4", className)} {...props}/>);
};
exports.ConversationContent = ConversationContent;
var ConversationEmptyState = function (_a) {
    var className = _a.className, _b = _a.title, title = _b === void 0 ? "No messages yet" : _b, _c = _a.description, description = _c === void 0 ? "Start a conversation to see messages here" : _c, icon = _a.icon, children = _a.children, props = __rest(_a, ["className", "title", "description", "icon", "children"]);
    return (<div className={(0, react_1.cn)("flex size-full flex-col items-center justify-center gap-3 p-8 text-center", className)} {...props}>
    {children !== null && children !== void 0 ? children : (<>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {description && (<p className="text-muted-foreground text-sm">{description}</p>)}
        </div>
      </>)}
  </div>);
};
exports.ConversationEmptyState = ConversationEmptyState;
var ConversationScrollButton = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var _b = (0, use_stick_to_bottom_1.useStickToBottomContext)(), isAtBottom = _b.isAtBottom, scrollToBottom = _b.scrollToBottom;
    var handleScrollToBottom = (0, react_2.useCallback)(function () {
        scrollToBottom();
    }, [scrollToBottom]);
    return (!isAtBottom && (<react_1.IconButton icon={<lu_1.LuArrowDown />} className={(0, react_1.cn)("absolute bottom-42 left-[50%] translate-x-[-50%] rounded-full", className)} onClick={handleScrollToBottom} size="icon" type="button" variant="secondary" {...props}/>));
};
exports.ConversationScrollButton = ConversationScrollButton;
