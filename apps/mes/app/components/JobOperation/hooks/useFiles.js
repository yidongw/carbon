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
exports.useFiles = useFiles;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useFiles(job) {
    var _this = this;
    var t = (0, macro_1.useLingui)().t;
    var user = (0, hooks_1.useUser)();
    var getFilePath = (0, react_2.useCallback)(function (file) {
        var _a, _b;
        var companyId = user.company.id;
        var bucket = file.bucket;
        var id = "";
        switch (bucket) {
            case "job":
                id = job.id;
                break;
            case "opportunity-line":
                id = (_a = job.salesOrderLineId) !== null && _a !== void 0 ? _a : job.quoteLineId;
                break;
            case "parts":
                id = (_b = file.itemId) !== null && _b !== void 0 ? _b : job.itemId;
                break;
        }
        return "".concat(companyId, "/").concat(bucket, "/").concat(id, "/").concat(file.name);
    }, [job.id, job.itemId, job.quoteLineId, job.salesOrderLineId, user.company.id]);
    var downloadFile = (0, react_2.useCallback)(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var url, response, blob, blobUrl, a, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = path_1.path.to.file.previewFile("private/".concat(getFilePath(file)));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.blob()];
                case 3:
                    blob = _a.sent();
                    blobUrl = window.URL.createObjectURL(blob);
                    a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = blobUrl;
                    a.download = file.name;
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Error downloading file"], ["Error downloading file"]))));
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [getFilePath, t]);
    var downloadModel = (0, react_2.useCallback)(function (model) { return __awaiter(_this, void 0, void 0, function () {
        var url, response, blob, blobUrl, a, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!model.modelPath || !model.modelName) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Model data is missing"], ["Model data is missing"]))));
                        return [2 /*return*/];
                    }
                    url = path_1.path.to.file.previewFile("private/".concat(model.modelPath));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.blob()];
                case 3:
                    blob = _a.sent();
                    blobUrl = window.URL.createObjectURL(blob);
                    a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = blobUrl;
                    a.download = model.modelName;
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Error downloading file"], ["Error downloading file"]))));
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [t]);
    return {
        downloadFile: downloadFile,
        downloadModel: downloadModel,
        getFilePath: getFilePath
    };
}
var templateObject_1, templateObject_2, templateObject_3;
