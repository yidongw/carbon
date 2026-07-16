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
exports.ItemThumbnailField = ItemThumbnailField;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
/**
 * Compact, input-styled thumbnail uploader for the item create forms
 * (Part/Tool/Material/Consumable). The image is uploaded to a staging path
 * before the item exists; the create action re-keys it under the item's own
 * folder after insert. Renders the hidden `thumbnailPath` field, so it must
 * live inside the form.
 *
 * `onUpload` is called with the original file name after a successful upload so
 * the caller can, e.g., default the item ID to the image name.
 */
function ItemThumbnailField(_a) {
    var _this = this;
    var onUpload = _a.onUpload, defaultPath = _a.defaultPath;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var inputId = (0, react_2.useId)();
    var _b = (0, react_2.useState)(defaultPath !== null && defaultPath !== void 0 ? defaultPath : null), thumbnailPath = _b[0], setThumbnailPath = _b[1];
    var _c = (0, react_2.useState)(defaultPath ? (0, path_1.getPrivateUrl)(defaultPath) : null), thumbnailPreview = _c[0], setThumbnailPreview = _c[1];
    var _d = (0, react_2.useState)(null), thumbnailName = _d[0], setThumbnailName = _d[1];
    var _e = (0, react_2.useState)(false), isUploading = _e[0], setIsUploading = _e[1];
    var upload = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var uploadToast, _a, status_1, blob, contentType, resolvedType, fileExtension, fileName, thumbnailFile, _b, data, error, reader, err_1, message;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    (0, react_dom_1.flushSync)(function () {
                        setIsUploading(true);
                    });
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "thumbnail-".concat(file.name),
                        label: function (pct) { return "".concat(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name), " (").concat(pct, "%)"); }
                    });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, (0, upload_1.resizeImageWithProgress)(file, {}, uploadToast.onProgress)];
                case 2:
                    _a = _c.sent(), status_1 = _a.status, blob = _a.blob, contentType = _a.contentType;
                    if (status_1 < 200 || status_1 >= 300) {
                        throw new Error("Failed to resize image");
                    }
                    resolvedType = contentType || "image/png";
                    fileExtension = resolvedType.includes("image/jpeg") ? "jpg" : "png";
                    fileName = "".concat((0, nanoid_1.nanoid)(), ".").concat(fileExtension);
                    thumbnailFile = new File([blob], fileName, { type: resolvedType });
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload("".concat(companyId, "/thumbnails/staging/").concat((0, nanoid_1.nanoid)(), "/").concat(fileName), thumbnailFile, { upsert: true })];
                case 3:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (error || !data) {
                        uploadToast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to upload thumbnail"], ["Failed to upload thumbnail"]))));
                        return [2 /*return*/];
                    }
                    reader = new FileReader();
                    reader.onload = function (event) {
                        var _a;
                        if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) {
                            setThumbnailPreview(event.target.result);
                        }
                    };
                    reader.readAsDataURL(blob);
                    setThumbnailPath(data.path);
                    setThumbnailName(file.name);
                    uploadToast.dismiss();
                    onUpload === null || onUpload === void 0 ? void 0 : onUpload(file.name);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _c.sent();
                    message = err_1 instanceof Error ? err_1.message : "Unknown error";
                    uploadToast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to upload thumbnail: ", ""], ["Failed to upload thumbnail: ", ""])), message));
                    return [3 /*break*/, 6];
                case 5:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var remove = function () {
        setThumbnailPath(null);
        setThumbnailPreview(null);
        setThumbnailName(null);
    };
    var _f = (0, react_dropzone_1.useDropzone)({
        multiple: false,
        accept: { "image/*": [] },
        onDropAccepted: function (acceptedFiles) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, upload(acceptedFiles[0])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onDropRejected: function () {
            react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["File type not supported"], ["File type not supported"]))));
        }
    }), getRootProps = _f.getRootProps, getInputProps = _f.getInputProps, isDragActive = _f.isDragActive;
    return (<react_1.VStack spacing={1} className="mb-6 w-full">
      <Form_1.Hidden name="thumbnailPath" value={thumbnailPath !== null && thumbnailPath !== void 0 ? thumbnailPath : ""}/>
      <label htmlFor={inputId} className="flex w-full items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          <macro_1.Trans>Thumbnail</macro_1.Trans>
        </span>
        <span className="text-muted-foreground text-xxs">
          <macro_1.Trans>Optional</macro_1.Trans>
        </span>
      </label>
      <div {...getRootProps()} className={(0, react_1.cn)("flex items-center gap-3 w-full rounded-md border bg-transparent px-2 py-2 text-sm cursor-pointer transition-colors hover:border-primary", isDragActive ? "border-primary bg-primary/10" : "border-input")}>
        <input id={inputId} {...getInputProps()}/>
        {thumbnailPreview ? (<img alt="thumbnail" src={thumbnailPreview} className="size-9 shrink-0 rounded object-cover border border-border"/>) : (<div className="flex size-9 shrink-0 items-center justify-center rounded bg-muted">
            <lu_1.LuImage className="h-4 w-4 text-muted-foreground"/>
          </div>)}
        <div className="flex-1 min-w-0">
          {thumbnailName ? (<p className="truncate text-foreground">{thumbnailName}</p>) : (<p className="text-muted-foreground">
              {isUploading ? (<macro_1.Trans>Uploading…</macro_1.Trans>) : (<macro_1.Trans>Drag and drop or click to upload</macro_1.Trans>)}
            </p>)}
        </div>
        {thumbnailPreview && (<react_1.Button size="sm" variant="ghost" className="shrink-0" onClick={function (e) {
                e.stopPropagation();
                remove();
            }}>
            <lu_1.LuX />
          </react_1.Button>)}
      </div>
    </react_1.VStack>);
}
exports.default = ItemThumbnailField;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
