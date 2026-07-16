"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.OperationChat = OperationChat;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function OperationChat(_a) {
    var _this = this;
    var operation = _a.operation;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var user = (0, hooks_1.useUser)();
    var employees = (0, stores_1.usePeople)()[0];
    var _b = (0, react_2.useState)([]), messages = _b[0], setMessages = _b[1];
    var _c = (0, react_2.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _d = (0, auth_1.useCarbon)(), carbon = _d.carbon, accessToken = _d.accessToken;
    var fetchChats = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    (0, react_dom_1.flushSync)(function () {
                        setIsLoading(true);
                    });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("jobOperationNote").select("*").eq("jobOperationId", operation.id).order("createdAt", { ascending: true }))];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error(error);
                        return [2 /*return*/];
                    }
                    setMessages(data);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        fetchChats();
    });
    (0, react_1.useRealtimeChannel)({
        topic: "job-operation-notes-".concat(operation.id),
        setup: function (channel) {
            return channel.on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "jobOperationNote",
                filter: "jobOperationId=eq.".concat(operation.id)
            }, function (payload) {
                setMessages(function (prev) {
                    if (prev.some(function (note) { return note.id === payload.new.id; })) {
                        return prev;
                    }
                    return __spreadArray(__spreadArray([], prev, true), [payload.new], false);
                });
            });
        }
    });
    var messagesEndRef = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
            block: "start",
            behavior: messages.length > 0 ? "smooth" : "auto"
        });
    }, [messages]);
    var _e = (0, react_2.useState)(""), message = _e[0], setMessage = _e[1];
    var notify = (0, react_1.useDebounce)(function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch(path_1.path.to.messagingNotify, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                type: "jobOperationNote",
                                operationId: operation.id
                            }),
                            credentials: "include" // This is sufficient for CORS with cookies
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Failed to notify user");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, 5000, true);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var newMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!message.trim())
                        return [2 /*return*/];
                    newMessage = {
                        id: (0, nanoid_1.nanoid)(),
                        jobOperationId: operation.id,
                        createdBy: user.id,
                        note: message,
                        createdAt: new Date().toISOString(),
                        companyId: user.company.id
                    };
                    (0, react_dom_1.flushSync)(function () {
                        setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newMessage], false); });
                        setMessage("");
                    });
                    return [4 /*yield*/, Promise.all([
                            carbon === null || carbon === void 0 ? void 0 : carbon.from("jobOperationNote").insert(newMessage),
                            notify()
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="flex flex-col h-[calc(100dvh-var(--header-height)*2)]">
      <react_1.ScrollArea className="flex-1 p-4">
        <react_1.Loading isLoading={isLoading}>
          <div className="flex flex-col gap-3">
            {messages.map(function (m) {
            var _a;
            var createdBy = employees.find(function (employee) { return employee.id === m.createdBy; });
            var isUser = m.createdBy === user.id;
            return (<div key={"message-".concat(m.id)} className={(0, react_1.cn)("flex gap-2 items-end", isUser && "flex-row-reverse")}>
                  <react_1.Avatar src={(_a = createdBy === null || createdBy === void 0 ? void 0 : createdBy.avatarUrl) !== null && _a !== void 0 ? _a : undefined} name={createdBy === null || createdBy === void 0 ? void 0 : createdBy.name}/>

                  <div className="flex flex-col gap-1 max-w-[80%] ">
                    <div className="flex flex-col gap-1">
                      {!isUser && (<span className="text-xs opacity-70">
                          {createdBy === null || createdBy === void 0 ? void 0 : createdBy.name}
                        </span>)}
                      <div className={(0, react_1.cn)("rounded-2xl p-3 w-full flex flex-col gap-1", isUser ? "bg-blue-500 text-white" : "bg-muted")}>
                        <p className="text-sm">{m.note}</p>

                        <span className="text-xs opacity-70">
                          {new Date(m.createdAt).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>);
        })}
            <div ref={messagesEndRef} style={{ height: 0 }}/>
          </div>
        </react_1.Loading>
      </react_1.ScrollArea>

      <div className="border-t p-4">
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <react_1.Input className="flex-1" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Type a message..."], ["Type a message..."])))} name="message" value={message} onChange={function (e) { return setMessage(e.target.value); }}/>
          <react_1.Button className="h-10" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Send"], ["Send"])))} type="submit" leftIcon={<lu_1.LuArrowUp />}>
            <macro_1.Trans>Send</macro_1.Trans>
          </react_1.Button>
        </form>
      </div>
    </div>);
}
var templateObject_1, templateObject_2;
