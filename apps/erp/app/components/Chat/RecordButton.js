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
exports.RecordButton = void 0;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var useAudioRecording_1 = require("./hooks/useAudioRecording");
var store_1 = require("./lib/store");
// Custom Record Icon with smooth animation
var RecordIcon = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 16 : _b, _c = _a.isRecording, isRecording = _c === void 0 ? false : _c;
    return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Recreate the Material Design MdOutlineGraphicEq icon with individual bars for wave-like animation */}

      {/* Bar 1 (leftmost, shortest) */}
      <rect x="3" y="10" width="2" height="4" fill="currentColor">
        {isRecording && (<>
            <animate attributeName="height" values="4;2;6;3;8;1;5;2;7;4" dur="2.4s" repeatCount="indefinite" begin="0s"/>
            <animate attributeName="y" values="10;11;7;10.5;6;11.5;8.5;11;6.5;10" dur="2.4s" repeatCount="indefinite" begin="0s"/>
          </>)}
      </rect>

      {/* Bar 2 (second from left) */}
      <rect x="7" y="6" width="2" height="12" fill="currentColor">
        {isRecording && (<>
            <animate attributeName="height" values="12;8;16;10;18;6;14;9;15;12" dur="2.7s" repeatCount="indefinite" begin="0.45s"/>
            <animate attributeName="y" values="6;8;2;7;1;9;5;7.5;4.5;6" dur="2.7s" repeatCount="indefinite" begin="0.45s"/>
          </>)}
      </rect>

      {/* Bar 3 (center, tallest) */}
      <rect x="11" y="2" width="2" height="20" fill="currentColor">
        {isRecording && (<>
            <animate attributeName="height" values="20;14;22;16;24;12;18;15;21;20" dur="2.1s" repeatCount="indefinite" begin="0.9s"/>
            <animate attributeName="y" values="2;5;1;4;0;6;3;4.5;1.5;2" dur="2.1s" repeatCount="indefinite" begin="0.9s"/>
          </>)}
      </rect>

      {/* Bar 4 (second from right) */}
      <rect x="15" y="6" width="2" height="12" fill="currentColor">
        {isRecording && (<>
            <animate attributeName="height" values="12;16;8;14;10;18;6;13;9;12" dur="3.3s" repeatCount="indefinite" begin="1.35s"/>
            <animate attributeName="y" values="6;2;8;5;7;1;9;5.5;7.5;6" dur="3.3s" repeatCount="indefinite" begin="1.35s"/>
          </>)}
      </rect>

      {/* Bar 5 (rightmost) */}
      <rect x="19" y="10" width="2" height="4" fill="currentColor">
        {isRecording && (<>
            <animate attributeName="height" values="4;6;2;7;3;8;1;5;3;4" dur="3.0s" repeatCount="indefinite" begin="1.8s"/>
            <animate attributeName="y" values="10;7;11;6.5;10.5;6;11.5;8.5;10.5;10" dur="3.0s" repeatCount="indefinite" begin="1.8s"/>
          </>)}
      </rect>
    </svg>);
};
exports.RecordButton = (0, react_2.forwardRef)(function RecordButton(_a, ref) {
    var _this = this;
    var _b = _a.disabled, disabled = _b === void 0 ? false : _b, className = _a.className, _c = _a.size, size = _c === void 0 ? 16 : _c;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, store_1.useChatStore)(), input = _d.input, setInput = _d.setInput, isRecording = _d.isRecording, isProcessing = _d.isProcessing, setIsRecording = _d.setIsRecording, setIsProcessing = _d.setIsProcessing;
    var _e = (0, useAudioRecording_1.useAudioRecording)(), startRecording = _e.startRecording, stopRecording = _e.stopRecording, transcribeAudio = _e.transcribeAudio;
    var handleRecordClick = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var audioBlob, transcribedText, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isRecording) return [3 /*break*/, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    setIsProcessing(true);
                    return [4 /*yield*/, stopRecording()];
                case 2:
                    audioBlob = _a.sent();
                    if (!audioBlob) return [3 /*break*/, 4];
                    return [4 /*yield*/, transcribeAudio(audioBlob)];
                case 3:
                    transcribedText = _a.sent();
                    if (transcribedText.trim()) {
                        setInput(input ? "".concat(input, " ").concat(transcribedText) : transcribedText);
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error("Failed to process recording:", error_1);
                    return [3 /*break*/, 7];
                case 6:
                    setIsRecording(false);
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 7: return [3 /*break*/, 11];
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    setInput(""); // Reset input when starting to record
                    return [4 /*yield*/, startRecording()];
                case 9:
                    _a.sent();
                    setIsRecording(true);
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    console.error("Failed to start recording:", error_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); }, [
        isRecording,
        stopRecording,
        startRecording,
        transcribeAudio,
        setInput,
        input,
        setIsRecording,
        setIsProcessing
    ]);
    // Expose the handleRecordClick method via ref
    (0, react_2.useImperativeHandle)(ref, function () { return ({
        handleRecordClick: handleRecordClick
    }); });
    return (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Record"], ["Record"])))} variant="ghost" isRound icon={isProcessing ? <react_1.Spinner /> : <RecordIcon isRecording={isRecording}/>} isDisabled={isProcessing} onClick={handleRecordClick} disabled={disabled} className={(0, react_1.cn)(isRecording &&
            "text-indigo-600 hover:text-indigo-600 [&_svg]:text-indigo-600 [&_svg]:hover:text-indigo-600", disabled && "opacity-50", className)}/>);
});
var templateObject_1;
