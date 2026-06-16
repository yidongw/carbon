import {
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  useDebounce,
  useDisclosure,
  useUrlParams
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { useFetcher } from "react-router";
import { LuMenu, LuSearch, LuTrash } from "react-icons/lu";
import { useDateFormatter } from "~/hooks";
import { path } from "~/utils/path";

type Chat = {
  chatId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
};

function ChatHistorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={`chat-skeleton-${i + 1}`} className="flex flex-col gap-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function ChatHistory({
  chats,
  isLoading
}: {
  chats: Chat[];
  isLoading: boolean;
}) {
  const { t } = useLingui();
  const { formatTimeAgo } = useDateFormatter();
  const [params, setParams] = useUrlParams();
  const fetcher = useFetcher();

  const [searchQuery, setSearchQuery] = useState("");
  const historyDisclosure = useDisclosure();

  const debouncedSearch = useDebounce(setSearchQuery, 300);

  const currentChatId = params.get("c");

  const handleChatSelect = (chatId: string) => {
    setParams({ c: chatId });
    historyDisclosure.onClose();
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    fetcher.submit(
      { chatId },
      { method: "DELETE", action: path.to.api.chats, encType: "application/json" }
    );
    // If deleting the active chat, clear it
    if (currentChatId === chatId) {
      setParams({ c: null });
    }
  };

  const filteredChats = searchQuery
    ? chats.filter((c) =>
        (c.title ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  // Optimistically hide deleted chats
  const deletingId =
    fetcher.state !== "idle"
      ? (fetcher.json as { chatId?: string } | null)?.chatId
      : null;
  const visibleChats = deletingId
    ? filteredChats.filter((c) => c.chatId !== deletingId)
    : filteredChats;

  return (
    <Popover
      open={historyDisclosure.isOpen}
      onOpenChange={historyDisclosure.onToggle}
    >
      <PopoverTrigger asChild>
        <IconButton
          variant="secondary"
          icon={<LuMenu />}
          aria-label={t`Open chat history`}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4">
          <div className="relative mb-4">
            <LuSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <Input
              placeholder={t`Search history`}
              className="pl-9"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <ChatHistorySkeleton />
            ) : visibleChats.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">
                  {searchQuery ? (
                    <Trans>No chats found</Trans>
                  ) : (
                    <Trans>No chat history</Trans>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleChats.map((chat) => (
                  <div
                    key={chat.chatId}
                    className="group relative flex items-center justify-between hover:bg-muted/50 rounded-md p-2 -m-2"
                  >
                    <button
                      type="button"
                      onClick={() => handleChatSelect(chat.chatId)}
                      className="flex-1 text-left"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium line-clamp-1">
                          {chat.title || t`New chat`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(
                            chat.updatedAt instanceof Date
                              ? chat.updatedAt.toISOString()
                              : String(chat.updatedAt)
                          )}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteChat(e, chat.chatId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-destructive/10 rounded-sm"
                      title={t`Delete chat`}
                    >
                      <LuTrash
                        size={14}
                        className="text-muted-foreground hover:text-destructive"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
