"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInterface = ChatInterface;
var client_1 = require("@ai-sdk-tools/artifacts/client");
var store_1 = require("@ai-sdk-tools/store");
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var i18n_1 = require("@react-aria/i18n");
var ai_1 = require("ai");
var react_2 = require("react");
var Greeting_1 = require("~/components/Greeting");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var Canvas_1 = require("./Canvas");
var ChatHeader_1 = require("./ChatHeader");
var ChatInput_1 = require("./ChatInput");
var ChatMessages_1 = require("./ChatMessages");
var ChatStatusIndicators_1 = require("./ChatStatusIndicators");
var Conversation_1 = require("./Conversation");
var useChatInterface_1 = require("./hooks/useChatInterface");
var useChatStatus_1 = require("./hooks/useChatStatus");
function ChatInterface(_a) {
    var _this = this;
    var geo = _a.geo, containerClassName = _a.containerClassName;
    var routeChatId = (0, useChatInterface_1.useChatInterface)().chatId;
    var recordButtonRef = (0, react_2.useRef)(null);
    var chatId = (0, react_2.useMemo)(function () { return routeChatId !== null && routeChatId !== void 0 ? routeChatId : (0, ai_1.generateId)(); }, [routeChatId]);
    var reset = (0, store_1.useChatActions)().reset;
    var prevChatIdRef = (0, react_2.useRef)(routeChatId);
    var _b = (0, store_1.useDataPart)("suggestions"), clearSuggestions = _b[1];
    // Reset chat state when navigating away from a chat (sidebar, browser back, etc.)
    (0, react_2.useEffect)(function () {
        var prevChatId = prevChatIdRef.current;
        var currentChatId = routeChatId;
        // If we had a chatId before and now we don't (navigated away), reset
        // Or if we're switching to a different chatId, reset
        if (prevChatId && prevChatId !== currentChatId) {
            reset();
            clearSuggestions();
        }
        // Update the ref for next comparison
        prevChatIdRef.current = currentChatId;
    }, [routeChatId, reset, clearSuggestions]);
    var locale = (0, i18n_1.useLocale)().locale;
    var accessToken = (0, auth_1.useCarbon)().accessToken;
    var _c = (0, hooks_1.useUser)(), userId = _c.id, firstName = _c.firstName, lastName = _c.lastName, _d = _c.company, companyId = _d.id, companyName = _d.name, baseCurrency = _d.baseCurrencyCode;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var authenticatedFetch = (0, react_2.useMemo)(function () {
        return Object.assign(function (url, requestOptions) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch(url, __assign(__assign({}, requestOptions), { headers: __assign(__assign({}, requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers), { Authorization: "Bearer ".concat(accessToken), "Content-Type": "application/json", "x-company-id": companyId, "x-user-id": userId }) }))];
            });
        }); });
    }, [accessToken]);
    var _e = (0, store_1.useChat)({
        id: chatId,
        transport: new ai_1.DefaultChatTransport({
            api: path_1.path.to.api.chat,
            fetch: authenticatedFetch,
            prepareSendMessagesRequest: function (_a) {
                var _b, _c;
                var messages = _a.messages, id = _a.id;
                var lastMessage = messages[messages.length - 1];
                var agentChoice = (_b = lastMessage.metadata) === null || _b === void 0 ? void 0 : _b.agentChoice;
                var toolChoice = (_c = lastMessage.metadata) === null || _c === void 0 ? void 0 : _c.toolChoice;
                return {
                    body: {
                        id: id,
                        fullName: "".concat(firstName, " ").concat(lastName),
                        companyName: companyName,
                        baseCurrency: baseCurrency !== null && baseCurrency !== void 0 ? baseCurrency : "USD",
                        country: geo === null || geo === void 0 ? void 0 : geo.country,
                        city: geo === null || geo === void 0 ? void 0 : geo.city,
                        message: lastMessage,
                        agentChoice: agentChoice,
                        toolChoice: toolChoice,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        locale: locale
                    }
                };
            }
        })
    }), messages = _e.messages, status = _e.status;
    var _f = (0, useChatStatus_1.useChatStatus)(messages, status), agentStatus = _f.agentStatus, currentToolCall = _f.currentToolCall;
    // @ts-expect-error TS2339 - TODO: fix type
    var artifacts = (0, client_1.useArtifacts)().artifacts;
    var hasArtifacts = artifacts && artifacts.length > 0;
    var hasMessages = messages.length > 0;
    var suggestions = (0, store_1.useDataPart)("suggestions")[0];
    var hasSuggestions = (suggestions === null || suggestions === void 0 ? void 0 : suggestions.prompts) && suggestions.prompts.length > 0;
    return (<div className={(0, react_1.cn)("relative flex size-full overflow-hidden bg-background", containerClassName !== null && containerClassName !== void 0 ? containerClassName : "h-[calc(100dvh-49px)]")}>
      {/* Canvas slides in from right when artifacts are present */}
      <div className={(0, react_1.cn)("fixed right-0 top-0 bottom-0 z-20", hasArtifacts ? "translate-x-0" : "translate-x-full", hasMessages && "transition-transform duration-300 ease-in-out")}>
        {hasArtifacts && <Canvas_1.Canvas />}
      </div>

      {/* Main chat area - container that slides left when canvas opens */}
      <div className={(0, react_1.cn)("relative flex-1", hasMessages && "transition-all duration-300 ease-in-out", hasArtifacts && "mr-[600px]")}>
        {hasMessages && (<>
            {/* Conversation view - messages with absolute positioning for proper height */}
            <div className="absolute inset-0 flex flex-col">
              <div className={(0, react_1.cn)("sticky top-0 left-0 z-10 shrink-0", hasMessages && "transition-all duration-300 ease-in-out", hasArtifacts ? "right-[600px]" : "right-0")}>
                <div className="bg-background/80 dark:bg-background/50 backdrop-blur-sm p-2 border-b">
                  <ChatHeader_1.ChatHeader />
                </div>
              </div>
              <Conversation_1.Conversation>
                <Conversation_1.ConversationContent className="pb-48 pt-14">
                  <div className="max-w-2xl mx-auto w-full">
                    <ChatMessages_1.ChatMessages messages={messages} isStreaming={status === "streaming" || status === "submitted"}/>
                    <ChatStatusIndicators_1.ChatStatusIndicators agentStatus={agentStatus} currentToolCall={currentToolCall} status={status}/>
                  </div>
                </Conversation_1.ConversationContent>
                <Conversation_1.ConversationScrollButton className={(0, react_1.cn)(hasSuggestions ? "bottom-52" : "bottom-42")}/>
              </Conversation_1.Conversation>
            </div>
          </>)}

        {!hasMessages && (<div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-24">
            <Greeting_1.Greeting size="h1" className="font-medium"/>
          </div>)}

        {/* Input pinned to bottom */}
        <div className={(0, react_1.cn)("absolute bottom-0 left-0 transition-all duration-300 ease-in-out max-w-2xl mx-auto px-6", hasArtifacts ? "right-[600px]" : "right-0")}>
          <div className="w-full pb-5">
            <ChatInput_1.ChatInput ref={recordButtonRef} hasMessages={hasMessages}/>
          </div>
        </div>
      </div>
    </div>);
}
