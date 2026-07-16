"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInput = void 0;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var CommandMenu_1 = require("./CommandMenu");
var store_2 = require("./lib/store");
var PromptInput_1 = require("./PromptInput");
var RecordButton_1 = require("./RecordButton");
var SuggestedActions_1 = require("./SuggestedActions");
var SuggestedPrompts_1 = require("./SuggestedPrompts");
var WebSearch_1 = require("./WebSearch");
exports.ChatInput = (0, react_2.forwardRef)(function ChatInput(_a, ref) {
    var hasMessages = _a.hasMessages;
    var t = (0, macro_1.useLingui)().t;
    var textareaRef = (0, react_2.useRef)(null);
    var status = (0, store_1.useChatStatus)();
    var _b = (0, store_1.useChatActions)(), sendMessage = _b.sendMessage, stop = _b.stop;
    var chatId = (0, store_1.useChatId)();
    var _c = (0, store_1.useDataPart)("suggestions"), clearSuggestions = _c[1];
    // const { } = useArtifacts({
    //   exclude: ["chat-title", "followup-questions"],
    // });
    // const isCanvasVisible = false;
    var _d = (0, store_2.useChatStore)(), input = _d.input, isWebSearch = _d.isWebSearch, isUploading = _d.isUploading, isRecording = _d.isRecording, isProcessing = _d.isProcessing, showCommands = _d.showCommands, selectedCommandIndex = _d.selectedCommandIndex, filteredCommands = _d.filteredCommands, setInput = _d.setInput, handleInputChange = _d.handleInputChange, handleKeyDown = _d.handleKeyDown, resetCommandState = _d.resetCommandState;
    var handleSubmit = function (message) {
        var _a, _b, _c;
        // If currently streaming or submitted, stop instead of submitting
        if (status === "streaming" || status === "submitted") {
            stop();
            return;
        }
        var hasText = Boolean(message.text);
        var hasAttachments = Boolean((_a = message.files) === null || _a === void 0 ? void 0 : _a.length);
        if (!(hasText || hasAttachments)) {
            return;
        }
        sendMessage({
            text: message.text || "Sent with attachments",
            files: message.files,
            metadata: {
                agentChoice: (_b = message.metadata) === null || _b === void 0 ? void 0 : _b.agentChoice,
                toolChoice: (_c = message.metadata) === null || _c === void 0 ? void 0 : _c.toolChoice
            }
        });
        setInput("");
    };
    return (<>
        <div className={(0, react_1.cn)("transition-all duration-300 ease-in-out", hasMessages ? "absolute bottom-6 left-0 z-20 w-full" : ""
        // isCanvasVisible ? "right-[603px]" : "right-0"
        )}>
          <div className="mx-auto w-full pt-2 relative">
            {/* Command Suggestions Menu */}
            <SuggestedPrompts_1.SuggestedPrompts />
            <CommandMenu_1.CommandMenu />

            <PromptInput_1.PromptInput onSubmit={handleSubmit} globalDrop multiple>
              <PromptInput_1.PromptInputBody>
                <PromptInput_1.PromptInputAttachments>
                  {function (attachment) { return <PromptInput_1.PromptInputAttachment data={attachment}/>; }}
                </PromptInput_1.PromptInputAttachments>
                <PromptInput_1.PromptInputTextarea ref={textareaRef} autoFocus onChange={handleInputChange} onKeyDown={function (e) {
            // Handle Enter key for commands
            if (e.key === "Enter" && showCommands) {
                e.preventDefault();
                var selectedCommand = filteredCommands[selectedCommandIndex];
                if (selectedCommand) {
                    // Execute command through the store
                    if (!chatId)
                        return;
                    clearSuggestions();
                    sendMessage({
                        role: "user",
                        parts: [
                            { type: "text", text: selectedCommand.title }
                        ],
                        metadata: {
                            toolCall: {
                                toolName: selectedCommand.toolName,
                                toolParams: selectedCommand.toolParams
                            }
                        }
                    });
                    setInput("");
                    resetCommandState();
                }
                return;
            }
            // Handle Enter key for normal messages
            if (e.key === "Enter" && !showCommands) {
                e.preventDefault();
                if (input.trim()) {
                    if (status === "streaming" || status === "submitted") {
                        stop === null || stop === void 0 ? void 0 : stop();
                        // Continue to send the new message after stopping
                    }
                    // Clear old suggestions
                    clearSuggestions();
                    sendMessage({
                        text: input,
                        files: [],
                        metadata: {
                            webSearch: isWebSearch
                        }
                    });
                    setInput("");
                    resetCommandState();
                }
                return;
            }
            // Handle other keys normally
            handleKeyDown(e);
        }} value={input} placeholder={isWebSearch
            ? t({
                id: "Search the web",
                message: "Search the web"
            })
            : t({
                id: "Ask anything",
                message: "Ask anything"
            })}/>
              </PromptInput_1.PromptInputBody>
              <PromptInput_1.PromptInputToolbar>
                <PromptInput_1.PromptInputTools>
                  <PromptInput_1.PromptInputActionAddAttachments />
                  <SuggestedActions_1.SuggestedActionsButton />
                  <WebSearch_1.WebSearchButton />
                </PromptInput_1.PromptInputTools>

                <PromptInput_1.PromptInputTools>
                  <RecordButton_1.RecordButton ref={ref} size={16}/>
                  <PromptInput_1.PromptInputSubmit disabled={(!input && !status) ||
            isUploading ||
            isRecording ||
            isProcessing} status={status}/>
                </PromptInput_1.PromptInputTools>
              </PromptInput_1.PromptInputToolbar>
            </PromptInput_1.PromptInput>
          </div>
        </div>
      </>);
});
