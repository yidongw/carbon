"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestedActions = SuggestedActions;
exports.SuggestedActionsButton = SuggestedActionsButton;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var store_2 = require("./lib/store");
function SuggestedActions() {
    var sendMessage = (0, store_1.useChatActions)().sendMessage;
    var chatId = (0, store_1.useChatId)();
    var handleToolCall = function (params) {
        if (!chatId)
            return;
        sendMessage({
            role: "user",
            parts: [{ type: "text", text: params.text }],
            metadata: {
                toolCall: {
                    toolName: params.toolName,
                    toolParams: params.toolParams
                }
            }
        });
    };
    // UI configuration based on action ID
    var uiConfig = {
    // "get-runway": {
    //   icon: Icons.Speed,
    //   title: "Runway",
    //   description: "Show me my runway",
    // },
    };
    var suggestedActions = [];
    return (<div className="w-full px-6 mt-10 mb-8 flex items-center justify-center">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {suggestedActions.map(function (action) {
            var config = uiConfig[action.id];
            var Icon = config === null || config === void 0 ? void 0 : config.icon;
            var title = (config === null || config === void 0 ? void 0 : config.title) || action.id;
            var description = (config === null || config === void 0 ? void 0 : config.description) || "Execute ".concat(action.toolName);
            return (<button key={action.id} type="button" className={(0, react_1.cn)("border border-border hover:bg-accent hover:border-border-hover", "px-3 py-2 flex items-center gap-2 cursor-pointer", "transition-all duration-300 min-w-fit whitespace-nowrap")} onClick={function () {
                    handleToolCall({
                        toolName: action.toolName,
                        toolParams: action.toolParams,
                        text: description
                    });
                }}>
              {Icon && <Icon className="w-4 h-4 text-muted-foreground"/>}
              <span className="text-foreground text-[12px] font-medium">
                {title}
              </span>
            </button>);
        })}
      </div>
    </div>);
}
function SuggestedActionsButton() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, store_2.useChatStore)(), showCommands = _a.showCommands, setShowCommands = _a.setShowCommands;
    var handleClick = function (e) {
        // Prevent the click from bubbling up and being detected as an "outside click"
        e.stopPropagation();
        // Toggle the command menu
        setShowCommands(!showCommands);
        // Focus textarea for keyboard navigation when opening
        if (!showCommands) {
            requestAnimationFrame(function () {
                var _a;
                (_a = document.querySelector("textarea")) === null || _a === void 0 ? void 0 : _a.focus();
            });
        }
    };
    return (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Suggested Actions"], ["Suggested Actions"])))} icon={<lu_1.LuZap />} variant="ghost" type="button" onClick={handleClick} className={(0, react_1.cn)(showCommands
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground")} 
    // Add data attribute to help identify this button for exclusion from outside clicks
    data-suggested-actions-toggle/>);
}
var templateObject_1;
