import { useEffect } from "react";
import { useFetcher } from "react-router";
import { path } from "~/utils/path";
import { ChatHistory } from "./ChatHistory";
import { ChatNavigation } from "./ChatNavigation";
import { ChatTitle } from "./ChatTitle";
import { NewChat } from "./NewChat";
import { useChatInterface } from "./hooks/useChatInterface";

type ChatSession = {
  chatId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
};

export function ChatHeader() {
  const { isChatPage } = useChatInterface();
  const fetcher = useFetcher<{ chats: ChatSession[] }>();

  // Load chat history once on mount
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(path.to.api.chats);
    }
  }, [fetcher]);

  const chats = fetcher.data?.chats ?? [];
  const isLoading = fetcher.state === "loading";

  return (
    <div className="flex items-center justify-start pl-9 relative h-8">
      <ChatNavigation />
      <ChatTitle />
      {!isChatPage && (
        <div className="absolute right-0 flex items-center gap-1">
          <NewChat />
          <ChatHistory chats={chats} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
