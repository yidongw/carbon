"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatTitle = ChatTitle;
var store_1 = require("@ai-sdk-tools/store");
var framer_motion_1 = require("framer-motion");
function ChatTitle() {
    var chatTitle = (0, store_1.useDataPart)("chat-title", {
        onData: function (dataPart) {
            if (dataPart.data.title) {
                document.title = "".concat(dataPart.data.title, " - Carbon");
            }
        }
    })[0];
    return (<framer_motion_1.AnimatePresence mode="wait">
      {(chatTitle === null || chatTitle === void 0 ? void 0 : chatTitle.title) && (<framer_motion_1.motion.div key={chatTitle.title} initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
          <div className="text-sm font-medium text-foreground whitespace-nowrap">
            {chatTitle.title}
          </div>
        </framer_motion_1.motion.div>)}
    </framer_motion_1.AnimatePresence>);
}
