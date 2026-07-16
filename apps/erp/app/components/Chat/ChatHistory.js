"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistory = ChatHistory;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
function ChatHistorySkeleton() {
    return (<div className="space-y-4">
      {Array.from({ length: 10 }, function (_, i) { return (<div key={"chat-skeleton-".concat(i + 1)} className="flex flex-col gap-1">
          <react_1.Skeleton className="h-4 w-3/4"/>
          <react_1.Skeleton className="h-3 w-1/2"/>
        </div>); })}
    </div>);
}
function ChatHistory(_a) {
    var chats = _a.chats, isLoading = _a.isLoading;
    var t = (0, macro_1.useLingui)().t;
    var formatTimeAgo = (0, hooks_1.useDateFormatter)().formatTimeAgo;
    var _b = (0, react_1.useUrlParams)(), setParams = _b[1];
    var _c = (0, react_2.useState)(""), searchQuery = _c[0], setSearchQuery = _c[1];
    var historyDisclosure = (0, react_1.useDisclosure)();
    // Debounced search to avoid too many API calls
    var debouncedSearch = (0, react_1.useDebounce)(setSearchQuery, 300);
    var handleChatSelect = function (chatId) {
        setParams({ chatId: chatId });
        historyDisclosure.onClose();
    };
    var handleDeleteChat = function (e, chatId) {
        alert("Delete chat ".concat(chatId));
    };
    return (<react_1.Popover open={historyDisclosure.isOpen} onOpenChange={historyDisclosure.onToggle}>
      <react_1.PopoverTrigger asChild>
        <react_1.IconButton variant="secondary" icon={<lu_1.LuMenu />} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Open chat history"], ["Open chat history"])))}/>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4">
          <div className="relative mb-4">
            <lu_1.LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14}/>
            <react_1.Input placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search history"], ["Search history"])))} className="pl-9" onChange={function (e) { return debouncedSearch(e.target.value); }}/>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (<ChatHistorySkeleton />) : (chats === null || chats === void 0 ? void 0 : chats.length) === 0 ? (<div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">
                  {searchQuery ? (<macro_1.Trans>No chats found</macro_1.Trans>) : (<macro_1.Trans>No chat history</macro_1.Trans>)}
                </div>
              </div>) : (<div className="space-y-4">
                {chats === null || chats === void 0 ? void 0 : chats.map(function (chat) { return (<div key={chat.id} className="group relative flex items-center justify-between hover:bg-muted/50 rounded-md p-2 -m-2">
                    <button type="button" onClick={function () { return handleChatSelect(chat.id); }} className="flex-1 text-left">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium line-clamp-1">
                          {chat.title || t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["New chat"], ["New chat"])))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(chat.updatedAt.toISOString())}
                        </div>
                      </div>
                    </button>
                    <button type="button" onClick={function (e) { return handleDeleteChat(e, chat.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-destructive/10 rounded-sm" title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Delete chat"], ["Delete chat"])))}>
                      <lu_1.LuTrash size={14} className="text-muted-foreground hover:text-destructive"/>
                    </button>
                  </div>); })}
              </div>)}
          </div>
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
