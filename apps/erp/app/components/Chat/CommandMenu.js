"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandMenu = CommandMenu;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var useOnClickOutside_1 = require("~/hooks/useOnClickOutside");
var AnimatedSizeContainer_1 = require("./AnimatedSizeContainer");
var store_2 = require("./lib/store");
function CommandMenu() {
    var commandListRef = (0, react_2.useRef)(null);
    var _a = (0, store_2.useChatStore)(), filteredCommands = _a.filteredCommands, selectedCommandIndex = _a.selectedCommandIndex, showCommands = _a.showCommands, 
    // handleCommandSelect,
    resetCommandState = _a.resetCommandState, setInput = _a.setInput, setShowCommands = _a.setShowCommands;
    var sendMessage = (0, store_1.useChatActions)().sendMessage;
    var chatId = (0, store_1.useChatId)();
    // Close command menu when clicking outside (but not on the toggle button)
    (0, useOnClickOutside_1.useOnClickOutside)(commandListRef, function (event) {
        if (showCommands) {
            // Check if the click was on the suggested actions toggle button
            var target = event.target;
            var isToggleButton = target.closest("[data-suggested-actions-toggle]");
            // Only close if it's not the toggle button
            if (!isToggleButton) {
                setShowCommands(false);
            }
        }
    });
    var handleCommandExecution = function (command) {
        if (!chatId)
            return;
        sendMessage({
            role: "user",
            parts: [{ type: "text", text: command.title }],
            metadata: {
                toolCall: {
                    toolName: command.toolName,
                    toolParams: command.toolParams
                }
            }
        });
        setInput("");
        resetCommandState();
    };
    // Scroll selected command into view
    (0, react_2.useEffect)(function () {
        if (commandListRef.current && showCommands) {
            var selectedElement = commandListRef.current.querySelector("[data-index=\"".concat(selectedCommandIndex, "\"]"));
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: "nearest" });
            }
        }
    }, [selectedCommandIndex, showCommands]);
    if (!showCommands || filteredCommands.length === 0)
        return null;
    return (<div ref={commandListRef} className="absolute bottom-full left-0 right-0 mb-2 w-full z-30">
      <AnimatedSizeContainer_1.AnimatedSizeContainer height className="bg-[#f7f7f7]/85 dark:bg-[#171717]/85 backdrop-blur-lg max-h-80 overflow-y-auto" transition={{
            type: "spring",
            duration: 0.2,
            bounce: 0.1,
            ease: "easeOut"
        }} style={{
            transformOrigin: "bottom center"
        }}>
        <div className="p-2">
          {filteredCommands.map(function (command, index) {
            var isActive = selectedCommandIndex === index;
            return (<div key={"".concat(command.command, "-").concat(index)} className={(0, react_1.cn)("px-2 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between group", isActive
                    ? "bg-black/5 dark:bg-white/5"
                    : "hover:bg-black/5 dark:hover:bg-white/5")} onClick={function () { return handleCommandExecution(command); }} data-index={index}>
                <div>
                  <span className="text-[#666] ml-2">{command.title}</span>
                </div>
                {isActive && (<span className="material-icons-outlined text-sm opacity-50 group-hover:opacity-100 text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">
                    <lu_1.LuArrowRight />
                  </span>)}
              </div>);
        })}
        </div>
      </AnimatedSizeContainer_1.AnimatedSizeContainer>
    </div>);
}
