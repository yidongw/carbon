"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHeader = ChatHeader;
var ChatNavigation_1 = require("./ChatNavigation");
var ChatTitle_1 = require("./ChatTitle");
function ChatHeader() {
    return (<div className="flex items-center justify-start pl-9 relative h-8">
      <ChatNavigation_1.ChatNavigation />
      <ChatTitle_1.ChatTitle />
      {/* {!isHome && (
          <div className="absolute right-0 flex items-center gap-4">
            <NewChatButton />
            <ChatHistory />
          </div>
        )} */}
    </div>);
}
