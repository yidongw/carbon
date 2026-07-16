"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestedPrompts = SuggestedPrompts;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var framer_motion_1 = require("framer-motion");
var useChatInterface_1 = require("./hooks/useChatInterface");
var delay = 1;
function SuggestedPrompts() {
    var _a = (0, store_1.useDataPart)("suggestions"), suggestions = _a[0], clearSuggestions = _a[1];
    var sendMessage = (0, store_1.useChatActions)().sendMessage;
    var isChatPage = (0, useChatInterface_1.useChatInterface)().isChatPage;
    var handlePromptClick = function (prompt) {
        clearSuggestions();
        sendMessage({ text: prompt });
    };
    if (!(suggestions === null || suggestions === void 0 ? void 0 : suggestions.prompts) ||
        suggestions.prompts.length === 0 ||
        !isChatPage) {
        return null;
    }
    var prompts = suggestions.prompts;
    return (<framer_motion_1.AnimatePresence mode="wait">
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: delay, ease: "easeOut" }} className="absolute bottom-full left-0 right-0 w-full z-30 flex gap-2 mb-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {prompts.map(function (prompt, index) { return (<framer_motion_1.motion.div key={prompt} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{
                duration: 0.2,
                delay: delay + index * 0.05,
                ease: "easeOut"
            }}>
            <react_1.Button variant="ghost" size="sm" onClick={function () { return handlePromptClick(prompt); }} className="px-2 py-1 h-auto rounded-full text-xs font-normal border text-muted-foreground flex-shrink-0 whitespace-nowrap">
              {prompt}
            </react_1.Button>
          </framer_motion_1.motion.div>); })}
      </framer_motion_1.motion.div>
    </framer_motion_1.AnimatePresence>);
}
