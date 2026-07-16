"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessages = ChatMessages;
var lu_1 = require("react-icons/lu");
var Message_1 = require("~/components/Message");
var Favicon_1 = require("./Favicon");
var Markdown_1 = require("./Markdown/Markdown");
/**
 * Extract sources from webSearch tool results
 * Sources are already deduplicated by the tool
 */
function extractWebSearchSources(parts) {
    var sources = [];
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        var type = part.type;
        if (type === "tool-webSearch") {
            var output = part.output;
            if (output === null || output === void 0 ? void 0 : output.sources) {
                sources.push.apply(sources, output.sources);
            }
        }
    }
    return sources;
}
/**
 * Extract source-url parts from AI SDK
 */
function extractAiSdkSources(parts) {
    var sources = [];
    for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
        var part = parts_2[_i];
        if (part.type === "source-url") {
            var sourcePart = part;
            sources.push({
                url: sourcePart.url,
                title: sourcePart.title || sourcePart.url
            });
        }
    }
    return sources;
}
/**
 * Extract file parts from message
 */
function extractFileParts(parts) {
    return parts.filter(function (part) { return part.type === "file"; });
}
function ChatMessages(_a) {
    var messages = _a.messages, _b = _a.isStreaming, isStreaming = _b === void 0 ? false : _b;
    return (<>
      {messages.map(function (_a, index) {
            var parts = _a.parts, message = __rest(_a, ["parts"]);
            // Extract text parts
            var textParts = parts.filter(function (part) { return part.type === "text"; });
            var textContent = textParts
                .map(function (part) { return (part.type === "text" ? part.text : ""); })
                .join("");
            // Extract file parts
            var fileParts = extractFileParts(parts);
            // Extract sources from AI SDK and webSearch
            var aiSdkSources = extractAiSdkSources(parts);
            // Extract sources from webSearch tool results (already deduplicated)
            var webSearchSources = extractWebSearchSources(parts);
            // Combine sources and deduplicate between AI SDK and webSearch sources
            var allSources = __spreadArray(__spreadArray([], aiSdkSources, true), webSearchSources, true);
            var uniqueSources = allSources.filter(function (source, index, self) {
                return index === self.findIndex(function (s) { return s.url === source.url; });
            });
            // Check if this is the last (currently streaming) message
            var isLastMessage = index === messages.length - 1;
            // Show sources only after response is finished (not on the currently streaming message)
            var shouldShowSources = uniqueSources.length > 0 &&
                message.role === "assistant" &&
                (!isLastMessage || !isStreaming);
            return (<div key={message.id}>
            {/* Render file attachments */}
            {fileParts.length > 0 && (<Message_1.Message from={message.role}>
                <Message_1.MessageContent className="max-w-[80%]">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {fileParts.map(function (part) {
                        var _a;
                        if (part.type !== "file")
                            return null;
                        var file = part;
                        // Create a unique key from file properties
                        var fileKey = "".concat(file.url, "-").concat(file.filename);
                        var isImage = (_a = file.mediaType) === null || _a === void 0 ? void 0 : _a.startsWith("image/");
                        if (isImage && file.url) {
                            return (<div key={fileKey} className="relative rounded-lg border overflow-hidden">
                            <img src={file.url} alt={file.filename || "attachment"} className="max-w-xs max-h-48 object-cover" width={300} height={192}/>
                          </div>);
                        }
                        return (<div key={fileKey} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/50">
                          <lu_1.LuPaperclip className="size-4 shrink-0 text-muted-foreground"/>
                          <span className="text-sm font-medium">
                            {file.filename || "Unknown file"}
                          </span>
                        </div>);
                    })}
                  </div>
                </Message_1.MessageContent>
              </Message_1.Message>)}

            {/* Render text content in message */}
            {textParts.length > 0 && (<Message_1.Message from={message.role}>
                <Message_1.MessageContent className="max-w-[80%]">
                  <Markdown_1.Markdown html>{textContent}</Markdown_1.Markdown>
                </Message_1.MessageContent>
              </Message_1.Message>)}

            {/* Render sources as stacked favicons - show immediately when available */}
            {shouldShowSources && (<div className="max-w-[80%]">
                <Favicon_1.FaviconStack sources={uniqueSources}/>
              </div>)}
          </div>);
        })}
    </>);
}
