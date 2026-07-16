"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatInterface = useChatInterface;
var react_1 = require("@carbon/react");
var ai_1 = require("ai");
var react_2 = require("react");
var path_1 = require("~/utils/path");
function useChatInterface() {
    var _a = (0, react_1.useUrlParams)(), params = _a[0], setParams = _a[1];
    var location = (0, react_1.useOptimisticLocation)();
    var chatId = params.get("c") || null;
    var isChatPage = !!chatId;
    var isHome = location.pathname === path_1.path.to.authenticatedRoot;
    (0, react_1.useMount)(function () {
        if (isHome && !chatId) {
            setParams({ c: (0, ai_1.generateId)() });
        }
    });
    var setChatId = (0, react_2.useCallback)(function (id) {
        setParams({ c: id });
    }, [setParams]);
    return {
        isChatPage: isChatPage,
        chatId: chatId,
        setChatId: setChatId
    };
}
