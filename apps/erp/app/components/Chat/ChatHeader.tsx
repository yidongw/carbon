import { ChatNavigation } from "./ChatNavigation";
import { ChatTitle } from "./ChatTitle";

export function ChatHeader() {
  return (
    <div className="flex items-center justify-start pl-9 relative h-8">
      <ChatNavigation />
      <ChatTitle />
      {/* {!isHome && (
        <div className="absolute right-0 flex items-center gap-4">
          <NewChatButton />
          <ChatHistory />
        </div>
      )} */}
    </div>
  );
}
