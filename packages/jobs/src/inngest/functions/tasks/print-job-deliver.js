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
exports.printJobDeliverFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var printing_1 = require("@carbon/printing");
var printing_server_1 = require("@carbon/printing/printing.server");
var inngest_1 = require("inngest");
var client_1 = require("../../client");
exports.printJobDeliverFunction = client_1.inngest.createFunction({
    id: "print-job-deliver",
    retries: 0
}, { event: "carbon/print-job-deliver" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var client, _c, printJobId, companyId, _d, job, jobError, route, apiKey, content, err_1, errorMessage, isTimeout;
    var _e;
    var event = _b.event;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                client = (0, client_server_1.getCarbonServiceRole)();
                _c = event.data, printJobId = _c.printJobId, companyId = _c.companyId;
                return [4 /*yield*/, client
                        .from("printJob")
                        .select("id, content, contentType, printerUrl, status, attempts")
                        .eq("id", printJobId)
                        .eq("companyId", companyId)
                        .single()];
            case 1:
                _d = _f.sent(), job = _d.data, jobError = _d.error;
                if (jobError || !job) {
                    throw new inngest_1.NonRetriableError("Print job not found: ".concat(printJobId));
                }
                if (!(!job.content || !job.contentType)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, printing_1.updatePrintJobStatus)(client, printJobId, companyId, "failed", {
                        error: "Print job has no content"
                    })];
            case 2:
                _f.sent();
                throw new inngest_1.NonRetriableError("Print job has no content");
            case 3: return [4 /*yield*/, client
                    .from("printerRoute")
                    .select("apiKey")
                    .eq("printerUrl", job.printerUrl)
                    .eq("companyId", companyId)
                    .limit(1)
                    .maybeSingle()];
            case 4:
                route = (_f.sent()).data;
                apiKey = route === null || route === void 0 ? void 0 : route.apiKey;
                return [4 /*yield*/, client
                        .from("printJob")
                        .update({
                        status: "printing",
                        attempts: ((_e = job.attempts) !== null && _e !== void 0 ? _e : 0) + 1,
                        updatedAt: new Date().toISOString()
                    })
                        .eq("id", printJobId)
                        .eq("companyId", companyId)];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6:
                _f.trys.push([6, 9, , 11]);
                content = job.contentType === "pdf"
                    ? Buffer.from(job.content, "base64")
                    : job.content;
                return [4 /*yield*/, (0, printing_server_1.sendToProxyBox)({
                        url: job.printerUrl,
                        apiKey: apiKey,
                        content: content
                    })];
            case 7:
                _f.sent();
                return [4 /*yield*/, (0, printing_1.updatePrintJobStatus)(client, printJobId, companyId, "completed")];
            case 8:
                _f.sent();
                return [2 /*return*/, { success: true }];
            case 9:
                err_1 = _f.sent();
                errorMessage = err_1 instanceof Error ? err_1.message : "Unknown delivery error";
                isTimeout = err_1 instanceof Error &&
                    (err_1.name === "AbortError" ||
                        errorMessage.includes("aborted") ||
                        errorMessage.includes("timeout"));
                return [4 /*yield*/, (0, printing_1.updatePrintJobStatus)(client, printJobId, companyId, "failed", {
                        error: errorMessage
                    })];
            case 10:
                _f.sent();
                if (isTimeout) {
                    // Don't retry on timeout — content was likely already delivered
                    // to the print server. Retrying would print duplicate copies.
                    throw new inngest_1.NonRetriableError("Delivery timed out \u2014 content may have been printed. ".concat(errorMessage));
                }
                throw err_1;
            case 11: return [2 /*return*/];
        }
    });
}); });
