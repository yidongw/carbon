"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveToolCall = exports.ThinkingMessage = void 0;
exports.Messages = Messages;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Message_1 = require("~/components/Message");
var hooks_1 = require("~/hooks");
var Conversation_1 = require("../Conversation");
var Markdown_1 = require("../Markdown/Markdown");
var ToolCallIndicator_1 = require("../ToolCallIndicator");
var WebSearch_1 = require("../WebSearch");
var MessageActions_1 = require("./MessageActions");
var ThinkingMessage = function () {
    return (<react_1.TextShimmer className="text-sm" duration={1}>
      Thinking...
    </react_1.TextShimmer>);
};
exports.ThinkingMessage = ThinkingMessage;
var ActiveToolCall = function (_a) {
    var toolName = _a.toolName;
    // Type assertion to ensure compatibility with our supported tool names
    var supportedToolName = toolName;
    return <ToolCallIndicator_1.ToolCallIndicator toolName={supportedToolName}/>;
};
exports.ActiveToolCall = ActiveToolCall;
function Messages() {
    var messages = (0, store_1.useChatMessages)();
    var status = (0, store_1.useChatStatus)();
    var user = (0, hooks_1.useUser)();
    return (<div className="w-full mx-auto relative size-full h-[calc(100vh-86px)] pb-28">
      <div className="flex flex-col h-full w-full">
        <Conversation_1.Conversation className="h-full w-full">
          <Conversation_1.ConversationContent className="px-6 mx-auto mb-40 max-w-[770px]">
            {messages.map(function (message) { return (<div key={message.id}>
                {message.parts.map(function (part, i) {
                var _a;
                switch (part.type) {
                    case "data-canvas":
                        return null; // Canvas content is rendered in sidebar
                    case "text":
                        return (<react_2.Fragment key={"".concat(message.id, "-").concat(i)}>
                          <Message_1.Message from={message.role}>
                            <Message_1.MessageContent>
                              <Markdown_1.Markdown limitedMarkdown>{part.text}</Markdown_1.Markdown>
                            </Message_1.MessageContent>

                            {message.role === "user" && user && (<Message_1.MessageAvatar src={user.avatarUrl} name={"".concat(user.firstName, " ").concat(user.lastName)}/>)}
                          </Message_1.Message>

                          {message.role === "assistant" &&
                                message.parts.filter(function (part) { return part.type === "source-url"; }).length > 0 && (<WebSearch_1.WebSearchSources sources={message.parts.filter(function (part) { return part.type === "source-url"; })}/>)}

                          {message.role === "assistant" &&
                                status !== "streaming" && (<MessageActions_1.MessageActions messageContent={part.text} messageId={message.id}/>)}
                        </react_2.Fragment>);
                    default: {
                        if (part.type.startsWith("tool-")) {
                            return (<react_2.Fragment key={"".concat(message.id, "-").concat(i)}>
                            <Message_1.Message from={message.role}>
                              <Message_1.MessageContent>
                                <Markdown_1.Markdown>
                                  {(_a = part === null || part === void 0 ? void 0 : part.output) === null || _a === void 0 ? void 0 : _a.text}
                                </Markdown_1.Markdown>
                              </Message_1.MessageContent>
                            </Message_1.Message>
                          </react_2.Fragment>);
                        }
                        return null;
                    }
                }
            })}
              </div>); })}

            {status === "submitted" && <exports.ThinkingMessage />}
          </Conversation_1.ConversationContent>
          <Conversation_1.ConversationScrollButton />
        </Conversation_1.Conversation>
      </div>
    </div>);
}
