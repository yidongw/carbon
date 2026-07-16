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
exports.ItemThumbnailUpload = ItemThumbnailUpload;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
function ItemThumbnailUpload(_a) {
    var _this = this;
    var path = _a.path, itemId = _a.itemId, modelId = _a.modelId;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _b = (0, react_2.useState)(function () {
        if (path) {
            return (0, path_1.getPrivateUrl)(path);
        }
        return null;
    }), thumbnailPath = _b[0], setThumbnailPath = _b[1];
    (0, react_2.useEffect)(function () {
        setThumbnailPath(path ? (0, path_1.getPrivateUrl)(path) : null);
    }, [path]);
    var onFileRemove = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var itemResult, modelResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon client not found"], ["Carbon client not found"]))));
                        return [2 /*return*/];
                    }
                    setThumbnailPath(null);
                    return [4 /*yield*/, carbon
                            .from("item")
                            .update({
                            thumbnailPath: null
                        })
                            .eq("id", itemId)];
                case 1:
                    itemResult = _a.sent();
                    if (itemResult.error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to remove thumbnail"], ["Failed to remove thumbnail"]))));
                        return [2 /*return*/];
                    }
                    if (!modelId) return [3 /*break*/, 3];
                    return [4 /*yield*/, carbon
                            .from("modelUpload")
                            .update({
                            thumbnailPath: null
                        })
                            .eq("id", modelId)];
                case 2:
                    modelResult = _a.sent();
                    if (modelResult.error) {
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to remove model thumbnail"], ["Failed to remove model thumbnail"]))));
                        return [2 /*return*/];
                    }
                    _a.label = 3;
                case 3:
                    react_1.toast.success(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Thumbnail removed"], ["Thumbnail removed"]))));
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, itemId, modelId, t]);
    var processFile = (0, react_2.useCallback)(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var uploadToast, _a, status_1, blob, contentType, errorMessage, errorData, _b, _c, _d, resolvedType, fileExtension, reader, fileName, thumbnailFile, _e, data, error, result, modelResult, error_1, errorMessage;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Carbon client not found"], ["Carbon client not found"]))));
                        return [2 /*return*/];
                    }
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "thumbnail-upload-".concat(itemId),
                        label: function (pct) { return "".concat(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name), " (").concat(pct, "%)"); }
                    });
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, (0, upload_1.resizeImageWithProgress)(file, {}, uploadToast.onProgress)];
                case 2:
                    _a = _f.sent(), status_1 = _a.status, blob = _a.blob, contentType = _a.contentType;
                    if (!(status_1 < 200 || status_1 >= 300)) return [3 /*break*/, 7];
                    errorMessage = "Failed to resize image";
                    if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json"))) return [3 /*break*/, 6];
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, blob.text()];
                case 4:
                    errorData = _c.apply(_b, [_f.sent()]);
                    if (errorData.error)
                        errorMessage = errorData.error;
                    return [3 /*break*/, 6];
                case 5:
                    _d = _f.sent();
                    return [3 /*break*/, 6];
                case 6: throw new Error(errorMessage);
                case 7:
                    resolvedType = contentType || "image/png";
                    fileExtension = resolvedType.includes("image/jpeg")
                        ? "jpg"
                        : "png";
                    reader = new FileReader();
                    reader.onload = function (event) {
                        var _a;
                        if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) {
                            var base64String = event.target.result;
                            setThumbnailPath(base64String);
                        }
                    };
                    reader.readAsDataURL(blob);
                    fileName = "".concat((0, nanoid_1.nanoid)(), ".").concat(fileExtension);
                    thumbnailFile = new File([blob], fileName, {
                        type: resolvedType
                    });
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload("".concat(company.id, "/thumbnails/").concat(itemId, "/").concat(fileName), thumbnailFile, {
                            upsert: true
                        })];
                case 8:
                    _e = _f.sent(), data = _e.data, error = _e.error;
                    if (error) {
                        console.error("Failed to upload thumbnail to storage:", error);
                        uploadToast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Failed to upload thumbnail"], ["Failed to upload thumbnail"]))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, carbon
                            .from("item")
                            .update({
                            thumbnailPath: data === null || data === void 0 ? void 0 : data.path
                        })
                            .eq("id", itemId)];
                case 9:
                    result = _f.sent();
                    if (result.error) {
                        uploadToast.error(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Failed to update thumbnail path"], ["Failed to update thumbnail path"]))));
                        return [2 /*return*/];
                    }
                    if (!modelId) return [3 /*break*/, 11];
                    return [4 /*yield*/, carbon
                            .from("modelUpload")
                            .update({
                            thumbnailPath: data === null || data === void 0 ? void 0 : data.path
                        })
                            .eq("id", modelId)];
                case 10:
                    modelResult = _f.sent();
                    if (modelResult.error) {
                        console.error("Failed to update model thumbnail path:", modelResult.error);
                    }
                    _f.label = 11;
                case 11:
                    if (data) {
                        setThumbnailPath((0, path_1.getPrivateUrl)(data.path));
                    }
                    uploadToast.dismiss();
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _f.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : "Unknown error";
                    console.error("Image processing error:", error_1);
                    uploadToast.error(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Failed to resize image: ", ""], ["Failed to resize image: ", ""])), errorMessage));
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); }, [carbon, company.id, itemId, modelId, t]);
    var onFileChange = (0, react_2.useCallback)(function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file;
        var _a;
        return __generator(this, function (_b) {
            file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file)
                processFile(file);
            return [2 /*return*/];
        });
    }); }, [processFile]);
    var _c = (0, react_dropzone_1.useDropzone)({
        multiple: false,
        noClick: true,
        noKeyboard: true,
        accept: { "image/*": [] },
        onDropAccepted: function (acceptedFiles) {
            if (acceptedFiles[0])
                processFile(acceptedFiles[0]);
        },
        onDropRejected: function () {
            react_1.toast.error(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["File type not supported"], ["File type not supported"]))));
        }
    }), getRootProps = _c.getRootProps, getInputProps = _c.getInputProps, isDragActive = _c.isDragActive, open = _c.open;
    return (<div {...getRootProps()} className="relative w-full aspect-square rounded-lg">
      <input {...getInputProps()}/>
      {thumbnailPath ? (<>
          <img alt="thumbnail" src={thumbnailPath} className="w-full h-full object-cover bg-gradient-to-bl from-muted to-muted/40 rounded-lg border border-border"/>
          {isDragActive && (<div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/70 border-2 border-dashed border-primary">
              <span className="text-sm font-medium text-primary">
                <macro_1.Trans>Drop image to upload</macro_1.Trans>
              </span>
            </div>)}
          <react_1.HStack className="absolute bottom-2 right-2">
            <react_1.Button variant="secondary" className="bg-card opacity-100" size="sm" onClick={onFileRemove}>
              <macro_1.Trans>Remove</macro_1.Trans>
            </react_1.Button>
            <react_1.File accept="image/*" variant="secondary" size="sm" className="bg-card opacity-100" onChange={onFileChange}>
              <macro_1.Trans>Upload</macro_1.Trans>
            </react_1.File>
          </react_1.HStack>
        </>) : (<button type="button" onClick={open} className={(0, react_1.cn)("w-full h-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center hover:border-primary hover:bg-primary/10", isDragActive ? "border-primary bg-primary/10" : "border-card")}>
          <lu_1.LuCloudUpload className="h-12 w-12 text-muted-foreground"/>
          <p className="text-sm text-muted-foreground">
            <macro_1.Trans>Drag and drop an image here, or click to select</macro_1.Trans>
          </p>
        </button>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
