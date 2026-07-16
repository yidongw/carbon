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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageActions = MessageActions;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
function MessageActions(_a) {
    var _this = this;
    var messageId = _a.messageId, messageContent = _a.messageContent;
    var t = (0, macro_1.useLingui)().t;
    var chatId = (0, store_1.useChatId)();
    var regenerate = (0, store_1.useChatActions)().regenerate;
    var _b = (0, react_2.useState)(null), feedbackGiven = _b[0], setFeedbackGiven = _b[1];
    var _c = (0, react_2.useState)(false), copied = _c[0], setCopied = _c[1];
    var feedbackFetcher = (0, react_router_1.useFetcher)();
    var handleRegenerate = function () {
        regenerate === null || regenerate === void 0 ? void 0 : regenerate();
    };
    var handlePositive = function () {
        if (feedbackGiven === "positive") {
            // Already gave positive feedback, remove feedback
            setFeedbackGiven(null);
            return;
        }
        setFeedbackGiven("positive");
        if (!chatId)
            return;
        alert(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Positive feedback"], ["Positive feedback"]))));
    };
    var handleNegative = function () {
        if (feedbackGiven === "negative") {
            // Already gave negative feedback, remove feedback
            setFeedbackGiven(null);
            return;
        }
        setFeedbackGiven("negative");
        if (!chatId)
            return;
        alert(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Negative feedback"], ["Negative feedback"]))));
    };
    var copyToClipboard = function () { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(messageContent)];
                case 1:
                    _a.sent();
                    setCopied(true);
                    // Reset the copied state after 2 seconds
                    setTimeout(function () { return setCopied(false); }, 2000);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error("Failed to copy to clipboard:", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<framer_motion_1.motion.div className="flex items-center gap-1 mt-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{
            duration: 0.3,
            ease: "easeOut",
            staggerChildren: 0.05
        }}>
      {/* Copy Button */}
      <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
        <react_1.TooltipProvider delayDuration={200}>
          <react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <button type="button" onClick={copyToClipboard} className="flex items-center justify-center w-6 h-6 transition-colors duration-200 hover:bg-muted">
                {copied ? (<lu_1.LuCheck className="size-3.5 animate-in zoom-in-50 duration-200"/>) : (<lu_1.LuCopy className="size-3 text-muted-foreground hover:text-foreground"/>)}
              </button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent className="px-2 py-1 text-xs">
              <p>
                {copied ? <macro_1.Trans>Copied!</macro_1.Trans> : <macro_1.Trans>Copy response</macro_1.Trans>}
              </p>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </react_1.TooltipProvider>
      </framer_motion_1.motion.div>

      {/* Retry Button */}
      <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
        <react_1.TooltipProvider delayDuration={200}>
          <react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <button type="button" onClick={handleRegenerate} className="flex items-center justify-center w-6 h-6 transition-colors duration-200 hover:bg-muted">
                <lu_1.LuRefreshCcw className="size-3.5 text-muted-foreground hover:text-foreground"/>
              </button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent className="px-2 py-1 text-xs">
              <p>
                <macro_1.Trans>Retry response</macro_1.Trans>
              </p>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </react_1.TooltipProvider>
      </framer_motion_1.motion.div>

      {/* Positive Feedback Button */}
      <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
        <react_1.TooltipProvider delayDuration={200}>
          <react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <button type="button" onClick={handlePositive} disabled={feedbackFetcher.state !== "idle"} className={(0, react_1.cn)("flex items-center justify-center w-6 h-6 transition-colors duration-200 hover:bg-muted", feedbackFetcher.state !== "idle" &&
            "opacity-50 cursor-not-allowed")}>
                <lu_1.LuThumbsUp className={(0, react_1.cn)("w-3 h-3", feedbackGiven === "positive"
            ? "text-emerald-600"
            : "text-muted-foreground hover:text-foreground")}/>
              </button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent className="px-2 py-1 text-xs">
              <p>
                {feedbackGiven === "positive" ? (<macro_1.Trans>Remove positive feedback</macro_1.Trans>) : (<macro_1.Trans>Positive feedback</macro_1.Trans>)}
              </p>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </react_1.TooltipProvider>
      </framer_motion_1.motion.div>

      {/* Negative Feedback Button */}
      <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
        <react_1.TooltipProvider delayDuration={200}>
          <react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <button type="button" onClick={handleNegative} disabled={feedbackFetcher.state !== "idle"} className={(0, react_1.cn)("flex items-center justify-center w-6 h-6 transition-colors duration-200 hover:bg-muted", feedbackFetcher.state !== "idle" &&
            "opacity-50 cursor-not-allowed")}>
                <lu_1.LuThumbsDown className={(0, react_1.cn)("w-3 h-3", feedbackGiven === "negative"
            ? "text-red-600"
            : "text-muted-foreground hover:text-foreground")}/>
              </button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent className="px-2 py-1 text-xs">
              <p>
                {feedbackGiven === "negative" ? (<macro_1.Trans>Remove negative feedback</macro_1.Trans>) : (<macro_1.Trans>Negative feedback</macro_1.Trans>)}
              </p>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </react_1.TooltipProvider>
      </framer_motion_1.motion.div>
    </framer_motion_1.motion.div>);
}
var templateObject_1, templateObject_2;
