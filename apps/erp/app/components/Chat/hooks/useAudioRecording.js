"use strict";
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
exports.useAudioRecording = useAudioRecording;
var auth_1 = require("@carbon/auth");
var react_1 = require("react");
var hooks_1 = require("~/hooks");
function useAudioRecording() {
    var _this = this;
    var _a = (0, react_1.useState)(false), isRecording = _a[0], setIsRecording = _a[1];
    var _b = (0, react_1.useState)(false), isProcessing = _b[0], setIsProcessing = _b[1];
    var mediaRecorderRef = (0, react_1.useRef)(null);
    var audioChunksRef = (0, react_1.useRef)([]);
    var streamRef = (0, react_1.useRef)(null);
    var recordingTimerRef = (0, react_1.useRef)(null);
    // Hard limit: 1 minute (60 seconds)
    var MAX_RECORDING_TIME = 15 * 1000; // 15 seconds in milliseconds
    var stopRecording = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    // Clear the recording timer if it exists
                    if (recordingTimerRef.current) {
                        clearTimeout(recordingTimerRef.current);
                        recordingTimerRef.current = null;
                    }
                    if (!mediaRecorderRef.current || !isRecording) {
                        resolve(null);
                        return;
                    }
                    mediaRecorderRef.current.onstop = function () {
                        // Stop all audio tracks
                        if (streamRef.current) {
                            for (var _i = 0, _a = streamRef.current.getTracks(); _i < _a.length; _i++) {
                                var track = _a[_i];
                                track.stop();
                            }
                        }
                        streamRef.current = null;
                        // Create audio blob from chunks
                        var audioBlob = audioChunksRef.current.length > 0
                            ? new Blob(audioChunksRef.current, {
                                type: "audio/webm;codecs=opus"
                            })
                            : null;
                        // Clear chunks
                        audioChunksRef.current = [];
                        setIsRecording(false);
                        resolve(audioBlob);
                    };
                    mediaRecorderRef.current.stop();
                })];
        });
    }); }, [isRecording]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var startRecording = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var stream, mediaRecorder, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                sampleRate: 44100
                            }
                        })];
                case 1:
                    stream = _a.sent();
                    streamRef.current = stream;
                    mediaRecorder = new MediaRecorder(stream, {
                        mimeType: "audio/webm;codecs=opus"
                    });
                    mediaRecorderRef.current = mediaRecorder;
                    audioChunksRef.current = [];
                    mediaRecorder.ondataavailable = function (event) {
                        if (event.data.size > 0) {
                            audioChunksRef.current.push(event.data);
                        }
                    };
                    mediaRecorder.start(1000); // Collect data every second
                    setIsRecording(true);
                    // Set up auto-stop timer for 1 minute limit
                    recordingTimerRef.current = setTimeout(function () {
                        console.log("Recording automatically stopped after 15 seconds");
                        stopRecording();
                    }, MAX_RECORDING_TIME);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error starting audio recording:", error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [MAX_RECORDING_TIME, stopRecording]);
    var accessToken = (0, auth_1.useCarbon)().accessToken;
    var _c = (0, hooks_1.useUser)(), userId = _c.id, companyId = _c.company.id;
    var transcribeAudio = (0, react_1.useCallback)(function (audioBlob) { return __awaiter(_this, void 0, void 0, function () {
        var arrayBuffer, base64Audio, transcriptionUrl, response, errorText, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, audioBlob.arrayBuffer()];
                case 2:
                    arrayBuffer = _a.sent();
                    base64Audio = btoa(new Uint8Array(arrayBuffer).reduce(function (data, byte) { return data + String.fromCharCode(byte); }, ""));
                    transcriptionUrl = "".concat(auth_1.SUPABASE_URL, "/functions/v1/transcription");
                    return [4 /*yield*/, fetch(transcriptionUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(accessToken),
                                "x-company-id": companyId,
                                "x-user-id": userId
                            },
                            body: JSON.stringify({
                                audio: base64Audio,
                                mimeType: audioBlob.type
                            })
                        })];
                case 3:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, response.text()];
                case 4:
                    errorText = _a.sent();
                    console.error("Transcription API error:", {
                        status: response.status,
                        statusText: response.statusText,
                        body: errorText
                    });
                    throw new Error("Failed to transcribe audio: ".concat(response.status, " ").concat(response.statusText));
                case 5: return [4 /*yield*/, response.json()];
                case 6:
                    data = _a.sent();
                    if (!data.success) {
                        throw new Error(data.error || "Transcription failed");
                    }
                    return [2 /*return*/, data.text];
                case 7:
                    error_2 = _a.sent();
                    console.error("Error transcribing audio:", error_2);
                    throw error_2;
                case 8:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [accessToken, companyId, userId]);
    return {
        isRecording: isRecording,
        isProcessing: isProcessing,
        startRecording: startRecording,
        stopRecording: stopRecording,
        transcribeAudio: transcribeAudio
    };
}
