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
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
var SIZE_LIMIT = (0, utils_1.getFileSizeLimit)("CAD_MODEL_UPLOAD");
var CadModel = function (_a) {
    var isReadOnly = _a.isReadOnly, metadata = _a.metadata, modelPath = _a.modelPath, title = _a.title, uploadClassName = _a.uploadClassName, viewerClassName = _a.viewerClassName;
    var companyId = (0, hooks_1.useUser)().company.id;
    var mode = (0, react_1.useMode)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(null), file = _b[0], setFile = _b[1];
    var onFileChange = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var modelId, fileExtension, fileName, uploadToast, modelUpload, formData;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    modelId = (0, nanoid_1.nanoid)();
                    setFile(file);
                    if (!file) return [3 /*break*/, 2];
                    if (!carbon) {
                        react_1.toast.error("Failed to initialize carbon client");
                        return [2 /*return*/];
                    }
                    fileExtension = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/models/").concat(modelId, ".").concat(fileExtension);
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "model-".concat(modelId, "-").concat(file.name),
                        label: function (pct) { return "Uploading ".concat(file.name, " (").concat(pct, "%)"); }
                    });
                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                            bucket: "private",
                            path: fileName,
                            file: file,
                            upsert: true,
                            onProgress: uploadToast.onProgress
                        })];
                case 1:
                    modelUpload = _b.sent();
                    if (modelUpload.error || !((_a = modelUpload.data) === null || _a === void 0 ? void 0 : _a.path)) {
                        uploadToast.error("Failed to upload file to storage");
                        return [2 /*return*/];
                    }
                    uploadToast.dismiss();
                    formData = new FormData();
                    formData.append("name", file.name);
                    formData.append("modelId", modelId);
                    formData.append("modelPath", modelUpload.data.path);
                    formData.append("size", file.size.toString());
                    if (metadata) {
                        if (metadata.itemId) {
                            formData.append("itemId", metadata.itemId);
                        }
                        if (metadata.salesRfqLineId) {
                            formData.append("salesRfqLineId", metadata.salesRfqLineId);
                        }
                        if (metadata.quoteLineId) {
                            formData.append("quoteLineId", metadata.quoteLineId);
                        }
                        if (metadata.salesOrderLineId) {
                            formData.append("salesOrderLineId", metadata.salesOrderLineId);
                        }
                        if (metadata.jobId) {
                            formData.append("jobId", metadata.jobId);
                        }
                    }
                    fetcher.submit(formData, {
                        method: "post",
                        action: path_1.path.to.api.modelUpload
                    });
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return (<react_1.ClientOnly fallback={<div className="flex w-full h-full rounded bg-gradient-to-bl from-card from-50% via-card to-background dark:border-none dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)] items-center justify-center">
          <react_1.Spinner className="h-10 w-10"/>
        </div>}>
      {function () {
            return file || modelPath ? (<react_1.ModelViewer key={modelPath} file={file} url={modelPath ? (0, path_1.getPrivateUrl)(modelPath) : null} mode={mode} className={viewerClassName}/>) : (<CadModelUpload className={uploadClassName} file={file} title={title} onFileChange={onFileChange}/>);
        }}
    </react_1.ClientOnly>);
};
exports.default = CadModel;
var CadModelUpload = function (_a) {
    var title = _a.title, file = _a.file, isReadOnly = _a.isReadOnly, className = _a.className, onFileChange = _a.onFileChange;
    var t = (0, macro_1.useLingui)().t;
    var hasFile = !!file;
    var _b = (0, react_dropzone_1.useDropzone)({
        disabled: hasFile,
        multiple: false,
        maxSize: SIZE_LIMIT.bytes,
        onDropAccepted: function (acceptedFiles) {
            var _a;
            var file = acceptedFiles[0];
            var fileExtension = (_a = file.name.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (!fileExtension || !utils_1.supportedModelTypes.includes(fileExtension)) {
                react_1.toast.error("File type not supported");
                return;
            }
            if (file.size > SIZE_LIMIT.bytes) {
                react_1.toast.error("File size too big (max. ".concat(SIZE_LIMIT.format(), ")"));
                return;
            }
            onFileChange(file);
        },
        onDropRejected: function (fileRejections) {
            var errors = fileRejections[0].errors;
            var message;
            if (errors[0].code === "file-too-large") {
                message = "File size too big (max. ".concat(SIZE_LIMIT.format(), ")");
            }
            else if (errors[0].code === "file-invalid-type") {
                message = "File type not supported";
            }
            else {
                message = errors[0].message;
            }
            react_1.toast.error(message);
        }
    }), getRootProps = _b.getRootProps, getInputProps = _b.getInputProps;
    if (isReadOnly) {
        return null;
    }
    return (<div {...getRootProps()} className={(0, react_1.cn)("group flex flex-col flex-grow rounded-lg border border-border bg-gradient-to-bl from-card from-50% via-card to-background dark:border-none dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)] text-card-foreground shadow-sm w-full min-h-[400px] ", !hasFile &&
            "cursor-pointer hover:border-primary/30 hover:border-dashed hover:to-primary/10 hover:via-card border-2 border-dashed", className)}>
      <input {...getInputProps()} name="file" className="sr-only"/>
      <div className="flex flex-col h-full w-full p-4">
        {title && (<react_1.CardHeader>
            <react_1.CardTitle>{title}</react_1.CardTitle>
          </react_1.CardHeader>)}

        <div className="flex flex-col flex-grow items-center justify-center gap-2 p-6">
          {file && <react_1.Spinner className={(0, react_1.cn)("h-16 w-16", title && "-mt-16")}/>}
          {file && (<>
              <p className="text-lg text-card-foreground mt-8">{file.name}</p>
              <p className="text-muted-foreground group-hover:text-foreground">
                {(0, utils_1.convertKbToString)(Math.ceil(file.size / 1024))}
              </p>
            </>)}
          {!file && (<>
              <div className={(0, react_1.cn)("p-4 bg-accent rounded-full group-hover:bg-primary", title ? "-mt-16" : "-mt-6")}>
                <lu_1.LuCloudUpload className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary-foreground"/>
              </div>
              <p className="text-base text-muted-foreground group-hover:text-foreground mt-8">
                <macro_1.Trans>Choose file to upload or drag and drop</macro_1.Trans>
              </p>
              <p className="text-xs text-muted-foreground group-hover:text-foreground">
                {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Supports ", " files"], ["Supports ", " files"])), utils_1.supportedModelTypes.join(", "))}
              </p>
            </>)}
        </div>
      </div>
    </div>);
};
var templateObject_1;
